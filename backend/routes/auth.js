const express = require("express");
const jwt = require("jsonwebtoken");

const {
  cognito,
  COGNITO_CLIENT_ID,
  COGNITO_CLIENT_SECRET,
  USER_POOL_ID,
} = require("../config/aws.js");
const generateSecretHash = require("../utils/secretHash.js");

const router = express.Router();

// Register new user
router.post("/register", async (req, res) => {
  const { username, email, password } = req.body;

  const params = {
    ClientId: COGNITO_CLIENT_ID,
    Username: username,
    Password: password,
    SecretHash: generateSecretHash(
      username,
      COGNITO_CLIENT_ID,
      COGNITO_CLIENT_SECRET
    ),
    UserAttributes: [
      { Name: "email", Value: email }
    ],
  };

  try {
    await cognito.signUp(params).promise();
    res.json({ message: "Registered! Check your email to confirm." });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Registration failed.",
      details: err.message,
      code: err.code,
    });
  }
});

// Login user

router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const params = {
    AuthFlow: "USER_PASSWORD_AUTH",
    ClientId: COGNITO_CLIENT_ID,
    AuthParameters: {
      USERNAME: username,
      PASSWORD: password,
      SECRET_HASH: generateSecretHash(
        username,
        COGNITO_CLIENT_ID,
        COGNITO_CLIENT_SECRET
      ),
    },
  };

  try {
    const result = await cognito.initiateAuth(params).promise();

    const idToken = result.AuthenticationResult.IdToken;
    const decoded = jwt.decode(idToken);
    const userSub = decoded.sub;

    const userData = await cognito.adminGetUser({
      UserPoolId: USER_POOL_ID,
      Username: username
    }).promise();

    const emailAttr = userData.UserAttributes.find(attr => attr.Name === "email");
    const email = emailAttr ? emailAttr.Value : null;

    res.json({
      IdToken: idToken,
      AccessToken: result.AuthenticationResult.AccessToken,
      RefreshToken: result.AuthenticationResult.RefreshToken,
      email,
      sub: userSub   // ✅ Add sub!
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(401).json({
      error: "Login failed",
      details: err.message,
      code: err.code,
    });
  }
});


// Confirm user account
router.post("/confirm", async (req, res) => {
  const { username, code } = req.body;
  console.log("Confirming account for:", username);
  console.log("Confirmation code:", code);
  const params = {
    ClientId: COGNITO_CLIENT_ID,
    Username: username,
    ConfirmationCode: code,
    SecretHash: generateSecretHash(
      username,
      COGNITO_CLIENT_ID,
      COGNITO_CLIENT_SECRET
    ),
  };

  try {
    await cognito.confirmSignUp(params).promise();
    res.json({ message: "Account confirmed! You can now log in." });
  } catch (err) {
    console.error(err);
    res.status(400).json({
      error: "Confirmation failed.",
      details: err.message,
      code: err.code,
    });
  }
});

// Resend confirmation code
router.post("/resend", async (req, res) => {
  const { username } = req.body;

  const params = {
    ClientId: COGNITO_CLIENT_ID,
    Username: username,
    SecretHash: generateSecretHash(
      username,
      COGNITO_CLIENT_ID,
      COGNITO_CLIENT_SECRET
    )
  };

  try {
    await cognito.resendConfirmationCode(params).promise();
    res.json({ message: "Confirmation code resent successfully!" });
  } catch (err) {
    console.error(err);
    res.status(400).json({
      error: "Failed to resend code.",
      details: err.message,
      code: err.code,
    });
  }
});

module.exports = router;
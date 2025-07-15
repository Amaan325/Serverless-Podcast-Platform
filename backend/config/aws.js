require("dotenv").config();
const AWS = require('aws-sdk');

console.log('🔑 ENV Loaded:', {
  REGION: process.env.AWS_REGION,
  KEY: process.env.AWS_ACCESS_KEY_ID ? 'OK' : 'MISSING',
  SECRET: process.env.AWS_SECRET_ACCESS_KEY ? 'OK' : 'MISSING',
});

// ✅ fallback credentials method
AWS.config.credentials = new AWS.Credentials({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

AWS.config.update({
  region: process.env.AWS_REGION || 'eu-north-1',
});

console.log('✅ AWS Config:', AWS.config.credentials);

module.exports = {
  s3: new AWS.S3(),
  dynamodb: new AWS.DynamoDB.DocumentClient(),
  cognito: new AWS.CognitoIdentityServiceProvider(),

  COGNITO_CLIENT_ID: process.env.COGNITO_CLIENT_ID,
  COGNITO_CLIENT_SECRET: process.env.COGNITO_CLIENT_SECRET,
  USER_POOL_ID: process.env.USER_POOL_ID,
  SOURCE_BUCKET: process.env.SOURCE_BUCKET,
  TABLE_NAME: process.env.TABLE_NAME,
};

const express = require('express');
const { s3, SOURCE_BUCKET, dynamodb, TABLE_NAME } = require('../config/aws.js');
const { v4: uuidv4 } = require('uuid');

const router = express.Router();

// ✅ 1️⃣ Generate signed URL
router.post('/generate-upload-url', async (req, res) => {
  console.log("Generating signed URL...");
  const { fileName, fileType } = req.body;

  const key = `${uuidv4()}-${fileName}`;

  const params = {
    Bucket: SOURCE_BUCKET,
    Key: key,
    ContentType: fileType,
    Expires: 60 * 5,
  };

  try {
    const url = await s3.getSignedUrlPromise('putObject', params);
    res.json({ uploadUrl: url, key });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not generate upload URL' });
  }
});

// ✅ 2️⃣ Save metadata separately
router.post('/save-metadata', async (req, res) => {
  const { key, title, description, uploader_id } = req.body;

  if (!key) {
    return res.status(400).json({ error: 'Missing key' });
  }

  try {
    await dynamodb.put({
      TableName: TABLE_NAME,
      Item: {
        podcast_id: key,
        title,
        description,
        uploader_id,
        createdAt: new Date().toISOString(),
      },
    }).promise();

    res.json({ message: 'Metadata saved.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not save metadata' });
  }
});

module.exports = router;

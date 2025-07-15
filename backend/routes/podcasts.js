const express = require('express');
const { dynamodb, TABLE_NAME } = require('../config/aws.js');

const router = express.Router();

router.get('/user/:userId', async (req, res) => {
  const { userId } = req.params;

  const params = {
    TableName: TABLE_NAME,
    FilterExpression: 'uploader_id = :uid',
    ExpressionAttributeValues: { ':uid': userId }
  };

  try {
    const data = await dynamodb.scan(params).promise();
    res.json(data.Items);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not fetch user podcasts' });
  }
});

router.get('/all', async (req, res) => {
  const params = { TableName: TABLE_NAME };

  try {
    const data = await dynamodb.scan(params).promise();
    res.json(data.Items);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not fetch podcasts' });
  }
});

module.exports = router;    
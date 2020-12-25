'use strict';

const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.update = (event, context, callback) => {
  const timestamp = new Date().getTime();
  const data = JSON.parse(event.body);

  if (typeof data.text !== 'string' || typeof data.checked !== 'boolean') {
    console.error('Validation Failed');
    callback(new Error('Couldn´t update the todo item.'));
    return;
  }

  const params = {
    TableName: 'todos',
    Item: {
      id: event.pathParameters.id,
      text: data.text,
      checked: data.checked,
      updatedAt: timestamp
    }
  }
  
  dynamoDb.put(params, (error, result) => {
    if (error) {
      console.error(error);
      callback(new Error('Couldn´t update the todo item.'));
      return;
    }

    const response = {
      statusCode: 200,
      body: JSON.stringify(result.Item)
    };

    callback(null, response);
  })
}
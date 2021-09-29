import AWS from 'aws-sdk';

interface Info {
  [key: string]: string;
}


AWS.config.update({
  region: process.env.AWS_DEFAULT_REGION || "us-east-2",
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

const dynamoClient = new AWS.DynamoDB.DocumentClient();


export const findUsersBill = async (userId: string) => {
  const params = {
    TableName: 'getbits-bills',
    IndexName: 'userId-index',
    KeyConditionExpression: 'userId = :user_id',
    ExpressionAttributeValues: { ':user_id': userId }
  };

  try {
    const data = await dynamoClient.query(params).promise();
    if (data.Items) {
      return data.Items;
    } else {
      return [];
    }
  } catch (err: any) {
    return { error: err.message || err };
  }
};

export const uploadData = async (tableName: string, info: Info) => {
  const params = {
    TableName: tableName,
    Item: info
  };
  try {
    return await dynamoClient.put(params).promise();
  } catch (error: any) {
    return { error: error.message || error };
  }
};

export const findData = async (tableName: string, id: Info) => {
  const params = {
    TableName: tableName,
    Key: {
      ...id
    }
  };
  try {
    const data = await dynamoClient.get(params).promise();
    return data.Item;
  } catch (error: any) {
    return { error: error.message || error };
  }
};

export const deleteData = async (tableName: string, id: Info) => {
  const params = {
    TableName: tableName,
    Key: {
      ...id
    }
  };
  return await dynamoClient.delete(params).promise();
};

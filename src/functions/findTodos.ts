import { APIGatewayProxyHandler } from "aws-lambda"
import { document } from '../utils/dynamodbClient'

interface IFindTodo {
  id: string;
  user_id: string;
  title: string;
  done: boolean;
  deadline: string;
}

export const handler: APIGatewayProxyHandler = async (event) => {
  const { id } = event.pathParameters;

  const response = await document.query({
    TableName: 'users_todos',
    KeyConditionExpression: 'user_id = :user_id',
    ExpressionAttributeValues: {
      ":user_id": id
    }
  }).promise();

  const todos = response.Items as IFindTodo[];

  if (todos.length > 0) {
    return {
      statusCode: 200,
      body: JSON.stringify({
        todos
      })
    }
  }

  return {
    statusCode: 400,
    body: JSON.stringify({
      message: 'Todos not found'
    })
  }
}
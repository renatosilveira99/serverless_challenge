import { APIGatewayProxyHandler } from "aws-lambda"
import { document } from '../utils/dynamodbClient'

interface ICreateTodo {
  title: string;
  deadline: string;
}

export const handler: APIGatewayProxyHandler = async (event) => {
  const { id } = event.pathParameters;
  const { title, deadline } = JSON.parse(event.body) as ICreateTodo;

  await document.put({
    TableName: 'users_todos',
    Item: {
      id: String(Math.floor(Math.random() * 99999)),
      user_id: id,
      title,
      done: false,
      deadline
    }
  }).promise();

  return {
    statusCode: 201,
    body: JSON.stringify({
      message: 'Todo created!',
    })
  }
}
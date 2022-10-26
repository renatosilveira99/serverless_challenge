import type { AWS } from '@serverless/typescript';

const serverlessConfiguration: AWS = {
  service: 'certificate-ignite',
  frameworkVersion: '3',
  plugins: ['serverless-esbuild', 'serverless-dynamodb-local', 'serverless-offline'],
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
    },
    iamRoleStatements: [
      {
        Effect: "Allow",
        Action: ["dynamodb:*"],
        Resource: ['*']
      },
      {
        Effect: 'Allow',
        Action: ['s3:*'],
        Resource: ['*']
      }
    ]
  },

  package: { individually: false, include: ["./src/templates/**"] },

  functions: {
    createTodo: {
      handler: 'src/functions/createTodo.handler',
      events: [
        {
          http: {
            path: 'createTodo/{id}',
            method: 'post',
            cors: true
          }
        }
      ]
    },
    findTodos: {
      handler: 'src/functions/findTodos.handler',
      events: [
        {
          http: {
            path: 'findTodos/{id}',
            method: 'get',
            cors: true
          }
        }
      ]
    }
  },

  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      target: 'node14',
      define: { 'require.resolve': undefined },
      platform: 'node',
      concurrency: 10,
      exclude: [
        "puppeteer-core", '@sparticuz/chrome-aws-lambda', "aws-sdk"
      ]
    },
    dynamodb: {
      stages: ['dev', 'local'],
      start: {
        port: 8000,
        inMemory: true,
        migrate: true,
      }
    }
  },
  resources: {
    Resources: {
      dbCertificateUsers: {
        Type: 'AWS::DynamoDB::Table',
        Properties: {
          TableName: 'users_todos',
          ProvisionedThroughput: {
            ReadCapacityUnits: 5,
            WriteCapacityUnits: 5,
          },
          AttributeDefinitions: [
            {
              AttributeName: 'user_id',
              AttributeType: 'S'
            }
          ],
          KeySchema: [
            {
              AttributeName: 'user_id',
              KeyType: 'HASH'
            }
          ]
        }
      }
    }
  }
};

module.exports = serverlessConfiguration;

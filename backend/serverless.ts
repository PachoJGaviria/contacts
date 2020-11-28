import type { AwsFunction, Serverless } from 'serverless/aws'

const serverlessConfiguration: Serverless = {
  service: {
    name: 'contacts',
  },
  frameworkVersion: '2',
  custom: {
    webpack: {
      webpackConfig: './webpack.config.js',
      includeModules: true
    }
  },
  package: {
    individually: true,
    excludeDevDependencies: true
  },
  // Add the serverless-webpack plugin
  plugins: [
    'serverless-webpack',
    'serverless-plugin-canary-deployments',
    'serverless-iam-roles-per-function'
  ],
  provider: {
    name: 'aws',
    runtime: 'nodejs12.x',
    profile: 'serverless-admin',
    stage: "${opt:stage, 'dev'}",
    region: "${opt:region, 'us-east-1'}",
    apiGateway: {
      minimumCompressionSize: 1024,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      CONTACTS_TABLE: "CONTACTS-${self:provider.stage}",
      CONTACTS_USER_INDEX: "ContactsUserIdIndex",
      CONTACTS_S3_BUCKET: "contacts-pachojgaviria-${self:provider.stage}",
      SIGNED_URL_EXPIRATION: 300
    },
    tracing: {
      apiGateway: true,
      lambda: true
    },
    iamRoleStatements: [
      {
        Effect: 'Allow',
        Action: [
          'xray:PutTraceSegments',
          'xray:PutTelemetryRecords'
        ],
        Resource: '*'
      }
    ]
  },
  functions: {
    Auth: {
      handler: 'src/infrastructure/authorization/Auth0Authorizer.handler'
    },

    GetAllContactsByUserId: ({
      handler: 'src/infrastructure/api/GetContactsController.handler',
      events: [
        {
          http: {
            method: 'get',
            path: 'contacts',
            cors: true,
            authorizer: {
              name: 'Auth'
            }
          }
        }
      ], 
      iamRoleStatements: [
        {
          Effect: 'Allow',
          Action: [
            'dynamodb:Query'
          ],
          Resource: 'arn:aws:dynamodb:${self:provider.region}:*:table/${self:provider.environment.CONTACTS_TABLE}'
        },
        {
          Effect: 'Allow',
          Action: [
            'dynamodb:Query'
          ],
          Resource: 'arn:aws:dynamodb:${self:provider.region}:*:table/${self:provider.environment.CONTACTS_TABLE}/index/${self:provider.environment.CONTACTS_USER_INDEX}'
        }
      ]
    } as unknown) as AwsFunction,

    CreateContact: ({
      handler: 'src/infrastructure/api/CreateContactController.handler',
      events: [
        {
          http: {
            method: 'post',
            path: 'contacts',
            cors: true,
            authorizer: {
              name: 'Auth'
            },
            request: {
              schema: {
                'application/json': '${file(src/infrastructure/api/models/create-contact-request.json)}'
              }
            }
          }
        }
      ],
      iamRoleStatements: [
        {
          Effect: 'Allow',
          Action: [
            'dynamodb:PutItem',
            'dynamodb:Query'
          ],
          Resource: 'arn:aws:dynamodb:${self:provider.region}:*:table/${self:provider.environment.CONTACTS_TABLE}'
        }
      ]
    } as unknown) as AwsFunction,

    UpdateContact: ({
      handler: 'src/infrastructure/api/UpdateContactController.handler',
      events: [
        {
          http: {
            method: 'patch',
            path: 'contacts/{contactId}',
            cors: true,
            authorizer: {
              name: 'Auth'
            },
            request: {
              schema: {
                'application/json': '${file(src/infrastructure/api/models/update-contact-request.json)}'
              }
            }
          }
        }
      ],
      iamRoleStatements: [
        {
          Effect: 'Allow',
          Action: [
            'dynamodb:PutItem',
            'dynamodb:Query'
          ],
          Resource: 'arn:aws:dynamodb:${self:provider.region}:*:table/${self:provider.environment.CONTACTS_TABLE}'
        }
      ]
    } as unknown) as AwsFunction,

    DeleteContact: ({
      handler: 'src/infrastructure/api/DeleteContactController.handler',
      events: [
        {
          http: {
            method: 'delete',
            path: 'contacts/{contactId}',
            cors: true,
            authorizer: {
              name: 'Auth'
            }
          }
        }
      ],
      iamRoleStatements: [
        {
          Effect: 'Allow',
          Action: [
            'dynamodb:DeleteItem'
          ],
          Resource: 'arn:aws:dynamodb:${self:provider.region}:*:table/${self:provider.environment.CONTACTS_TABLE}'
        }
      ]
    } as unknown) as AwsFunction,
  
    GenerateSignedUrl: ({
      handler: 'src/infrastructure/api/GenerateSignedUrl.handler',
      events: [
        {
          http: {
            method: 'post',
            path: 'contacts/{contactId}/attachment',
            cors: true,
            authorizer: {
              name: 'Auth'
            }
          }
        }
      ],
      iamRoleStatements: [
        {
          Effect: 'Allow',
          Action: [
            'dynamodb:Query',
            'dynamodb:PutItem'
          ],
          Resource: 'arn:aws:dynamodb:${self:provider.region}:*:table/${self:provider.environment.CONTACTS_TABLE}'
        },
        {
          Effect: 'Allow',
          Action: [
            's3:PutObject',
            's3:GetObject'
          ],
          Resource: 'arn:aws:s3:::${self:provider.environment.CONTACTS_S3_BUCKET}/*'
        }
      ]
    } as unknown) as AwsFunction
  },

  resources: {
    Resources: {
      APIGatewayDefault4XXResponse: {
        Type: 'AWS::ApiGateway::GatewayResponse',
        Properties: {
          ResponseParameters: {
            'gatewayresponse.header.Access-Control-Allow-Origin': "'*'",
            'gatewayresponse.header.Access-Control-Allow-Headers': "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,X-Amz-User-Agent'",
            'gatewayresponse.header.Access-Control-Allow-Methods': "'PATCH,DELETE,GET,OPTIONS,POST'"
          },
          ResponseType: 'DEFAULT_4XX',
          RestApiId: {
            Ref: 'ApiGatewayRestApi'
          }
        }
      },
      
      ContactsDynamoDBTable: {
        Type: 'AWS::DynamoDB::Table',
        Properties: {
          TableName: '${self:provider.environment.CONTACTS_TABLE}',
          BillingMode: 'PAY_PER_REQUEST',
          AttributeDefinitions: [
            {
              AttributeName: 'contactId',
              AttributeType: 'S'
            },
            {
              AttributeName: 'userId',
              AttributeType: 'S'
            }
          ],
          KeySchema: [
            {
              AttributeName: 'contactId',
              KeyType: 'HASH'
            },
            {
              AttributeName: 'userId',
              KeyType: 'RANGE'
            }
          ],
          GlobalSecondaryIndexes: [
            {
              IndexName: '${self:provider.environment.CONTACTS_USER_INDEX}',
              KeySchema: [
                {
                  AttributeName: 'userId',
                  KeyType: 'HASH'
                }
              ],
              Projection: {
                ProjectionType: 'ALL'
              }
            }
          ]
        }
      },

      ContactsBucket: {
        Type: 'AWS::S3::Bucket',
        Properties: {
          BucketName: '${self:provider.environment.CONTACTS_S3_BUCKET}',
          CorsConfiguration: {
            CorsRules: [
              {
                AllowedOrigins: ["*"],
                AllowedHeaders: ["*"],
                AllowedMethods: ["GET", "PUT", "POST", "DELETE", "HEAD"],
                MaxAge: 3000
              }
            ]
          }
        }
      },

      ContactsBucketPolicy: {
        Type: 'AWS::S3::BucketPolicy',
        Properties: {
          PolicyDocument: {
            Id: 'ContactPublicBucketPolicy',
            Version: '2012-10-17',
            Statement: [
              {
                Sid: 'PublicGetBucketObjects',
                Effect: 'Allow',
                Principal: '*',
                Action: 's3:GetObject',
                Resource: 'arn:aws:s3:::${self:provider.environment.CONTACTS_S3_BUCKET}/*'
              }
            ]
          },
          Bucket: {
            'Ref': 'ContactsBucket'
          }
        }
      }
    }
  }
}

module.exports = serverlessConfiguration

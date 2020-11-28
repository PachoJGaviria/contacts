import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayTokenAuthorizerEvent, CustomAuthorizerResult } from 'aws-lambda'

export function getUserId(event: APIGatewayProxyEvent) {
  return "pachoTest"
}

export const handler = async (event: APIGatewayTokenAuthorizerEvent): Promise<CustomAuthorizerResult> => {
  return {
    principalId: 'pachoTest',
    policyDocument: {
      Version: '2012-10-17',
      Statement: [
        {
          Action: 'execute-api:Invoke',
          Effect: 'Allow',
          Resource: '*'
        }
      ]
    }
  }
}

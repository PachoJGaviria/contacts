import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import { getUserId } from '../authorization/Auth0Authorizer'

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const contactId = event.pathParameters.contactId
  const userId = getUserId(event)

  console.log(contactId, userId)

  return {
    statusCode: 200,
    body: 'This the delete contact endpoint'
  }
} 

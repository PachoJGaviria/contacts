import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import { getUserId } from '../authorization/Auth0Authorizer'
import middy from '@middy/core'
import cors from '@middy/http-cors'
import httpErrorHandler from '@middy/http-error-handler'
import { createLogger } from '../../util/logger'
import { DynamoDBContactRepository } from '../persistence/DynamoDBContactRepository';
import { UserId } from '../../domain/valueobject/UserId'
import { DeleteContact } from '../../application/DeleteContact';
import { ContactId } from '../../domain/valueobject/ContactId'

const logger = createLogger('DeleteContactsController')
const contactRepository = new DynamoDBContactRepository()
const deleteContact = new DeleteContact(contactRepository)

const DeleteContactsController: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const userId = getUserId(event)
  const contactId = event.pathParameters.contactId

  logger.info(`Delete contacts: Contact id: ${contactId} - User id: ${userId}`)
  await deleteContact.delete(new ContactId(contactId), new UserId(userId))
  return {
    statusCode: 200,
    body: JSON.stringify({message: 'DELETED'})
  }
} 

const handler = middy(DeleteContactsController)
handler
  .use(httpErrorHandler())
  .use(cors({credentials: true}))

export { handler }

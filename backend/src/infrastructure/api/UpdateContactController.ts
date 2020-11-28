import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import { getUserId } from '../authorization/Auth0Authorizer'
import { createLogger } from '../../util/logger';
import middy from '@middy/core'
import cors from '@middy/http-cors'
import httpErrorHandler from '@middy/http-error-handler'
import { DynamoDBContactRepository } from '../persistence/DynamoDBContactRepository';
import { ContactName } from '../../domain/valueobject/ContactName';
import { ContactId } from '../../domain/valueobject/ContactId';
import { UserId } from '../../domain/valueobject/UserId';
import { ContactPhone } from '../../domain/valueobject/ContactPhone';
import { UpdateContact } from '../../application/UpdateContact';

const logger = createLogger('CreateContactController')
const contactRepository = new DynamoDBContactRepository()
const updateContact = new UpdateContact(contactRepository)

interface UpdateContactRequest {
  name: string,
  phone: string
}

const createContactController: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const userId = getUserId(event)
  const contactId = event.pathParameters.contactId
  const updateContactInfo: UpdateContactRequest = JSON.parse(event.body)
  logger.info(`Update a Contact: Contact id: ${contactId} User id: ${userId} - info:  ${JSON.stringify(updateContactInfo)}`)

  await updateContact.update(
    new ContactId(contactId), 
    new UserId(userId), 
    new ContactName(updateContactInfo.name), 
    new ContactPhone(updateContactInfo.phone)
  )
  return {
    statusCode: 201,
    body: 'UPDATED'
  }
}

const handler = middy(createContactController)
handler
  .use(httpErrorHandler())
  .use(cors({credentials: true}))

export { handler }

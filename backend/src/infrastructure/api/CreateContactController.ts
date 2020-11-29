import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import { getUserId } from '../authorization/Auth0Authorizer'
import { createLogger } from '../../util/logger';
import middy from '@middy/core'
import cors from '@middy/http-cors'
import httpErrorHandler from '@middy/http-error-handler'
import { CreateContact } from '../../application/CreateContact';
import { DynamoDBContactRepository } from '../persistence/DynamoDBContactRepository';
import { ContactName } from '../../domain/valueobject/ContactName';
import { ContactId } from '../../domain/valueobject/ContactId';
import { UserId } from '../../domain/valueobject/UserId';
import { ContactPhone } from '../../domain/valueobject/ContactPhone';

const logger = createLogger('CreateContactController')
const contactRepository = new DynamoDBContactRepository()
const createContact = new CreateContact(contactRepository)

interface CreateContactRequest {
  contactId: string,
  name: string,
  phone: string
}

const createContactController: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const userId = getUserId(event)
  const newContact: CreateContactRequest = JSON.parse(event.body)
  logger.info(`Create a new Contact: User id: ${userId} - info:  ${JSON.stringify(newContact)}`)

  await createContact.create(
    new ContactId(newContact.contactId), 
    new UserId(userId), 
    new ContactName(newContact.name), 
    new ContactPhone(newContact.phone)
  )
  return {
    statusCode: 201,
    body: JSON.stringify({message: 'CREATED'})
  }
}

const handler = middy(createContactController)
handler
  .use(httpErrorHandler())
  .use(cors({credentials: true}))

export { handler }

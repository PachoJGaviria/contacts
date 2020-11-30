import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import { getUserId } from '../authorization/Auth0Authorizer'
import middy from '@middy/core'
import cors from '@middy/http-cors'
import httpErrorHandler from '@middy/http-error-handler'
import { GetAllContacts } from '../../application/GetAllContacts'
import { createLogger } from '../../util/logger'
import { DynamoDBContactRepository } from '../persistence/DynamoDBContactRepository';
import { UserId } from '../../domain/valueobject/UserId'



const logger = createLogger('GetAllContactsController')
const contactRepository = new DynamoDBContactRepository()
const getAllContacts = new GetAllContacts(contactRepository)


const GetAllContactsController: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const userId = await getUserId(event)
  logger.info(`Get all Contacts by User id: ${userId}`)
  const contacts = (await getAllContacts
  .getAllContacts(new UserId(userId)))
  .map(contact => {
    return {
      contactId: contact.contactId.id,
      name: contact.name.value,
      phone: contact.phone.value,
      photo: contact.photoUrl
    }
  })
  logger.info(`Contacts by user id ${userId} - ${JSON.stringify(contacts)}`)
  return {
    statusCode: 200,
    body: JSON.stringify(contacts)
  }
} 


const handler = middy(GetAllContactsController)
handler
  .use(httpErrorHandler())
  .use(cors({credentials: true}))

export { handler }

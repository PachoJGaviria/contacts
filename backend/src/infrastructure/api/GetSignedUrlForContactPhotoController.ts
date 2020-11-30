import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import { getUserId } from '../authorization/Auth0Authorizer'
import { createLogger } from '../../util/logger';
import middy from '@middy/core'
import cors from '@middy/http-cors'
import httpErrorHandler from '@middy/http-error-handler'
import { DynamoDBContactRepository } from '../persistence/DynamoDBContactRepository';
import { ContactId } from '../../domain/valueobject/ContactId';
import { UserId } from '../../domain/valueobject/UserId';
import { AddContactPhoto } from '../../application/AddContactPhoto';
import * as AWS  from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'

const XAWS = AWSXRay.captureAWS(AWS)
const s3 = new XAWS.S3({ signatureVersion: 'v4' })
const contactBucket = process.env.CONTACTS_S3_BUCKET
const expiration: number = +process.env.SIGNED_URL_EXPIRATION

const logger = createLogger('CreateContactController')
const contactRepository = new DynamoDBContactRepository()
const addContactPhoto = new AddContactPhoto(contactRepository)

function getSignedUrl(todoId: string): string {
  return s3.getSignedUrl('putObject', {
    Bucket: contactBucket,
    Key: todoId,
    Expires: expiration
  })
}

const getSignedUrlForContactPhotoController: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const contactId = event.pathParameters.contactId
  const userId = await getUserId(event)
  const s3Url = `https://${contactBucket}.s3.amazonaws.com/${contactId}`
  logger.info(`Get a signed URL to Contact with id: ${contactId} userId: ${userId}`)
  await addContactPhoto.updateContactPhoto(
    new ContactId(contactId), 
    new UserId(userId),
    s3Url
  )
  const url = getSignedUrl(contactId)
  return {
    statusCode: 200,
    body: JSON.stringify({
      uploadUrl: url
    })
  }
}

const handler = middy(getSignedUrlForContactPhotoController)
handler
  .use(httpErrorHandler())
  .use(cors({credentials: true}))

export { handler }


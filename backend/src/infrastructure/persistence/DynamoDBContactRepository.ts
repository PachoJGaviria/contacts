
import 'source-map-support/register'
import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { Contact } from '../../domain/Contact'
import { ContactRepository } from '../../domain/ContactRepository'
import { ContactId } from '../../domain/valueobject/ContactId'
import { UserId } from '../../domain/valueobject/UserId'
import { createLogger } from '../../util/logger'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { ContactName } from '../../domain/valueobject/ContactName'
import { ContactPhone } from '../../domain/valueobject/ContactPhone'

const XAWS = AWSXRay.captureAWS(AWS)
const logger = createLogger('DynamoDBContactRepository')
function createDynamoDBDocumentClient(): DocumentClient {
  return new XAWS.DynamoDB.DocumentClient()
}

export class DynamoDBContactRepository implements ContactRepository {

  constructor(
    private readonly dynamoDBDocClient: DocumentClient = createDynamoDBDocumentClient(),
    private readonly contactTable = process.env.CONTACTS_TABLE,
    private readonly contactUserIndex = process.env.CONTACTS_USER_INDEX) {
  }
  async getContactsBy(userId: UserId): Promise<Contact[]> {
    logger.info(`Get all contacts by user ${userId}`)

    const result = await this.dynamoDBDocClient.query({
      TableName: this.contactTable,
      IndexName: this.contactUserIndex,
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':userId': userId.id
      }
    }).promise()
    return (result.Items as any[])
      .map(item => new Contact(
        new ContactId(item.contactId),
        new UserId(item.userId), 
        new ContactName(item.name), 
        new ContactPhone(item.phone)))
  }

  async save(contact: Contact): Promise<void> {
    logger.info(`Save a Contact ${JSON.stringify(contact)}`)
    await this.dynamoDBDocClient.put({
      TableName: this.contactTable,
      Item: {
        contactId: contact.contactId.id,
        userId: contact.userId.id,
        name: contact.name.value,
        phone: contact.phone.value
      }
    }).promise()
  }
  async exists(contactId: ContactId, userId: UserId): Promise<boolean> {    
    const result = await this.dynamoDBDocClient.query({
      TableName: this.contactTable,
      KeyConditionExpression: 'contactId = :contactId and userId = :userId',
      ExpressionAttributeValues: {
        ':contactId': contactId.id,
        ':userId': userId.id
      }
    }).promise()
    const response = result.Items.length > 0
    logger.info(`Exists contact? ${response} - contact Id: ${contactId.id} - userId: ${userId.id}`)
    return response
  }
}

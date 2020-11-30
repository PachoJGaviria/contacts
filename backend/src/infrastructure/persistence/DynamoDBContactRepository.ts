
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
  
  async find(contactId: ContactId, userId: UserId): Promise<Contact> {
    logger.info(`Get contact by contactId: ${contactId} - userId: ${userId}`)
    
    const result = await this.dynamoDBDocClient.query({
      TableName: this.contactTable,
      KeyConditionExpression: 'contactId = :contactId and userId = :userId',
      ExpressionAttributeValues: {
        ':contactId': contactId.id,
        ':userId': userId.id
      }
    }).promise()
    const item = result.Items.length > 0 ? result.Items[0] : undefined
    const contact = this.toContact(item)
    return contact
  }

  private toContact(dynamoDBItem: any): Contact {
    if (dynamoDBItem) {
      const contact = new Contact(
        new ContactId(dynamoDBItem.contactId),
        new UserId(dynamoDBItem.userId), 
        new ContactName(dynamoDBItem.name), 
        new ContactPhone(dynamoDBItem.phone))
      contact.updateContactPhoto(dynamoDBItem.photoUrl)
      logger.info(`DynamoItem to Contact ${JSON.stringify(dynamoDBItem)} -> ${JSON.stringify(contact)}`)
      return contact
    }
    return null
  }

  private toDynamoItem(contact: Contact): any {
    const item = {
      contactId: contact.contactId.id,
      userId: contact.userId.id,
      name: contact.name.value,
      phone: contact.phone.value,
      photoUrl: contact.photoUrl
    }
    logger.info(`Contact to DynamoItem ${JSON.stringify(contact)} -> ${JSON.stringify(contact)}`)
    return item
  }

  async delete(contactId: ContactId, userId: UserId): Promise<void> {
    logger.info(`Delete a contact with contactId: ${contactId.id} userId: ${userId.id}`)
    await this.dynamoDBDocClient.delete({
      TableName: this.contactTable,
      Key: { contactId: contactId.id, userId: userId.id }
    }).promise()  
  }

  async getContactsBy(userId: UserId): Promise<Contact[]> {
    logger.info(`Get all contacts by user ${userId.id}`)

    const result = await this.dynamoDBDocClient.query({
      TableName: this.contactTable,
      IndexName: this.contactUserIndex,
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':userId': userId.id
      }
    }).promise()
    const contacts = (result.Items as any[])
      .map(this.toContact)
    logger.info(`Contacts by user id ${userId.id} - ${JSON.stringify(contacts)}`)
    return contacts
  }

  async save(contact: Contact): Promise<void> {
    logger.info(`Save a Contact ${JSON.stringify(contact)}`)
    const item = this.toDynamoItem(contact)
    await this.dynamoDBDocClient.put({
      TableName: this.contactTable,
      Item: item
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

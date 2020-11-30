import 'source-map-support/register'
import { ContactId } from './valueobject/ContactId'
import { ContactName } from './valueobject/ContactName'
import { ContactPhone } from './valueobject/ContactPhone';
import { UserId } from './valueobject/UserId'

export class Contact {

  readonly contactId: ContactId
  readonly userId: UserId
  readonly name: ContactName
  readonly phone: ContactPhone
  photoUrl: string

  constructor(contactId: ContactId, userId: UserId, name: ContactName, phone: ContactPhone) {
    this.contactId = contactId
    this.userId = userId
    this.name = name
    this.phone = phone
  }

  static create(contactId: ContactId, userId: UserId, name: ContactName, phone: ContactPhone) {
    return new Contact(contactId, userId, name, phone)
  }
  
  static update(contactId: ContactId, userId: UserId, name: ContactName, phone: ContactPhone) {
    return new Contact(contactId, userId, name, phone)
  }

  updateContactPhoto(photoUrl: string) {
    this.photoUrl = photoUrl
  }
}

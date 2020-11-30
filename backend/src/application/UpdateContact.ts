import 'source-map-support/register'
import { Contact } from '../domain/Contact'
import { ContactId } from '../domain/valueobject/ContactId'
import { ContactName } from '../domain/valueobject/ContactName'
import { ContactPhone } from '../domain/valueobject/ContactPhone'
import { UserId } from '../domain/valueobject/UserId'
import { ContactRepository } from '../domain/ContactRepository'
import { createLogger } from '../util/logger'

const logger = createLogger('UpdateContact')

export class UpdateContact {

  readonly contactRepository: ContactRepository

  constructor(contactRepository: ContactRepository) {
    this.contactRepository = contactRepository
  }

  async update(contactId: ContactId, userId: UserId, name: ContactName, phone: ContactPhone): Promise<Contact> {
    const contact = Contact.update(contactId, userId, name, phone)
    this.contactRepository.save(contact)
    return contact
  }

}

import 'source-map-support/register'
import { Contact } from '../domain/Contact'
import { ContactId } from '../domain/valueobject/ContactId'
import { ContactName } from '../domain/valueobject/ContactName'
import { ContactPhone } from '../domain/valueobject/ContactPhone'
import { UserId } from '../domain/valueobject/UserId'
import { ContactRepository } from '../domain/ContactRepository'
import { ContactAlreadyExistsError } from '../domain/errors/ContactAlreadyExistsError';
import { createLogger } from '../util/logger'

const logger = createLogger('CreateContact')

export class CreateContact {

  readonly contactRepository: ContactRepository

  constructor(contactRepository: ContactRepository) {
    this.contactRepository = contactRepository
  }

  async create(contactId: ContactId, userId: UserId, name: ContactName, phone: ContactPhone): Promise<Contact> {
    if (await this.contactRepository.exists(contactId, userId)) {
      throw new ContactAlreadyExistsError(`The contact with id: ${contactId.id} - user id ${userId.id} already exists.`, logger)
    }
    const contact = Contact.create(contactId, userId, name, phone)
    this.contactRepository.save(contact)
    return contact
  }

}

import 'source-map-support/register'
import { createLogger } from '../util/logger'
import { ContactRepository } from '../domain/ContactRepository';
import { UserId } from '../domain/valueobject/UserId';
import { ContactId } from '../domain/valueobject/ContactId';
import { ContactNotFoundError } from '../domain/errors/ContactNotFoundError';


const logger = createLogger('UpdateContact')


export class AddContactPhoto {

  readonly contactRepository: ContactRepository

  constructor(contactRepository: ContactRepository) {
    this.contactRepository = contactRepository
  }

  async updateContactPhoto(contactId: ContactId, userId: UserId, photoUrl: string): Promise<void> {
    const contact = await this.contactRepository.find(contactId, userId);
    if (!contact) {
      throw new ContactNotFoundError(`Contact with id: ${contactId} - userId ${userId} not found`, logger)
    }
    contact.updateContactPhoto(photoUrl)
    await this.contactRepository.save(contact)
  }
}

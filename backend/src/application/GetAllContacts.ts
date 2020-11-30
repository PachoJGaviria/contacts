import 'source-map-support/register'
import { Contact } from '../domain/Contact'
import { UserId } from '../domain/valueobject/UserId'
import { ContactRepository } from '../domain/ContactRepository'
import { createLogger } from '../util/logger'

const logger = createLogger('GetContacts')

export class GetAllContacts {

  readonly contactRepository: ContactRepository

  constructor(contactRepository: ContactRepository) {
    this.contactRepository = contactRepository
  }

  async getAllContacts(userId: UserId): Promise<Contact[]> {
    logger.info(`Get All contacts by UserId: ${userId.id}`)
    return await this.contactRepository.getContactsBy(userId)
  }

}

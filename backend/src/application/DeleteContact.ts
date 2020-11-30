import 'source-map-support/register'
import { ContactId } from '../domain/valueobject/ContactId'
import { UserId } from '../domain/valueobject/UserId'
import { ContactRepository } from '../domain/ContactRepository'
import { createLogger } from '../util/logger'

const logger = createLogger('DeleteContact')

export class DeleteContact {

  readonly contactRepository: ContactRepository

  constructor(contactRepository: ContactRepository) {
    this.contactRepository = contactRepository
  }

  async delete(contactId: ContactId, userId: UserId): Promise<void> {
    logger.info(`Delete contact by contact id: ${contactId} - UserId: ${userId}`)
    await this.contactRepository.delete(contactId, userId)
  }

}

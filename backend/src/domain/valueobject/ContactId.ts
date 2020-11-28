import 'source-map-support/register'
import {validate as uuidValidate} from 'uuid'
import { createLogger } from '../../util/logger'
import { IllegalArgumentError } from '../errors/IllegalArgumentError'

const logger = createLogger('ContactId')

export class ContactId {
  readonly id: string

  constructor(contactId: string) {
    if (!contactId) {
      throw new IllegalArgumentError('The contact id is required.', logger)
    }
    if (!uuidValidate(contactId)) {
      throw new IllegalArgumentError('The contact id is not an uuid.', logger)
    }
    this.id = contactId
  }
}

import 'source-map-support/register'
import { IllegalArgumentError } from '../errors/IllegalArgumentError'
import { createLogger } from '../../util/logger'

const logger = createLogger('ContactId')

export class ContactPhone {
  readonly value: string

  constructor(contactNumber:  string) {
    if (!contactNumber) {
      throw new IllegalArgumentError('The contact number is required.', logger)
    }
    this.value = contactNumber
  }
}

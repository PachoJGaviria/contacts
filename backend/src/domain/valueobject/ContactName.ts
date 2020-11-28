import 'source-map-support/register'
import { IllegalArgumentError } from '../errors/IllegalArgumentError'
import { createLogger } from '../../util/logger'

const logger = createLogger('ContactId')

export class ContactName {
  readonly value: string

  constructor (contactName: string){
    if (!contactName) {
      throw new IllegalArgumentError('The contact name is required.', logger)
    }
    if (!contactName.match(/^[a-zA-Z0-9 .-]+$/)) {
      throw new IllegalArgumentError('The contact name is not a safe text.', logger)
    }
    this.value = contactName
  }
}

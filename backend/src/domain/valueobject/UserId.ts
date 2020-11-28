import 'source-map-support/register'
import { createLogger } from '../../util/logger'
import { IllegalArgumentError } from '../errors/IllegalArgumentError'

const logger = createLogger('UserId')

export class UserId {
  readonly id: string

  constructor(userId: string) {
    if (!userId) {
      throw new IllegalArgumentError('The user id is required.', logger)
    }
    this.id = userId
  }
}

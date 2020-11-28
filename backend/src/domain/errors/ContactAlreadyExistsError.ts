import 'source-map-support/register'
import * as winston from 'winston'

export class ContactAlreadyExistsError extends Error {

  readonly statusCode: number

  constructor(readonly message: string, readonly logger: winston.Logger) {
    super(message)
    this.statusCode = 409
    logger.error(message)
  }
}

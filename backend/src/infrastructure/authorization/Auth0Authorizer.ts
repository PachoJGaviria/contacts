import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayTokenAuthorizerEvent, CustomAuthorizerResult } from 'aws-lambda'
import { createLogger } from '../../util/logger'
import Axios from 'axios'

const logger = createLogger('auth')

export interface UserInfo {
  sub: string,
  given_name: string,
  family_name: string,
  nickname: string,
  name: string,
  locale: string,
  email: string
}

// URL that can be used to download a certificate that can be used to verify JWT token signature.
const userInfoUrl = 'https://dev-8gn1qd2h.us.auth0.com/userinfo'

export async function getUserId(event: APIGatewayProxyEvent): Promise<string> {
  const userInfo = await getUserInfo(event.headers.Authorization)
  return userInfo.sub
}

export const handler = async (event: APIGatewayTokenAuthorizerEvent): Promise<CustomAuthorizerResult> => {
  logger.info(`Authorizing a user with token ${event.authorizationToken}`)
  try {
    const userInfo = await getUserInfo(event.authorizationToken)
    logger.info(`User was authorized ${userInfo.sub} - ${userInfo.email}`)
    return {
      principalId: userInfo.sub,
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Allow',
            Resource: '*'
          }
        ]
      }
    }
  } catch (e) {
    logger.error(`User not authorized. Error: ${e.message}`)
    return {
      principalId: 'user',
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Deny',
            Resource: '*'
          }
        ]
      }
    }
  }
}

async function getUserInfo(opaqueToken: string): Promise<UserInfo> {
  if (!opaqueToken) {
    throw new Error('No authentication header')
  }

  if (!opaqueToken.toLowerCase().startsWith('bearer ')) {
    throw new Error('Invalid authentication header')
  }

  logger.info(`Getting user info from ${userInfoUrl}`)
  const response = await Axios.get(userInfoUrl, {
    headers: {
      Authorization: opaqueToken
    }
  })
  return response.data as UserInfo
}

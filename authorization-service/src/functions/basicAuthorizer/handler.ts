import { APIGatewayTokenAuthorizerHandler, PolicyDocument } from 'aws-lambda';
import 'source-map-support/register';

import { middyfy } from '@libs/lambda';

enum Effect {
  Allow = 'Allow',
  Deny = 'Deny',
}

const checkPasswordWithEnv = (username: string, password: string): Effect => {
  const storedUserPassword = process.env[username];

  return storedUserPassword && storedUserPassword === password
    ? Effect.Allow
    : Effect.Deny;
};

const generatePolicy = ({
  principalId,
  resource,
  effect,
}: {
  principalId: string;
  resource: string;
  effect: Effect;
}) => {
  const policyDocument: PolicyDocument = {
    Version: '2012-10-17',
    Statement: [
      {
        Action: 'execute-api:Invoke',
        Effect: effect,
        Resource: resource,
      },
    ],
  };
  return { principalId, policyDocument };
};

export const basicAuthorizer: APIGatewayTokenAuthorizerHandler = (
  event,
  _context,
  cb
) => {
  console.log('Event basicAuthorizer', JSON.stringify(event));
  if (event.type !== 'TOKEN') {
    cb('Unauthorized');
  }
  try {
    const { authorizationToken, methodArn } = event;
    const token = authorizationToken.split(' ')[1];

    let effect = Effect.Deny;

    if (token) {
      const buffer = Buffer.from(token, 'base64');
      const [username, password] = buffer.toString('utf-8').split(':');

      console.log(`username: ${username} and password: ${password}`);
      effect = checkPasswordWithEnv(username, password);
    }

    const policy = generatePolicy({
      principalId: token,
      resource: methodArn,
      effect,
    });
    cb(null, policy);
  } catch (err) {
    console.error(err);
    cb(`Unauthorized ${err.message}`);
  }
};

export const main = middyfy(basicAuthorizer);

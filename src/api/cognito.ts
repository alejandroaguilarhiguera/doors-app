import { CognitoUserPool } from 'amazon-cognito-identity-js';

const poolData = {
  UserPoolId: process.env.EXPO_PUBLIC_AWS_COGNITO_POOL ?? '',
  ClientId: process.env.EXPO_PUBLIC_AWS_COGNITO_APP_CLIENT ?? '',
};

export let userPool = new CognitoUserPool(poolData);

export function getUserPool(): CognitoUserPool {
  if (!userPool) {
    userPool = new CognitoUserPool(poolData);
  }
  return userPool;
}

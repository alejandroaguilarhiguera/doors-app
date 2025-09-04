import { CognitoUser } from 'amazon-cognito-identity-js';
import { userPool } from './cognito';

export const signOut = (username: string) => {
  const user = userPool.getCurrentUser();
  user?.signOut();
};
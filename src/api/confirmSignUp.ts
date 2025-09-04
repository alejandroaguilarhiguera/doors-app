import { CognitoUser } from 'amazon-cognito-identity-js';
import { userPool } from './cognito';

export const confirmSignUp = (username: string, code: string) => {
  const user = new CognitoUser({ Username: username, Pool: userPool });

  return new Promise((resolve, reject) => {
    user.confirmRegistration(code, true, (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
};
import { CognitoUserAttribute } from 'amazon-cognito-identity-js';
import { userPool } from './cognito';

export const signUp = async (username: string, email: string, password: string) => {
  return new Promise((resolve, reject) => {
    const attributeList = [
      new CognitoUserAttribute({ Name: 'email', Value: email }),
    ];

    userPool.signUp(username, password, attributeList, [], (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
};
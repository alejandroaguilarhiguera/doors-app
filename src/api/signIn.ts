// src/api/signIn.ts
import { CognitoUser, AuthenticationDetails, CognitoUserSession } from 'amazon-cognito-identity-js';
import { userPool } from './cognito';
import { CognitoTokens } from '@/src/types/auth';

export default function signIn(
  username: string,
  password: string,
  newPassword?: string
): Promise<CognitoTokens> { // <-- tipamos el retorno
  

  return new Promise((resolve, reject) => {
    const user = new CognitoUser({ Username: username, Pool: userPool });
    const authDetails = new AuthenticationDetails({ Username: username, Password: password });

    user.authenticateUser(authDetails, {
      onSuccess: (session: CognitoUserSession) => {
        // Convertimos la sesión de Cognito a nuestra interface
        const tokens: CognitoTokens = {
          accessToken: {
            jwtToken: session.getAccessToken().getJwtToken(),
            payload: session.getAccessToken().decodePayload() as CognitoTokens['accessToken']['payload'],
          },
          idToken: {
            jwtToken: session.getIdToken().getJwtToken(),
            payload: session.getIdToken().decodePayload() as CognitoTokens['idToken']['payload'],
          },
          refreshToken: {
            token: session.getRefreshToken().getToken(),
          },
          clockDrift: 0,
        };
        resolve(tokens);
      },
      onFailure: (err) => reject(err),
      newPasswordRequired: (userAttributes, requiredAttributes) => {
        if (!newPassword) {
          reject({ message: 'Usuario debe cambiar la contraseña' });
        } else {
          user.completeNewPasswordChallenge(newPassword, {}, {
            onSuccess: (session: CognitoUserSession) => {
              const tokens: CognitoTokens = {
                accessToken: {
                  jwtToken: session.getAccessToken().getJwtToken(),
                  payload: session.getAccessToken().decodePayload() as CognitoTokens['accessToken']['payload'],
                },
                idToken: {
                  jwtToken: session.getIdToken().getJwtToken(),
                  payload: session.getIdToken().decodePayload() as CognitoTokens['idToken']['payload'],
                },
                refreshToken: {
                  token: session.getRefreshToken().getToken(),
                },
                clockDrift: 0,
              };
              resolve(tokens);
            },
            onFailure: (err) => reject(err),
          });
        }
      },
    });
  });
}
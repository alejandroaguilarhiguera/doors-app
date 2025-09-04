// src/api/fetcher.ts
import { router } from 'expo-router';
import { CognitoTokens } from '@/src/types/auth';
import { CognitoUserPool, CognitoUser } from 'amazon-cognito-identity-js';
import { getUserPool } from './cognito';

async function refreshSession(token: CognitoTokens): Promise<CognitoTokens | null> {
  const Pool = getUserPool();
  return new Promise((resolve, reject) => {
    try {
      const user = new CognitoUser({
        Username: token.idToken.payload.email || '', // asegúrate de guardar el username en CognitoTokens
        Pool,
      });

      user.refreshSession(token.refreshToken as any, (err: any, session: any) => {
        if (err) {
          console.error("Error refrescando sesión:", err);
          reject(err);
        } else {
          const newTokens: CognitoTokens = {
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
          resolve(newTokens);
        }
      });
    } catch (err) {
      reject(err);
    }
  });
}


export async function fetcher(
  url: string,
  options: RequestInit = {},
  token?: CognitoTokens | null,
  onTokenRefresh?: (newTokens: CognitoTokens) => void,
) {
 let currentToken = token;

  const headers = {
    ...options.headers,
    ...(currentToken?.idToken.jwtToken
      ? { Authorization: `Bearer ${currentToken.idToken.jwtToken}` }
      : {}),
    "Content-Type": "application/json",
  };

  let response = await fetch(url, { ...options, headers });

  if (response.status === 401) {
    if (currentToken?.refreshToken) {
        try {
            // refrescar token
            const newTokens = await refreshSession(currentToken);
            if (newTokens) {
              currentToken = newTokens;
              onTokenRefresh?.(newTokens); // guardar en storage, Zustand, Redux, etc.
              // reintentar petición con nuevo token
              const retryHeaders = {
                  ...options.headers,
                  Authorization: `Bearer ${newTokens.idToken.jwtToken}`,
                  "Content-Type": "application/json",
                };
                response = await fetch(url, { ...options, headers: retryHeaders });
            }
        } catch (err) {
          router.replace('/auth/login');
          throw new Error('Sesión expirada, redirigiendo al login...');
        } 
    } // End if

    if (!currentToken?.refreshToken) {
        // TODO: Without refresh
      router.replace('/auth/login');
    } // End if
  }// End if 401


  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || `Error ${response.status}`);
  }

  return response.json();
}
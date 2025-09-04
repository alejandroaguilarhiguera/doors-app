import { CognitoUser, CognitoRefreshToken } from "amazon-cognito-identity-js";
import { getUserPool } from "./cognito"; // tu configuración de UserPool

export async function refreshSession(
  username: string,
  refreshToken: string
): Promise<{ idToken: string; accessToken: string; refreshToken: string }> {
  return new Promise((resolve, reject) => {
    const userPool = getUserPool();
    const cognitoUser = new CognitoUser({ Username: username, Pool: userPool });

    const refresh = new CognitoRefreshToken({ RefreshToken: refreshToken });

    cognitoUser.refreshSession(refresh, (err, session) => {
      if (err) {
        reject(err);
        return;
      }

      resolve({
        idToken: session.getIdToken().getJwtToken(),
        accessToken: session.getAccessToken().getJwtToken(),
        refreshToken: session.getRefreshToken().getToken(),
      });
    });
  });
}
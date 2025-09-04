export interface CognitoTokens {
  accessToken: {
    jwtToken: string;
    payload: {
      auth_time: number;
      client_id: string;
      event_id: string;
      exp: number;
      iat: number;
      iss: string;
      jti: string;
      origin_jti: string;
      scope: string;
      sub: string;
      token_use: 'access';
      username: string;
    };
  };
  idToken: {
    jwtToken: string;
    payload: {
      aud: string;
      auth_time: number;
      'cognito:username': string;
      email?: string;
      email_verified?: boolean;
      event_id?: string;
      exp: number;
      iat: number;
      iss: string;
      jti?: string;
      origin_jti?: string;
      sub: string;
      token_use: 'id';
    };
  };
  refreshToken: {
    token: string;
  };
  clockDrift: number;
}
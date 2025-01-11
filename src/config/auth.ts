export const authConfig = {
  authority: `https://eu-north-1qxhxtxgzn.auth.eu-north-1.amazoncognito.com`,
  client_id: import.meta.env.VITE_COGNITO_CLIENT_ID,
  redirect_uri: "http://localhost:5173/",
  response_type: "code",
  scope: "email openid profile",
  loadUserInfo: true,
  onSigninCallback: () => {
    window.history.replaceState({}, document.title, window.location.pathname);
  },
  metadata: {
    issuer: `https://eu-north-1qxhxtxgzn.auth.eu-north-1.amazoncognito.com`,
    authorization_endpoint: `https://eu-north-1qxhxtxgzn.auth.eu-north-1.amazoncognito.com/oauth2/authorize`,
    token_endpoint: `https://eu-north-1qxhxtxgzn.auth.eu-north-1.amazoncognito.com/oauth2/token`,
    userinfo_endpoint: `https://eu-north-1qxhxtxgzn.auth.eu-north-1.amazoncognito.com/oauth2/userInfo`,
    end_session_endpoint: `https://eu-north-1qxhxtxgzn.auth.eu-north-1.amazoncognito.com/logout`,
    jwks_uri: `https://eu-north-1qxhxtxgzn.auth.eu-north-1.amazoncognito.com/.well-known/jwks.json`,
  },
  extraQueryParams: {
    response_mode: "query",
  },
};

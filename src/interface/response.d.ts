export interface AuthTokensResponse {
  access: TokenResponse;
  refresh?: TokenResponse;
}

export interface TokenResponse {
  expires: Date;
  token: string;
}

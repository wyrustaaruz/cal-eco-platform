import { ACCESS_TOKEN_LOCAL_STORAGE } from "../constants/common";
import { getApi } from "./axios.service";

/**
 * Response type for Google auth endpoint
 */
interface GoogleAuthResponse {
  url: string;
}

/**
 * Login response type
 */
interface LoginResponse {
  access_token: string;
}

/**
 * Initiates Google OAuth sign-in flow
 */
export const handleSignInWithGoogleClick = async () => {
  const response = await getApi<GoogleAuthResponse>("/v1/auth/google");
  if (response.data?.url) {
    window.location.href = response.data.url;
  }
};

/**
 * Stores access token after successful login
 */
export const postLogin = (result: { data: LoginResponse }) => {
  localStorage.setItem(ACCESS_TOKEN_LOCAL_STORAGE, result.data.access_token);
};

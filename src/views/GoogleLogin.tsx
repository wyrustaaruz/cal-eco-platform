import React from "react";

import { getApi } from "../services/axios.service";

/**
 * Response type for Google OAuth endpoint
 */
interface GoogleAuthResponse {
  url: string;
}

const GoogleLogin = () => {
  const handleClick = async () => {
    const response = await getApi<GoogleAuthResponse>("/users/google");
    if (response.data?.url) {
      window.location.href = response.data.url;
    }
  };
  return (
    <div>
      <button onClick={handleClick}>Click</button>
    </div>
  );
};

export default GoogleLogin;

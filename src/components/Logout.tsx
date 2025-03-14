import { useState } from "react";

import { disconnect } from "../web3Auth";

async function logout(setIsLoading: (isLoading: boolean) => void) {
  try {
    setIsLoading(true);
    await disconnect();
  } finally {
    setIsLoading(false);
  }
}

function Logout() {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <button onClick={() => logout(setIsLoading)} disabled={isLoading}>
      Logout
    </button>
  );
}

export default Logout;

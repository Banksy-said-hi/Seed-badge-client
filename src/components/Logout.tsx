import { useState } from "react";

import { disconnect } from "../api/web3Auth";

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
    <div>
      <button
        onClick={() => logout(setIsLoading)}
        className={`px-4 py-2 font-semibold text-white bg-blue-500 rounded ${
          isLoading ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"
        }`}
      >
        Logout
      </button>
    </div>
  );
}

export default Logout;

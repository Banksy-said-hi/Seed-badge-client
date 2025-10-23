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

export function Logout() {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div>
      <button
        onClick={() => logout(setIsLoading)}
        disabled={isLoading}
        className={`group inline-flex items-center px-6 py-3 font-semibold text-sm text-white rounded-xl shadow-lg transition-all duration-200 border ${
          isLoading 
            ? "opacity-60 cursor-not-allowed bg-gradient-to-r from-red-400 to-pink-400 border-red-300/20" 
            : "bg-gradient-to-r from-red-600 to-pink-600 border-red-500/20 hover:shadow-xl hover:scale-105 hover:from-red-700 hover:to-pink-700"
        }`}
      >
        {isLoading ? (
          <>
            <div className="animate-spin mr-2 w-4 h-4 border-2 border-white/30 border-t-white rounded-full"></div>
            <span>Logging out...</span>
          </>
        ) : (
          <>
            <svg className="mr-2 w-4 h-4 group-hover:rotate-12 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span>Logout</span>
          </>
        )}
      </button>
    </div>
  );
}

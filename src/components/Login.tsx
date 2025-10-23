import { useState, useEffect } from "react";
import { WALLET_ADAPTERS } from "@web3auth/base";

import { connect } from "../api/web3Auth";
import { Loading } from "./Loading";
import { authorize, authenticate } from "../api/klang";

async function login(setLoading: (loading: boolean) => void) {
  try {
    setLoading(true);
    await authorize();
  } catch (error) {
    setLoading(false);
    throw error;
  }
}

async function handleRedirect(setLoading: (loading: boolean) => void) {
  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get("code");
  const codeVerifier = window.localStorage.getItem("code_verifier");

  // The state query parameter gets removed by web3Auth.init() so we save it in localStorage
  const state = urlParams.get("state") || window.localStorage.getItem("oauth_state");

  const storedState = window.localStorage.getItem("stored_oauth_state");

  if (code && codeVerifier && state === storedState) {
    try {
      setLoading(true);

      const token = await authenticate(code, codeVerifier);

      await connect(WALLET_ADAPTERS.AUTH, {
        loginProvider: "jwt",
        extraLoginOptions: {
          id_token: token,
          verifierIdField: "sub",
          redirectUrl: window.location.origin,
        },
      });
    } finally {
      setLoading(false);
    }
  }
}

export function Login() {
  const [isInitialized, setInitialized] = useState(false);
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    const redirect = async () => {
      await handleRedirect(setLoading);
      setInitialized(true);
    };

    redirect();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      {isInitialized ? (
        <div className="relative">
          {/* Background decoration */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-400/20 blur-3xl transform rotate-6 scale-110"></div>
          
          {/* Main card */}
          <div className="relative bg-white/80 backdrop-blur-xl p-12 rounded-3xl shadow-2xl border border-white/50 max-w-lg w-full">
            {/* Header section */}
            <div className="text-center mb-10">
              {/* Logo/Icon */}
              <div className="mx-auto mb-6 w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg transform rotate-3 hover:rotate-0 transition-transform duration-300">
                <div className="text-3xl">🎮</div>
              </div>
              
              {/* Title */}
              <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-3">
                Welcome to Klang
              </h1>
              <h2 className="text-2xl font-semibold text-gray-700 mb-8">
                Badge Collection
              </h2>
            </div>

            {/* Login button */}
            <div className="relative">
              {/* Glow effect behind button */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl blur-lg opacity-25 animate-pulse"></div>
              
              <button
                onClick={() => login(setLoading)}
                disabled={isLoading}
                className={`group relative w-full px-10 py-6 font-bold text-xl text-white rounded-3xl shadow-2xl transition-all duration-300 transform ${
                  isLoading 
                    ? "opacity-60 cursor-not-allowed scale-95" 
                    : "hover:scale-110 hover:shadow-3xl active:scale-105"
                } bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 hover:from-blue-700 hover:via-purple-700 hover:to-blue-800`}
              >
                {/* Multiple background effects */}
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-blue-400/30 to-purple-400/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                {/* Button content */}
                <div className="relative flex items-center justify-center">
                  {isLoading ? (
                    <>
                      {/* Enhanced loading spinner */}
                      <div className="animate-spin mr-4 w-7 h-7 border-3 border-white/20 border-t-white border-r-white rounded-full"></div>
                      <span className="tracking-wide">Connecting to Klang...</span>
                    </>
                  ) : (
                    <>
                      {/* Enhanced Klang icon */}
                      <div className="mr-4 text-3xl group-hover:scale-110 transition-transform duration-200">🚀</div>
                      <span className="tracking-wide">Login with Klang</span>
                      
                      {/* Enhanced arrow with better animation */}
                      <div className="ml-4 text-xl transform group-hover:translate-x-2 transition-transform duration-300">
                        →
                      </div>
                    </>
                  )}
                </div>
                
                {/* Enhanced shine effect */}
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-transparent via-white/30 to-transparent transform -skew-x-12 translate-x-full group-hover:-translate-x-full transition-transform duration-1000 ease-in-out"></div>
                
                {/* Subtle border highlight */}
                <div className="absolute inset-0 rounded-3xl border-2 border-gradient-to-r from-blue-300/50 to-purple-300/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="min-h-screen flex items-center justify-center">
          <Loading />
        </div>
      )}
    </div>
  );
}

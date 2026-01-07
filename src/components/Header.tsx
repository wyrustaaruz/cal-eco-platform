import React, { useContext, useEffect, useState } from "react";

import LumangiLogo from "../assets/images/LumangiLogo.svg";
import RewardWheel from "../assets/images/RewardWheel.svg";

import Button from "../UI/Button";
import { useWeb3React } from "@web3-react/core";
import ConnectWallet from "./auth/ConnectWallet";
import { AuthContext, ActionTypes } from "../contexts/AuthContext";
// const style = {
//   position: "absolute" as "absolute",
//   top: "50%",
//   left: "50%",
//   transform: "translate(-50%, -50%)",
//   // width: 400,
//   p: 4,
// };

export function Header() {
  const { updateAuthAction, isAuthenticated } = useContext(AuthContext);
  const { account } = useWeb3React();

  const handleLogin = () => {
    updateAuthAction(ActionTypes.Login);
  }; //TODO
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);

  const [selectedWallet, setSelectedWallet] = useState<
    "MetaMask" | "WalletConnect" | "Coinbase" | null
  >(null);
  useEffect(() => {
    if (account && selectedWallet) {
      setIsAuthModalOpen(false);
    }
  }, [account, selectedWallet]);

  return (
    <>
      <div className="flex flex-wrap items-center justify-between w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 mb-8 gap-4">
        <div className="flex items-center">
          <div
            className="rounded-lg shadow-lg"
            style={{
              background: "linear-gradient(135deg, #414593 0%, #00022E 100%)",
              backgroundBlendMode: "hard-light",
            }}
          >
            {isAuthenticated && (
              <div className="flex h-full px-4 py-1">
                <img src={RewardWheel} alt="RewardWheel" className="" />

                <div className="self-end mx-2 text-xl text-white">
                  Bright Mba
                </div>
                <div className="px-1 text-xs text-white bg-[#5856D6] rounded-full h-fit">
                  Beginner
                </div>
              </div>
            )}
            <div className="w-full h-1 rounded-full bg-neutral-200 dark:bg-neutral-600 overflow-hidden">
              <div
                className="h-full bg-[#FF073A] rounded-full"
                style={{ width: "45%" }}
              ></div>
            </div>
          </div>
          {isAuthenticated && (
            <div className="flex items-center justify-end px-3 py-2 ml-4 bg-white/10 backdrop-blur-sm rounded-lg border border-white/10">
              <img
                src={RewardWheel}
                alt="RewardWheel"
                className="w-8 h-8 mr-2"
              />
              <div className="flex flex-col w-full text-xs text-white">
                <div className="opacity-70">Next Roll:</div>
                <div className="">8h 13m 22s</div>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-center flex-1 md:flex-none order-first md:order-none w-full md:w-auto mb-4 md:mb-0">
          <a href="/" className="block">
            <img src={LumangiLogo} alt="Lumangi Logo" className="h-10 w-auto" />
          </a>
        </div>

        <div className="flex items-center gap-3 ml-auto">
          {!isAuthenticated && (
            <Button
              color="default"
              onClick={handleLogin}
              label={
                <span className="flex items-center gap-2">
                  <span>Register/Login</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-4 h-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                    />
                  </svg>
                </span>
              }
              customStyle="!bg-[#2563EB] !bg-gradient-to-r !from-blue-600 !to-indigo-600 !text-white !border-0 !outline-none !ring-0 shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transition-all duration-300 transform hover:-translate-y-0.5 rounded-full px-6 py-2.5 font-bold tracking-wide"
              title="Login to start"
            />
          )}
          <Button
            onClick={() => setIsAuthModalOpen(true)}
            label={
              <span className="flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 12a2.25 2.25 0 00-2.25-2.25H15a3 3 0 11-6 0H5.25A2.25 2.25 0 003 12m18 0v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 9m18 0V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v3"
                  />
                </svg>
                {account
                  ? `${account.substring(0, 6)}...${account.substring(
                      account.length - 4,
                    )}`
                  : "Connect Wallet"}
              </span>
            }
            color="default"
            disabled={!!account}
            customStyle={`!border-0 !outline-none rounded-full px-5 py-2.5 font-medium transition-colors ${
              account
                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                : "bg-white/10 text-white hover:bg-white/20"
            }`}
            title={account ? account : "Connect your crypto wallet"}
          />
          <ConnectWallet
            isModalOpen={isAuthModalOpen}
            setIsModalOpen={setIsAuthModalOpen}
            setSelectedWallet={setSelectedWallet}
          />
        </div>
      </div>
    </>
  );
}

export default Header;

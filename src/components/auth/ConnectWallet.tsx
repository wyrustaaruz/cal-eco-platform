import React, { useEffect, useRef } from "react";

import { coinbaseWallet } from "../../connectors/coinbaseWallet";
import { metaMask } from "../../connectors/metaMask";
import { walletConnect } from "../../connectors/walletConnect";

import Metamask from "../../assets/wallet/Metamask.svg";
import Phantom from "../../assets/wallet/Phantom.svg";
import Coinbase from "../../assets/wallet/Coinbase.svg";
import WalletConnect from "../../assets/wallet/WalletConnect.svg";

interface ConnectModalProps {
  isModalOpen: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedWallet: React.Dispatch<
    React.SetStateAction<"MetaMask" | "WalletConnect" | "Coinbase" | null>
  >;
}
const ConnectWallet: React.FC<ConnectModalProps> = ({
  isModalOpen,
  setIsModalOpen,
  setSelectedWallet,
}) => {
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isModalOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsModalOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    const id = window.setTimeout(() => {
      dialogRef.current?.focus();
    }, 0);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.clearTimeout(id);
    };
  }, [isModalOpen, setIsModalOpen]);

  const activateConnector = async (label: string) => {
    switch (label) {
      case "MetaMask":
        await metaMask.activate();
        setSelectedWallet(label);
        window.localStorage.setItem("connectorId", "injected");
        break;

      case "WalletConnect":
        await walletConnect.activate();
        setSelectedWallet(label);
        window.localStorage.setItem("connectorId", "wallet_connect");
        break;

      case "Coinbase":
        await coinbaseWallet.activate();
        setSelectedWallet(label);
        window.localStorage.setItem("connectorId", "injected");

        break;

      default:
        break;
    }
  };
  return (
    <>
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 overflow-y-auto"
          role="dialog"
          aria-modal="true"
          aria-labelledby="connect-wallet-title"
        >
          <div
            className="fixed inset-0 bg-black/60 transition-opacity"
            onClick={() => setIsModalOpen(false)}
          />

          <div className="flex min-h-screen items-center justify-center p-4 text-center">
            <div
              ref={dialogRef}
              tabIndex={-1}
              className="relative w-full max-w-md transform overflow-hidden rounded-2xl bg-custom-gradient p-6 text-left shadow-2xl transition-all outline-none"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2
                  id="connect-wallet-title"
                  className="text-2xl font-semibold text-white font-poppins"
                >
                  Connect a wallet
                </h2>
                <button
                  type="button"
                  className="text-white/70 hover:text-white transition-colors p-1 rounded-md hover:bg-white/10"
                  onClick={() => setIsModalOpen(false)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <div>
                <p className="self-start text-base leading-10 text-gray-300 font-inter">
                  Don't have an account?
                  <a
                    href="#aa"
                    className="ml-1 font-semibold text-primary-900-high-emphasis hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-900-high-emphasis/50 rounded-sm"
                  >
                    Register here
                  </a>
                </p>
                <div className="mt-4 flex flex-col gap-3">
                  <button
                    type="button"
                    onClick={() => activateConnector("MetaMask")}
                    className="flex items-center gap-4 w-full rounded-xl border border-white/10 bg-white/5 p-4 text-left hover:border-white/20 hover:bg-white/10 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40 active:scale-[0.98]"
                  >
                    <img src={Metamask} alt="Metamask" className="w-8 h-8" />
                    <span className="text-lg font-medium text-white font-inter">
                      MetaMask
                    </span>
                  </button>
                  <button
                    type="button"
                    className="flex items-center gap-4 w-full rounded-xl border border-white/10 bg-white/5 p-4 text-left hover:border-white/20 hover:bg-white/10 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40 active:scale-[0.98]"
                  >
                    <img src={Phantom} alt="Phantom" className="w-8 h-8" />
                    <span className="text-lg font-medium text-white font-inter">
                      Phantom
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => activateConnector("Coinbase")}
                    className="flex items-center gap-4 w-full rounded-xl border border-white/10 bg-white/5 p-4 text-left hover:border-white/20 hover:bg-white/10 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40 active:scale-[0.98]"
                  >
                    <img src={Coinbase} alt="Coinbase" className="w-8 h-8" />
                    <span className="text-lg font-medium text-white font-inter">
                      Coinbase Wallet
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => activateConnector("WalletConnect")}
                    className="flex items-center gap-4 w-full rounded-xl border border-white/10 bg-white/5 p-4 text-left hover:border-white/20 hover:bg-white/10 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40 active:scale-[0.98]"
                  >
                    <img
                      src={WalletConnect}
                      alt="WalletConnect"
                      className="w-8 h-8"
                    />
                    <span className="text-lg font-medium text-white font-inter">
                      WalletConnect
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ConnectWallet;

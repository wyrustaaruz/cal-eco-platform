import "./App.css";
import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { Buffer } from "buffer";

import "react-toastify/dist/ReactToastify.css";

import Routers from "./components/Router";
import MetmaskContextProvider from "./contexts/MetmaskContextProvider";
import AuthContextProvider from "./contexts/AuthContext";

function App() {
  if (!(window as any).Buffer) {
    (window as any).Buffer = Buffer;
  }

  return (
    <MetmaskContextProvider>
      <AuthContextProvider>
        <div
          className="relative w-full min-h-screen overflow-x-hidden"
          id="dashboard"
        >
          <BrowserRouter>
            <Routers />
          </BrowserRouter>
        </div>
        <ToastContainer />
      </AuthContextProvider>
    </MetmaskContextProvider>
  );
}

export default App;

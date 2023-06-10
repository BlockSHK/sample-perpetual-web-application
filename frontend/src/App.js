import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Home";
import Application from "./Application";
import SignIn from "./SignIn";
import Navigation from "./NavBar";
import { useState } from "react";
import { ethers } from "ethers";
import { Spinner } from "react-bootstrap";
import "./App.css";
import "quill/dist/quill.snow.css";

function App() {
  const [loading, setLoading] = useState(true);
  const [account, setAccount] = useState(null);

  // MetaMask Login/Connect
  const web3Handler = async () => {
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    setAccount(accounts[0]);

    // Get provider from Metamask
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    // Set signer
    const signer = provider.getSigner();

    window.ethereum.on("chainChanged", (chainId) => {
      window.location.reload();
    });

    window.ethereum.on("accountsChanged", async function (accounts) {
      setAccount(accounts[0]);
      await web3Handler();
    });

    setLoading(false);
  };

  return (
    <BrowserRouter>
      <div className="App">
        <Navigation web3Handler={web3Handler} account={account} />
        <div>
          {loading ? (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minHeight: "80vh",
              }}
            >
              <Spinner animation="border" style={{ display: "flex" }} />
              <p className="mx-3 my-0">Awaiting Metamask Connection...</p>
            </div>
          ) : (
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/application" element={<Application />} />
              <Route path="/sign-in" element={<SignIn />} />
            </Routes>
          )}
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;

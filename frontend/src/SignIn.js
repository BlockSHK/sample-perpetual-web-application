import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import {
  Button,
  TextField,
  Typography,
  TextareaAutosize,
  Paper,
  Dialog,
  CircularProgress,
} from "@mui/material";
import { styled } from "@mui/system";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const StyledButton = styled(Button)(({ theme }) => ({
  background: "#1976D2",
  color: "#ffffff",
  margin: theme.spacing(1),
  borderRadius: "8px",
  "&:hover": {
    backgroundColor: "#1565C0",
    color: "#ffffff",
  },
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: "16px",
}));

const SignIn = () => {
  const [address, setAddress] = useState("");
  const [nonce, setNonce] = useState("");
  const [signedNonce, setSignedNonce] = useState("");
  const [tokenId, setTokenId] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const initialize = async () => {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        setAddress(accounts[0]);
      } else {
        alert("Please install MetaMask!");
      }
    };
    initialize();
  }, []);

  const getNonce = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        "https://b1r5aq31x2.execute-api.us-east-1.amazonaws.com/Prod/activation/nonce",
        { address }
      );
      setNonce(response.data.payload.nonce);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const signNonce = async () => {
    setLoading(true);
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const signedNonce = await signer.signMessage(nonce);
      setSignedNonce(signedNonce);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const sendData = async () => {
    setLoading(true);
    try {
      const response = await axios.post("http://localhost:3000/sign-in", {
        address,
        tokenId,
        nonce,
        signedNonce,
      });

      if (response.status === 200) {
        localStorage.setItem("token", response.data.token);
        navigate("/application");
      } else {
        alert("Invalid Sign In");
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Dialog open={loading}>
        <div style={{ padding: "20px", textAlign: "center" }}>
          <CircularProgress />
          <Typography variant="h6" style={{ marginTop: "10px" }}>
            Loading...
          </Typography>
        </div>
      </Dialog>

      <StyledPaper
        component="form"
        noValidate
        autoComplete="off"
        elevation={3}
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: "1em",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "70vh",
          width: { xs: "90%", sm: "50%", md: "30%" },
          margin: "5% auto",
          boxSizing: "border-box",
          borderRadius: "10px",
        }}
      >
        <Typography variant="h3" component="h1" gutterBottom>
          Sign In
        </Typography>
        {nonce && (
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="tokenId"
            label="Token ID"
            name="tokenId"
            autoFocus
            value={tokenId}
            onChange={(e) => setTokenId(e.target.value)}
          />
        )}
        {nonce && (
          <>
            <Typography variant="h6" margin="normal">
              Nonce: {nonce}
            </Typography>
            <TextareaAutosize
              aria-label="Signed Nonce"
              minRows={3}
              style={{ width: "100%", padding: "0.5em", marginBottom: "1em" }}
              value={signedNonce ? `Signed Nonce: ${signedNonce}` : ""}
            />
            <StyledButton onClick={signNonce} size="large" fullWidth>
              Sign Nonce
            </StyledButton>
            {signedNonce && tokenId && (
              <StyledButton onClick={sendData} size="large" fullWidth>
                Sign In
              </StyledButton>
            )}
          </>
        )}
        {!nonce && (
          <StyledButton onClick={getNonce} size="large" fullWidth>
            Get Nonce
          </StyledButton>
        )}
        {error && (
          <Typography variant="h6" color="error">
            Error: {error}
          </Typography>
        )}
      </StyledPaper>
    </>
  );
};

export default SignIn;

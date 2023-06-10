import React, { useState, useEffect } from "react";
import {
  Button,
  TextField,
  Typography,
  Paper,
  Dialog,
  CircularProgress,
} from "@mui/material";
import { styled } from "@mui/system";
import axios from "axios";

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

const Register = () => {
  const [address, setAddress] = useState("");
  const [tokenId, setTokenId] = useState("");
  const [responseHash, setResponseHash] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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

  const register = async () => {
    setLoading(true);
    try {
      const response = await axios.post("http://localhost:3000/register", {
        address,
        tokenId,
      });
      setResponseHash(response.data.hash);
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
          Register
        </Typography>

        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          id="address"
          label="Address"
          name="address"
          value={address}
          disabled
        />

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

        <StyledButton onClick={register} size="large" fullWidth>
          Register
        </StyledButton>

        {responseHash && (
          <Typography variant="h6" margin="normal">
            Response Hash: {responseHash}
          </Typography>
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

export default Register;

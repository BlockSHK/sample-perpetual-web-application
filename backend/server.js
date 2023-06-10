const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const ethers = require("ethers");
const cors = require("cors");
require("dotenv").config();
const axios = require("axios");
const crypto = require("crypto");
// assuming that you have set your secret in .env file
// you should replace 'YOUR_SECRET' with your actual secret.
const jwtSecret = process.env.JWT_SECRET || "YOUR_SECRET";

// Contract address from .env file
const contractAddress = process.env.CONTRACT_ADDRESS;

const app = express();
app.use(express.json());
app.use(cors());

let users = []; // In a real application, you should use a database
let nonces = [];

app.post("/register", async (req, res) => {
  console.log(req.body);
  const { address, tokenId } = req.body;

  // Generate a unique hash
  const hash = crypto.randomBytes(20).toString("hex");
  const messageHash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(hash));
  console.log("messageHash", messageHash);
  const user = { address, tokenId, messageHash };
  users.push(user);
  console.log("hash", hash);
  // Send hash in response
  console.log(users);
  res.status(201).json({ hash });
});

app.post("/nonce", async (req, res) => {
  const { address } = req.body;
  let nonce = crypto.randomBytes(16).toString("hex");

  let timestamp = Date.now();
  const session = {
    nonce: nonce,
    address: address,
    timestamp: timestamp,
  };

  console.log(session);

  // Sending the nonce back in the response
  res.status(201).json({ nonce: nonce });
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = users.find((user) => user.username === username);
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.sendStatus(401);
  }
  const token = jwt.sign({ username }, process.env.JWT_SECRET);
  res.send({ token });
});

app.post("/sign-in", async (req, res) => {
  console.log(req.body);
  const { nonce, address, tokenId, signedNonce } = req.body;

  try {
    const response = await axios.post(
      "https://b1r5aq31x2.execute-api.us-east-1.amazonaws.com/Prod/activation/activate",
      {
        nonce,
        address,
        contract: contractAddress,
        tokenId,
        sign: signedNonce,
      }
    );

    const data = response.data;
    console.log(response.data);
    if (data.payload.activate === "true") {
      // Check if expireTime is greater than current Unix timestamp
      const currentUnixTime = Math.floor(Date.now() / 1000);
      if (parseInt(data.payload.credential.expireTime) > currentUnixTime) {
        // create and sign a new jwt
        const token = jwt.sign({ address }, jwtSecret);
        res.send({ token });
      } else {
        res.status(400).send({ error: "Activation expired" });
      }
    } else {
      res.status(400).send({ error: "Activation failed" });
    }
  } catch (error) {
    console.error(error);
    res.status(400).send({ error: "No Access" });
  }
});

app.listen(3000, () => console.log("Server started"));

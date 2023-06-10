const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const ethers = require("ethers");
const cors = require("cors");
const Web3 = require("web3"); // Import Web3
require("dotenv").config();
const axios = require("axios");
const crypto = require("crypto");

// Assuming your ABI file is named LicenseActivation.abi and in the same directory
const licenseActivationABI = require("./LicenseActivation.json");

// Instantiating web3 (you can specify your own provider)
const web3 = new Web3(
  new Web3.providers.HttpProvider(
    "https://eth-sepolia.g.alchemy.com/v2/by1trNTlFI3duvE9djbUXgTfE9O6QPed"
  )
);

// assuming that you have set your secret in .env file
// you should replace 'YOUR_SECRET' with your actual secret.
const jwtSecret = process.env.JWT_SECRET || "YOUR_SECRET";

console.log(licenseActivationABI);
// Contract address from .env file
const contractAddress = process.env.CONTRACT_ADDRESS;
const activationContractAddress = process.env.ACTIVATION_CONTRACT_ADDRESS;
const nonceValidityDuration = 600000;
const app = express();
app.use(express.json());
app.use(cors());

let users = [
  {
    address: "0x704bc8d7952756e1adbee8ad8761bfe1c85cbde6",
    tokenId: "1",
    messageHash:
      "0x539892d0003e236dc4f68a9df08086329c96ea5942808a3d65be672ac59fff1b",
  },
]; // In a real application, you should use a database
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
  nonces.push(session);
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
  const session = nonces.find((element) => element.nonce === nonce);

  console.log(session);

  let timestamp = Date.now();
  if (timestamp - session.timestamp > nonceValidityDuration) {
    console.error("Session expired");
    res.status(400).send({ error: "Try again request expired" });
  }

  //Remove session from nonces
  nonces = nonces.filter((element) => element.nonce !== nonce);

  const hash = nonce;
  const signing_address = web3.eth.accounts.recover(hash, signedNonce);

  console.log(signing_address);
  if (signing_address.toLowerCase() !== address.toLowerCase()) {
    console.error("Invalid signature");
    res.status(400).send({ error: "Invalid signature" });
    return;
  }

  const user = users.find(
    (user) => user.address === address && user.tokenId === tokenId
  );

  if (!user) {
    console.error("User not found");
    res.status(400).send({ error: "User not found" });
    return;
  }

  if (user.tokenId !== tokenId) {
    console.error("Invalid token");
    res.status(400).send({ error: "Invalid token" });
    return;
  }

  // Check if user has already been activated
  const licenseActivationContract = new web3.eth.Contract(
    licenseActivationABI,
    activationContractAddress
  );

  const activationEvents = await licenseActivationContract.getPastEvents(
    "Activation",
    {
      filter: { tokenId: tokenId, hash: user.messageHash },
      fromBlock: 0,
      toBlock: "latest",
    }
  );

  if (activationEvents.length === 0) {
    console.log("No activation event found for this token ID.");
    res
      .status(400)
      .send({ error: "No activation event found for this token ID." });
    return;
  }

  const lastActivationEvent = activationEvents[activationEvents.length - 1];

  const deactivationEvents = await licenseActivationContract.getPastEvents(
    "Deactivation",
    {
      filter: { tokenId: tokenId },
      fromBlock: lastActivationEvent.blockNumber,
      toBlock: "latest",
    }
  );

  if (deactivationEvents.length > 0) {
    console.log(
      "Activation event found, but a deactivation event occurred afterward."
    );
    res.status(400).send({ error: "Deactivation happen after activation" });
    return;
  } else {
    console.log("Valid Activation event found");
    const token = jwt.sign({ address }, jwtSecret);
    res.send({ token });
    return;
  }
});

app.listen(3000, () => console.log("Server started"));

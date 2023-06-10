const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");
require("dotenv").config();
const axios = require("axios");

// assuming that you have set your secret in .env file
// you should replace 'YOUR_SECRET' with your actual secret.
const jwtSecret = process.env.JWT_SECRET || "YOUR_SECRET";

// Contract address from .env file
const contractAddress = process.env.CONTRACT_ADDRESS;

const app = express();
app.use(express.json());
app.use(cors());

let users = []; // In a real application, you should use a database

app.post("/register", async (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = { username, password: hashedPassword };
  users.push(user);
  res.sendStatus(201);
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

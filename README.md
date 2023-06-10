# Sample Subscription Web Application

This repository contains the code for a sample media player web application built using React, Express, and blockchain technology. The application demonstrates how to use blockchain-based licensing for accessing the media player. It allows users to connect via MetaMask and sign a nonce with their private key to access the media player.

## Prerequisites

Before running this application, you must have:

- [Node.js and npm](https://nodejs.org/en/download/) installed.
- [MetaMask Browser Extension](https://metamask.io/download.html) installed.

## Getting Started

1. Clone the repository:

   ```sh
   git clone https://github.com/BlockSHK/sample-subscription-web-application.git
   ```

2. Navigate to the project directory:

   ```sh
   cd sample-subscription-web-application
   ```

3. Install the dependencies for the frontend and backend:

   - Frontend:

     ```sh
     cd frontend
     npm install
     ```

   - Backend:

     ```sh
     cd backend
     npm install
     ```

4. Create a `.env` file in the backend directory and add the following environment variables:

   ```env
   JWT_SECRET=<your_jwt_secret>
   CONTRACT_ADDRESS=<smart_contract_address>
   ACTIVATION_CONTRACT_ADDRESS=<activation_contract_address>
   ```

   - `JWT_SECRET` is the secret key used for JSON Web Tokens.
   - `CONTRACT_ADDRESS` is the address of the smart contract you're interacting with.
   - `ACTIVATION_CONTRACT_ADDRESS` is the address of the activation contract address of license contract you're interacting with.

5. Start the backend server:

   - Navigate to the backend directory and run:

     ```sh
     node index.js
     ```

   - The backend server will start at http://localhost:3000.

6. Start the frontend application:

   - In a new terminal, navigate to the frontend directory and run:

     ```sh
     npm start
     ```

   - This will start the frontend at http://localhost:3001.

7. Open your browser and go to http://localhost:3001.

8. Connect your MetaMask extension to the application.

## Application Structure

### Frontend

The frontend of the application is built using React. Below are the main components:

- **App.js**: The main component of the application. It sets up routing and handles MetaMask connections.
- **NavBar.js**: Contains the navigation bar.
- **Home.js**: The home component displays a welcome message and information about the application.
- **SignIn.js**: The sign-in component handles the process of getting a nonce, signing it, and sending the data to the backend.
- **Application.js**: The component displayed once the user is authenticated. This component allows users to use the media player.

The frontend uses Material-UI for styling.

### Backend

The backend is a simple Express server that handles the process of verifying the user through blockchain.

## Features

- MetaMask integration for blockchain-based access.
- Uses nonce for secure signing.
- React frontend integrated with an Express backend.
- Uses JWT for user authentication.
- Media player accessible only through blockchain verification.

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.

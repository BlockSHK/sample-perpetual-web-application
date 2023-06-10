import React, { useEffect } from "react";
import ReactPlayer from "react-player";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, Typography } from "@mui/material";

const Application = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/sign-in");
    }
  }, [navigate, token]);

  return (
    <Card
      variant="outlined"
      style={{ margin: "20px", padding: "20px", height: "80vh" }}
    >
      <CardContent>
        <Typography variant="h5" component="div">
          Welcome to the Media Player
        </Typography>
        <Typography variant="body2">
          This media player can only be accessed if you have a blockchain-based
          license.
        </Typography>
        {token && (
          <div style={{ marginTop: "20px", height: "500px" }}>
            <ReactPlayer
              url="https://www.youtube.com/watch?v=yubzJw0uiE4" // You can replace this with the URL of your media
              controls
              width="100%"
              height="100%"
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default Application;

import React, { useEffect, useRef } from "react";
import Quill from "quill";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, Typography, Paper } from "@mui/material";
import "quill/dist/quill.snow.css";

const Application = () => {
  const navigate = useNavigate();
  const quillElement = useRef(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/sign-in");
    } else {
      new Quill(quillElement.current, {
        debug: "info",
        modules: {
          toolbar: true,
        },
        placeholder: "Blockchain is ...",
        readOnly: true,
        theme: "snow",
      });
    }
  }, [navigate, token]);

  return (
    <Card
      variant="outlined"
      style={{ margin: "20px", padding: "20px", height: "80vh" }}
    >
      <CardContent>
        <Typography variant="h5" component="div">
          Welcome to the Application
        </Typography>
        <Typography variant="body2">
          This application can only be accessed if you have a blockchain-based
          license.
        </Typography>
        <Paper style={{ marginTop: "20px", height: "500px" }}>
          <div ref={quillElement} style={{ height: "100%" }} />
        </Paper>
      </CardContent>
    </Card>
  );
};

export default Application;

import React from "react";
import { Card, CardContent, Typography, Box, Container } from "@mui/material";
import { styled } from "@mui/system";
import backgroundImage from "./background_3.jpg";

const BackgroundImage = styled("div")({
  backgroundImage: `url(${backgroundImage})`,
  height: "93vh", // Adjusted to account for the navbar
  backgroundPosition: "center",
  backgroundRepeat: "no-repeat",
  backgroundSize: "cover",
  position: "relative",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
});

const StyledCard = styled(Card)(({ theme }) => ({
  minHeight: "70vh",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  borderRadius: theme.spacing(2),
  backgroundColor: "rgba(255, 255, 255, 0.8)", //Added rgba values to make the card slightly transparent
}));

const Home = () => {
  return (
    <BackgroundImage>
      <Container maxWidth="md">
        <Box mt={5}>
          <StyledCard variant="outlined">
            <CardContent>
              <Typography variant="h3" component="div" gutterBottom>
                Welcome to Our Blockchain-Based License Application
              </Typography>
              <Typography variant="body1" gutterBottom>
                This application serves to demonstrate the use of
                blockchain-based licensing. We utilize the immutability and
                security provided by blockchain technology to create a unique
                and secure signing mechanism.
              </Typography>
              <Typography variant="body1">
                By signing in, users will be provided with a nonce that will be
                signed with their private key. This will enable them to access
                our document editor. This process ensures the validity and
                integrity of the user, allowing us to provide a safer, more
                secure experience.
              </Typography>
            </CardContent>
          </StyledCard>
        </Box>
      </Container>
    </BackgroundImage>
  );
};

export default Home;

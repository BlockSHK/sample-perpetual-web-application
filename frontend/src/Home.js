import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Container,
  IconButton,
} from "@mui/material";
import { styled } from "@mui/system";
import newBackgroundImage from "./background_4.jpg";
import mediaPlayerIcon from "./media_player_icon.png";

const BackgroundImage = styled("div")({
  backgroundImage: `url(${newBackgroundImage})`,
  height: "93vh",
  backgroundPosition: "center",
  backgroundRepeat: "no-repeat",
  backgroundSize: "cover",
  position: "relative",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
});

const StyledCard = styled(Card)(({ theme }) => ({
  minWidth: "300px",
  minHeight: "60vh",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  borderRadius: theme.spacing(2),
  backgroundColor: "rgba(255, 255, 255, 0.9)",
  padding: theme.spacing(4),
}));

const IconWrapper = styled(IconButton)(({ theme }) => ({
  fontSize: "3em",
  backgroundColor: "#3f51b5", // Hardcoded color value for demonstration
  padding: theme.spacing(2),
  marginBottom: theme.spacing(2),
}));

const Home = () => {
  return (
    <BackgroundImage>
      <Container maxWidth="sm">
        <Box mt={5}>
          <StyledCard variant="outlined">
            <IconWrapper>
              <img
                src={mediaPlayerIcon}
                alt="Media Player"
                width="50"
                height="50"
              />
            </IconWrapper>
            <CardContent>
              <Typography variant="h4" component="div" gutterBottom>
                Welcome to Our Secure Media Player
              </Typography>
              <Typography variant="body1" gutterBottom>
                Experience high-quality media content with the added security
                and trust of blockchain technology.
              </Typography>
              <Typography variant="body1">
                Sign in to verify your blockchain license and unlock access to
                an array of media.
              </Typography>
            </CardContent>
          </StyledCard>
        </Box>
      </Container>
    </BackgroundImage>
  );
};

export default Home;

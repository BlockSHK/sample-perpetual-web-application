import { styled } from "@mui/system";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Link,
  Box,
  Container,
} from "@mui/material";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import logo from "./BlockSHK.png";

const Logo = styled("img")(({ theme }) => ({
  marginRight: theme.spacing(2),
  width: "40px",
  height: "40px",
  borderRadius: "8px",
}));

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  background: "#1976D2",
}));

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
}));

const StyledLink = styled(Link)(({ theme }) => ({
  margin: theme.spacing(1),
  color: "#ffffff",
  textDecoration: "none",
  "&:hover": {
    textDecoration: "none",
    color: "#ffffff",
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  margin: theme.spacing(1),
  background: "#ffffff",
  color: "#1976D2",
  "&:hover": {
    backgroundColor: "#1565C0",
    color: "#ffffff",
  },
}));

const Navigation = ({ web3Handler, account }) => {
  const navigate = useNavigate();

  const handleSignOut = () => {
    localStorage.removeItem("token");
    navigate("/sign-in");
  };

  return (
    <StyledAppBar position="static">
      <Container>
        <StyledToolbar variant="dense">
          <Box display="flex" alignItems="center">
            <Logo src={logo} />
            <Typography variant="h6" component="div">
              BlockSHK Docs
            </Typography>
          </Box>
          <Box display="flex" alignItems="center">
            <StyledLink component={RouterLink} to="/">
              Home
            </StyledLink>
            <StyledLink component={RouterLink} to="/application">
              Application
            </StyledLink>
            <StyledLink component={RouterLink} to="/sign-in">
              Sign In
            </StyledLink>
            {account ? (
              <StyledLink
                href={`https://etherscan.io/address/${account}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <StyledButton variant="contained">
                  {account.slice(0, 5) + "..." + account.slice(38, 42)}
                </StyledButton>
              </StyledLink>
            ) : (
              <StyledButton onClick={web3Handler} variant="contained">
                Connect Wallet
              </StyledButton>
            )}
            {localStorage.getItem("token") && (
              <StyledButton onClick={handleSignOut} variant="contained">
                Sign Out
              </StyledButton>
            )}
          </Box>
        </StyledToolbar>
      </Container>
    </StyledAppBar>
  );
};

export default Navigation;

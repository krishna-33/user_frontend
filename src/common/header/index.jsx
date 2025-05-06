import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import DialogAlert from "../dialog"
import { useDispatch } from "react-redux";
import { logout } from "../../redux/authSlice";
import { useNavigate } from "react-router-dom";
import useAlerts from "../../hooks/useAlerts";

export default function Header() {
  const [open, setOpen] = React.useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { success } = useAlerts();

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const handleLogOut = () => {
    dispatch(logout());
    setOpen(false);
    navigate("/login");
    success("Logout suceessfully");
  };

  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="fixed">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              User Application
            </Typography>
            <Button color="inherit" onClick={handleClickOpen}>
              Log Out
            </Button>
          </Toolbar>
        </AppBar>
        <Toolbar />
      </Box>
      <DialogAlert
        open={open}
        setOpen={setOpen}
        title={"Log Out"}
        description="Do you want to logout from website ?"
        onConfirm={handleLogOut}
        confirmText="Yes"
        cancelText="No"
      />
    </>
  );
}

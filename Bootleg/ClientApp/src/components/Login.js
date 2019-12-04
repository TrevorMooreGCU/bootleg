import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography
} from "@material-ui/core";
import useAuth from "../hooks/useAuth";
import Avatar from "@material-ui/core/Avatar";
import CheckIcon from "@material-ui/icons/Check";
import { GoogleLogin } from "react-google-login";
import config from "../config.json";
import useRequest from "../hooks/useRequest";

const useStyles = makeStyles(theme => ({
  root: {}
}));

export default function Login({ open, close }) {
  const classes = useStyles();
  const [success, setSuccess] = useState(false);
  const [failure, setFailure] = useState(false);
  const { login } = useAuth();
  const { post } = useRequest();

  useEffect(() => {
    if (open) {
	  setSuccess(false);
	  setFailure(false);
    }
  }, [open]);

  const responseGoogle = async googleResponse => {
    if (googleResponse.tokenId) {
      let response = await post(config.GOOGLE_AUTH_CALLBACK_URL, {
        tokenId: googleResponse.tokenId
      });
      if (response.success) {
        login(response.data[0]);
        setSuccess(true);
	  } else {
		setFailure(true);
      }
    }
  };

  return (
    <div className={classes.root}>
      <Dialog
        onClose={close}
        open={open}
        fullWidth
        PaperProps={{ style: { maxWidth: 400 } }}
      >
        {!success && (
          <>
			<DialogTitle>{failure ? "Oops :(" : "Welcome to Zuri's Dashboard!"}</DialogTitle>
            <DialogContent align="center">
              <Typography gutterBottom>
				{failure ? "Looks like that account isn't allowed access to Zuri's Dashboard. Please try again:" : "Please sign in with your Google account:"}
              </Typography>
              <GoogleLogin
                clientId={config.GOOGLE_CLIENT_ID}
                buttonText="Google Login"
                onSuccess={responseGoogle}
                onFailure={responseGoogle}
              />
            </DialogContent>
            <br/>
          </>
		)}
        {success && (
          <>
            <DialogTitle align="center">Successfully Signed in</DialogTitle>
            <DialogContent align="center">
              <Avatar style={{ backgroundColor: "#00cc00" }}>
                <CheckIcon fontSize="large" />
              </Avatar>
            </DialogContent>
            <DialogActions>
              <Button onClick={close} variant="contained">
                Close
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </div>
  );
}

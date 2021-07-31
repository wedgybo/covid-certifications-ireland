import React, { createContext, useContext, useState } from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import MuiMonitor from '@material-ui/lab/Alert';

function Monitor(props) {
  return <MuiMonitor elevation={6} variant="filled" {...props} />;
}

export const SnackbarContext = createContext();

export function SnackbarContextProvider({children}) {

  const [snack, setSnack] = useState({});
  const [open, setOpen] = useState(false);

  const api = {
    setSnack,
    success: (message) => {
      setSnack
      ({
        level: 'success',
        message
      });
      setOpen(true);
    },
    warning: (message) => {
      setSnack
      ({
        level: 'warning',
        message
      });
      setOpen(true);
    },
    error: (message) => {
      setSnack
      ({
        level: 'error',
        message
      });
      setOpen(true);
    },
    info: (message) => {
      setSnack
      ({
        level: 'info',
        message
      });
      setOpen(true);
    }
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  return (
    <SnackbarContext.Provider value={api}>
      <Snackbar anchorOrigin={{ vertical: 'bottom', horizontal: 'right'}} open={open} autoHideDuration={3000} onClose={handleClose}>
          <Monitor onClose={handleClose} severity={snack.level}>{snack.message}</Monitor>
      </Snackbar>
      {children}
    </SnackbarContext.Provider>
  )
}

export function useSnackbar() {
  return useContext(SnackbarContext);
}
import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { toast } from "react-toastify";

interface SwapModalProps {
  open: boolean;
  handleClose: () => void;
  fromToken?: string;
  toToken?: string;
  refresh: () => void;
}
const SwapModal = (props: SwapModalProps) => {
  const { open, handleClose, fromToken, toToken, refresh } = props;

  const handleSubmit = () => {
    refresh();
    handleClose();
    toast.success("Transaction successful!");
  };

  return (
    <React.Fragment>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>
          Tranfer token from {fromToken} to {toToken}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to transfer {fromToken} to {toToken}? It will
            be not revert after you have been submitted.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmit}>
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
};

export default SwapModal;

import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Alert } from '@mui/material';

interface DeleteConfirmationDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

const DeleteConfirmationDialog: React.FC<DeleteConfirmationDialogProps> = ({ open, onCancel, onConfirm }) => (
  <Dialog open={open} onClose={onCancel}>
    <DialogTitle>Confirm Delete</DialogTitle>
    <DialogContent>
      <Alert severity="warning">
        Are you sure you want to delete this feedback? This action cannot be undone.
      </Alert>
    </DialogContent>
    <DialogActions>
      <Button onClick={onCancel} color="primary">Cancel</Button>
      <Button onClick={onConfirm} color="error" variant="contained">Delete</Button>
    </DialogActions>
  </Dialog>
);

export default DeleteConfirmationDialog;

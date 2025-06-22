import React, { useState, useEffect, useMemo } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
} from '@mui/material';
import type { SelectChangeEvent } from '@mui/material';
import type { UpdateFeedbackRequest } from '../types/api';
import { CATEGORY_OPTIONS, STATUS_OPTIONS } from '../utils/constants';

const MIN_FEEDBACK_CHARACTERS = 20;

interface EditFeedbackDialogProps {
  open: boolean;
  initialForm: UpdateFeedbackRequest | null;
  onClose: () => void;
  onSave: (form: UpdateFeedbackRequest) => void;
}

const EditFeedbackDialog: React.FC<EditFeedbackDialogProps> = ({
  open,
  initialForm,
  onClose,
  onSave,
}) => {
  const [editForm, setEditForm] = useState<UpdateFeedbackRequest>(
    initialForm || {
      name: '',
      email: '',
      content: '',
      category: CATEGORY_OPTIONS[0],
      status: STATUS_OPTIONS[0],
    }
  );
const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open && initialForm) setEditForm(initialForm);
  }, [open, initialForm]);

  const isEditUnchanged = useMemo(() => {
    return (
      editForm.content === initialForm?.content &&
      editForm.status === initialForm?.status
    );
  }, [editForm, initialForm]);

  const handleInputChange = (field: keyof UpdateFeedbackRequest) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSelectChange = (field: keyof UpdateFeedbackRequest) => (e: SelectChangeEvent) => {
    setEditForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const validateContent = (content: string): string | undefined => {
    if (content?.trim().length < MIN_FEEDBACK_CHARACTERS) {
      return `Feedback must be at least ${MIN_FEEDBACK_CHARACTERS} characters long`;
    }
    return undefined;
  };

  const handleBlur = (field: keyof UpdateFeedbackRequest) => {
    if (field === 'content') {
      const validationError = validateContent(editForm.content || "");
      setError(validationError || null);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Edit Feedback</DialogTitle>
      <DialogContent>
        <Stack spacing={3} sx={{ mt: 2 }}>
          <TextField
            label="Name"
            disabled
            value={editForm.name || ''}
            fullWidth
            size="small"
          />
          <TextField
            label="Email"
            type="email"
            disabled
            value={editForm.email || ''}
            fullWidth
            size="small"
          />
          <TextField
            label="Content (min 20 characters)"
            value={editForm.content || ''}
            onChange={handleInputChange('content')}
            onBlur={() => handleBlur('content')}
            fullWidth
            multiline
            rows={4}
            size="small"
            error={!!error}
            helperText={error}
          />
          <FormControl fullWidth size="small">
            <InputLabel>Category</InputLabel>
            <Select
              value={editForm.category || ''}
              disabled
              label="Category"
            >
              {CATEGORY_OPTIONS?.map((category) => (
                <MenuItem key={category} value={category}>
                  {category}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth size="small">
            <InputLabel>Status</InputLabel>
            <Select
              value={editForm.status || ''}
              label="Status"
              onChange={handleSelectChange('status')}
            >
              {STATUS_OPTIONS?.map((status) => (
                <MenuItem key={status} value={status}>
                  {status}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button 
          onClick={() => { 
            onSave(editForm); 
            onClose(); 
        }}
          variant="contained"
          disabled={isEditUnchanged}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditFeedbackDialog;

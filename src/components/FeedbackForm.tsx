import React, { useState } from 'react';
import {
  Paper,
  Typography,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Box,
} from '@mui/material';
import { createFeedback } from '../hooks/useApi';
import { FeedbackStatusEnum } from '../types/api';
import type { CreateFeedbackRequest } from '../types/api';
import { CATEGORY_OPTIONS } from '../utils/constants';

interface ValidationErrors {
  name?: string;
  email?: string;
  content?: string;
}

interface FeedbackFormProps {
  onSuccess?: () => void;
}

const MIN_NAME_CHARACTERS = 3;
const MIN_FEEDBACK_CHARACTERS = 20;

const FeedbackForm = ({ onSuccess }: FeedbackFormProps) => {
  const [formData, setFormData] = useState<CreateFeedbackRequest>({
    name: '',
    email: '',
    content: '',
    category: 'Request',
    status: FeedbackStatusEnum.Pending,
  });

  const [errors, setErrors] = useState<ValidationErrors>({});
  const [categories] = useState<string[]>([...CATEGORY_OPTIONS]);
  const [submitting, setSubmitting] = useState(false);

  const isFormDataFilled = Object.values(formData).every(value => value.trim() !== '');
  const isFormValid = isFormDataFilled && Object.values(errors).every((value) => !value);

  // Validation functions
  const validateName = (name: string): string | undefined => {

    if (name.trim()?.length < MIN_NAME_CHARACTERS) {
      return `Name must be at least ${MIN_NAME_CHARACTERS} characters long`;
    }
    if (!/^[a-zA-Z\s]+$/.test(name.trim())) {
      return 'Name must contain only alphabetical characters and spaces';
    }
    return undefined;
  };

  const validateEmail = (email: string): string | undefined => {
    if (!email.trim()) {
      return 'Email is required';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return 'Please enter a valid email address';
    }
    return undefined;
  };

  const validateContent = (content: string): string | undefined => {
    if (content?.trim().length < MIN_FEEDBACK_CHARACTERS) {
      return `Feedback must be at least ${MIN_FEEDBACK_CHARACTERS} characters long`;
    }
    return undefined;
  };

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};
    
    const nameError = validateName(formData.name);
    const emailError = validateEmail(formData.email);
    const contentError = validateContent(formData.content);

    if (nameError) newErrors.name = nameError;
    if (emailError) newErrors.email = emailError;
    if (contentError) newErrors.content = contentError;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setSubmitting(true);
    try {
      await createFeedback(formData);
      setFormData({ name: '', email: '', content: '', category: 'Request', status: FeedbackStatusEnum.Pending });
      setErrors({});
      onSuccess?.();
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (field: keyof CreateFeedbackRequest, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));

    if (errors[field as keyof ValidationErrors]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined,
      }));
    }
  };

  const handleBlur = (field: keyof ValidationErrors) => {
    let error: string | undefined;
    
    switch (field) {
      case 'name':
        error = validateName(formData.name);
        break;
      case 'email':
        error = validateEmail(formData.email);
        break;
      case 'content':
        error = validateContent(formData.content);
        break;
    }
    
    setErrors(prev => ({
      ...prev,
      [field]: error,
    }));
  };

  return (
    <Paper elevation={2} sx={{ p: 3 }}>
      <Typography variant="h5" component="h3">
        Submit Feedback
      </Typography>
      <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {/* Name */}
        <TextField
          label="Name (min 3 characters)"
          type="text"
          value={formData.name}
          onChange={(e) => handleChange('name', e.target.value)}
          onBlur={() => handleBlur('name')}
          required
          fullWidth
          placeholder="Your full name"
          error={!!errors.name}
          helperText={errors.name}
        />

        {/* Email */}
        <TextField
          label="Email"
          type="email"
          value={formData.email}
          onChange={(e) => handleChange('email', e.target.value)}
          onBlur={() => handleBlur('email')}
          required
          fullWidth
          placeholder="name.email@example.com"
          error={!!errors.email}
          helperText={errors.email}
        />

        {/* Category */}
        <FormControl fullWidth required>
          <InputLabel>Category</InputLabel>
          <Select
            value={formData.category}
            label="Category"
            onChange={(e) => handleChange('category', e.target.value)}
          >
            {categories.map((c) => (
              <MenuItem key={c} value={c}>{c}</MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Status */}
        <FormControl fullWidth disabled>
          <InputLabel id="status-label">Status</InputLabel>
          <Select
            labelId="status-label"
            value={formData.status}
            label="Status"
            onChange={(e) => handleChange('status', e.target.value)}
          >
            {Object.values(FeedbackStatusEnum).map((status) => (
              <MenuItem key={status} value={status}>
                {status}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Content */}
        <TextField
          label={`Feedback (min ${MIN_FEEDBACK_CHARACTERS} characters)`}
          value={formData.content}
          onChange={(e) => handleChange('content', e.target.value)}
          onBlur={() => handleBlur('content')}
          required
          fullWidth
          multiline
          rows={4}
          placeholder="Please describe your feedback in detail..."
          error={!!errors.content}
          helperText={errors.content}
        />

        {/* Submit Button */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={submitting || !isFormValid}
          >
            Submit
          </Button>
        </Box>
      </Box>
    </Paper>
  );
};

export default FeedbackForm;

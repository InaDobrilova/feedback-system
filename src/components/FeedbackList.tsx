import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Alert,
  Pagination,
  Stack,
  CircularProgress,
} from '@mui/material';
import { fetchFeedback } from '../hooks/useApi';
import { useDebounce } from '../hooks/useDebounce';
import FeedbackGrid from './FeedbackGrid';
import type { FeedbackCategory, FeedbackStatus, FeedbackResponse } from '../types/api';
import { CATEGORY_OPTIONS, STATUS_OPTIONS } from '../utils/constants';

const FeedbackList: React.FC = () => {
  const [searchInput, setSearchInput] = useState('');
  const debouncedSearchTerm = useDebounce(searchInput, 300);
  const [filters, setFilters] = useState({
    search: undefined as string | undefined,
    category: undefined as FeedbackCategory | undefined,
    status: undefined as FeedbackStatus | undefined,
    page: 1,
  });
  const [response, setResponse] = useState<FeedbackResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);


  useEffect(() => {
    setFilters(prev => ({ ...prev, search: debouncedSearchTerm || undefined, page: 1 }));
  }, [debouncedSearchTerm]);

  // Fetch feedback
  useEffect(() => {
    setLoading(true);
    setError(null);
    fetchFeedback(filters)
      .then(feedbackRes => {
        setResponse(feedbackRes);
      })
      .catch(() => setError('Failed to load feedback. Please try again.'))
      .finally(() => setLoading(false));
  }, [filters]);

  const refetch = () => {
    setLoading(true);
    setError(null);
    fetchFeedback(filters)
      .then(feedbackRes => {
        setResponse(feedbackRes);
      })
      .catch(() => setError('Failed to load feedback. Please try again.'))
      .finally(() => setLoading(false));
  };

  const feedback = response?.feedback || [];
  const pagination = response?.pagination;

  const handleFilterChange = (field: keyof typeof filters, value: string | number) => {
    setFilters(prev => ({ ...prev, [field]: value || undefined, page: 1 }));
  };

  if (loading) {
    return <Box textAlign="center" py={4}><CircularProgress /></Box>;
  }
  if (error) {
    return (
      <Alert severity="error" action={<Button size="small" onClick={refetch}>Retry</Button>} >
        {error}
      </Alert>
    );
  }

  return (
    <Box>
      <Box display="flex" flexDirection={{ xs: 'column' }} alignItems="center" justifyContent="space-between" gap={2} mb={3}>
        <Typography variant="h4" component="h2" color="primary" mb={2}>
          Feedback
        </Typography>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          {/* Search */}
          <TextField
            size="small"
            placeholder="Search feedback..."
            value={searchInput}
            onChange={e => setSearchInput(e.target.value)}
            sx={{ minWidth: 200 }}
          />
          {/* Category Filter */}
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Category</InputLabel>
            <Select
              value={filters.category || ''}
              label="Category"
              onChange={e => handleFilterChange('category', e.target.value)}
            >
              <MenuItem value="">All Categories</MenuItem>
              {CATEGORY_OPTIONS.map(category => (
                <MenuItem key={category} value={category}>{category}</MenuItem>
              ))}
            </Select>
          </FormControl>
          {/* Status Filter */}
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={filters.status || ''}
              label="Status"
              onChange={e => handleFilterChange('status', e.target.value)}
            >
              <MenuItem value="">All Statuses</MenuItem>
              {STATUS_OPTIONS.map(status => (
                <MenuItem key={status} value={status}>{status}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>
      </Box>
      {/* Feedback Grid */}
      {feedback.length === 0 ? (
        <Box textAlign="center" py={4}>
          <Typography variant="body1" color="text.secondary">
            No feedback available.
          </Typography>
        </Box>
      ) : (
        <FeedbackGrid feedback={feedback} onRefetch={refetch} />
      )}
      {/* Pagination */}
      {pagination && pagination.total > 1 && (
        <Box display="flex" justifyContent="center" mt={4}>
          <Pagination
            count={pagination.total}
            page={pagination.current}
            onChange={(_event, page) => setFilters(prev => ({ ...prev, page }))}
            color="primary"
            size="large"
          />
        </Box>
      )}
    </Box>
  );
};

export default FeedbackList;

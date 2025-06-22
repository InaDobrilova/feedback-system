import React, { useState, useMemo } from 'react';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Button,
  Typography,
  Alert,
  Stack,
  TableSortLabel,
  Pagination,
  PaginationItem,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  KeyboardArrowLeft,
  KeyboardArrowRight,
  DragIndicator as DragIndicatorIcon,
} from '@mui/icons-material';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import type { DropResult } from '@hello-pangea/dnd';
import { updateFeedback, deleteFeedback } from '../hooks/useApi';
import type { Feedback } from '../types/api';
import { FeedbackStatusEnum } from '../types/api';
import { getCategoryColor, getStatusColor } from '../utils/helpers';
import EditFeedbackDialog from './EditFeedbackDialog';
import DeleteConfirmationDialog from './DeleteConfirmationDialog';

interface FeedbackGridProps {
  feedback: Feedback[];
  onRefetch?: () => void;
}

type SortField = 'name' | 'category' | 'status';
type SortDirection = 'asc' | 'desc';

const ITEMS_PER_PAGE = 3;

const FeedbackGrid: React.FC<FeedbackGridProps> = ({ feedback, onRefetch }) => {
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [draggedOrder, setDraggedOrder] = useState<Feedback[]>([]);
  const [isDragMode, setIsDragMode] = useState(false);
  const [editDialog, setEditDialog] = useState<Feedback | null>(null);
  const [deleteDialogId, setDeleteDialogId] = useState<string | null>(null);

  const sortedFeedback = useMemo(() => {
    // If in drag mode

    const statusPriority = {
      [FeedbackStatusEnum.Pending]: 1,
      [FeedbackStatusEnum.Resolved]: 2,
      [FeedbackStatusEnum.Closed]: 3,
    };


    if (isDragMode && draggedOrder.length > 0) {
      return draggedOrder;
    }

    return [...feedback].sort((a, b) => {
      let aValue: string | number;
      let bValue: string | number;

      switch (sortField) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'category':
          aValue = a.category.toLowerCase();
          bValue = b.category.toLowerCase();
          break;
        case 'status':
          aValue = statusPriority[a.status];
          bValue = statusPriority[b.status];
          break;
        default:
          return 0;
      }

      if (aValue < bValue) {
        return sortDirection === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortDirection === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [feedback, sortField, sortDirection, isDragMode, draggedOrder]);


  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) {
      return;
    }

    const items = Array.from(paginatedFeedback);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Update the dragged order for the current page
    const newDraggedOrder = Array.from(sortedFeedback);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;

    // Replace the items in the current page with the reordered items
    newDraggedOrder.splice(startIndex, items.length, ...items);

    setDraggedOrder(newDraggedOrder);
    setIsDragMode(true);
  };

  const toggleDragMode = () => {
    if (isDragMode) {
      setDraggedOrder([]);
      setIsDragMode(false);
    } else {
      setDraggedOrder([...sortedFeedback]);
      setIsDragMode(true);
    }
  };

  // Pagination
  const totalPages = Math.ceil(sortedFeedback.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedFeedback = sortedFeedback.slice(startIndex, endIndex);

  // Page change
  const handlePageChange = (_event: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page);
  };

  // Sort
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
    setCurrentPage(1);
  };

  const handleEditClick = (feedbackItem: Feedback) => {
    setEditDialog(feedbackItem);
  };

  const handleEditClose = () => {
    setEditDialog(null);
  };

  const handleDeleteClick = (id: string) => {
    setDeleteDialogId(id);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteDialogId) return;
    try {
      await deleteFeedback(deleteDialogId);
      onRefetch?.();
    } catch (error: unknown) {
      console.error('Failed to delete feedback:', error);
    } finally {
      setDeleteDialogId(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogId(null);
  };


  return (
    <>
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6" component="h2">
          Feedback Items
        </Typography>
        <Button
          color={isDragMode ? 'secondary' : 'primary'}
          onClick={toggleDragMode}
          startIcon={<DragIndicatorIcon />}
          size="small"
        >
          {isDragMode ? 'Exit Drag Mode' : 'Enable Drag Mode'}
        </Button>
      </Box>

      <DragDropContext onDragEnd={handleDragEnd}>
        <TableContainer component={Paper} sx={{ mt: 2, width: '100%' }}>
          <Table sx={{ minWidth: 650, tableLayout: 'fixed' }}>
            <TableHead>
              <TableRow sx={{ backgroundColor: 'grey.50' }}>
                {isDragMode && (
                  <TableCell sx={{ fontWeight: 'bold', width: '40px' }}>
                    <DragIndicatorIcon fontSize="small" color="action" />
                  </TableCell>
                )}
                <TableCell sx={{ fontWeight: 'bold', width: '50%' }}>
                  <TableSortLabel
                    active={sortField === 'name' && !isDragMode}
                    direction={sortField === 'name' ? sortDirection : 'asc'}
                    onClick={() => !isDragMode && handleSort('name')}
                    disabled={isDragMode}
                  >
                    Name & Content
                  </TableSortLabel>
                </TableCell>
                <TableCell sx={{ fontWeight: 'bold', width: '15%' }}>
                  <TableSortLabel
                    active={sortField === 'category' && !isDragMode}
                    direction={sortField === 'category' ? sortDirection : 'asc'}
                    onClick={() => !isDragMode && handleSort('category')}
                    disabled={isDragMode}
                  >
                    Category
                  </TableSortLabel>
                </TableCell>
                <TableCell sx={{ fontWeight: 'bold', width: '15%' }}>
                  <TableSortLabel
                    active={sortField === 'status' && !isDragMode}
                    direction={sortField === 'status' ? sortDirection : 'asc'}
                    onClick={() => !isDragMode && handleSort('status')}
                    disabled={isDragMode}
                  >
                    Status
                  </TableSortLabel>
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold', width: '20%' }}>
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <Droppable droppableId="feedback-table" isDropDisabled={!isDragMode}>
              {(provided) => (
                <TableBody
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                >
                  {paginatedFeedback.length === 0 ? (
                    <TableRow>
                      <TableCell align="center" sx={{ py: 8 }}>
                        <Typography variant="body1" color="text.secondary">
                          No feedback items to display
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedFeedback.map((item, index) => (
                      <Draggable
                        key={item.id}
                        draggableId={item.id}
                        index={index}
                        isDragDisabled={!isDragMode}
                      >
                        {(provided, snapshot) => (
                          <TableRow
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            sx={{
                              '&:hover': {
                                backgroundColor: snapshot.isDragging ? 'action.selected' : 'action.hover',
                              },
                              '&:last-child td, &:last-child th': { border: 0 },
                              minHeight: '120px',
                              backgroundColor: snapshot.isDragging ? 'action.selected' : 'inherit',
                              boxShadow: snapshot.isDragging ? 4 : 0,
                              '& td': {
                                padding: '16px',
                                verticalAlign: 'top'
                              }
                            }}
                          >
                            {isDragMode && (
                              <TableCell sx={{ width: '40px', cursor: 'grab' }}>
                                <Box
                                  {...provided.dragHandleProps}
                                  sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    opacity: 0.6,
                                    '&:hover': {
                                      opacity: 1,
                                    },
                                  }}
                                >
                                  <DragIndicatorIcon fontSize="small" />
                                </Box>
                              </TableCell>
                            )}
                            <TableCell component="th" scope="row" sx={{ width: isDragMode ? '45%' : '60%', minWidth: '300px' }}>
                              <Box>
                                <Typography variant="body2" fontWeight="medium" sx={{ wordBreak: 'break-word' }}>
                                  {item.name}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" fontSize="0.75rem" sx={{ wordBreak: 'break-word' }}>
                                  {item.email}
                                </Typography>
                                <Typography
                                  variant="body2"
                                  color="text.primary"
                                  fontSize="0.75rem"
                                  sx={{
                                    mt: 0.5,
                                    wordBreak: 'break-word',
                                    whiteSpace: 'pre-wrap',
                                    lineHeight: 1.4,
                                    minHeight: '3.6em',
                                    maxHeight: '7.2em',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    display: '-webkit-box',
                                    WebkitLineClamp: 5,
                                    WebkitBoxOrient: 'vertical',
                                  }}
                                >
                                  {item.content}
                                </Typography>
                              </Box>
                            </TableCell>
                            <TableCell sx={{ width: '15%' }}>
                              <Chip
                                label={item.category}
                                color={getCategoryColor(item.category)}
                                size="small"
                                sx={{ fontWeight: 'medium', minWidth: '80px' }}
                              />
                            </TableCell>
                            <TableCell sx={{ width: '15%' }}>
                              <Chip
                                label={item.status}
                                color={getStatusColor(item.status)}
                                size="small"
                                sx={{ fontWeight: 'medium', minWidth: '80px' }}
                              />
                            </TableCell>
                            <TableCell align="center" sx={{ width: '20%' }}>
                              <Stack direction="row" spacing={1} justifyContent="center">
                                <IconButton
                                  size="small"
                                  color="primary"
                                  onClick={() => handleEditClick(item)}
                                  title="Edit feedback"
                                  disabled={isDragMode}
                                >
                                  <EditIcon fontSize="small" />
                                </IconButton>
                                <IconButton
                                  size="small"
                                  color="error"
                                  onClick={() => handleDeleteClick(item.id)}
                                  title="Delete feedback"
                                  disabled={isDragMode}
                                >
                                  <DeleteIcon fontSize="small" />
                                </IconButton>
                              </Stack>
                            </TableCell>
                          </TableRow>
                        )}
                      </Draggable>
                    ))
                  )}
                  {provided.placeholder}
                </TableBody>
              )}
            </Droppable>
          </Table>
        </TableContainer>
      </DragDropContext>

      {/* Pagination Section */}
      {sortedFeedback.length > 0 && (
        <Paper elevation={0} sx={{
          p: 2,
          mt: 2,
          backgroundColor: isDragMode ? 'warning.light' : 'grey.50',
          borderRadius: 2,
          border: '1px solid',
          borderColor: isDragMode ? 'warning.main' : 'grey.200'
        }}>
          <Box sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 2
          }}>
            {/* Total items info */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {isDragMode && (
                <Typography variant="body2" color="warning.dark" sx={{ fontWeight: 'medium' }}>
                  Drag Mode Active
                </Typography>
              )}
              <Typography variant="body2" color="text.secondary">
                Showing {startIndex + 1}-{Math.min(endIndex, sortedFeedback.length)} of {sortedFeedback.length} items
              </Typography>
              {totalPages > 1 && (
                <Typography variant="body2" color="text.secondary">
                  Page {currentPage} of {totalPages}
                </Typography>
              )}
            </Box>

            {/* Pagination controls */}
            {totalPages > 1 && (
              <Pagination
                count={totalPages}
                page={currentPage}
                onChange={handlePageChange}
                color="primary"
                shape="rounded"
                showFirstButton
                showLastButton
                disabled={isDragMode}
                renderItem={(item) => (
                  <PaginationItem
                    slots={{
                      previous: KeyboardArrowLeft,
                      next: KeyboardArrowRight
                    }}
                    {...item}
                  />
                )}
              />
            )}
          </Box>
          {isDragMode && (
            <Alert severity="info" sx={{ mt: 2 }}>
              <Typography variant="body2">
                Drag Mode is active. You can reorder items by dragging.
                Sorting and editing are disabled in this mode.
              </Typography>
            </Alert>
          )}
        </Paper>
      )}

      {/* Edit Dialog */}
      <EditFeedbackDialog
        open={!!editDialog}
        initialForm={editDialog}
        onClose={handleEditClose}
        onSave={async (form) => {
          if (!editDialog) return;
          await updateFeedback(editDialog.id, form);
          onRefetch?.();
          setEditDialog(null);
        }}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        open={!!deleteDialogId}
        onCancel={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
      />
    </>
  );
};

export default FeedbackGrid;

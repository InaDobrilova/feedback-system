import express from 'express';

const router = express.Router();

// Feedback status and category enums
export const FeedbackStatus = {
  PENDING: 'Pending',
  RESOLVED: 'Resolved',
  CLOSED: 'Closed'
};

export const FeedbackCategory = {
  BUG: 'Bug',
  FEATURE: 'Feature',
  REQUEST: 'Request'
};

// Mock feedback database
const feedback = [
  {
    id: '1',
    name: 'Ivan Ivanov',
    email: 'ivan.ivanov@example.com',
    content: 'The application crashes. Please fix this.',
    category: FeedbackCategory.BUG,
    status: FeedbackStatus.PENDING
  },
  {
    id: '2',
    name: 'Georgi Georgiev',
    email: 'georgi.georgiev@example.com',
    content: 'Can you add a dark mode feature?',
    category: FeedbackCategory.FEATURE,
    status: FeedbackStatus.PENDING
  },
  {
    id: '3',
    name: 'Petya Petrova',
    email: 'petya.petrova@example.com',
    content: 'Can you add support for exporting data to CSV?',
    category: FeedbackCategory.REQUEST,
    status: FeedbackStatus.RESOLVED
  },
    {
    id: '4',
    name: 'John Doe',
    email: 'john.doe@example.com',
    content: 'Can you add support for exporting data to CSV?',
    category: FeedbackCategory.REQUEST,
    status: FeedbackStatus.RESOLVED
  },
      {
    id: '5',
    name: 'Jane Doe',
    email: 'jane.doe@example.com',
    content: 'Can you add support for exporting data to CSV?',
    category: FeedbackCategory.REQUEST,
    status: FeedbackStatus.RESOLVED
  },
  {
    id: '6',
    name: 'Alice Smith',
    email: 'alice.smith@example.com',
    content: 'Can you add support for exporting data to CSV?',
    category: FeedbackCategory.REQUEST,
    status: FeedbackStatus.CLOSED
  },
    {
    id: '7',
    name: 'Brian Smith',
    email: 'brian.smith@example.com',
    content: 'Can you add support for exporting data to CSV?',
    category: FeedbackCategory.REQUEST,
    status: FeedbackStatus.PENDING
  },
      {
    id: '8',
    name: 'Alex Hanson',
    email: 'alex.hanson@example.com',
    content: 'Can you add support for exporting data to CSV?',
    category: FeedbackCategory.REQUEST,
    status: FeedbackStatus.PENDING
  }
];

// Validation helper
const validateFeedback = (data) => {
  const { name, email, content, category, status } = data;
  const errors = [];

  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    errors.push('Name is required');
  }

  if (!email || typeof email !== 'string' || !email.includes('@')) {
    errors.push('Valid email is required');
  }

  if (!content || typeof content !== 'string' || content.trim().length === 0) {
    errors.push('Feedback content is required');
  }

  if (!category || !Object.values(FeedbackCategory).includes(category)) {
    errors.push('Category must be one of: ' + Object.values(FeedbackCategory).join(', '));
  }

  if (!status || !Object.values(FeedbackStatus).includes(status)) {
    errors.push('Status must be one of: ' + Object.values(FeedbackStatus).join(', '));
  }

  return errors;
};

// GET /api/feedback - Get all feedback (public)
router.get('/', (req, res) => {
  const { page = 1, limit = 10, search, category, status } = req.query;
  let filteredFeedback = [...feedback];

  if (search) {
    const searchTerm = search.toLowerCase();
    filteredFeedback = feedback.filter(item => 
      item.name.toLowerCase().includes(searchTerm) ||
      item.email.toLowerCase().includes(searchTerm) ||
      item.content.toLowerCase().includes(searchTerm)
    );
  }

  if (category && Object.values(FeedbackCategory).includes(category)) {
    filteredFeedback = filteredFeedback.filter(item => item.category === category);
  }

  if (status && Object.values(FeedbackStatus).includes(status)) {
    filteredFeedback = filteredFeedback.filter(item => item.status === status);
  }

  // Pagination
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + parseInt(limit);
  const paginatedFeedback = filteredFeedback.slice(startIndex, endIndex);

  res.json({
    feedback: paginatedFeedback,
    pagination: {
      current: parseInt(page),
      total: Math.ceil(filteredFeedback.length / limit),
      count: filteredFeedback.length
    }
  });
});

// GET /api/feedback/:id - Get single feedback (public)
router.get('/:id', (req, res) => {
  const { id } = req.params;
  const feedbackItem = feedback.find(f => f.id === id);
  
  if (!feedbackItem) {
    return res.status(404).json({ error: 'Feedback not found' });
  }

  res.json(feedbackItem);
});

// POST /api/feedback - Create new feedback (public)
router.post('/', (req, res) => {
  const { name, email, content, category = FeedbackCategory.REQUEST, status = FeedbackStatus.PENDING } = req.body;

  const errors = validateFeedback({ name, email, content, category, status });
  if (errors.length > 0) {
    return res.status(400).json({ error: 'Validation failed', details: errors });
  }

  const newFeedback = {
    id: (feedback.length + 1).toString(),
    name: name,
    email: email,
    content: content,
    category,
    status
  };

  feedback.push(newFeedback);

  res.status(201).json({
    message: 'Feedback created successfully',
    feedback: newFeedback
  });
});

// PUT /api/feedback/:id - Update feedback (public)
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { name, email, content, category, status } = req.body;
  const feedbackIndex = feedback.findIndex(f => f.id === id);

  if (feedbackIndex === -1) {
    return res.status(404).json({ error: 'Feedback not found' });
  }

  const errors = validateFeedback({ name, email, content, category, status });
  if (errors.length > 0) {
    return res.status(400).json({ error: 'Validation failed', details: errors });
  }

  if (content) feedback[feedbackIndex].content = content;
  if (status) feedback[feedbackIndex].status = status;

  res.json({
    message: 'Feedback updated successfully',
    feedback: feedback[feedbackIndex]
  });
});

// DELETE /api/feedback/:id - Delete feedback (public)
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  const feedbackIndex = feedback.findIndex(f => f.id === id);

  if (feedbackIndex === -1) {
    return res.status(404).json({ error: 'Feedback not found' });
  }

  feedback.splice(feedbackIndex, 1);

  res.json({ message: 'Feedback deleted successfully' });
});

// GET /api/feedback/categories - Get all available categories
router.get('/sub/categories', (req, res) => {
  res.json(Object.values(FeedbackCategory));
});

// GET /api/feedback/statuses - Get all available statuses
router.get('/sub/statuses', (req, res) => {
  res.json(Object.values(FeedbackStatus));
});

export default router;

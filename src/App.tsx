import { useState } from 'react'
import { Container, Typography, Box, Tab,  } from '@mui/material'
import TabList from '@mui/lab/TabList';
import TabContext from '@mui/lab/TabContext';
import TabPanel from '@mui/lab/TabPanel';
import './App.css'
import { FeedbackList, FeedbackForm } from './components'


function App() {
  const [activeTab, setActiveTab] = useState('0')

  const handleTabChange = (_event: React.SyntheticEvent, newValue: string) => {
    setActiveTab(newValue)
  }

  const handleSubmit = () => {
    setTimeout(() => {
      setActiveTab('0')
    }, 1000)
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box textAlign="center" mb={4}>
        <Typography variant="h3" component="h1" color="primary">
          Feedback Management System
        </Typography>
        <Typography variant="h6" component="h2" color="text.secondary">
          View and submit feedback for bugs, features, and requests
        </Typography>
      </Box>
      <TabContext value={activeTab}>
        <Box mb={4} display="flex" justifyContent="center">
          <TabList onChange={handleTabChange} aria-label="tabs">
            <Tab label="View Feedback" value="0" />
            <Tab label="Submit Feedback" value="1" />
          </TabList>
        </Box>
        <TabPanel value="0">
          <FeedbackList />
        </TabPanel>
        <TabPanel value="1">
          <Box maxWidth="md" mx="auto">
            <FeedbackForm onSuccess={handleSubmit} />
          </Box>
        </TabPanel>
      </TabContext>
    </Container>
  )
}

export default App

// Imports
import React, { useState, useEffect } from 'react';
import { 
  Box, 
  TextField, 
  Button, 
  Paper, 
  Typography, 
  Container, 
  Avatar,
  Snackbar,
  Alert
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import axios from 'axios';

// Components
import Message from './Message';
import LoadingIndicator from './LoadingIndicator';
import ErrorMessage from './ErrorMessage';

// Utils
import { isCodeBlock, parseCodeBlock, formatCode } from '../utils/codeUtils';

// API Configuration
const API_ENDPOINT = process.env.REACT_APP_API_ENDPOINT;
const API_KEY = process.env.REACT_APP_API_KEY;

const Chat = () => {
  // State Management
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [snackbar, setSnackbar] = useState({ 
    open: false, 
    message: '', 
    severity: 'success' 
  });

  // Environment Validation
  useEffect(() => {
    if (!API_ENDPOINT || !API_KEY) {
      setError('API configuration is missing. Please check your environment variables.');
    }
  }, []);

  // Network Status Monitoring
  useEffect(() => {
    const handleOnline = () => {
      setSnackbar({
        open: true,
        message: 'Back online! You can continue chatting.',
        severity: 'success'
      });
      setError(null);
    };

    const handleOffline = () => {
      setSnackbar({
        open: true,
        message: 'You are offline. Please check your connection.',
        severity: 'warning'
      });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Utility Functions
  const showNotification = (message, severity = 'info') => {
    setSnackbar({
      open: true,
      message,
      severity
    });
  };

  // Event Handlers
  const handleCopyCode = async (code) => {
    try {
      await navigator.clipboard.writeText(code);
      showNotification('Code copied to clipboard!', 'success');
    } catch (error) {
      console.error('Error copying code:', error);
      showNotification('Failed to copy code', 'error');
    }
  };

  const handleRunCode = async (code, language) => {
    try {
      console.log(`Running ${language} code:`, code);
      showNotification('Code execution is simulated', 'info');
    } catch (error) {
      console.error('Error running code:', error);
      showNotification('Failed to run code', 'error');
    }
  };

  const handleSend = async (retryMessage = null) => {
    const messageToSend = retryMessage || input;
    if (!messageToSend.trim()) return;

    setError(null);
    const userMessage = { text: messageToSend.trim(), sender: 'user' };
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      if (!navigator.onLine) {
        throw new Error('No internet connection');
      }

      const response = await axios.get(API_ENDPOINT, {
        params: {
          q: userMessage.text,
          apikey: API_KEY
        }
      });

      if (response.data?.data) {
        const aiMessage = { 
          text: response.data.data.trim(), 
          sender: 'ai' 
        };
        setMessages(prevMessages => [...prevMessages, aiMessage]);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      let errorMessage = 'An error occurred while processing your request.';
      
      if (!navigator.onLine) {
        errorMessage = 'You are offline. Please check your internet connection.';
      } else if (error.response) {
        switch (error.response.status) {
          case 429:
            errorMessage = 'Too many requests. Please wait a moment before trying again.';
            break;
          case 401:
            errorMessage = 'Authentication error. Please check your API key.';
            break;
          default:
            errorMessage = `Server error: ${error.response.status}`;
        }
      }

      console.error('Chat error:', error);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // UI Components
  const renderWelcomeMessage = () => (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100%',
      color: 'text.secondary',
      gap: 2
    }}>
      <Avatar sx={{ 
        bgcolor: 'primary.light',
        width: 64,
        height: 64,
        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
      }}>
        <SmartToyIcon sx={{ fontSize: 32 }} />
      </Avatar>
      <Typography variant="h6" color="text.primary">Welcome to AI Chat</Typography>
      <Typography variant="body2" color="text.secondary" textAlign="center">
        Start a conversation with your AI Assistant.<br />Ask anything you'd like to know!
      </Typography>
    </Box>
  );

  // Main Render
  return (
    <Container maxWidth="md" sx={{ height: '100vh', py: 3 }}>
      <Paper 
        elevation={2}
        sx={{ 
          height: '90vh',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          borderRadius: { xs: 0, sm: 3 },
          bgcolor: '#f8f9fa',
          boxShadow: {
            xs: 'none',
            sm: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)'
          }
        }}
      >
        {/* Header */}
        <Box sx={{ 
          p: 2.5, 
          backgroundColor: '#fff',
          borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          boxShadow: '0 1px 2px 0 rgb(0 0 0 / 0.05)'
        }}>
          <Avatar sx={{ 
            bgcolor: 'primary.main',
            width: 42,
            height: 42,
            boxShadow: '0 2px 4px 0 rgb(0 0 0 / 0.05)'
          }}>
            <SmartToyIcon sx={{ fontSize: 24 }} />
          </Avatar>
          <Box>
            <Typography variant="h6" fontWeight="600" sx={{ fontSize: '1.1rem' }}>
              AI Assistant
            </Typography>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1 
            }}>
              <Box sx={{ 
                width: 8, 
                height: 8, 
                borderRadius: '50%', 
                bgcolor: '#22c55e',
                boxShadow: '0 0 0 2px rgba(34, 197, 94, 0.2)'
              }} />
              <Typography 
                variant="caption" 
                color="text.secondary" 
                sx={{ fontSize: '0.8rem' }}
              >
                Online - Ready to help
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Messages */}
        <Box sx={{ 
          flexGrow: 1, 
          overflow: 'auto', 
          p: { xs: 2, sm: 3 },
          display: 'flex',
          flexDirection: 'column',
          gap: 3,
          '&::-webkit-scrollbar': {
            width: '8px',
            backgroundColor: 'transparent'
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: 'rgba(0,0,0,0.1)',
            borderRadius: '4px',
            '&:hover': {
              backgroundColor: 'rgba(0,0,0,0.2)'
            }
          }
        }}>
          {messages.length === 0 ? renderWelcomeMessage() : (
            messages.map((message, index) => {
              const isCode = isCodeBlock(message.text);
              const codeProps = isCode ? {
                ...parseCodeBlock(message.text),
                code: formatCode(parseCodeBlock(message.text).code, parseCodeBlock(message.text).language)
              } : null;

              return (
                <Message
                  key={index}
                  message={message}
                  isCodeBlock={isCode}
                  codeProps={codeProps}
                  onCopyCode={handleCopyCode}
                  onRunCode={handleRunCode}
                />
              );
            })
          )}
          {isLoading && <LoadingIndicator />}
          {error && (
            <ErrorMessage 
              message={error} 
              onRetry={() => handleSend(messages[messages.length - 1]?.text)} 
            />
          )}
        </Box>

        {/* Input Area */}
        <Box sx={{ 
          p: { xs: 2, sm: 3 }, 
          backgroundColor: '#fff',
          borderTop: '1px solid rgba(0, 0, 0, 0.08)',
          display: 'flex',
          gap: 1.5
        }}>
          <TextField
            fullWidth
            multiline
            maxRows={4}
            variant="outlined"
            placeholder="Type your message here..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2.5,
                backgroundColor: '#f8f9fa',
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  backgroundColor: '#f0f1f2'
                },
                '&.Mui-focused': {
                  backgroundColor: '#fff',
                  '& fieldset': {
                    borderColor: 'primary.main',
                    borderWidth: '2px'
                  }
                }
              }
            }}
          />
          <Button
            variant="contained"
            onClick={() => handleSend()}
            disabled={isLoading || !input.trim()}
            sx={{
              minWidth: 'auto',
              width: 50,
              height: 50,
              borderRadius: 2.5,
              boxShadow: 'none',
              '&:hover': {
                boxShadow: '0 2px 4px 0 rgb(0 0 0 / 0.1)'
              }
            }}
          >
            <SendIcon />
          </Button>
        </Box>
      </Paper>

      {/* Notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity}
          variant="filled"
          sx={{ 
            width: '100%',
            boxShadow: '0 2px 4px -1px rgb(0 0 0 / 0.1)'
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Chat;

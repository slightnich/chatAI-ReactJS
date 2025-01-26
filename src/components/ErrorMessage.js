import React from 'react';
import { Box, Paper, Typography, Button } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import RefreshIcon from '@mui/icons-material/Refresh';

const ErrorMessage = ({ message, onRetry }) => {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        backgroundColor: '#FEF2F2',
        borderRadius: 2.5,
        border: '1px solid #FCA5A5',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 2,
        maxWidth: '100%',
        width: '100%',
        transition: 'all 0.2s ease-in-out',
        animation: 'fadeIn 0.3s ease-in-out',
        '@keyframes fadeIn': {
          from: {
            opacity: 0,
            transform: 'translateY(10px)'
          },
          to: {
            opacity: 1,
            transform: 'translateY(0)'
          }
        }
      }}
    >
      <ErrorOutlineIcon sx={{ color: '#DC2626', fontSize: 40 }} />
      <Box sx={{ textAlign: 'center' }}>
        <Typography 
          variant="h6" 
          sx={{ 
            color: '#991B1B',
            fontSize: '1.1rem',
            fontWeight: 600,
            mb: 1
          }}
        >
          Connection Error
        </Typography>
        <Typography 
          variant="body2" 
          sx={{ 
            color: '#7F1D1D',
            mb: 2
          }}
        >
          {message}
        </Typography>
        <Button
          variant="contained"
          onClick={onRetry}
          startIcon={<RefreshIcon />}
          sx={{
            backgroundColor: '#DC2626',
            '&:hover': {
              backgroundColor: '#B91C1C'
            }
          }}
        >
          Try Again
        </Button>
      </Box>
    </Paper>
  );
};

export default ErrorMessage;

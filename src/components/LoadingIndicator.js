import React from 'react';
import { Box, Avatar, Paper, Typography, CircularProgress } from '@mui/material';
import SmartToyIcon from '@mui/icons-material/SmartToy';

const LoadingIndicator = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        ml: 1,
        opacity: 0.999,
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
      <Avatar
        sx={{
          bgcolor: '#fff',
          width: 38,
          height: 38,
          border: '2px solid #e0e0e0',
          boxShadow: '0 2px 4px 0 rgb(0 0 0 / 0.1)',
          transition: 'all 0.2s ease-in-out',
          animation: 'pulse 2s infinite',
          '@keyframes pulse': {
            '0%': {
              boxShadow: '0 0 0 0 rgba(25, 118, 210, 0.4)'
            },
            '70%': {
              boxShadow: '0 0 0 6px rgba(25, 118, 210, 0)'
            },
            '100%': {
              boxShadow: '0 0 0 0 rgba(25, 118, 210, 0)'
            }
          }
        }}
      >
        <SmartToyIcon sx={{ 
          color: 'primary.main',
          fontSize: 20,
          animation: 'thinking 1.5s infinite',
          '@keyframes thinking': {
            '0%, 100%': {
              transform: 'rotate(0deg)'
            },
            '25%': {
              transform: 'rotate(-10deg)'
            },
            '75%': {
              transform: 'rotate(10deg)'
            }
          }
        }} />
      </Avatar>
      <Paper
        elevation={0}
        sx={{
          p: 2,
          backgroundColor: '#fff',
          borderRadius: 2.5,
          boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)',
          border: '1px solid rgba(0, 0, 0, 0.08)',
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-1px)',
            boxShadow: '0 2px 4px -1px rgb(0 0 0 / 0.15)'
          }
        }}
      >
        <CircularProgress 
          size={18} 
          thickness={6} 
          sx={{ 
            color: 'primary.main',
            opacity: 0.8
          }} 
        />
        <Typography 
          variant="body2" 
          sx={{ 
            color: 'text.secondary',
            fontSize: '0.9rem',
            fontWeight: 500,
            letterSpacing: '0.01em'
          }}
        >
          AI is thinking...
        </Typography>
      </Paper>
    </Box>
  );
};

export default LoadingIndicator;

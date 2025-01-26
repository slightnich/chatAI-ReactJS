import React from 'react';
import { Box, Avatar, Paper, Typography } from '@mui/material';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import PersonIcon from '@mui/icons-material/Person';
import CodeBlock from './CodeBlock';

const Message = ({ message, isCodeBlock, codeProps, onCopyCode, onRunCode }) => {
  const isAI = message.sender === 'ai';

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: isAI ? 'row' : 'row-reverse',
        gap: 2,
        maxWidth: '85%',
        alignSelf: isAI ? 'flex-start' : 'flex-end',
      }}
    >
      <Avatar
        sx={{
          bgcolor: isAI ? 'primary.main' : 'secondary.main',
          width: 38,
          height: 38,
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        }}
      >
        {isAI ? <SmartToyIcon /> : <PersonIcon />}
      </Avatar>

      <Box sx={{ maxWidth: '100%' }}>
        {isCodeBlock ? (
          <CodeBlock
            code={codeProps.code}
            language={codeProps.language}
            onCopy={onCopyCode}
            onRun={onRunCode}
          />
        ) : (
          <Paper
            elevation={0}
            sx={{
              p: 2,
              borderRadius: 2.5,
              bgcolor: isAI ? 'grey.100' : 'primary.main',
              color: isAI ? 'text.primary' : 'white',
              maxWidth: '100%',
              position: 'relative',
              '&::before': {
                content: '""',
                position: 'absolute',
                width: 0,
                height: 0,
                borderStyle: 'solid',
                borderWidth: '8px',
                borderColor: 'transparent',
                [isAI ? 'left' : 'right']: -8,
                top: 12,
                borderRightColor: isAI ? 'grey.100' : 'transparent',
                borderLeftColor: isAI ? 'transparent' : 'primary.main',
              },
            }}
          >
            <Typography
              variant="body1"
              sx={{
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
                lineHeight: 1.6,
                '& a': {
                  color: isAI ? 'primary.main' : 'inherit',
                  textDecoration: 'underline',
                  '&:hover': {
                    textDecoration: 'none',
                  },
                },
              }}
            >
              {message.text}
            </Typography>
          </Paper>
        )}
      </Box>
    </Box>
  );
};

export default Message;

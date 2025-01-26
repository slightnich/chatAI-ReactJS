import React from 'react';
import { Box, IconButton, Typography, Tooltip, Paper } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import {
  atomOneDark,
  docco
} from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { useTheme } from '@mui/material/styles';

const CodeBlock = ({ code, language, onCopy, onRun }) => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';

  const isExecutable = ['javascript', 'python', 'nodejs'].includes(language?.toLowerCase());

  return (
    <Paper 
      elevation={2}
      sx={{
        position: 'relative',
        borderRadius: 2,
        overflow: 'hidden',
        bgcolor: isDarkMode ? '#1a1a1a' : '#f8f9fa',
        border: '1px solid',
        borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          px: 2,
          py: 1,
          borderBottom: '1px solid',
          borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
          bgcolor: isDarkMode ? '#2d2d2d' : '#fff',
        }}
      >
        <Typography
          variant="caption"
          sx={{
            textTransform: 'uppercase',
            fontWeight: 600,
            letterSpacing: '0.5px',
            color: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'text.secondary',
            fontSize: '0.75rem',
          }}
        >
          {language || 'text'}
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Tooltip title="Copy code" arrow>
            <IconButton
              size="small"
              onClick={() => onCopy(code)}
              sx={{
                color: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'text.secondary',
                '&:hover': {
                  color: isDarkMode ? 'white' : 'text.primary',
                  bgcolor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
                },
              }}
            >
              <ContentCopyIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          {isExecutable && (
            <Tooltip title="Run code" arrow>
              <IconButton
                size="small"
                onClick={() => onRun(code, language)}
                sx={{
                  color: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'text.secondary',
                  '&:hover': {
                    color: theme.palette.primary.main,
                    bgcolor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
                  },
                }}
              >
                <PlayArrowIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      </Box>

      {/* Code Content */}
      <Box 
        sx={{ 
          position: 'relative',
          '& pre': {
            m: 0,
            p: '16px !important',
            fontSize: '0.875rem !important',
            lineHeight: '1.5 !important',
            fontFamily: 'Consolas, Monaco, "Andale Mono", "Ubuntu Mono", monospace !important',
            borderRadius: '0 !important',
            bgcolor: 'transparent !important',
          },
          '&:hover': {
            '& .copy-button': {
              opacity: 1,
            },
          },
        }}
      >
        <SyntaxHighlighter
          language={language || 'text'}
          style={isDarkMode ? atomOneDark : docco}
          customStyle={{
            margin: 0,
            padding: 16,
            background: 'transparent',
          }}
          showLineNumbers={code.split('\n').length > 1}
          lineNumberStyle={{
            minWidth: 40,
            paddingRight: 16,
            textAlign: 'right',
            color: isDarkMode ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)',
            userSelect: 'none',
          }}
        >
          {code}
        </SyntaxHighlighter>
      </Box>
    </Paper>
  );
};

export default CodeBlock;

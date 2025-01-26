// Constants
export const LANGUAGE_MAP = {
  'js': 'javascript',
  'jsx': 'javascript',
  'ts': 'typescript',
  'tsx': 'typescript',
  'py': 'python',
  'rb': 'ruby',
  'php': 'php',
  'cs': 'csharp',
  'cpp': 'cpp',
  'c++': 'cpp',
  'html': 'html',
  'css': 'css',
  'json': 'json',
  'yaml': 'yaml',
  'yml': 'yaml',
  'sh': 'bash',
  'bash': 'bash',
  'sql': 'sql',
  'java': 'java',
  'go': 'go',
  'rust': 'rust',
  'swift': 'swift',
  'kotlin': 'kotlin'
};

const COMMON_KEYWORDS = {
  javascript: ['const', 'let', 'var', 'function', 'class', 'import', 'export', 'return', 'async', 'await'],
  python: ['def', 'class', 'import', 'from', 'return', 'async', 'await', 'if', 'for', 'while'],
  java: ['public', 'private', 'class', 'void', 'int', 'String', 'static', 'final'],
  html: ['<html', '<div', '<span', '<p', '<a', '<img', '<button', '<form'],
  css: ['body', 'div', 'span', '.class', '#id', '@media', '@keyframes'],
  sql: ['SELECT', 'INSERT', 'UPDATE', 'DELETE', 'CREATE', 'DROP', 'ALTER', 'WHERE']
};

// Function to detect if text is a code block
export const isCodeBlock = (text) => {
  if (!text) return false;
  
  // Check for markdown code block syntax
  const hasMarkdownSyntax = text.includes('```');
  if (hasMarkdownSyntax) {
    return text.trim().startsWith('```') && text.trim().endsWith('```');
  }

  // Check for inline code block syntax
  if (text.includes('`')) {
    const matches = text.match(/`[^`]+`/g);
    if (matches && matches.length > 0) {
      // If the inline code is long enough, treat it as a code block
      return matches.some(match => match.length > 20);
    }
  }

  // Check for common programming patterns
  const hasCodePatterns = /^(const|let|var|function|import|class|if|for|while|def|public|private|#include)/m.test(text);
  const hasIndentation = /^( {2,}|\t+)/m.test(text);
  const hasComments = /^(\/\/|\/\*|\*|#|--)/m.test(text);
  const hasBraces = /[{}\[\]()<>]/g.test(text);
  const hasOperators = /[=+\-*/%<>!&|^~]/g.test(text);
  const hasSemicolons = /;/g.test(text);
  const hasLineBreaks = text.includes('\n');

  // Language-specific patterns
  const hasJavaScriptPatterns = /^(import .* from|export|const|let|var|async function)/m.test(text);
  const hasPythonPatterns = /^(def |class |import |from .* import|@)/m.test(text);
  const hasHTMLPatterns = /^<[^>]+>/m.test(text);
  const hasCSSPatterns = /^[.#]?\w+\s*{/m.test(text);
  const hasSQLPatterns = /^(SELECT|INSERT|UPDATE|DELETE|CREATE|DROP|ALTER)\s/im.test(text);

  // Count code-like characteristics
  let codeCharacteristics = 0;
  if (hasCodePatterns) codeCharacteristics += 2;
  if (hasIndentation) codeCharacteristics += 1;
  if (hasComments) codeCharacteristics += 1;
  if (hasBraces) codeCharacteristics += 1;
  if (hasOperators) codeCharacteristics += 1;
  if (hasSemicolons) codeCharacteristics += 1;
  if (hasLineBreaks) codeCharacteristics += 1;
  if (hasJavaScriptPatterns || hasPythonPatterns || hasHTMLPatterns || hasCSSPatterns || hasSQLPatterns) {
    codeCharacteristics += 2;
  }

  // Check for common keywords from different languages
  for (const [, keywords] of Object.entries(COMMON_KEYWORDS)) {
    const keywordCount = keywords.filter(keyword => text.includes(keyword)).length;
    if (keywordCount >= 2) {
      codeCharacteristics += 2;
      break;
    }
  }

  return codeCharacteristics >= 3;
};

// Function to extract code and detect language
export const parseCodeBlock = (text) => {
  if (!text) return { language: 'text', code: '' };

  let language = 'text';
  let code = text;

  // Handle markdown code blocks
  if (text.includes('```')) {
    const lines = text.split('\n');
    const firstLine = lines[0].trim();
    
    if (firstLine.startsWith('```')) {
      language = firstLine.replace('```', '').trim().toLowerCase() || 'text';
      code = lines.slice(1, -1).join('\n');
    }
  } else if (text.includes('`')) {
    // Handle inline code blocks
    const match = text.match(/`([^`]+)`/);
    if (match) {
      code = match[1];
    }
  }

  // Detect language if not specified
  if (language === 'text') {
    if (/^(import|export|const|let|var|function|class)\s/.test(code)) {
      language = 'javascript';
    } else if (/^(def|class|import|from|print)\s/.test(code)) {
      language = 'python';
    } else if (/^(public|private|class|void|int|String)\s/.test(code)) {
      language = 'java';
    } else if (/<[^>]+>/.test(code)) {
      language = 'html';
    } else if (/^[.#]?\w+\s*{/.test(code)) {
      language = 'css';
    } else if (/^(SELECT|INSERT|UPDATE|DELETE|CREATE|DROP|ALTER)\s/i.test(code)) {
      language = 'sql';
    } else if (/^#include/.test(code)) {
      language = 'cpp';
    }
  }

  // Map language aliases
  return {
    language: LANGUAGE_MAP[language] || language,
    code: code.trim()
  };
};

// Function to format code
export const formatCode = (code, language) => {
  if (!code) return '';
  
  switch (language) {
    case 'javascript':
    case 'typescript':
      return code
        .replace(/([^;])\n/g, '$1;\n')
        .replace(/{\n*}/g, '{\n}')
        .replace(/\n{3,}/g, '\n\n')
        .trim();

    case 'python':
      return code
        .replace(/^\s+/gm, '    ')
        .replace(/\n{3,}/g, '\n\n')
        .trim();

    case 'html':
      return code
        .replace(/></g, '>\n<')
        .replace(/(<[^/][^>]*>)([^<]*)/g, '$1\n    $2')
        .replace(/\n{3,}/g, '\n\n')
        .trim();

    case 'css':
      return code
        .replace(/[{](?!\n)/g, ' {\n    ')
        .replace(/;(?!\n)/g, ';\n    ')
        .replace(/^\s+}/gm, '}')
        .replace(/[}](?!\n)/g, '}\n')
        .replace(/\n{3,}/g, '\n\n')
        .trim();

    case 'sql':
      return code
        .replace(/\b(SELECT|FROM|WHERE|GROUP BY|ORDER BY|HAVING|INSERT|UPDATE|DELETE)\b/gi, '\n$1')
        .replace(/\b(INNER|LEFT|RIGHT|FULL|JOIN|ON)\b/gi, '\n    $1')
        .replace(/\n{3,}/g, '\n\n')
        .trim()
        .toUpperCase();

    default:
      return code.trim();
  }
};

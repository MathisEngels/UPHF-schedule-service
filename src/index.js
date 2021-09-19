import React from 'react';
import ReactDOM from 'react-dom';
import { ThemeProvider } from '@mui/system';
import { CssBaseline } from '@mui/material';
import { createTheme } from '@mui/material/styles'
import App from './App';
import './index.css';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  }
});

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById('root')
);


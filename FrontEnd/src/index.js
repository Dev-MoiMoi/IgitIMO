import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css';

// 🎯 FIX 1: Import the ThemeProvider from its location
// Adjust the path './context/ThemeContext' if your file is in a different directory
import { ThemeProvider } from './context/ThemeContext'; 

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {/* 🎯 FIX 2: Wrap the entire application (<App />) with the ThemeProvider */}
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </React.StrictMode>
);
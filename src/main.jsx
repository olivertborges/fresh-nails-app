import React from 'react';
import ReactDOM from 'react-dom/client';
import emailjs from '@emailjs/browser';
import { EMAILJS_CONFIG } from './config/emailjs';
import App from './App';
import './index.css';

// Inicializar EmailJS UNA SOLA VEZ al inicio de la app
emailjs.init(EMAILJS_CONFIG.PUBLIC_KEY);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
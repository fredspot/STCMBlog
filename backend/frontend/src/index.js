import React from 'react';
import ReactDOM from 'react-dom';
import './styles.css';
import App from './App';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './AuthProvider';

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <AuthProvider> {/* Wrap the App component */}
        <App />
      </AuthProvider>
    </Router>
  </React.StrictMode>,
  document.getElementById('root')
);

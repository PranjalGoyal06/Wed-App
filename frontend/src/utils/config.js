// Configuration for different environments
const config = {
  development: {
    API_BASE_URL: 'http://localhost:5000/api'
  },
  production: {
    API_BASE_URL: '/api'  // Use relative URL in production
  }
};

// Detect environment
const environment = window.location.hostname === 'localhost' ? 'development' : 'production';

// Export configuration
const API_BASE_URL = config[environment].API_BASE_URL;

const API_BASE_URL = 'http://localhost:5000/api';

// API utility functions
const api = {
    // Auth endpoints
    async register(userData) {
        return await this.post('/auth/register', userData);
    },
    
    async login(credentials) {
        return await this.post('/auth/login', credentials);
    },
    
    async getProfile() {
        return await this.get('/auth/profile');
    },
    
    // Photo endpoints
    async uploadPhoto(formData) {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/photos/upload`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: formData
        });
        return await response.json();
    },
    
    async getAllPhotos(params = {}) {
        const queryString = new URLSearchParams(params).toString();
        return await this.get(`/photos?${queryString}`);
    },
    
    async filterPhotosByFace(faceDescriptor) {
        return await this.post('/photos/filter-by-face', { faceDescriptor });
    },
    
    async likePhoto(photoId) {
        return await this.post(`/photos/${photoId}/like`);
    },
    
    async addComment(photoId, text) {
        return await this.post(`/photos/${photoId}/comment`, { text });
    },
    
    // Game endpoints
    async getAllGames() {
        return await this.get('/games');
    },
    
    async getGame(gameId) {
        return await this.get(`/games/${gameId}`);
    },
    
    async submitScore(gameId, score, answers) {
        return await this.post('/games/submit-score', { gameId, score, answers });
    },
    
    async getLeaderboard(gameId) {
        return await this.get(`/games/${gameId}/leaderboard`);
    },
    
    // Challenge endpoints
    async getAllChallenges() {
        return await this.get('/challenges');
    },
    
    async joinChallenge(challengeId) {
        return await this.post(`/challenges/${challengeId}/join`);
    },
    
    async submitChallenge(challengeId, submission) {
        return await this.post('/challenges/submit', { challengeId, submission });
    },
    
    // Event endpoints
    async getAllEvents(params = {}) {
        const queryString = new URLSearchParams(params).toString();
        return await this.get(`/events?${queryString}`);
    },
    
    async rsvpEvent(eventId) {
        return await this.post(`/events/${eventId}/rsvp`);
    },
    
    // Admin endpoints
    async getDashboardStats() {
        return await this.get('/admin/dashboard');
    },
    
    async getAllUsers(params = {}) {
        const queryString = new URLSearchParams(params).toString();
        return await this.get(`/admin/users?${queryString}`);
    },
    
    async createGame(gameData) {
        return await this.post('/games', gameData);
    },
    
    async createChallenge(challengeData) {
        return await this.post('/challenges', challengeData);
    },
    
    async createEvent(eventData) {
        return await this.post('/events', eventData);
    },
    
    async broadcastNotification(message, type) {
        return await this.post('/admin/broadcast-notification', { message, type });
    },
    
    // Notification endpoints
    async getNotifications() {
        return await this.get('/auth/notifications');
    },
    
    async markNotificationRead(notificationId) {
        return await this.put(`/auth/notifications/${notificationId}/read`);
    },
    
    // Generic methods
    async get(endpoint) {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: 'GET',
            headers: {
                'Authorization': token ? `Bearer ${token}` : '',
                'Content-Type': 'application/json'
            }
        });
        return await response.json();
    },
    
    async post(endpoint, data) {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: 'POST',
            headers: {
                'Authorization': token ? `Bearer ${token}` : '',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        return await response.json();
    },
    
    async put(endpoint, data) {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: 'PUT',
            headers: {
                'Authorization': token ? `Bearer ${token}` : '',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        return await response.json();
    },
    
    async delete(endpoint) {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: 'DELETE',
            headers: {
                'Authorization': token ? `Bearer ${token}` : '',
                'Content-Type': 'application/json'
            }
        });
        return await response.json();
    }
};

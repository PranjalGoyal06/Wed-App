// Authentication utilities

function isAuthenticated() {
    const token = localStorage.getItem('token');
    return !!token;
}

function getUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
}

function isAdmin() {
    const user = getUser();
    return user && user.role === 'admin';
}

function requireAuth() {
    if (!isAuthenticated()) {
        window.location.href = 'login.html';
        return false;
    }
    return true;
}

function requireAdmin() {
    if (!isAuthenticated() || !isAdmin()) {
        alert('Access denied. Admin only.');
        window.location.href = 'index.html';
        return false;
    }
    return true;
}

function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = 'login.html';
}

function saveAuth(token, user) {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
}

// Show/hide navigation links based on auth status
function updateNavigation() {
    const token = localStorage.getItem('token');
    const user = getUser();
    
    const loginLink = document.getElementById('loginLink');
    const logoutLink = document.getElementById('logoutLink');
    const adminLink = document.getElementById('adminLink');
    
    if (token) {
        if (loginLink) loginLink.style.display = 'none';
        if (logoutLink) {
            logoutLink.style.display = 'block';
            logoutLink.addEventListener('click', (e) => {
                e.preventDefault();
                logout();
            });
        }
        
        if (user && user.role === 'admin' && adminLink) {
            adminLink.style.display = 'block';
        }
    } else {
        if (loginLink) loginLink.style.display = 'block';
        if (logoutLink) logoutLink.style.display = 'none';
        if (adminLink) adminLink.style.display = 'none';
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', updateNavigation);

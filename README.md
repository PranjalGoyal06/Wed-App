# Wedding App

A comprehensive wedding application featuring face recognition-based photo filtering, interactive games and challenges, event notifications, and an admin dashboard.

## Features

### 🎯 Core Features

1. **Face Recognition Photo Filtering**
   - Upload photos and automatically detect faces
   - Filter photos to find all images containing a specific person
   - Advanced face descriptor matching system

2. **Games & Challenges**
   - Interactive wedding games (Quiz, Trivia, Memory Match, etc.)
   - User challenges with point systems
   - Real-time leaderboards
   - Multiple game types for guest entertainment

3. **Event Notifications**
   - Schedule wedding events with automatic reminders
   - RSVP functionality
   - Customizable notification timing
   - Real-time push notifications via Socket.io

4. **Admin Dashboard**
   - Comprehensive statistics and analytics
   - Create and manage games, challenges, and events
   - User management
   - Broadcast notifications to all users
   - View recent activities and engagement metrics

### 📸 Photo Gallery
- Upload and share wedding photos
- Like and comment on photos
- Tag-based organization
- Public and private photo options

## Tech Stack

### Backend
- **Node.js** & **Express.js** - Server framework
- **MongoDB** & **Mongoose** - Database
- **JWT** - Authentication
- **Socket.io** - Real-time notifications
- **Multer** - File upload handling
- **bcryptjs** - Password hashing

### Frontend
- **HTML5**, **CSS3**, **JavaScript** (Vanilla)
- Responsive design
- Real-time updates

## Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone https://github.com/PranjalGoyal06/Wed-App.git
   cd Wed-App
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` file with your settings:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/wedding-app
   JWT_SECRET=your_secure_jwt_secret_key
   NODE_ENV=development
   ```

4. **Start MongoDB**
   ```bash
   # Make sure MongoDB is running
   mongod
   ```

5. **Start the application**
   ```bash
   # Development mode with auto-reload
   npm run dev
   
   # Production mode
   npm start
   ```

6. **Access the application**
   - Frontend: Open `frontend/public/index.html` in a web browser
   - API: `http://localhost:5000/api`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile
- `GET /api/auth/notifications` - Get user notifications

### Photos
- `POST /api/photos/upload` - Upload photo (requires auth)
- `GET /api/photos` - Get all photos
- `GET /api/photos/:id` - Get photo by ID
- `POST /api/photos/filter-by-face` - Filter photos by face descriptor
- `POST /api/photos/:id/like` - Like/unlike photo
- `POST /api/photos/:id/comment` - Add comment to photo
- `DELETE /api/photos/:id` - Delete photo

### Games
- `GET /api/games` - Get all games
- `GET /api/games/:id` - Get game details
- `POST /api/games` - Create game (admin only)
- `POST /api/games/submit-score` - Submit game score
- `GET /api/games/:gameId/leaderboard` - Get game leaderboard
- `PUT /api/games/:id` - Update game (admin only)
- `DELETE /api/games/:id` - Delete game (admin only)

### Challenges
- `GET /api/challenges` - Get all challenges
- `GET /api/challenges/:id` - Get challenge details
- `POST /api/challenges` - Create challenge (admin only)
- `POST /api/challenges/:id/join` - Join challenge
- `POST /api/challenges/submit` - Submit challenge completion
- `POST /api/challenges/verify-submission` - Verify submission (admin only)
- `PUT /api/challenges/:id` - Update challenge (admin only)
- `DELETE /api/challenges/:id` - Delete challenge (admin only)

### Events
- `GET /api/events` - Get all events
- `GET /api/events/:id` - Get event details
- `POST /api/events` - Create event (admin only)
- `POST /api/events/:id/rsvp` - RSVP to event
- `PUT /api/events/:id` - Update event (admin only)
- `DELETE /api/events/:id` - Delete event (admin only)
- `POST /api/events/send-notifications` - Send event reminders (admin only)

### Admin
- `GET /api/admin/dashboard` - Get dashboard statistics
- `GET /api/admin/users` - Get all users
- `PUT /api/admin/users/role` - Update user role
- `DELETE /api/admin/users/:id` - Delete user
- `GET /api/admin/analytics` - Get system analytics
- `POST /api/admin/broadcast-notification` - Broadcast notification to all users

## Project Structure

```
Wed-App/
├── backend/
│   ├── config/
│   │   └── database.js          # Database configuration
│   ├── controllers/
│   │   ├── authController.js    # Authentication logic
│   │   ├── photoController.js   # Photo management
│   │   ├── gameController.js    # Games logic
│   │   ├── challengeController.js # Challenges logic
│   │   ├── eventController.js   # Events management
│   │   └── adminController.js   # Admin operations
│   ├── middleware/
│   │   ├── auth.js             # Authentication middleware
│   │   └── upload.js           # File upload middleware
│   ├── models/
│   │   ├── User.js             # User schema
│   │   ├── Photo.js            # Photo schema
│   │   ├── Game.js             # Game schema
│   │   ├── Challenge.js        # Challenge schema
│   │   └── Event.js            # Event schema
│   └── routes/
│       ├── auth.js             # Auth routes
│       ├── photos.js           # Photo routes
│       ├── games.js            # Game routes
│       ├── challenges.js       # Challenge routes
│       ├── events.js           # Event routes
│       └── admin.js            # Admin routes
├── frontend/
│   ├── public/
│   │   ├── index.html          # Home page
│   │   ├── login.html          # Login page
│   │   ├── register.html       # Registration page
│   │   ├── photos.html         # Photo gallery
│   │   ├── games.html          # Games page
│   │   ├── challenges.html     # Challenges page
│   │   ├── events.html         # Events page
│   │   └── admin.html          # Admin dashboard
│   └── src/
│       ├── styles/
│       │   └── main.css        # Main stylesheet
│       └── utils/
│           ├── api.js          # API utility functions
│           └── auth.js         # Authentication utilities
├── uploads/                    # Uploaded files directory
├── server.js                   # Main server file
├── package.json               # Dependencies and scripts
├── .env.example              # Environment variables template
├── .gitignore               # Git ignore rules
└── README.md                # This file
```

## Usage Guide

### For Users

1. **Register/Login**: Create an account or login to access features
2. **Upload Photos**: Share your wedding photos with face recognition tagging
3. **Play Games**: Participate in wedding games and climb the leaderboard
4. **Join Challenges**: Complete fun challenges to earn points
5. **RSVP to Events**: Stay updated with all wedding events and activities
6. **Receive Notifications**: Get timely reminders about upcoming events

### For Admins

1. **Access Admin Dashboard**: Login with admin credentials
2. **Create Games**: Design interactive games for guests
3. **Set Up Challenges**: Create engaging challenges with point rewards
4. **Schedule Events**: Add wedding events with automatic notifications
5. **Manage Users**: View and manage user accounts
6. **Send Announcements**: Broadcast notifications to all users
7. **View Analytics**: Monitor engagement and activity statistics

## Face Recognition Feature

The face recognition system uses face descriptors to match faces across photos:

1. Upload a reference photo
2. System extracts face descriptor (128-dimensional vector)
3. Compares against all photos in the database
4. Returns photos with matching faces (similarity threshold)

*Note: For production use, integrate with face-api.js or AWS Rekognition for robust face detection.*

## Security Features

- JWT-based authentication
- Password hashing with bcryptjs
- Role-based access control (User/Admin)
- Protected API endpoints
- File upload validation
- XSS and injection protection

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Support

For support, email support@weddingapp.com or open an issue in the repository.

## Acknowledgments

- Built with ❤️ for memorable wedding celebrations
- Thanks to all contributors and the open-source community

---

**Made for your special day! 💒**

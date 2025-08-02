# 🤖 IntelliChat - AI Assistant with Image Support

A modern, responsive AI chat application built with React, Node.js, and Groq API. Features real-time chat, image analysis, user authentication, and a beautiful dark-themed interface.

## ✨ Features

### 🎯 Core Features
- **AI Chat Interface** - Powered by Groq's Llama 4 Scout model
- **Image Analysis** - Upload and analyze images with AI
- **Real-time Messaging** - Instant AI responses
- **User Authentication** - Secure login/register system
- **Google OAuth** - Sign in with Google account
- **Responsive Design** - Works on desktop, tablet, and mobile

### 🖼️ Image Features
- **Image Upload** - Drag & drop or click to upload
- **Image Compression** - Automatic compression to <100KB
- **Image Preview** - See images before sending
- **AI Image Analysis** - Get detailed descriptions of images
- **Multiple Formats** - Supports JPG, PNG, GIF, WebP

### 🎨 UI/UX Features
- **Dark Theme** - Modern dark interface
- **Responsive Sidebar** - Collapsible on mobile
- **Hamburger Menu** - Mobile-friendly navigation
- **Loading States** - Smooth animations and indicators
- **Error Handling** - User-friendly error messages
- **Toast Notifications** - Success/error feedback

## 🚀 Tech Stack

### Frontend
- **React 18** - Modern UI framework
- **React Router** - Client-side routing
- **Axios** - HTTP client for API calls
- **React Icons** - Beautiful icon library
- **React Toastify** - Toast notifications
- **Tailwind CSS** - Utility-first CSS framework

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **Multer** - File upload handling
- **Sharp** - Image processing
- **Passport.js** - Authentication middleware
- **Express Session** - Session management

### AI & APIs
- **Groq API** - Fast AI inference
- **Llama 4 Scout** - Multimodal AI model
- **Image Analysis** - Vision capabilities

## 📦 Installation

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud)
- Groq API key

### 1. Clone the Repository
```bash
git clone <repository-url>
cd Ai-chat
```

### 2. Install Dependencies

**Backend:**
```bash
cd Server
npm install
```

**Frontend:**
```bash
cd my-app
npm install
```

### 3. Environment Setup

Create `.env` file in the `Server` directory:
```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGO_URL=mongodb://localhost:27017/AiChat

# Authentication
SESSION_SECRET=yourSuperSecretKey123!@#$%^&*()
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# AI API
GROQ_API=your_groq_api_key

# URLs
FRONT_URL=http://localhost:3000
BACK_URL=http://localhost:5000
```

### 4. Database Setup
```bash
# Start MongoDB (if local)
mongod

# Or use MongoDB Atlas (cloud)
# Update MONGO_URL in .env
```

### 5. Run the Application

**Start Backend:**
```bash
cd Server
npm start
```

**Start Frontend:**
```bash
cd my-app
npm start
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

## 🔧 Configuration

### Groq API Setup
1. Sign up at [Groq Console](https://console.groq.com)
2. Get your API key
3. Add to `.env` file

### Google OAuth Setup
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add client ID and secret to `.env`

### MongoDB Setup
- **Local**: Install MongoDB locally
- **Cloud**: Use MongoDB Atlas (recommended)

## 📱 Usage

### Getting Started
1. **Register/Login** - Create account or sign in with Google
2. **Start Chatting** - Type messages and get AI responses
3. **Upload Images** - Click the image icon to upload photos
4. **Analyze Images** - Get detailed descriptions of uploaded images

### Features Guide

#### Chat Interface
- **Text Messages** - Type and send text messages
- **Image Upload** - Click 📷 icon to upload images
- **Image Preview** - See uploaded images before sending
- **AI Analysis** - Get detailed image descriptions

#### Mobile Features
- **Hamburger Menu** - Tap ☰ to open sidebar
- **Responsive Design** - Optimized for mobile screens
- **Touch-Friendly** - Large touch targets

#### User Management
- **Profile Editing** - Update name and email
- **Account Deletion** - Remove account permanently
- **Session Management** - Automatic login/logout

## 🛠️ API Endpoints

### Authentication
- `POST /api/register` - User registration
- `POST /api/login` - User login
- `POST /api/logout` - User logout
- `GET /api/auth` - Check auth status
- `GET /api/profile` - Get user profile

### Chat
- `POST /chat` - Send message with optional image
- **Supports**: Text messages, image uploads, image analysis

### User Management
- `PUT /api/update/:id` - Update user profile
- `DELETE /api/delete/:id` - Delete user account

## 🎨 Customization

### Styling
- **Colors**: Update CSS variables in `my-app/src/css/Chat.css`
- **Theme**: Modify dark theme colors
- **Icons**: Replace React Icons with custom icons

### Features
- **Add Models**: Integrate different AI models
- **File Types**: Support more file formats
- **Authentication**: Add more OAuth providers

## 🔒 Security Features

- **Password Hashing** - bcrypt encryption
- **Session Management** - Secure session handling
- **CORS Protection** - Cross-origin request security
- **File Validation** - Image type and size validation
- **Input Sanitization** - XSS protection

## 📊 Performance

### Image Optimization
- **Automatic Compression** - Images compressed to <100KB
- **Progressive JPEG** - Better compression
- **MozJPEG** - Optimized JPEG encoding
- **Size Validation** - Prevents oversized uploads

### Database Optimization
- **Indexed Queries** - Fast user lookups
- **Session Storage** - Efficient session management
- **Connection Pooling** - Optimized MongoDB connections

## 🐛 Troubleshooting

### Common Issues

**Image Upload Fails:**
- Check file size (<10MB)
- Verify image format (JPG, PNG, GIF, WebP)
- Ensure uploads directory exists

**Authentication Issues:**
- Verify Google OAuth credentials
- Check session configuration
- Ensure MongoDB is running

**AI Responses Fail:**
- Verify Groq API key
- Check API rate limits
- Ensure internet connection

### Debug Mode
```bash
# Backend debug
cd Server
DEBUG=* npm start

# Frontend debug
cd my-app
REACT_APP_DEBUG=true npm start
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Groq** - For fast AI inference
- **React Team** - For the amazing framework
- **MongoDB** - For the database
- **Express.js** - For the backend framework

## 📞 Support

For support and questions:
- Create an issue on GitHub
- Check the troubleshooting section
- Review the documentation

---

**Made with ❤️ by [Djawed-Lebaili]**

*IntelliChat - Where AI meets conversation* 
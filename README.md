# Chatify: Real-Time Chat Application

A modern real-time chat application built with the MERN stack (MongoDB, Express.js, React.js, Node.js) that enables users to communicate in real-time with a sleek and responsive interface.

👉 [Click to watch demo video](https://drive.google.com/file/d/1gnNAFdMHhnlC1Wk2etaC6YKhONTNyrFC/view?usp=sharing)

## 🌟 Features

- Real-time messaging using Socket.io
- User authentication & authorization with JWT
- Online/offline user status
- Responsive UI with Tailwind CSS and Daisy UI
- Message notifications
- User search functionality
- Emoji support
- Clean and modern UI/UX
- Global state management with Zustand
- Error handling (both client and server-side)
- Message timestamps
- Sound notifications for new messages

## 🛠️ Tech Stack

### Frontend
- React.js
- Tailwind CSS
- Daisy UI
- Socket.io-client
- Zustand for state management
- Vite as build tool

### Backend
- Node.js
- Express.js
- MongoDB
- Socket.io
- JWT for authentication
- Bcrypt for password hashing

## 🚀 Getting Started

### Prerequisites
- Node.js (version 14 or higher)
- MongoDB installed locally or MongoDB Atlas account
- Git

### Installation

1. Clone the repository
```bash
git clone https://github.com/Kushagra888/Chatify.git
cd Chatify
```

2. Install dependencies for backend
```bash
cd backend
npm install
```

3. Install dependencies for frontend
```bash
cd ../frontend
npm install
```

4. Set up environment variables
Create a `.env` file in the backend directory:
```env
PORT=5000
MONGO_DB_URI=mongodb://localhost:27017/chatify
JWT_SECRET=your_jwt_secret_key
NODE_ENV=development
```

### Running the Application

1. Start the backend server
```bash
cd backend
npm run dev
```

2. Start the frontend development server
```bash
cd frontend
npm run dev
```

The application should now be running on:
- Frontend: http://localhost:5173
- Backend: http://localhost:5000

## 🏗️ Build for Production

### Backend
```bash
cd backend
npm run build
```

### Frontend
```bash
cd frontend
npm run build
```

## 📝 Project Structure

```
Chatify/
├── backend/           # Backend server code
│   ├── controllers/   # Request handlers
│   ├── models/       # Database models
│   ├── routes/       # API routes
│   ├── socket/       # Socket.io configuration
│   └── utils/        # Utility functions
└── frontend/         # Frontend React application
    ├── src/
    │   ├── components/  # React components
    │   ├── context/     # React context
    │   ├── hooks/       # Custom hooks
    │   ├── pages/       # Page components
    │   └── utils/       # Utility functions
    └── public/          # Static assets
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👤 Author

**Kushagra888**

* GitHub: [@Kushagra888](https://github.com/Kushagra888)

## 🌟 Show your support

Give a ⭐️ if this project helped you!

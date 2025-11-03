# Blog Web Application (Assignment given by Aariya Tech)

## Deployed at Vercel

 [https://blog-web-application-inky.vercel.app/](https://blog-web-application-inky.vercel.app/)

## Clone Repository

```bash
git clone https://github.com/rishabh0078/blog-web-application.git
```

## Setup Instructions

1. **Navigate to the project directory:**
   ```bash
   cd blog-web-application
   ```

2. **Install dependencies for both frontend and backend:**
   ```bash
   # Install backend dependencies
   cd backend
   npm install

   # Install frontend dependencies
   cd ../frontend
   npm install
   ```

3. **Set up environment variables:**
   - Create a `.env` file in the `backend` directory
   - Add required environment variables (MongoDB URI, JWT secret, Cloudinary credentials, etc.)

4. **Run the application:**
   ```bash
   # Start backend server (from backend directory)
   npm start

   # Start frontend development server (from frontend directory)
   npm start
   ```

## Tech Stack

- **Frontend:** React.js, Tailwind CSS
- **Backend:** Express.js
- **Database:** MongoDB
- **Authentication:** JWT (JSON Web Tokens)
- **Cloudinary:** For image storage

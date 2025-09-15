# 🎬 CineReview – Backend API

**Theme:** *Discover Cinema*  
The backend API powers CineReview with secure movie data management, user authentication, reviews, and watchlist functionality.  

---

## 🌐 Deployment

- **Backend API Base URL**:
- https://moive-review-platform-backend-3.onrender.com/api

## 📡 API Endpoints

### 🎥 Movies
- `GET /movies` – Retrieve all movies (with pagination & filtering)  
- `GET /movies/:id` – Retrieve a specific movie with reviews  
- `POST /movies` – Add a new movie (**Admin only**)  

### ⭐ Reviews
- `GET /movies/:id/reviews` – Retrieve reviews for a specific movie  
- `POST /movies/:id/reviews` – Submit a new review  

### 👤 Users
- `GET /users/:id` – Retrieve user profile & review history  
- `PUT /users/:id` – Update user profile  

### 🎬 Watchlist
- `GET /users/:id/watchlist` – Retrieve user's watchlist  
- `POST /users/:id/watchlist` – Add movie to watchlist  
- `DELETE /users/:id/watchlist/:movieId` – Remove movie from watchlist  

---

## 🔐 Authentication

- **User Registration & Login**  
- **JWT-based authentication**  
- **Role-based access** (User / Admin)  

---

## 🛠️ Tech Stack

- Node.js + Express  
- MongoDB / SQL (choose based on setup)  
- JWT for authentication  
- Bcrypt for password hashing  

---

## ⚙️ Installation & Setup

### 1. Clone the Repository

git clone https://github.com/loki-0405/Moive_Review_Platform_Backend.git
cd Moive_Review_Platform_Backend

### 2. Install Dependencies

npm install

### 3. Configure Environment Variables

Create a .env file in the backend folder:
PORT=5000
DATABASE_URL=your_database_url
JWT_SECRET=your_jwt_secret

### 4. Run the Server
npm start
The backend will run at http://localhost:5000/.

📽️ Future Enhancements
Role-based admin dashboard for movie management

Enhanced validation & error messages

Rate-limiting & security improvements

Recommendation engine based on reviews & watch history

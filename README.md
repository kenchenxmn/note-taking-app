# Notable - Note-Taking App

A full-stack note-taking application built with **HTML, CSS, JavaScript (Frontend)** and **Node.js, Express.js, MongoDB (Backend)**.

## Features
- User authentication (JWT-based)
- Create, read, update, and delete notes
- Secure routes (users can only access their own notes)
- MongoDB Atlas for database storage
- Responsive UI using Bootstrap

---

## Setup Instructions

### **Clone the Repository**
```sh
git clone https://github.com/your-username/notable-app.git
cd notable-app
```

### **Backend Setup**
1. Navigate to the backend directory:
   ```sh
   cd backend
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Create a `.env` file in the `backend/` folder and add:
   ```sh
   MONGO_URI=mongodb+srv://your_username:your_password@cluster0.mongodb.net/notesDB?retryWrites=true&w=majority
   JWT_SECRET=your_secret_key
   PORT=1229
   ```
4. Start the backend server:
   ```sh
   npm run dev
   ```
   Server should run on `http://localhost:1229`

---

## API Documentation

### **User Authentication**

#### Register a New User
**Endpoint:** `POST /api/users/register`
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "123456"
}
```
**Response:**
```json
{
  "message": "User registered successfully"
}
```

#### Log In
**Endpoint:** `POST /api/users/login`
```json
{
  "email": "john@example.com",
  "password": "123456"
}
```
**Response:**
```json
{
  "token": "YOUR_JWT_TOKEN"
}
```

---

### **Notes Management** (Authenticated Routes)

#### Get All Notes
**Endpoint:** `GET /api/notes`
- **Headers:** `{ Authorization: 'Bearer YOUR_JWT_TOKEN' }`
**Response:**
```json
[
  {
    "_id": "NOTE_ID",
    "user": "USER_ID",
    "title": "My First Note",
    "content": "This is my first note.",
    "createdAt": "2024-02-08T12:00:00.000Z"
  }
]
```

#### Create a New Note
**Endpoint:** `POST /api/notes`
- **Headers:** `{ Authorization: 'Bearer YOUR_JWT_TOKEN' }`
```json
{
  "title": "New Note",
  "content": "This is the content."
}
```
**Response:**
```json
{
  "_id": "NOTE_ID",
  "user": "USER_ID",
  "title": "New Note",
  "content": "This is the content.",
  "createdAt": "2024-02-08T12:00:00.000Z"
}
```

#### Update a Note
**Endpoint:** `PUT /api/notes/:id`
- **Headers:** `{ Authorization: 'Bearer YOUR_JWT_TOKEN' }`
```json
{
  "title": "Updated Title",
  "content": "Updated content."
}
```
**Response:**
```json
{
  "_id": "NOTE_ID",
  "title": "Updated Title",
  "content": "Updated content."
}
```

#### Delete a Note
**Endpoint:** `DELETE /api/notes/:id`
- **Headers:** `{ Authorization: 'Bearer YOUR_JWT_TOKEN' }`
**Response:**
```json
{
  "message": "Note deleted successfully"
}
```

---

## Contributing
Contributions are welcome! Feel free to submit issues or pull requests.

---

## Tech Stack
- **Backend:** Node.js, Express.js, MongoDB, Mongoose
- **Frontend:** HTML, CSS, JavaScript, Bootstrap
- **Authentication:** JWT, bcrypt.js
- **Dev Tools:** Postman, Nodemon
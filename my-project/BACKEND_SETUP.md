# Backend Setup Guide

Your frontend is now fully functional and ready to integrate with a backend API running on `http://127.0.0.1:8000`.

## Required Endpoints

### 1. **Login Endpoint**
```
POST /login
Content-Type: application/json

Request Body:
{
  "email": "user@example.com",
  "password": "password123"
}

Response (200 OK):
{
  "access_token": "your_token_here",
  "refresh_token": "refresh_token_here",
  "token_type": "bearer"
}
```

### 2. **Signup Endpoint**
```
POST /signup
Content-Type: application/json

Request Body:
{
  "email": "user@example.com",
  "password": "password123"
}

Response (200 OK):
{
  "message": "User created successfully",
  "user_id": "123"
}
```

### 3. **Chat Endpoint** (Main AI Chat)
```
POST /chat
Content-Type: application/json
Authorization: Bearer {access_token}

Request Body:
{
  "message": "Hello, how are you?"
}

Response (200 OK):
{
  "response": "I'm doing great! How can I help you today?"
}
```

## Example Backend (Python/FastAPI)

Create a `main.py` file:

```python
from fastapi import FastAPI, HTTPException, Header
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import secrets

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:5174", "http://localhost:5175"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mock database
users = {}
tokens = {}

class LoginRequest(BaseModel):
    email: str
    password: str

class ChatRequest(BaseModel):
    message: str

@app.post("/login")
async def login(request: LoginRequest):
    # Check if user exists (mock)
    if request.email not in users:
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    if users[request.email]["password"] != request.password:
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    # Generate tokens
    access_token = secrets.token_urlsafe(32)
    refresh_token = secrets.token_urlsafe(32)
    tokens[access_token] = request.email
    
    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer"
    }

@app.post("/signup")
async def signup(request: LoginRequest):
    if request.email in users:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    users[request.email] = {"password": request.password}
    
    return {"message": "User created successfully"}

@app.post("/chat")
async def chat(request: ChatRequest, authorization: str = Header(None)):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Unauthorized")
    
    token = authorization.split(" ")[1]
    if token not in tokens:
        raise HTTPException(status_code=401, detail="Invalid token")
    
    # Here you would integrate with an actual AI API (OpenAI, etc.)
    # For now, just echo back the message
    user_email = tokens[token]
    
    response = f"[{user_email}] Received: {request.message}"
    
    return {"response": response}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
```

## Installation

1. **Install FastAPI and Uvicorn:**
```bash
pip install fastapi uvicorn python-multipart
```

2. **Run the backend:**
```bash
python main.py
```

The server will start at `http://127.0.0.1:8000`

## Test with Frontend

1. Make sure your backend is running on `http://127.0.0.1:8000`
2. Visit your frontend: `http://localhost:5175`
3. Sign up with a test account
4. Login
5. Start chatting!

## Features Implemented in Frontend

✅ **Authentication System**
- Login page with email/password
- Signup page with validation
- Token storage in localStorage
- Automatic redirect after successful login

✅ **AI Chat Interface**
- Welcome screen with suggestion cards
- Real-time message history
- Message auto-scroll
- Loading states
- User and AI message avatars
- Clean, modern UI

✅ **Chat Features**
- Send/receive messages
- Message persistence (localStorage)
- Conversation history
- Auto-title conversations based on first message
- Delete conversations (via Sidebar)
- Multiple simultaneous conversations

## Next Steps

1. Replace the mock chat endpoint with real AI (OpenAI API, etc.)
2. Add proper database instead of in-memory storage
3. Add password hashing (bcrypt)
4. Add email verification
5. Add refresh token logic
6. Add user profiles and settings

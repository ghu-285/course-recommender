from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from api.parser import TranscriptParser
from api.mongo_user import insert_user, find_user_by_email, update_user
from passlib.context import CryptContext

# Initialize password hashing context
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Update this with your frontend URL in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Welcome to the Course Recommender API!"}

@app.post("/parse-transcript")
async def parse_transcript(file: UploadFile = File(...)):
    if not file.filename.endswith('.pdf'):
        raise HTTPException(status_code=400, detail="Only PDF files are allowed")
    
    try:
        content = await file.read()
        parser = TranscriptParser(content)
        response = {
            "name": parser.get_name(),
            "startQuarter": parser.get_start_quarter(),
            "student_id": parser.get_student_id(),
            "gpa": parser.get_gpa(),
            "courses": parser.get_courses_descriptive(),
            "credits": parser.get_cumulative_credits()
        }
        
        return response
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@app.post("/login")
async def login(data: dict):
    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        raise HTTPException(status_code=400, detail="Email and password are required")

    # Find the user in MongoDB
    user = find_user_by_email(email)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid email or password")

    # Verify password
    if not pwd_context.verify(password, user.get("password")):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    # Convert MongoDB ObjectId to string for JSON serialization
    user["_id"] = str(user["_id"])

    # Remove sensitive information
    user.pop("password", None)

    return {"message": "Login successful", "user": user}


@app.post("/signup")
async def signup(user_data: dict):
    email = user_data.get("email")
    plain_password = user_data.get("password")

    if not email or not plain_password:
        raise HTTPException(status_code=400, detail="Email and password are required")

    try:
        existing_user = find_user_by_email(email)
        if existing_user:
            raise HTTPException(status_code=400, detail="Email is already registered")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

    # Hash the password
    hashed_password = pwd_context.hash(plain_password)
    user_data["password"] = hashed_password

    try:
        user_id = insert_user(user_data)
        return {"message": "Account created successfully", "user_id": str(user_id)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create user: {str(e)}")

    
@app.post("/api/updateUser")
async def update_user_endpoint(user_data: dict):
    """
    Endpoint for updating user information.
    """
    try:
        email = user_data.get("email")
        if not email:
            raise HTTPException(status_code=400, detail="Email is required")

        updated_user = update_user(email, user_data)  # Use your existing `update_user` function
        if not updated_user:
            raise HTTPException(status_code=404, detail="User not found")

        # Convert ObjectId to string if needed
        if "_id" in updated_user:
            updated_user["_id"] = str(updated_user["_id"])

        return {"message": "User updated successfully", "updated_user": updated_user}
    except Exception as e:
        print(f"Error updating user: {e}")
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {str(e)}")
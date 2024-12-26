from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from api.parser import TranscriptParser

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Update this with your frontend URL in production
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

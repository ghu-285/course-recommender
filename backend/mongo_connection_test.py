from pymongo import MongoClient
import os
from dotenv import load_dotenv

load_dotenv()
uri= os.getenv('MONGO_URI')


try:
    client = MongoClient(uri)
    client.admin.command("ping")  # Test connection
    print("Authentication successful!")
except Exception as e:
    print(f"Authentication failed: {e}")

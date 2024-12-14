from fastapi import FastAPI, File, UploadFile, Query
import os
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins, you can restrict this for production
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
)



@app.post("/upload-log/")
async def upload_log(
    file: UploadFile = File(...),
    severity: str = Query(None, title="Severity Level", description="Filter by severity level"),
    search: str = Query(None, title="Search Keyword", description="Search for logs containing a keyword")
):
    content = await file.read()
    logs = content.decode("utf-8").split("\n")
    parsed_logs = []

    for line in logs:
        if line.strip():
            parts = line.split(" ")
            if len(parts) >= 4:  # Ensure the line is valid
                # Fix for timestamp extraction
                timestamp = parts[1][:-1] # Assuming timestamp is in the first two parts
                log = {
                    "timestamp": timestamp,
                    "severity": parts[2].strip(),  # Ensure severity is trimmed
                    "node": parts[3].strip(),      # Ensure node is trimmed
                    "message": " ".join(parts[4:]).strip()  # Ensure message is trimmed
                }

                # Debugging: Print out severity and user input
                print(f"Log severity: '{log['severity']}', Filter severity: '{severity}'")

                # Filter by severity if specified
                if severity:
                    if log["severity"].upper() != severity.upper():
                        continue

                # Filter by keyword if specified
                if search and search.lower() not in log["message"].lower():
                    continue

                parsed_logs.append(log)

    return {"logs": parsed_logs}



@app.get("/")
def root():
    return {"message": "Welcome to the ROS Log Viewer backend!"}

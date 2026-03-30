from fastapi import FastAPI, UploadFile, File, Form
from api.base_router import router
from fastapi.responses import RedirectResponse
from fastapi.middleware.cors import CORSMiddleware
from db.base import Base
from db.session import engine

Base.metadata.create_all(bind=engine)
# //cors

app = FastAPI()

origins = [
    "http://localhost:3000",  # React frontend
    "http://127.0.0.1:5500",
    "http://127.0.0.1:3000",
    # Add your frontend domains here
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,        # Allowed origins
    allow_credentials=True,
    allow_methods=["*"],          # Allow all HTTP methods
    allow_headers=["*"],          # Allow all headers
)

@app.get("/", tags=["Base URL"], description="Redirects to docs on \/")
def redirect_to_docs():
    # Redirects with a default status code of 307 (Temporary Redirect)
    return RedirectResponse(url="/docs")

app.include_router(prefix='/api/v1', router = router)
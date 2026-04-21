from fastapi import FastAPI, UploadFile, File, Form
from api.base_router import router
from fastapi.responses import RedirectResponse
from fastapi.middleware.cors import CORSMiddleware
from db.base import Base
from db.session import engine

Base.metadata.create_all(bind=engine)

app = FastAPI()

# ✅ CORS Configuration
origins = [
    "http://localhost:3000",  # Next.js frontend
    "http://127.0.0.1:3000", 
    "http://192.168.1.19:3000",  # Network access
    "http://localhost:5500",     # VSCode Live Server
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/", tags=["Base"], description="Redirect to API docs")
def redirect_to_docs():
    """Redirects to interactive API documentation."""
    return RedirectResponse(url="/docs")

# ✅ Router inclusion (both syntaxes work, using clean one)
app.include_router(router, prefix="/api/v1")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

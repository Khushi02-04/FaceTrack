from fastapi import FastAPI
from api.base_router import router
from fastapi.responses import RedirectResponse
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# ✅ CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Next.js frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/", tags=["Base URL"], description="Redirects to docs on /")
def redirect_to_docs():
    return RedirectResponse(url="/docs")

# ✅ Include router correctly
app.include_router(router, prefix="/api/v1")
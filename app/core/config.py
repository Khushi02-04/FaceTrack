from typing import Any, Optional
import os
# from dotenv import load_dotenv

# Load variables from .env file
# load_dotenv()


class Settings():
    APP_NAME:str = "CRMKitty Backend"
    APP_VERSION:str = "V.0.0.1"
    SQLALCHEMY_DATABASE_URL:str = "sqlite:///./test.db"
    APP_DESCRIPTION:str = '''
                            This is CRMKitty API backend, Running with FastAPIs and uvicorn, Sqlite
                            '''
    class Config:
        env_file:str = ".env"

    SET_MAIN_OPTION:str = "sqlalchemy.url"
    # ALGORITHM:str = os.getenv("ALGORITHM", "HS256")
    # SECRET_KEY:str = os.getenv("SECRET_KEY", "iqf7ti7456jkiosnjb8478")
    # ACCESS_TOKEN_EXPIRE_MIN:int = int(os.getenv("ACCESS_TOKEN_TIME", "30"))
    # REFRESH_TOKEN_TIME:int = int(os.getenv("REFRESH_TOKEN_TIME")) or 30*60

settings = Settings()
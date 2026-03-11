from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from core.config import settings
from typing import Generator


engine = create_engine(settings.SQLALCHEMY_DATABASE_URL, connect_args={
   "check_same_thread":False
})


SESSIONLOCAL= sessionmaker(autoflush=False, autocommit = False, bind= engine)

def get_db()->Generator:
    try:
        db = SESSIONLOCAL()
        yield db
    finally:
        db.close()
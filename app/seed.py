from db.session import SESSIONLOCAL
from db.seed.seed_data import ERPSeeder

db = SESSIONLOCAL()

ERPSeeder(db).seed()

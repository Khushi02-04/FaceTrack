from sqlalchemy.orm import Session
from db.models.tenant import Tenant


class TenantRepository:

    @staticmethod
    def create(db: Session, tenant_data: dict):
        tenant = Tenant(**tenant_data)
        db.add(tenant)
        db.commit()
        db.refresh(tenant)
        return tenant

    @staticmethod
    def get_by_id(db: Session, tenant_id: int):
        return db.query(Tenant).filter(Tenant.id == tenant_id).first()

    @staticmethod
    def get_all(db: Session):
        return db.query(Tenant).all()

    @staticmethod
    def update(db: Session, tenant, update_data: dict):
        for key, value in update_data.items():
            setattr(tenant, key, value)

        db.commit()
        db.refresh(tenant)
        return tenant

    @staticmethod
    def delete(db: Session, tenant):
        db.delete(tenant)
        db.commit()

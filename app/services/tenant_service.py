from sqlalchemy.orm import Session
from fastapi import HTTPException
from db.repository.tenant_repository import TenantRepository


class TenantService:

    @staticmethod
    def create_tenant(db: Session, data):
        return TenantRepository.create(db, data.dict())

    @staticmethod
    def get_tenant(db: Session, tenant_id: int):
        tenant = TenantRepository.get_by_id(db, tenant_id)

        if not tenant:
            raise HTTPException(status_code=404, detail="Tenant not found")

        return tenant

    @staticmethod
    def get_all_tenants(db: Session):
        return TenantRepository.get_all(db)

    @staticmethod
    def update_tenant(db: Session, tenant_id: int, data):
        tenant = TenantRepository.get_by_id(db, tenant_id)

        if not tenant:
            raise HTTPException(status_code=404, detail="Tenant not found")

        return TenantRepository.update(db, tenant, data.dict(exclude_unset=True))

    @staticmethod
    def delete_tenant(db: Session, tenant_id: int):
        tenant = TenantRepository.get_by_id(db, tenant_id)

        if not tenant:
            raise HTTPException(status_code=404, detail="Tenant not found")

        TenantRepository.delete(db, tenant)
        return {"message": "Tenant deleted"}

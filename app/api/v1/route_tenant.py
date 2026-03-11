from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from db.session import get_db
from services.tenant_service import TenantService
from db.schemas.tenant import TenantCreate, TenantUpdate, TenantResponse
from typing import List

router = APIRouter()


@router.post("/", response_model=TenantResponse)
def create_tenant(
    tenant: TenantCreate,
    db: Session = Depends(get_db)
):
    return TenantService.create_tenant(db, tenant)


@router.get("/{tenant_id}", response_model=TenantResponse)
def get_tenant(
    tenant_id: int,
    db: Session = Depends(get_db)
):
    return TenantService.get_tenant(db, tenant_id)


@router.get("/", response_model=List[TenantResponse])
def get_all_tenants(db: Session = Depends(get_db)):
    return TenantService.get_all_tenants(db)


@router.put("/{tenant_id}", response_model=TenantResponse)
def update_tenant(
    tenant_id: int,
    tenant: TenantUpdate,
    db: Session = Depends(get_db)
):
    return TenantService.update_tenant(db, tenant_id, tenant)


@router.delete("/{tenant_id}")
def delete_tenant(
    tenant_id: int,
    db: Session = Depends(get_db)
):
    return TenantService.delete_tenant(db, tenant_id)

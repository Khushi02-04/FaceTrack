export interface MenuItem {
  id: string;
  label: string;
  icon: string;
  path?: string;
  children?: MenuItem[];
  badge?: number;
  description?: string;
}

export interface Breadcrumb {
  label: string;
  path: string;
}

export interface Tenant {
  id: string;
  name: string;
  logo?: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginationParams {
  page: number;
  limit: number;
  search?: string;
  sort?: string;
  order?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

export interface Student {
  id: string;
  rollNumber: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: 'Male' | 'Female' | 'Other';
  address: string;
  city: string;
  state: string;
  postalCode: string;
  department: string;
  yearOfStudy: string;
  semester: number;
  admissionDate: string;
  fatherName: string;
  motherName: string;
  parentPhone: string;
  bloodGroup: string;
  nationality: string;
  profileImage?: string;
  status: 'Active' | 'Inactive' | 'Suspended';
  createdAt: string;
  updatedAt: string;
}

export interface StudentFilters {
  department?: string;
  semester?: number;
  status?: 'Active' | 'Inactive' | 'Suspended';
  search?: string;
}

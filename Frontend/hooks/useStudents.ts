'use client'

import { useState, useCallback } from 'react'
import type { Student, StudentFilters, PaginatedResponse } from '@/types/common'

// Mock data
const mockStudents: Student[] = [
  {
    id: '1',
    rollNumber: 'CS001',
    firstName: 'Aarav',
    lastName: 'Kumar',
    email: 'aarav.kumar@college.edu',
    phone: '+91-9876543210',
    dateOfBirth: '2004-03-15',
    gender: 'Male',
    address: '123 Main Street',
    city: 'Delhi',
    state: 'Delhi',
    postalCode: '110001',
    department: 'Computer Science',
    semester: 4,
    admissionDate: '2022-07-20',
    fatherName: 'Rajesh Kumar',
    motherName: 'Priya Kumar',
    parentPhone: '+91-9876543200',
    bloodGroup: 'O+',
    nationality: 'Indian',
    status: 'Active',
    createdAt: new Date('2022-07-20').toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    rollNumber: 'CS002',
    firstName: 'Priya',
    lastName: 'Singh',
    email: 'priya.singh@college.edu',
    phone: '+91-8765432109',
    dateOfBirth: '2004-05-20',
    gender: 'Female',
    address: '456 Oak Avenue',
    city: 'Mumbai',
    state: 'Maharashtra',
    postalCode: '400001',
    department: 'Computer Science',
    semester: 4,
    admissionDate: '2022-07-20',
    fatherName: 'Vikram Singh',
    motherName: 'Anjali Singh',
    parentPhone: '+91-8765432100',
    bloodGroup: 'A+',
    nationality: 'Indian',
    status: 'Active',
    createdAt: new Date('2022-07-20').toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '3',
    rollNumber: 'CS003',
    firstName: 'Rohan',
    lastName: 'Patel',
    email: 'rohan.patel@college.edu',
    phone: '+91-7654321098',
    dateOfBirth: '2004-08-10',
    gender: 'Male',
    address: '789 Pine Road',
    city: 'Bangalore',
    state: 'Karnataka',
    postalCode: '560001',
    department: 'Computer Science',
    semester: 4,
    admissionDate: '2022-07-20',
    fatherName: 'Harish Patel',
    motherName: 'Neha Patel',
    parentPhone: '+91-7654321000',
    bloodGroup: 'B+',
    nationality: 'Indian',
    status: 'Active',
    createdAt: new Date('2022-07-20').toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '4',
    rollNumber: 'EC001',
    firstName: 'Divya',
    lastName: 'Sharma',
    email: 'divya.sharma@college.edu',
    phone: '+91-6543210987',
    dateOfBirth: '2004-11-05',
    gender: 'Female',
    address: '321 Elm Street',
    city: 'Pune',
    state: 'Maharashtra',
    postalCode: '411001',
    department: 'Electronics',
    semester: 3,
    admissionDate: '2022-07-20',
    fatherName: 'Amit Sharma',
    motherName: 'Meera Sharma',
    parentPhone: '+91-6543210900',
    bloodGroup: 'O+',
    nationality: 'Indian',
    status: 'Active',
    createdAt: new Date('2022-07-20').toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '5',
    rollNumber: 'ME001',
    firstName: 'Arjun',
    lastName: 'Reddy',
    email: 'arjun.reddy@college.edu',
    phone: '+91-5432109876',
    dateOfBirth: '2003-02-14',
    gender: 'Male',
    address: '654 Maple Drive',
    city: 'Hyderabad',
    state: 'Telangana',
    postalCode: '500001',
    department: 'Mechanical',
    semester: 6,
    admissionDate: '2021-07-20',
    fatherName: 'Krishna Reddy',
    motherName: 'Lakshmi Reddy',
    parentPhone: '+91-5432109800',
    bloodGroup: 'AB+',
    nationality: 'Indian',
    status: 'Inactive',
    createdAt: new Date('2021-07-20').toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

export function useStudents(initialFilters?: StudentFilters) {
  const [students, setStudents] = useState<Student[]>(mockStudents)
  const [isLoading, setIsLoading] = useState(false)
  const [filters, setFilters] = useState<StudentFilters>(initialFilters || {})
  const [page, setPage] = useState(1)
  const [limit] = useState(10)

  const filteredStudents = students.filter(student => {
    if (filters.department && student.department !== filters.department) return false
    if (filters.semester && student.semester !== filters.semester) return false
    if (filters.status && student.status !== filters.status) return false
    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      return (
        student.firstName.toLowerCase().includes(searchLower) ||
        student.lastName.toLowerCase().includes(searchLower) ||
        student.rollNumber.toLowerCase().includes(searchLower) ||
        student.email.toLowerCase().includes(searchLower)
      )
    }
    return true
  })

  const paginatedStudents = filteredStudents.slice(
    (page - 1) * limit,
    page * limit
  )

  const addStudent = useCallback(async (studentData: Omit<Student, 'id' | 'createdAt' | 'updatedAt'>) => {
    setIsLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 500))
      const newStudent: Student = {
        ...studentData,
        id: `student-${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      setStudents(prev => [...prev, newStudent])
      return newStudent
    } finally {
      setIsLoading(false)
    }
  }, [])

  const updateStudent = useCallback(async (id: string, updates: Partial<Student>) => {
    setIsLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 500))
      setStudents(prev =>
        prev.map(student =>
          student.id === id
            ? { ...student, ...updates, updatedAt: new Date().toISOString() }
            : student
        )
      )
    } finally {
      setIsLoading(false)
    }
  }, [])

  const deleteStudent = useCallback(async (id: string) => {
    setIsLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 500))
      setStudents(prev => prev.filter(student => student.id !== id))
    } finally {
      setIsLoading(false)
    }
  }, [])

  const searchStudents = useCallback((query: string) => {
    setFilters(prev => ({ ...prev, search: query }))
    setPage(1)
  }, [])

  const filterByDepartment = useCallback((department: string) => {
    setFilters(prev => ({ ...prev, department }))
    setPage(1)
  }, [])

  const filterBySemester = useCallback((semester: number) => {
    setFilters(prev => ({ ...prev, semester }))
    setPage(1)
  }, [])

  const filterByStatus = useCallback((status: 'Active' | 'Inactive' | 'Suspended') => {
    setFilters(prev => ({ ...prev, status }))
    setPage(1)
  }, [])

  const clearFilters = useCallback(() => {
    setFilters({})
    setPage(1)
  }, [])

  const totalPages = Math.ceil(filteredStudents.length / limit)

  return {
    students: paginatedStudents,
    allStudents: students,
    filteredStudents,
    isLoading,
    filters,
    page,
    limit,
    totalPages,
    totalCount: filteredStudents.length,
    addStudent,
    updateStudent,
    deleteStudent,
    searchStudents,
    filterByDepartment,
    filterBySemester,
    filterByStatus,
    clearFilters,
    setPage,
    setFilters,
  }
}

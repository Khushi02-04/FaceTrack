'use client'

import { useState, useCallback, useEffect } from "react";
import type { Student, StudentFilters } from "@/types/common";
import { apiClient } from "@/lib/api";

interface StudentApiResponse {
  id: number;
  name: string;
  email: string;
  mobile: string;
  father_name: string;
  mother_name: string;
  roll_no: string;
  class_id: number;
  tenant_id: number;
  is_face_registered: boolean;
  address_line: string | null;
  city: string;
  state: string;
  pincode: string;
  tenth_school: string;
  tenth_percentage: number;
  tenth_board: string;
  tenth_year: number;
  twelfth_school: string;
  twelfth_percentage: number;
  twelfth_board: string;
  twelfth_year: number;
  academic_records: any;
  father_mobile: string;
  mother_mobile: string;
  father_occupation: string;
  mother_occupation: string;
  guardian_name: string | null;
  guardian_mobile: string | null;
  guardian_relation: string | null;
  sibling_details: any;
  aadhaar_number: string;
  university_prn: string;
  documents: any[];
}

const mapApiStudentToStudent = (apiStudent: StudentApiResponse): Student => {
  const nameParts = apiStudent.name.split(" ");
  const firstName = nameParts[0] || "";
  const lastName = nameParts.slice(1).join(" ") || "";

  const admissionYear = (apiStudent.tenth_year || 2023) + 2;
  const admissionDate = `${admissionYear}-07-01`;

  const birthYear = (apiStudent.tenth_year || 2005) - 16;
  const dateOfBirth = `${birthYear}-01-01`;

  const departmentMap: Record<number, string> = {
    1: "Computer Science",
    2: "Electronics",
    3: "Mechanical",
    4: "Civil",
    5: "Information Technology"
  };

  const semesterMap: Record<number, number> = {
    1: 1,
    2: 3,
    3: 5,
    4: 2,
    5: 4
  };

  return {
    id: String(apiStudent.id),
    rollNumber: apiStudent.roll_no,
    firstName,
    lastName,
    email: apiStudent.email,
    phone: apiStudent.mobile,
    dateOfBirth,
    gender: "Male" as const,
    address: apiStudent.address_line || "",
    city: apiStudent.city || "",
    state: apiStudent.state || "",
    postalCode: apiStudent.pincode || "",
    department: departmentMap[apiStudent.class_id] || "Unknown",
    semester: semesterMap[apiStudent.class_id] || 1,
    admissionDate,
    fatherName: apiStudent.father_name || "",
    motherName: apiStudent.mother_name || "",
    parentPhone: apiStudent.father_mobile || "",
    bloodGroup: "O+",
    nationality: "Indian",
    status: apiStudent.is_face_registered ? "Active" : "Inactive",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
};

export function useStudents(initialFilters?: StudentFilters) {
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<StudentFilters>(initialFilters || {});
  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  const fetchStudents = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiClient.get<StudentApiResponse[]>("/students");
      if (response.success && response.data && Array.isArray(response.data)) {
        const studentData = response.data.map(mapApiStudentToStudent);
        setStudents(studentData);
      } else {
        setStudents([]);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch students";
      setError(errorMessage);
      console.error("Students fetch error:", err);
      setStudents([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  const filteredStudents = students.filter((student) => {
    if (filters.department && student.department !== filters.department) return false;
    if (filters.semester && Number(student.semester) !== filters.semester) return false;
    if (filters.status && student.status !== filters.status) return false;
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      return (
        student.firstName.toLowerCase().includes(searchLower) ||
        student.lastName.toLowerCase().includes(searchLower) ||
        student.rollNumber.toLowerCase().includes(searchLower) ||
        student.email.toLowerCase().includes(searchLower)
      );
    }
    return true;
  });

  const paginatedStudents = filteredStudents.slice((page - 1) * limit, page * limit);

  const addStudent = useCallback(async (studentData: Omit<Student, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const apiData = {
        name: `${studentData.firstName} ${studentData.lastName}`,
        email: studentData.email || '',
        mobile: studentData.phone || '',
        father_name: studentData.fatherName || '',
        mother_name: studentData.motherName || '',
        roll_no: studentData.rollNumber || '',
        class_id: 1,
        tenant_id: 1,
        address_line: studentData.address || '',
        city: studentData.city || '',
        state: studentData.state || '',
        pincode: studentData.postalCode || '',
        tenth_school: '',
        tenth_percentage: 0,
        tenth_board: '',
        tenth_year: new Date(studentData.admissionDate || Date.now()).getFullYear() - 2,
        twelfth_school: '',
        twelfth_percentage: 0,
        twelfth_board: '',
        twelfth_year: new Date(studentData.admissionDate || Date.now()).getFullYear(),
        father_mobile: studentData.parentPhone || '',
        mother_mobile: '',
        father_occupation: '',
        mother_occupation: '',
        aadhaar_number: '',
        university_prn: studentData.rollNumber || ''
      };

      const response = await apiClient.post<StudentApiResponse>("/students", apiData);
      if (response.success && response.data) {
        const newStudent = mapApiStudentToStudent(response.data);
        setStudents(prev => [...prev, newStudent]);
        return newStudent;
      } else {
        throw new Error(response.error || 'Failed to add student');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to add student";
      setError(errorMessage);
      console.error('Add student error:', err);
      throw err;
    }
  }, [setStudents]);

  const deleteStudent = useCallback(async (id: string) => {
    try {
      const response = await apiClient.delete(`/students/${id}`);
      if (response.success) {
        setStudents(prev => prev.filter(student => student.id !== id));
      } else {
        throw new Error(response.error || 'Failed to delete student');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to delete student";
      setError(errorMessage);
      console.error('Delete student error:', err);
      throw err;
    }
  }, [setStudents]);

  const totalPages = Math.ceil(filteredStudents.length / limit);

  return {
    students: paginatedStudents,
    allStudents: students,
    filteredStudents,
    isLoading,
    error,
    filters,
    page,
    limit,
    totalPages,
    totalCount: filteredStudents.length,
    addStudent,
    deleteStudent,
    setPage: useCallback((p: number) => setPage(p), []),
    setFilters,
    fetchStudents
  };
}

export type YearCode = 'FE' | 'SE' | 'TE' | 'BE'
export type DepartmentCode = 'CM' | 'IT' | 'MECH' | 'CIVIL'
export type FaceDataStatus = 'Uploaded' | 'Pending' | 'Not Uploaded'
export type StudentStatus = 'Active' | 'Inactive' | 'Suspended'
export type AttendanceStatus = 'Present' | 'Absent'

export type DemoStudent = {
  id: number
  rollNumber: string
  name: string
  className: string
  department: DepartmentCode
  year: YearCode
  contact: string
  email: string
  faceData: FaceDataStatus
  attendance: number
  status: StudentStatus
  addressLine1?: string
  city?: string
  state?: string
  pincode?: string
  fatherName?: string
  motherName?: string
  parentPhone?: string
}

export type DemoTeacher = {
  id: number
  name: string
  email: string
  phone: string
  departments: string
  subjects: string
  classes: string
  subjectList: string[]
  classList: string[]
  departmentList: DepartmentCode[]
  workload: string
  room: string
}

export type DemoAttendance = {
  studentId: number
  name: string
  rollNumber: string
  className: string
  faceData: 'Uploaded' | 'Pending'
  status: AttendanceStatus
  attendance: number
  markedAt: string
}

type CustomStudentInput = {
  name: string
  rollNumber: string
  className: string
  email: string
  mobile: string
  faceData?: FaceDataStatus
  addressLine1?: string
  city?: string
  state?: string
  pincode?: string
  fatherName?: string
  motherName?: string
  parentPhone?: string
}

type TeacherAssignment = {
  name: string
  email: string
  phone: string
  room: string
  assignments: Partial<Record<DepartmentCode, string[]>>
}

type TimetablePeriod = {
  subject: string
  time: string
  teacher: string
  room: string
}

type TimetableRow = {
  day: string
  periods: TimetablePeriod[]
}

type DashboardActivity = {
  title: string
  description: string
  time: string
  href: string
}

type DashboardAction = {
  title: string
  description: string
  href: string
}

type SubjectClassMap = {
  className: string
  department: DepartmentCode
  year: YearCode
  subjects: string[]
}

export const departments: DepartmentCode[] = ['CM', 'IT', 'MECH', 'CIVIL']
export const years: YearCode[] = ['FE', 'SE', 'TE', 'BE']

const studentNamesByYear: Record<YearCode, string[]> = {
  FE: ['Aarav Sharma', 'Vivaan Kulkarni', 'Aditya Joshi', 'Vihaan Verma', 'Arjun Pawar', 'Sai Yadav'],
  SE: ['Ananya Sharma', 'Diya Kulkarni', 'Saanvi Joshi', 'Aadhya Verma', 'Kavya Pawar', 'Riya Yadav'],
  TE: ['Isha Pandey', 'Tanvi Malhotra', 'Mira Bajaj', 'Shruti Goel', 'Aarti Shetty', 'Komal Pillai'],
  BE: ['Preeti Yadav', 'Jyoti Patel', 'Shreya Naik', 'Bhavna Thakur', 'Divya Tiwari', 'Tejas Pandey'],
}

export const subjectBuckets: Record<`${YearCode}-${DepartmentCode}`, string[]> = {
  'FE-CM': ['Engineering Mathematics', 'Physics', 'Chemistry', 'BEE', 'C Programming'],
  'SE-CM': ['Data Structures', 'Digital Logic', 'Computer Organization', 'Discrete Mathematics', 'Java'],
  'TE-CM': ['Operating Systems', 'Software Engineering', 'TOC', 'Computer Networks', 'Web Technology'],
  'BE-CM': ['AI', 'ML', 'Cloud Computing', 'Big Data', 'Cyber Security'],
  'FE-IT': ['Engineering Mathematics', 'Physics', 'Chemistry', 'BEE', 'C Programming'],
  'SE-IT': ['Data Structures', 'DBMS', 'Computer Networks', 'Discrete Mathematics', 'Java'],
  'TE-IT': ['Operating Systems', 'DWM', 'Software Engineering', 'Computer Networks', 'Web Development'],
  'BE-IT': ['AI', 'ML', 'Cloud Computing', 'Information Security', 'Big Data'],
  'FE-MECH': ['Engineering Mathematics', 'Physics', 'Chemistry', 'Engineering Mechanics', 'BEE'],
  'SE-MECH': ['Thermodynamics', 'Fluid Mechanics', 'Strength of Materials', 'Manufacturing', 'Mathematics II'],
  'TE-MECH': ['Machine Design', 'Heat Transfer', 'Dynamics of Machinery', 'CAD/CAM', 'Industrial Engineering'],
  'BE-MECH': ['Robotics', 'Automobile Engineering', 'Power Plant', 'RAC', 'Project'],
  'FE-CIVIL': ['Engineering Mathematics', 'Physics', 'Chemistry', 'Engineering Mechanics', 'BEE'],
  'SE-CIVIL': ['Structural Analysis', 'Fluid Mechanics', 'Geotechnical Engineering', 'Surveying', 'Mathematics II'],
  'TE-CIVIL': ['Structural Design', 'Environmental Engineering', 'Transportation Engineering', 'Construction Management', 'Hydrology'],
  'BE-CIVIL': ['Advanced Design', 'Earthquake Engineering', 'EIA', 'Planning', 'Project'],
}

const teacherAssignments: TeacherAssignment[] = [
  {
    name: 'Dr. Patil',
    email: 'patil@snjb.edu',
    phone: '9876500101',
    room: 'B-204',
    assignments: {
      CM: ['Engineering Mathematics', 'Data Structures', 'AI'],
      IT: ['Data Structures', 'ML'],
    },
  },
  {
    name: 'Prof. Sharma',
    email: 'sharma@snjb.edu',
    phone: '9876500102',
    room: 'B-207',
    assignments: {
      CM: ['Physics', 'Computer Networks', 'Cloud Computing'],
      IT: ['Computer Networks', 'Cloud Computing'],
      CIVIL: ['Project'],
    },
  },
  {
    name: 'Prof. Kulkarni',
    email: 'kulkarni@snjb.edu',
    phone: '9876500103',
    room: 'C-112',
    assignments: {
      CM: ['Chemistry', 'Discrete Mathematics'],
      IT: ['Discrete Mathematics', 'DBMS'],
      MECH: ['Dynamics of Machinery'],
      CIVIL: ['Environmental Engineering'],
    },
  },
  {
    name: 'Prof. Mehta',
    email: 'mehta@snjb.edu',
    phone: '9876500104',
    room: 'A-105',
    assignments: {
      CM: ['BEE'],
      IT: ['BEE'],
      MECH: ['BEE'],
      CIVIL: ['Planning'],
    },
  },
  {
    name: 'Prof. Shah',
    email: 'shah@snjb.edu',
    phone: '9876500105',
    room: 'Lab-3',
    assignments: {
      CM: ['C Programming', 'Java', 'Web Technology'],
      IT: ['Java', 'Web Development', 'Information Security'],
      MECH: ['Industrial Engineering'],
    },
  },
  {
    name: 'Prof. Desai',
    email: 'desai@snjb.edu',
    phone: '9876500106',
    room: 'M-309',
    assignments: {
      MECH: ['Engineering Mechanics', 'Manufacturing', 'CAD/CAM', 'Robotics'],
      CIVIL: ['Surveying'],
    },
  },
  {
    name: 'Prof. Joshi',
    email: 'joshi@snjb.edu',
    phone: '9876500107',
    room: 'C-314',
    assignments: {
      MECH: ['Machine Design', 'Heat Transfer', 'Automobile Engineering'],
      CIVIL: ['Structural Design', 'Advanced Design', 'Earthquake Engineering'],
    },
  },
]

const foundationTeacherMap: Partial<Record<string, string>> = {
  'ENGINEERING MATHEMATICS': 'Dr. Patil',
  PHYSICS: 'Prof. Sharma',
  CHEMISTRY: 'Prof. Kulkarni',
  BEE: 'Prof. Mehta',
  'C PROGRAMMING': 'Prof. Shah',
  'ENGINEERING MECHANICS': 'Prof. Desai',
  'MATHEMATICS II': 'Dr. Patil',
}

const departmentFallbackTeacherMap: Record<DepartmentCode, Partial<Record<string, string>>> = {
  CM: {
    'COMPUTER NETWORKS': 'Prof. Sharma',
    JAVA: 'Prof. Shah',
    AI: 'Dr. Patil',
  },
  IT: {
    DBMS: 'Prof. Kulkarni',
    'COMPUTER NETWORKS': 'Prof. Sharma',
    JAVA: 'Prof. Shah',
    ML: 'Dr. Patil',
  },
  MECH: {
    'MACHINE DESIGN': 'Prof. Joshi',
    'HEAT TRANSFER': 'Prof. Joshi',
    'CAD/CAM': 'Prof. Desai',
    ROBOTICS: 'Prof. Desai',
  },
  CIVIL: {
    'STRUCTURAL DESIGN': 'Prof. Joshi',
    'ENVIRONMENTAL ENGINEERING': 'Prof. Kulkarni',
    SURVEYING: 'Prof. Desai',
    PLANNING: 'Prof. Mehta',
    PROJECT: 'Prof. Sharma',
  },
}

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
const periodTimes = ['09:00 - 10:00', '10:00 - 11:00', '11:15 - 12:15', '13:00 - 14:00', '14:00 - 15:00']

const normalizeSubject = (subject: string) => subject.toUpperCase().replace(/\s+/g, ' ').trim()
const rollNumberFor = (department: DepartmentCode, year: YearCode, roll: number) =>
  `${department}${year}${String(roll).padStart(3, '0')}`
const studentClassLabel = (department: DepartmentCode, year: YearCode) => `${department} ${year}`

export function resolveTeacherForSubject(department: DepartmentCode, subject: string) {
  const normalized = normalizeSubject(subject)

  const exactTeacher = teacherAssignments.find((teacher) =>
    (teacher.assignments[department] || []).some((assignedSubject) => {
      const normalizedAssigned = normalizeSubject(assignedSubject)
      return (
        normalizedAssigned === normalized ||
        normalizedAssigned.includes(normalized) ||
        normalized.includes(normalizedAssigned)
      )
    })
  )

  if (exactTeacher) return exactTeacher.name

  const departmentFallback = departmentFallbackTeacherMap[department][normalized]
  if (departmentFallback) return departmentFallback

  const foundationFallback = foundationTeacherMap[normalized]
  if (foundationFallback) return foundationFallback

  return `${department} Faculty Pool`
}

const getTeacherClassList = (teacher: TeacherAssignment) =>
  departments.flatMap((department) =>
    years
      .filter((year) => {
        const subjects = subjectBuckets[`${year}-${department}`]
        return subjects.some((subject) => resolveTeacherForSubject(department, subject) === teacher.name)
      })
      .map((year) => `${department} ${year}`)
  )

export const demoTeachers: DemoTeacher[] = teacherAssignments.map((teacher, index) => {
  const departmentList = departments.filter((department) => teacher.assignments[department]?.length)
  const subjectList = departmentList.flatMap((department) => teacher.assignments[department] || [])
  const classList = getTeacherClassList(teacher)

  return {
    id: index + 1,
    name: teacher.name,
    email: teacher.email,
    phone: teacher.phone,
    departments: departmentList.join(', '),
    subjects: subjectList.join(', '),
    classes: classList.join(', '),
    subjectList,
    classList,
    departmentList,
    workload: `${subjectList.length} subjects`,
    room: teacher.room,
  }
})

export const allStudents: DemoStudent[] = departments.flatMap((department, departmentIndex) =>
  years.flatMap((year, yearIndex) =>
    studentNamesByYear[year].map((name, nameIndex) => {
      const sequence = departmentIndex * 24 + yearIndex * 6 + nameIndex + 1
      const roll = nameIndex + 1
      const status =
        sequence % 27 === 0 ? 'Suspended' : sequence % 5 === 0 ? 'Inactive' : 'Active'
      const faceData =
        sequence % 9 === 0 ? 'Not Uploaded' : sequence % 4 === 0 ? 'Pending' : 'Uploaded'

      return {
        id: sequence,
        rollNumber: rollNumberFor(department, year, roll),
        name,
        className: studentClassLabel(department, year),
        department,
        year,
        contact: String(9000000000 + sequence),
        email: `${name.toLowerCase().replace(/\s+/g, '.')}@student.snjb.edu`,
        faceData,
        attendance: 72 + (sequence % 24),
        status,
      }
    })
  )
)

const CUSTOM_STUDENTS_STORAGE_KEY = 'college-erp-custom-students'
const CUSTOM_STUDENTS_UPDATED_EVENT = 'college-erp-custom-students-updated'

const isDepartmentCode = (value: string): value is DepartmentCode =>
  departments.includes(value as DepartmentCode)

const isYearCode = (value: string): value is YearCode =>
  years.includes(value as YearCode)

const normalizeStudentIdentity = (className: string, rollNumber: string) => {
  const trimmedClass = className.toUpperCase().replace(/\s+/g, ' ').trim()
  const compactRoll = rollNumber.toUpperCase().replace(/\s+/g, '')

  const tokens = trimmedClass.split(' ').filter(Boolean)
  const classDepartment = tokens.find(isDepartmentCode)
  const classYear = tokens.find(isYearCode)

  const rollDepartment = departments.find((department) => compactRoll.startsWith(department))
  const rollYear = years.find((year) => compactRoll.includes(year))

  const department = classDepartment || rollDepartment || 'CM'
  const year = classYear || rollYear || 'FE'

  return {
    department,
    year,
    className: `${department} ${year}`,
    rollNumber: compactRoll || `${department}${year}001`,
  }
}

export const getCustomStudents = (): DemoStudent[] => {
  if (typeof window === 'undefined') {
    return []
  }

  try {
    const raw = window.localStorage.getItem(CUSTOM_STUDENTS_STORAGE_KEY)
    if (!raw) return []

    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

const setCustomStudents = (students: DemoStudent[]) => {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(CUSTOM_STUDENTS_STORAGE_KEY, JSON.stringify(students))
  window.dispatchEvent(new Event(CUSTOM_STUDENTS_UPDATED_EVENT))
}

export const subscribeToStudentChanges = (callback: () => void) => {
  if (typeof window === 'undefined') {
    return () => undefined
  }

  const handler = () => callback()
  window.addEventListener(CUSTOM_STUDENTS_UPDATED_EVENT, handler)
  window.addEventListener('storage', handler)

  return () => {
    window.removeEventListener(CUSTOM_STUDENTS_UPDATED_EVENT, handler)
    window.removeEventListener('storage', handler)
  }
}

export const getAllStudents = () => [...allStudents, ...getCustomStudents()]

export const getStudentStats = (students: DemoStudent[] = getAllStudents()) => ({
  total: students.length,
  active: students.filter((student) => student.status === 'Active').length,
  inactive: students.filter((student) => student.status === 'Inactive').length,
  suspended: students.filter((student) => student.status === 'Suspended').length,
  faceUploaded: students.filter((student) => student.faceData === 'Uploaded').length,
  facePending: students.filter((student) => student.faceData !== 'Uploaded').length,
})

export const addCustomStudent = (input: CustomStudentInput) => {
  const currentStudents = getCustomStudents()
  const nextId = Math.max(...getAllStudents().map((student) => student.id), 0) + 1
  const identity = normalizeStudentIdentity(input.className, input.rollNumber)

  const student: DemoStudent = {
    id: nextId,
    name: input.name.trim(),
    rollNumber: identity.rollNumber,
    className: identity.className,
    department: identity.department,
    year: identity.year,
    contact: input.mobile.trim(),
    email: input.email.trim(),
    faceData: input.faceData || 'Not Uploaded',
    attendance: 80,
    status: 'Active',
    addressLine1: input.addressLine1?.trim(),
    city: input.city?.trim(),
    state: input.state?.trim(),
    pincode: input.pincode?.trim(),
    fatherName: input.fatherName?.trim(),
    motherName: input.motherName?.trim(),
    parentPhone: input.parentPhone?.trim(),
  }

  setCustomStudents([...currentStudents, student])
  return student
}

export const deleteCustomStudent = (studentId: number) => {
  const currentStudents = getCustomStudents()
  const nextStudents = currentStudents.filter((student) => student.id !== studentId)
  setCustomStudents(nextStudents)
}

export const updateCustomStudentFaceData = (studentId: number, faceData: FaceDataStatus) => {
  const currentStudents = getCustomStudents()
  const nextStudents = currentStudents.map((student) =>
    student.id === studentId ? { ...student, faceData } : student
  )
  setCustomStudents(nextStudents)
}

export const demoStudents = getAllStudents()

export const studentStats = getStudentStats(allStudents)

export const teacherStats = {
  total: demoTeachers.length,
  subjectsCovered: new Set(demoTeachers.flatMap((teacher) => teacher.subjectList)).size,
  classesAssigned: new Set(demoTeachers.flatMap((teacher) => teacher.classList)).size,
}

export const attendanceDates = ['2026-04-21', '2026-04-20', '2026-04-19', '2026-04-18', '2026-04-17']

const formatAttendanceTime = (date: string, studentIndex: number, isPresent: boolean) => {
  if (!isPresent) return 'Not marked'

  const hour = 9 + (studentIndex % 5)
  const minute = studentIndex % 2 === 0 ? '08' : '43'
  const suffix = hour >= 12 ? 'pm' : 'am'
  const displayHour = hour > 12 ? hour - 12 : hour
  return `${date.split('-').reverse().join('/')}, ${displayHour}:${minute}:00 ${suffix}`
}

export const getAttendanceRecordsByDate = (date: string, students: DemoStudent[] = getAllStudents()): DemoAttendance[] => {
  const dateIndex = Math.max(0, attendanceDates.indexOf(date))

  return students.map((student, studentIndex) => {
    const isPresent = (studentIndex + dateIndex) % 11 !== 0

    return {
      studentId: student.id,
      name: student.name,
      rollNumber: student.rollNumber,
      className: student.className,
      faceData: student.faceData === 'Uploaded' ? 'Uploaded' : 'Pending',
      status: isPresent ? 'Present' : 'Absent',
      attendance: student.attendance,
      markedAt: formatAttendanceTime(date, studentIndex, isPresent),
    }
  })
}

export const getAttendanceStatsByDate = (date: string, students: DemoStudent[] = getAllStudents()) => {
  const records = getAttendanceRecordsByDate(date, students)
  const present = records.filter((record) => record.status === 'Present').length
  const absent = records.length - present

  return {
    date,
    present,
    absent,
    total: records.length,
  }
}

export const attendanceStats = getAttendanceStatsByDate(attendanceDates[0])
export const demoAttendance = getAttendanceRecordsByDate(attendanceDates[0])

export const getStudentsMissingFace = (students: DemoStudent[] = getAllStudents()) =>
  students.filter((student) => student.faceData !== 'Uploaded')

export const studentsMissingFace = getStudentsMissingFace(allStudents)
export const lowAttendanceStudents = [...allStudents]
  .sort((left, right) => left.attendance - right.attendance)
  .slice(0, 6)

export const subjectClassMap: SubjectClassMap[] = departments.flatMap((department) =>
  years.map((year) => ({
    className: `${department} ${year}`,
    department,
    year,
    subjects: subjectBuckets[`${year}-${department}`],
  }))
)

export const dashboardActivities: DashboardActivity[] = [
  {
    title: `${studentsMissingFace[0]?.name} needs face upload`,
    description: `Face data is still pending for ${studentsMissingFace[0]?.className}.`,
    time: '10 min ago',
    href: `/admin/students/${studentsMissingFace[0]?.id ?? ''}`,
  },
  {
    title: `${demoTeachers[0]?.name} timetable synced`,
    description: `${demoTeachers[0]?.classes.split(', ')[0]} lectures are available in the timetable module.`,
    time: '25 min ago',
    href: '/admin/timetable',
  },
  {
    title: 'Attendance sheet refreshed',
    description: `${attendanceStats.present} students are marked present for ${attendanceStats.date}.`,
    time: '40 min ago',
    href: '/admin/attendance',
  },
  {
    title: 'Academic subjects aligned',
    description: `${teacherStats.subjectsCovered} mapped subjects are visible in academics and timetable.`,
    time: '1 hr ago',
    href: '/admin/academics',
  },
]

export const dashboardActions: DashboardAction[] = [
  {
    title: 'Mark Attendance',
    description: 'Open daily attendance and review present or absent records.',
    href: '/admin/attendance',
  },
  {
    title: 'Face Recognition',
    description: 'Use the camera to recognize a student or review pending face uploads.',
    href: '/admin/attendance/face-recognition',
  },
  {
    title: 'Manage Students',
    description: 'Open the student roster with attendance and face data status.',
    href: '/admin/students',
  },
  {
    title: 'View Timetable',
    description: 'See subject and teacher allocation by class.',
    href: '/admin/timetable',
  },
]

export const getTeacherOptionsForSelection = (year: YearCode, department: DepartmentCode) => {
  const subjects = subjectBuckets[`${year}-${department}`]
  return ['All Teachers', ...new Set(subjects.map((subject) => resolveTeacherForSubject(department, subject)))]
}

export const getTimetableRows = (
  year: YearCode,
  department: DepartmentCode,
  teacherFilter: string = 'All Teachers'
): TimetableRow[] => {
  const subjects = subjectBuckets[`${year}-${department}`]

  return days.map((day, dayIndex) => ({
    day,
    periods: subjects.map((_, periodIndex) => {
      const subject = subjects[(periodIndex + dayIndex) % subjects.length]
      const teacher = resolveTeacherForSubject(department, subject)
      const shouldShow = teacherFilter === 'All Teachers' || teacher === teacherFilter

      return {
        subject: shouldShow ? subject : 'No Lecture',
        time: periodTimes[periodIndex],
        teacher: shouldShow ? teacher : teacherFilter,
        room: shouldShow ? `${department}-${year}-${dayIndex + 1}0${periodIndex + 1}` : '--',
      }
    }),
  }))
}

export const timetableRows = getTimetableRows('FE', 'CM')

export const analyticsSummary = [
  {
    title: 'Average Attendance',
    value: `${Math.round((attendanceStats.present / attendanceStats.total) * 100)}%`,
    description: `${attendanceStats.present} present today overall`,
    color: 'bg-emerald-50 border-emerald-100',
    accent: 'text-emerald-600',
  },
  {
    title: 'Student Health',
    value: `${Math.round((studentStats.active / studentStats.total) * 100)}%`,
    description: 'Active profile ratio in current roster',
    color: 'bg-sky-50 border-sky-100',
    accent: 'text-sky-600',
  },
  {
    title: 'Teaching Coverage',
    value: String(teacherStats.total),
    description: 'Teachers linked with class and subject mapping',
    color: 'bg-amber-50 border-amber-100',
    accent: 'text-amber-600',
  },
  {
    title: 'Face Upload Gap',
    value: String(studentStats.facePending),
    description: 'Students still missing final face data',
    color: 'bg-violet-50 border-violet-100',
    accent: 'text-violet-600',
  },
]

export const analyticsBars = years.map((year) => {
  const studentsForYear = allStudents.filter((student) => student.year === year)
  const averageAttendance =
    studentsForYear.reduce((total, student) => total + student.attendance, 0) / studentsForYear.length

  return {
    year,
    attendance: Math.round(averageAttendance),
  }
})

export const departmentMix = departments.map((department, index) => ({
  department,
  students: allStudents.filter((student) => student.department === department).length,
  fill: ['#2f5ee5', '#127b72', '#f45d01', '#6f3fe8'][index],
}))

export const reportSummary = [
  {
    title: 'Roster Reports',
    value: String(studentStats.total),
    description: 'Student records ready for export',
    color: 'bg-sky-50 border-sky-100',
  },
  {
    title: 'Attendance Reports',
    value: String(attendanceStats.present),
    description: 'Present records available for selected day',
    color: 'bg-emerald-50 border-emerald-100',
  },
  {
    title: 'Faculty Reports',
    value: String(teacherStats.total),
    description: 'Teachers linked with workload data',
    color: 'bg-amber-50 border-amber-100',
  },
  {
    title: 'Schedule Reports',
    value: String(timetableRows.length * timetableRows[0].periods.length * years.length * departments.length),
    description: 'Lecture rows available for timetable audit',
    color: 'bg-violet-50 border-violet-100',
  },
]

export const availableReports = [
  {
    title: 'Attendance Summary',
    badge: 'Ready',
    description: 'Daily attendance audit linked with recognition records',
    count: `${attendanceStats.present}/${attendanceStats.total}`,
  },
  {
    title: 'Student Master Register',
    badge: 'Updated',
    description: 'Roster export with year, department, attendance, and face upload flag',
    count: `${studentStats.total} students`,
  },
  {
    title: 'Faculty Workload Sheet',
    badge: 'Ready',
    description: 'Teacher-class-subject mapping aligned with timetable planning',
    count: `${teacherStats.total} faculty profiles`,
  },
]

export const getStudentById = (studentId: number) => getAllStudents().find((student) => student.id === studentId)
export const getStudentByRollNumber = (rollNumber: string) =>
  getAllStudents().find((student) => student.rollNumber === rollNumber)

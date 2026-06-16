
import supabase from './supabase'
import { generateLocalizedSlug } from './seo/slug'
import { DEFAULT_LOCALE } from './utils'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const STORAGE_KEYS = {
  UNIVERSITIES: 'kktc_universities',
  APPLICATION_INTAKES: 'kktc_application_intakes',
  PROGRAMS: 'kktc_programs',
  REQUIRED_DOCUMENTS: 'kktc_required_documents',
  PROGRAM_REQUIRED_DOCUMENTS: 'kktc_program_required_documents',
  NATIONALITY_REQUIREMENTS: 'kktc_nationality_requirements',
  SCHOLARSHIPS: 'kktc_scholarships',
  BLOG_POSTS: 'kktc_blog_posts',
  USERS: 'kktc_users',
  SETTINGS: 'kktc_settings',
  DRAFTS_BLOG: 'kktc_drafts_blog',
  DRAFTS_SCHOLARSHIPS: 'kktc_drafts_scholarships',
  DRAFTS_UNIVERSITIES: 'kktc_drafts_universities',
  AI_SKILLS: 'kktc_ai_skills',
}

// Check if we should use backend API, Supabase directly, or localStorage
const USE_API = !!import.meta.env.VITE_API_URL
const USE_SUPABASE = !!import.meta.env.VITE_USE_SUPABASE
const USE_LOCAL = !USE_API && !USE_SUPABASE

const initializeData = () => {
  if (!USE_LOCAL) return
  if (!localStorage.getItem(STORAGE_KEYS.UNIVERSITIES)) {
    const universities = [
      {
        id: '1',
        name: 'جامعة شرق البحر المتوسط',
        country: 'Cyprus',
        city: 'فاماغوستا',
        university_type: 'private',
        accreditation_status: 'accredited',
        logo_image: 'https://images.unsplash.com/photo-1562774053-701939374585?w=800&h=600&fit=crop',
        description: 'واحدة من أكبر وأعرق الجامعات، تقدم برامج دراسية متنوعة باللغة الإنجليزية',
        website_url: 'https://example.com',
        is_active: true,
      },
      {
        id: '2',
        name: 'جامعة دولية',
        country: 'Cyprus',
        city: 'نيقوسيا',
        university_type: 'private',
        accreditation_status: 'accredited',
        logo_image: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&h=600&fit=crop',
        description: 'جامعة حديثة تركز على التميز الأكاديمي والبحث العلمي',
        website_url: 'https://example.com',
        is_active: true,
      },
      {
        id: '3',
        name: 'جامعة الشرق الأدنى',
        country: 'Cyprus',
        city: 'نيقوسيا',
        university_type: 'private',
        accreditation_status: 'accredited',
        logo_image: 'https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?w=800&h=600&fit=crop',
        description: 'أكبر جامعة مع حرم جامعي حديث ومرافق متطورة',
        website_url: 'https://example.com',
        is_active: true,
      },
    ]
    localStorage.setItem(STORAGE_KEYS.UNIVERSITIES, JSON.stringify(universities))
  }

  if (!localStorage.getItem(STORAGE_KEYS.APPLICATION_INTAKES)) {
    const intakes = [
      {
        id: '1',
        university_id: '1',
        semester_name: 'fall',
        application_open_date: '2024-09-01',
        application_close_date: '2024-10-31',
        expected_admission_result_date: '2024-11-15',
        semester_start_date: '2025-01-15',
      },
      {
        id: '2',
        university_id: '1',
        semester_name: 'spring',
        application_open_date: '2025-01-01',
        application_close_date: '2025-02-28',
        expected_admission_result_date: '2025-03-15',
        semester_start_date: '2025-05-15',
      },
      {
        id: '3',
        university_id: '2',
        semester_name: 'fall',
        application_open_date: '2024-08-15',
        application_close_date: '2024-11-15',
        expected_admission_result_date: '2024-12-01',
        semester_start_date: '2025-02-01',
      },
    ]
    localStorage.setItem(STORAGE_KEYS.APPLICATION_INTAKES, JSON.stringify(intakes))
  }

  if (!localStorage.getItem(STORAGE_KEYS.PROGRAMS)) {
    const programs = [
      {
        id: '1',
        university_id: '1',
        program_name: 'إدارة الأعمال',
        degree_level: 'bachelor',
        study_language: 'english',
        duration_years: 4,
        tuition_fee_original: 8500,
        scholarship_type: 'none',
        min_gpa_percentage: 70,
        language_requirement: 'ielts_toefl',
        is_active: true,
        translations: {},
      },
      {
        id: '2',
        university_id: '1',
        program_name: 'هندسة الحاسوب',
        degree_level: 'bachelor',
        study_language: 'english',
        duration_years: 4,
        tuition_fee_original: 9500,
        scholarship_type: '50',
        min_gpa_percentage: 75,
        language_requirement: 'ielts_toefl',
        is_active: true,
        translations: {},
      },
      {
        id: '3',
        university_id: '2',
        program_name: 'علوم الحاسوب',
        degree_level: 'master',
        study_language: 'english',
        duration_years: 2,
        tuition_fee_original: 12000,
        scholarship_type: 'none',
        min_gpa_percentage: 80,
        language_requirement: 'ielts_toefl',
        is_active: true,
        translations: {},
      },
    ]
    localStorage.setItem(STORAGE_KEYS.PROGRAMS, JSON.stringify(programs))
  }

  if (!localStorage.getItem(STORAGE_KEYS.REQUIRED_DOCUMENTS)) {
    const requiredDocs = [
      // University 1 required docs
      { id: '1', university_id: '1', name: 'جواز سفر صالح', description: 'صلاحية لا تقل عن 6 أشهر' },
      { id: '2', university_id: '1', name: 'شهادة الثانوية العامة', description: 'مع كشف الدرجات' },
      { id: '3', university_id: '1', name: 'شهادة ميلاد', description: 'صورة موثقة' },
      { id: '4', university_id: '1', name: 'صور شخصية', description: 'خلفية بيضاء' },
      { id: '5', university_id: '1', name: 'سيرة ذاتية', description: 'CV' },
      // University 2 required docs
      { id: '6', university_id: '2', name: 'جواز سفر صالح', description: 'صلاحية لا تقل عن 12 أشهر' },
      { id: '7', university_id: '2', name: 'شهادة البكالوريوس', description: 'مع كشف الدرجات' },
      { id: '8', university_id: '2', name: 'خطابات توصية', description: 'اثنتان على الأقل' },
      { id: '9', university_id: '2', name: 'سجل جنائي', description: 'Police Clearance' },
      { id: '10', university_id: '2', name: 'شهادة لغة', description: 'IELTS أو TOEFL' },
    ]
    localStorage.setItem(STORAGE_KEYS.REQUIRED_DOCUMENTS, JSON.stringify(requiredDocs))
  }

  if (!localStorage.getItem(STORAGE_KEYS.NATIONALITY_REQUIREMENTS)) {
    const nationalityReqs = [
      // University 1 requirements
      {
        id: '1',
        university_id: '1',
        student_nationality: 'Sudan',
        applies_to_destination: 'All',
        condition_text: 'يجب توثيق الشهادة من وزارة الخارجية قبل التقديم',
        extra_document_required: 'وثيق الشهادات من الخارجية',
        severity: 'mandatory',
      },
      // University 2 requirements
      {
        id: '2',
        university_id: '2',
        student_nationality: 'Italy',
        applies_to_destination: 'Cyprus',
        condition_text: 'مطلوب وثيقة DOV (Declaration of Value)',
        extra_document_required: 'DOV',
        severity: 'mandatory',
      },
    ]
    localStorage.setItem(STORAGE_KEYS.NATIONALITY_REQUIREMENTS, JSON.stringify(nationalityReqs))
  }

  if (!localStorage.getItem(STORAGE_KEYS.SCHOLARSHIPS)) {
    const scholarships = [
      {
        id: '1',
        title: 'منحة التميز الأكاديمي الكاملة',
        type: 'منحة كاملة',
        university_id: '1',
        value: '100% من الرسوم الدراسية',
        image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&h=600&fit=crop',
        description: 'منحة دراسية كاملة تغطي جميع الرسوم الدراسية للطلاب المتفوقين أكاديمياً',
        requirements: [
          'معدل تراكمي لا يقل عن 90%',
          'شهادة إتقان اللغة الإنجليزية',
          'خطاب توصية من معلمين',
          'بيان شخصي',
        ],
      },
    ]
    localStorage.setItem(STORAGE_KEYS.SCHOLARSHIPS, JSON.stringify(scholarships))
  }

  if (!localStorage.getItem(STORAGE_KEYS.BLOG_POSTS)) {
    const blogPosts = [
      {
        id: '1',
        title: 'دليل شامل للدراسة 2024',
        excerpt: 'كل ما تحتاج معرفته عن الدراسة من التقديم حتى التخرج',
        author: 'فريق التحرير',
        date: '15 مايو 2024',
        image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&h=600&fit=crop',
        content: 'محتوى المقالة الكامل...'
      },
    ]
    localStorage.setItem(STORAGE_KEYS.BLOG_POSTS, JSON.stringify(blogPosts))
  }

  if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
    const users = [
      { id: '1', email: 'admin@example.com', role: 'admin', canPost: true },
    ]
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users))
  }

  if (!localStorage.getItem(STORAGE_KEYS.SETTINGS)) {
    const settings = {
      heroBackgroundImage: 'https://imagedelivery.net/LqiWLm-3MGbYHtFuUbcBtA/119580eb-abd9-4191-b93a-f01938786700/public',
    }
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings))
  }
}

initializeData()

// Helper function to make API calls
async function apiCall(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  })
  if (!response.ok) {
    const errorText = await response.text()
    console.error(`API call failed: ${response.status}`, errorText)
    throw new Error(`API call failed: ${response.status}`)
  }
  if (response.status === 204) return null
  return response.json()
}

// Helper function to compute intake status
export const computeIntakeStatus = (intake) => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const openDate = new Date(intake.application_open_date)
  const closeDate = new Date(intake.application_close_date)
  openDate.setHours(0, 0, 0, 0)
  closeDate.setHours(0, 0, 0, 0)

  if (today < openDate) {
    return 'opening_soon'
  } else if (today >= openDate && today <= closeDate) {
    return 'open'
  } else {
    return 'closed'
  }
}

export const getUniversities = async () => {
  if (USE_LOCAL) {
    const data = localStorage.getItem(STORAGE_KEYS.UNIVERSITIES)
    return data ? JSON.parse(data) : []
  }
  if (USE_SUPABASE) {
    if (!supabase) throw new Error('Supabase not configured')
    const { data } = await supabase.from('universities').select('*').order('name')
    return data ?? []
  }
  return apiCall('/universities')
}

export const getUniversityById = async (id) => {
  if (USE_LOCAL) {
    const list = await getUniversities()
    return list.find(u => u.id === id) ?? null
  }
  if (USE_SUPABASE) {
    if (!supabase) throw new Error('Supabase not configured')
    const { data } = await supabase.from('universities').select('*').eq('id', id).single()
    return data
  }
  return apiCall(`/universities/${id}`)
}

export const createUniversity = async (university) => {
  const title = university.translations?.[DEFAULT_LOCALE]?.name || university.name || ''
  const slug = university.slug || generateLocalizedSlug(title, DEFAULT_LOCALE)
  const item = { ...university, slug }
  if (USE_LOCAL) {
    const list = await getUniversities()
    const stored = { id: Date.now().toString(), ...item }
    const updated = [...list, stored]
    localStorage.setItem(STORAGE_KEYS.UNIVERSITIES, JSON.stringify(updated))
    return stored
  }
  if (USE_SUPABASE) {
    if (!supabase) throw new Error('Supabase not configured')
    const { accreditations, ...cleanData } = item
    const { data, error } = await supabase.from('universities').insert(cleanData).select().single()
    if (error) throw error
    return data
  }
  return apiCall('/universities', {
    method: 'POST',
    body: JSON.stringify(item),
  })
}

export const updateUniversity = async (id, university) => {
  const title = university.translations?.[DEFAULT_LOCALE]?.name || university.name || ''
  const slug = university.slug || generateLocalizedSlug(title, DEFAULT_LOCALE)
  const item = { ...university, slug }
  if (USE_LOCAL) {
    const list = await getUniversities()
    const updated = list.map(u => (u.id === id ? { ...u, ...item } : u))
    localStorage.setItem(STORAGE_KEYS.UNIVERSITIES, JSON.stringify(updated))
    return updated.find(u => u.id === id) ?? null
  }
  if (USE_SUPABASE) {
    if (!supabase) throw new Error('Supabase not configured')
    const { accreditations, ...cleanData } = item
    const { data, error } = await supabase.from('universities').update(cleanData).eq('id', id).select().single()
    if (error) throw error
    return data
  }
  return apiCall(`/universities/${id}`, {
    method: 'PUT',
    body: JSON.stringify(item),
  })
}

export const deleteUniversity = async (id) => {
  if (USE_LOCAL) {
    const list = await getUniversities()
    const updated = list.filter(u => u.id !== id)
    localStorage.setItem(STORAGE_KEYS.UNIVERSITIES, JSON.stringify(updated))
    return
  }
  if (USE_SUPABASE) {
    if (!supabase) throw new Error('Supabase not configured')
    const { error } = await supabase.from('universities').delete().eq('id', id)
    if (error) throw error
    return
  }
  return apiCall(`/universities/${id}`, {
    method: 'DELETE',
  })
}

// Application Intakes
export const getApplicationIntakes = async (universityId) => {
  if (USE_LOCAL) {
    const data = localStorage.getItem(STORAGE_KEYS.APPLICATION_INTAKES)
    const intakes = data ? JSON.parse(data) : []
    return intakes.filter(i => i.university_id === universityId)
  }
  if (USE_SUPABASE) {
    if (!supabase) throw new Error('Supabase not configured')
    if (!universityId) return []
    const { data } = await supabase.from('application_intakes').select('*').eq('university_id', universityId).order('application_open_date', { ascending: false })
    return data ?? []
  }
  return apiCall(`/application-intakes/${universityId}`)
}

export const createApplicationIntake = async (intake) => {
  if (USE_LOCAL) {
    const data = localStorage.getItem(STORAGE_KEYS.APPLICATION_INTAKES)
    const list = data ? JSON.parse(data) : []
    const item = { id: Date.now().toString(), ...intake }
    const updated = [...list, item]
    localStorage.setItem(STORAGE_KEYS.APPLICATION_INTAKES, JSON.stringify(updated))
    return item
  }
  if (USE_SUPABASE) {
    if (!supabase) throw new Error('Supabase not configured')
    const cleanedIntake = {
      ...intake,
      expected_admission_result_date: intake.expected_admission_result_date || null,
      semester_start_date: intake.semester_start_date || null
    }
    const { data, error } = await supabase.from('application_intakes').insert(cleanedIntake).select().single()
    if (error) throw error
    return data
  }
  const cleanedIntake = {
    ...intake,
    expected_admission_result_date: intake.expected_admission_result_date || null,
    semester_start_date: intake.semester_start_date || null
  }
  return apiCall('/application-intakes', {
    method: 'POST',
    body: JSON.stringify(cleanedIntake),
  })
}

export const updateApplicationIntake = async (id, intake) => {
  if (USE_LOCAL) {
    const data = localStorage.getItem(STORAGE_KEYS.APPLICATION_INTAKES)
    const list = data ? JSON.parse(data) : []
    const updated = list.map(i => (i.id === id ? { ...i, ...intake } : i))
    localStorage.setItem(STORAGE_KEYS.APPLICATION_INTAKES, JSON.stringify(updated))
    return updated.find(i => i.id === id) ?? null
  }
  if (USE_SUPABASE) {
    if (!supabase) throw new Error('Supabase not configured')
    const cleanedIntake = {
      ...intake,
      expected_admission_result_date: intake.expected_admission_result_date || null,
      semester_start_date: intake.semester_start_date || null
    }
    const { data, error } = await supabase.from('application_intakes').update(cleanedIntake).eq('id', id).select().single()
    if (error) throw error
    return data
  }
  const cleanedIntake = {
    ...intake,
    expected_admission_result_date: intake.expected_admission_result_date || null,
    semester_start_date: intake.semester_start_date || null
  }
  return apiCall(`/application-intakes/${id}`, {
    method: 'PUT',
    body: JSON.stringify(cleanedIntake),
  })
}

export const deleteApplicationIntake = async (id) => {
  if (USE_LOCAL) {
    const data = localStorage.getItem(STORAGE_KEYS.APPLICATION_INTAKES)
    const list = data ? JSON.parse(data) : []
    const updated = list.filter(i => i.id !== id)
    localStorage.setItem(STORAGE_KEYS.APPLICATION_INTAKES, JSON.stringify(updated))
    return
  }
  if (USE_SUPABASE) {
    if (!supabase) throw new Error('Supabase not configured')
    const { error } = await supabase.from('application_intakes').delete().eq('id', id)
    if (error) throw error
    return
  }
  return apiCall(`/application-intakes/${id}`, {
    method: 'DELETE',
  })
}

// Programs
export const getPrograms = async (universityId) => {
  if (USE_LOCAL) {
    const data = localStorage.getItem(STORAGE_KEYS.PROGRAMS)
    const programs = data ? JSON.parse(data) : []
    return programs.filter(p => p.university_id === universityId)
  }
  if (USE_SUPABASE) {
    if (!supabase) throw new Error('Supabase not configured')
    if (!universityId) return []
    const { data } = await supabase.from('programs').select('*').eq('university_id', universityId).order('program_name')
    return data ?? []
  }
  return apiCall(`/programs/${universityId}`)
}

export const createProgram = async (program) => {
  if (USE_LOCAL) {
    const data = localStorage.getItem(STORAGE_KEYS.PROGRAMS)
    const list = data ? JSON.parse(data) : []
    const item = { id: Date.now().toString(), ...program }
    const updated = [...list, item]
    localStorage.setItem(STORAGE_KEYS.PROGRAMS, JSON.stringify(updated))
    return item
  }
  if (USE_SUPABASE) {
    if (!supabase) throw new Error('Supabase not configured')
    const { data, error } = await supabase.from('programs').insert(program).select().single()
    if (error) throw error
    return data
  }
  return apiCall('/programs', {
    method: 'POST',
    body: JSON.stringify(program),
  })
}

export const updateProgram = async (id, program) => {
  if (USE_LOCAL) {
    const data = localStorage.getItem(STORAGE_KEYS.PROGRAMS)
    const list = data ? JSON.parse(data) : []
    const updated = list.map(p => (p.id === id ? { ...p, ...program } : p))
    localStorage.setItem(STORAGE_KEYS.PROGRAMS, JSON.stringify(updated))
    return updated.find(p => p.id === id) ?? null
  }
  if (USE_SUPABASE) {
    if (!supabase) throw new Error('Supabase not configured')
    const { data, error } = await supabase.from('programs').update(program).eq('id', id).select().single()
    if (error) throw error
    return data
  }
  return apiCall(`/programs/${id}`, {
    method: 'PUT',
    body: JSON.stringify(program),
  })
}

export const deleteProgram = async (id) => {
  if (USE_LOCAL) {
    const data = localStorage.getItem(STORAGE_KEYS.PROGRAMS)
    const list = data ? JSON.parse(data) : []
    const updated = list.filter(p => p.id !== id)
    localStorage.setItem(STORAGE_KEYS.PROGRAMS, JSON.stringify(updated))
    return
  }
  if (USE_SUPABASE) {
    if (!supabase) throw new Error('Supabase not configured')
    const { error } = await supabase.from('programs').delete().eq('id', id)
    if (error) throw error
    return
  }
  return apiCall(`/programs/${id}`, {
    method: 'DELETE',
  })
}

// Required Documents
export const getRequiredDocuments = async (universityId) => {
  if (USE_LOCAL) {
    const data = localStorage.getItem(STORAGE_KEYS.REQUIRED_DOCUMENTS)
    const allDocs = data ? JSON.parse(data) : []
    return universityId ? allDocs.filter(d => d.university_id === universityId) : allDocs
  }
  if (USE_SUPABASE) {
    if (!supabase) throw new Error('Supabase not configured')
    let query = supabase.from('required_documents').select('*')
    if (universityId) {
      query = query.eq('university_id', universityId)
    }
    const { data, error } = await query.order('name')
    if (error) {
      console.error('Supabase required_documents error:', error)
      return []
    }
    return data ?? []
  }
  return apiCall(`/required-documents/${universityId}`)
}

export const createRequiredDocument = async (doc) => {
  if (USE_LOCAL) {
    const data = localStorage.getItem(STORAGE_KEYS.REQUIRED_DOCUMENTS)
    const list = data ? JSON.parse(data) : []
    const item = { id: Date.now().toString(), ...doc }
    const updated = [...list, item]
    localStorage.setItem(STORAGE_KEYS.REQUIRED_DOCUMENTS, JSON.stringify(updated))
    return item
  }
  if (USE_SUPABASE) {
    if (!supabase) throw new Error('Supabase not configured')
    const { data, error } = await supabase.from('required_documents').insert(doc).select().single()
    if (error) throw error
    return data
  }
  return apiCall('/required-documents', {
    method: 'POST',
    body: JSON.stringify(doc),
  })
}

export const updateRequiredDocument = async (id, doc) => {
  if (USE_LOCAL) {
    const data = localStorage.getItem(STORAGE_KEYS.REQUIRED_DOCUMENTS)
    const list = data ? JSON.parse(data) : []
    const updated = list.map(d => d.id === id ? { ...d, ...doc } : d)
    localStorage.setItem(STORAGE_KEYS.REQUIRED_DOCUMENTS, JSON.stringify(updated))
    return updated.find(d => d.id === id) ?? null
  }
  if (USE_SUPABASE) {
    if (!supabase) throw new Error('Supabase not configured')
    const { data, error } = await supabase.from('required_documents').update(doc).eq('id', id).select().single()
    if (error) throw error
    return data
  }
  return apiCall(`/required-documents/${id}`, {
    method: 'PUT',
    body: JSON.stringify(doc),
  })
}

export const deleteRequiredDocument = async (id) => {
  if (USE_LOCAL) {
    const data = localStorage.getItem(STORAGE_KEYS.REQUIRED_DOCUMENTS)
    const list = data ? JSON.parse(data) : []
    const updated = list.filter(d => d.id !== id)
    localStorage.setItem(STORAGE_KEYS.REQUIRED_DOCUMENTS, JSON.stringify(updated))
    return
  }
  if (USE_SUPABASE) {
    if (!supabase) throw new Error('Supabase not configured')
    const { error } = await supabase.from('required_documents').delete().eq('id', id)
    if (error) throw error
    return
  }
  return apiCall(`/required-documents/${id}`, {
    method: 'DELETE',
  })
}

export const getProgramRequiredDocuments = async (programId) => {
  if (USE_LOCAL) {
    const data = localStorage.getItem(STORAGE_KEYS.PROGRAM_REQUIRED_DOCUMENTS)
    const list = data ? JSON.parse(data) : []
    return list.filter(prd => prd.program_id === programId)
  }
  if (USE_SUPABASE) {
    if (!supabase) throw new Error('Supabase not configured')
    if (!programId) return []
    const { data } = await supabase.from('program_required_documents').select('*').eq('program_id', programId)
    return data ?? []
  }
  return apiCall(`/program-required-documents/${programId}`)
}

export const addProgramRequiredDocument = async (programId, documentId, isRequired = true) => {
  if (USE_LOCAL) {
    const data = localStorage.getItem(STORAGE_KEYS.PROGRAM_REQUIRED_DOCUMENTS)
    const list = data ? JSON.parse(data) : []
    const item = { id: Date.now().toString(), program_id: programId, required_document_id: documentId, is_required: isRequired }
    const updated = [...list, item]
    localStorage.setItem(STORAGE_KEYS.PROGRAM_REQUIRED_DOCUMENTS, JSON.stringify(updated))
    return item
  }
  if (USE_SUPABASE) {
    if (!supabase) throw new Error('Supabase not configured')
    const { data, error } = await supabase.from('program_required_documents').insert({ program_id: programId, required_document_id: documentId, is_required: isRequired }).select().single()
    if (error) throw error
    return data
  }
  return apiCall('/program-required-documents', {
    method: 'POST',
    body: JSON.stringify({ program_id: programId, required_document_id: documentId, is_required: isRequired }),
  })
}

export const updateProgramRequiredDocument = async (id, updates) => {
  if (USE_LOCAL) {
    const data = localStorage.getItem(STORAGE_KEYS.PROGRAM_REQUIRED_DOCUMENTS)
    const list = data ? JSON.parse(data) : []
    const updated = list.map(prd => prd.id === id ? { ...prd, ...updates } : prd)
    localStorage.setItem(STORAGE_KEYS.PROGRAM_REQUIRED_DOCUMENTS, JSON.stringify(updated))
    return updated.find(prd => prd.id === id) ?? null
  }
  if (USE_SUPABASE) {
    if (!supabase) throw new Error('Supabase not configured')
    const { data, error } = await supabase.from('program_required_documents').update(updates).eq('id', id).select().single()
    if (error) throw error
    return data
  }
  return apiCall(`/program-required-documents/${id}`, {
    method: 'PUT',
    body: JSON.stringify(updates),
  })
}

export const deleteProgramRequiredDocument = async (id) => {
  if (USE_LOCAL) {
    const data = localStorage.getItem(STORAGE_KEYS.PROGRAM_REQUIRED_DOCUMENTS)
    const list = data ? JSON.parse(data) : []
    const updated = list.filter(prd => prd.id !== id)
    localStorage.setItem(STORAGE_KEYS.PROGRAM_REQUIRED_DOCUMENTS, JSON.stringify(updated))
    return
  }
  if (USE_SUPABASE) {
    if (!supabase) throw new Error('Supabase not configured')
    const { error } = await supabase.from('program_required_documents').delete().eq('id', id)
    if (error) throw error
    return
  }
  return apiCall(`/program-required-documents/${id}`, {
    method: 'DELETE',
  })
}

// Nationality Requirements
export const getNationalityRequirements = async (universityId) => {
  if (USE_LOCAL) {
    const data = localStorage.getItem(STORAGE_KEYS.NATIONALITY_REQUIREMENTS)
    const allReqs = data ? JSON.parse(data) : []
    return universityId ? allReqs.filter(r => r.university_id === universityId) : allReqs
  }
  if (USE_SUPABASE) {
    if (!supabase) throw new Error('Supabase not configured')
    let query = supabase.from('nationality_requirements').select('*')
    if (universityId) {
      query = query.eq('university_id', universityId)
    }
    const { data } = await query
    return data ?? []
  }
  return apiCall(`/nationality-requirements/${universityId}`)
}

export const createNationalityRequirement = async (req) => {
  if (USE_LOCAL) {
    const data = localStorage.getItem(STORAGE_KEYS.NATIONALITY_REQUIREMENTS)
    const list = data ? JSON.parse(data) : []
    const item = { id: Date.now().toString(), ...req }
    const updated = [...list, item]
    localStorage.setItem(STORAGE_KEYS.NATIONALITY_REQUIREMENTS, JSON.stringify(updated))
    return item
  }
  if (USE_SUPABASE) {
    if (!supabase) throw new Error('Supabase not configured')
    const { data, error } = await supabase.from('nationality_requirements').insert(req).select().single()
    if (error) throw error
    return data
  }
  return apiCall('/nationality-requirements', {
    method: 'POST',
    body: JSON.stringify(req),
  })
}

export const updateNationalityRequirement = async (id, updates) => {
  if (USE_LOCAL) {
    const data = localStorage.getItem(STORAGE_KEYS.NATIONALITY_REQUIREMENTS)
    const list = data ? JSON.parse(data) : []
    const updated = list.map(r => r.id === id ? { ...r, ...updates } : r)
    localStorage.setItem(STORAGE_KEYS.NATIONALITY_REQUIREMENTS, JSON.stringify(updated))
    return updated.find(r => r.id === id) ?? null
  }
  if (USE_SUPABASE) {
    if (!supabase) throw new Error('Supabase not configured')
    const { data, error } = await supabase.from('nationality_requirements').update(updates).eq('id', id).select().single()
    if (error) throw error
    return data
  }
  return apiCall(`/nationality-requirements/${id}`, {
    method: 'PUT',
    body: JSON.stringify(updates),
  })
}

export const deleteNationalityRequirement = async (id) => {
  if (USE_LOCAL) {
    const data = localStorage.getItem(STORAGE_KEYS.NATIONALITY_REQUIREMENTS)
    const list = data ? JSON.parse(data) : []
    const updated = list.filter(r => r.id !== id)
    localStorage.setItem(STORAGE_KEYS.NATIONALITY_REQUIREMENTS, JSON.stringify(updated))
    return
  }
  if (USE_SUPABASE) {
    if (!supabase) throw new Error('Supabase not configured')
    const { error } = await supabase.from('nationality_requirements').delete().eq('id', id)
    if (error) throw error
    return
  }
  return apiCall(`/nationality-requirements/${id}`, {
    method: 'DELETE',
  })
}

// Helper for smart filtering
export const getFilteredPrograms = async (filters) => {
  if (USE_LOCAL) {
    let programs = JSON.parse(localStorage.getItem(STORAGE_KEYS.PROGRAMS) || '[]')
    const universities = JSON.parse(localStorage.getItem(STORAGE_KEYS.UNIVERSITIES) || '[]')
    // Join programs with universities
    const joined = programs.map(p => ({ ...p, universities: universities.find(u => u.id === p.university_id) }))
    if (filters.country) {
      joined.filter(p => p.universities?.country === filters.country)
    }
    if (filters.degree_level) {
      joined.filter(p => p.degree_level === filters.degree_level)
    }
    if (filters.max_fee) {
      joined.filter(p => p.tuition_fee_original <= filters.max_fee)
    }
    if (filters.student_gpa) {
      joined.filter(p => p.min_gpa_percentage <= filters.student_gpa)
    }
    return joined.filter(p => p.is_active)
  }
  let query = supabase.from('programs').select('*, universities(*)')
  if (filters.country) {
    query = query.eq('universities.country', filters.country)
  }
  if (filters.degree_level) {
    query = query.eq('degree_level', filters.degree_level)
  }
  if (filters.max_fee) {
    query = query.lte('tuition_fee_original', filters.max_fee)
  }
  if (filters.student_gpa) {
    query = query.lte('min_gpa_percentage', filters.student_gpa)
  }
  query = query.eq('is_active', true)
  const { data } = await query
  return data ?? []
}

export const getScholarships = async () => {
  if (USE_LOCAL) {
    const data = localStorage.getItem(STORAGE_KEYS.SCHOLARSHIPS)
    return data ? JSON.parse(data) : []
  }
  if (USE_SUPABASE) {
    if (!supabase) throw new Error('Supabase not configured')
    const { data } = await supabase.from('scholarships').select('*, universities(name, logo_image)').order('title')
    return data ?? []
  }
  return apiCall('/scholarships')
}

export const getScholarshipById = async (id) => {
  if (USE_LOCAL) {
    const list = await getScholarships()
    return list.find(s => s.id === id) ?? null
  }
  if (USE_SUPABASE) {
    if (!supabase) throw new Error('Supabase not configured')
    const { data } = await supabase.from('scholarships').select('*, universities(name, logo_image)').eq('id', id).single()
    return data
  }
  return apiCall(`/scholarships/${id}`)
}

export const createScholarship = async (scholarship) => {
  const title = scholarship.translations?.[DEFAULT_LOCALE]?.title || scholarship.title || ''
  const slug = scholarship.slug || generateLocalizedSlug(title, DEFAULT_LOCALE)
  if (USE_LOCAL) {
    const list = await getScholarships()
    const item = { id: Date.now().toString(), ...scholarship, slug }
    const updated = [...list, item]
    localStorage.setItem(STORAGE_KEYS.SCHOLARSHIPS, JSON.stringify(updated))
    return item
  }
  if (USE_SUPABASE) {
    if (!supabase) throw new Error('Supabase not configured')
    const cleanedScholarship = {
      ...scholarship,
      slug,
      deadline: scholarship.deadline || null
    }
    const { data, error } = await supabase.from('scholarships').insert(cleanedScholarship).select().single()
    if (error) throw error
    return data
  }
  const cleanedScholarship = {
    ...scholarship,
    slug,
    deadline: scholarship.deadline || null
  }
  return apiCall('/scholarships', {
    method: 'POST',
    body: JSON.stringify(cleanedScholarship),
  })
}

export const updateScholarship = async (id, scholarship) => {
  const title = scholarship.translations?.[DEFAULT_LOCALE]?.title || scholarship.title || ''
  const slug = scholarship.slug || generateLocalizedSlug(title, DEFAULT_LOCALE)
  if (USE_LOCAL) {
    const list = await getScholarships()
    const updated = list.map(s => (s.id === id ? { ...s, ...scholarship, slug } : s))
    localStorage.setItem(STORAGE_KEYS.SCHOLARSHIPS, JSON.stringify(updated))
    return updated.find(s => s.id === id) ?? null
  }
  if (USE_SUPABASE) {
    if (!supabase) throw new Error('Supabase not configured')
    const cleanedScholarship = {
      ...scholarship,
      slug,
      deadline: scholarship.deadline || null
    }
    const { data, error } = await supabase.from('scholarships').update(cleanedScholarship).eq('id', id).select().single()
    if (error) throw error
    return data
  }
  const cleanedScholarship = {
    ...scholarship,
    slug,
    deadline: scholarship.deadline || null
  }
  return apiCall(`/scholarships/${id}`, {
    method: 'PUT',
    body: JSON.stringify(cleanedScholarship),
  })
}

export const deleteScholarship = async (id) => {
  if (USE_LOCAL) {
    const list = await getScholarships()
    const updated = list.filter(s => s.id !== id)
    localStorage.setItem(STORAGE_KEYS.SCHOLARSHIPS, JSON.stringify(updated))
    return
  }
  if (USE_SUPABASE) {
    if (!supabase) throw new Error('Supabase not configured')
    const { error } = await supabase.from('scholarships').delete().eq('id', id)
    if (error) throw error
    return
  }
  return apiCall(`/scholarships/${id}`, {
    method: 'DELETE',
  })
}

export const getBlogPosts = async () => {
  if (USE_LOCAL) {
    const data = localStorage.getItem(STORAGE_KEYS.BLOG_POSTS)
    return data ? JSON.parse(data) : []
  }
  if (USE_SUPABASE) {
    if (!supabase) throw new Error('Supabase not configured')
    const { data } = await supabase.from('blog_posts').select('*').order('created_at', { ascending: false })
    return data ?? []
  }
  return apiCall('/blog-posts')
}

export const getBlogPostById = async (id) => {
  if (USE_LOCAL) {
    const list = await getBlogPosts()
    return list.find(p => p.id === id) ?? null
  }
  if (USE_SUPABASE) {
    if (!supabase) throw new Error('Supabase not configured')
    const { data } = await supabase.from('blog_posts').select('*').eq('id', id).single()
    return data
  }
  return apiCall(`/blog-posts/${id}`)
}

export const createBlogPost = async (post) => {
  const title = post.translations?.[DEFAULT_LOCALE]?.title || post.title || ''
  const slug = post.slug || generateLocalizedSlug(title, DEFAULT_LOCALE)
  if (USE_LOCAL) {
    const list = await getBlogPosts()
    const item = { id: Date.now().toString(), ...post, slug }
    const updated = [...list, item]
    localStorage.setItem(STORAGE_KEYS.BLOG_POSTS, JSON.stringify(updated))
    return item
  }
  if (USE_SUPABASE) {
    if (!supabase) throw new Error('Supabase not configured')
    const { data, error } = await supabase.from('blog_posts').insert({ ...post, slug }).select().single()
    if (error) throw error
    return data
  }
  return apiCall('/blog-posts', {
    method: 'POST',
    body: JSON.stringify({ ...post, slug }),
  })
}

export const updateBlogPost = async (id, post) => {
  const title = post.translations?.[DEFAULT_LOCALE]?.title || post.title || ''
  const slug = post.slug || generateLocalizedSlug(title, DEFAULT_LOCALE)
  if (USE_LOCAL) {
    const list = await getBlogPosts()
    const updated = list.map(p => (p.id === id ? { ...p, ...post, slug } : p))
    localStorage.setItem(STORAGE_KEYS.BLOG_POSTS, JSON.stringify(updated))
    return updated.find(p => p.id === id) ?? null
  }
  if (USE_SUPABASE) {
    if (!supabase) throw new Error('Supabase not configured')
    const { data, error } = await supabase.from('blog_posts').update({ ...post, slug }).eq('id', id).select().single()
    if (error) throw error
    return data
  }
  return apiCall(`/blog-posts/${id}`, {
    method: 'PUT',
    body: JSON.stringify({ ...post, slug }),
  })
}

export const deleteBlogPost = async (id) => {
  if (USE_LOCAL) {
    const list = await getBlogPosts()
    const updated = list.filter(p => p.id !== id)
    localStorage.setItem(STORAGE_KEYS.BLOG_POSTS, JSON.stringify(updated))
    return
  }
  if (USE_SUPABASE) {
    if (!supabase) throw new Error('Supabase not configured')
    const { error } = await supabase.from('blog_posts').delete().eq('id', id)
    if (error) throw error
    return
  }
  return apiCall(`/blog-posts/${id}`, {
    method: 'DELETE',
  })
}

export const getDrafts = async (type) => {
  const key = type === 'blog' ? STORAGE_KEYS.DRAFTS_BLOG : type === 'scholarship' ? STORAGE_KEYS.DRAFTS_SCHOLARSHIPS : STORAGE_KEYS.DRAFTS_UNIVERSITIES
  const raw = localStorage.getItem(key)
  return raw ? JSON.parse(raw) : []
}

export const saveDraft = async (type, draft) => {
  const list = await getDrafts(type)
  const item = { id: draft.id || Date.now().toString(), updatedAt: new Date().toISOString(), history: draft.history || [], ...draft }
  const existingIndex = list.findIndex((d) => d.id === item.id)
  const nextHistory = [...item.history, { timestamp: item.updatedAt, summary: draft.title || draft.name || 'غير مسمى' }]
  const nextItem = { ...item, history: nextHistory }
  let next
  if (existingIndex >= 0) { next = [...list]; next[existingIndex] = nextItem } else { next = [...list, nextItem] }
  const key = type === 'blog' ? STORAGE_KEYS.DRAFTS_BLOG : type === 'scholarship' ? STORAGE_KEYS.DRAFTS_SCHOLARSHIPS : STORAGE_KEYS.DRAFTS_UNIVERSITIES
  localStorage.setItem(key, JSON.stringify(next))
  return nextItem
}

export const deleteDraft = async (type, id) => {
  const list = await getDrafts(type)
  const next = list.filter((d) => d.id !== id)
  const key = type === 'blog' ? STORAGE_KEYS.DRAFTS_BLOG : type === 'scholarship' ? STORAGE_KEYS.DRAFTS_SCHOLARSHIPS : STORAGE_KEYS.DRAFTS_UNIVERSITIES
  localStorage.setItem(key, JSON.stringify(next))
}

export const getUsers = async () => {
  if (USE_LOCAL) {
    const data = localStorage.getItem(STORAGE_KEYS.USERS)
    return data ? JSON.parse(data) : []
  }
  const { data } = await supabase.from('users').select('*').order('email', { ascending: true })
  return data ?? []
}

export const createUser = async (user) => {
  if (USE_LOCAL) {
    const list = await getUsers()
    const item = { id: Date.now().toString(), ...user }
    const updated = [...list, item]
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(updated))
    return item
  }
  const { data } = await supabase.from('users').insert(user).select().single()
  return data
}

export const updateUser = async (id, updates) => {
  if (USE_LOCAL) {
    const list = await getUsers()
    const updated = list.map(u => (u.id === id ? { ...u, ...updates } : u))
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(updated))
    return updated.find(u => u.id === id) ?? null
  }
  const { data } = await supabase.from('users').update(updates).eq('id', id).select().single()
  return data
}

export const deleteUser = async (id) => {
  if (USE_LOCAL) {
    const list = await getUsers()
    const updated = list.filter(u => u.id !== id)
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(updated))
    return
  }
  await supabase.from('users').delete().eq('id', id)
}

export const getSettings = async () => {
  if (USE_LOCAL) {
    const data = localStorage.getItem(STORAGE_KEYS.SETTINGS)
    return data ? JSON.parse(data) : {}
  }
  const { data } = await supabase.from('settings').select('*').eq('id', 'site').single()
  return data ?? {}
}

export const updateSettings = async (updates) => {
  if (USE_LOCAL) {
    const current = await getSettings()
    const next = { ...current, ...updates }
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(next))
    return next
  }
  const { data } = await supabase
    .from('settings')
    .upsert({ id: 'site', ...updates }, { onConflict: 'id' })
    .select()
    .single()
  return data
}

// ============================================================
// AI SKILLS (use localStorage always — reliable across sessions)
// ============================================================
export const getAiSkills = async () => {
  const data = localStorage.getItem(STORAGE_KEYS.AI_SKILLS)
  return data ? JSON.parse(data) : []
}

export const updateAiSkills = async (skills) => {
  localStorage.setItem(STORAGE_KEYS.AI_SKILLS, JSON.stringify(skills))
  return skills
}

export default {
  getUniversities,
  getUniversityById,
  createUniversity,
  updateUniversity,
  deleteUniversity,
  getApplicationIntakes,
  createApplicationIntake,
  updateApplicationIntake,
  deleteApplicationIntake,
  getPrograms,
  createProgram,
  updateProgram,
  deleteProgram,
  getRequiredDocuments,
  getProgramRequiredDocuments,
  addProgramRequiredDocument,
  updateProgramRequiredDocument,
  deleteProgramRequiredDocument,
  getNationalityRequirements,
  createNationalityRequirement,
  updateNationalityRequirement,
  deleteNationalityRequirement,
  getFilteredPrograms,
  getScholarships,
  getScholarshipById,
  createScholarship,
  updateScholarship,
  deleteScholarship,
  getBlogPosts,
  getBlogPostById,
  createBlogPost,
  updateBlogPost,
  deleteBlogPost,
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  getSettings,
  updateSettings,
  getAiSkills,
  updateAiSkills,
  uploadImage,
  computeIntakeStatus,
}

export async function uploadImage(file, pathPrefix = 'uploads') {
  if (USE_LOCAL || !supabase) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onloadend = () => resolve(reader.result)
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  }

  try {
    const fileExt = file.name.split('.').pop()
    const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`
    const filePath = `${pathPrefix}/${fileName}`

    const { data, error } = await supabase.storage
      .from('uploads')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      })

    if (error) throw error

    const { data: { publicUrl } } = supabase.storage
      .from('uploads')
      .getPublicUrl(filePath)

    return publicUrl
  } catch (err) {
    console.error('Supabase upload failed, falling back to base64:', err)
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onloadend = () => resolve(reader.result)
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  }
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
const USE_LOCAL = !import.meta.env.VITE_API_URL && (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY)

const STORAGE_KEYS = {
  UNIVERSITIES: 'kktc_universities',
  SCHOLARSHIPS: 'kktc_scholarships',
  BLOG_POSTS: 'kktc_blog_posts',
  USERS: 'kktc_users',
  SETTINGS: 'kktc_settings',
  DRAFTS_BLOG: 'kktc_drafts_blog',
  DRAFTS_SCHOLARSHIPS: 'kktc_drafts_scholarships',
  DRAFTS_UNIVERSITIES: 'kktc_drafts_universities',
}

const initializeData = () => {
  if (!USE_LOCAL) return
  if (!localStorage.getItem(STORAGE_KEYS.UNIVERSITIES)) {
    const universities = [
      {
        id: '1',
        name: 'جامعة شرق البحر المتوسط',
        location: 'فاماغوستا',
        students: '20,000+',
        image: 'https://images.unsplash.com/photo-1562774053-701939374585?w=800&h=600&fit=crop',
        description: 'واحدة من أكبر وأعرق الجامعات، تقدم برامج دراسية متنوعة باللغة الإنجليزية',
        programs: ['الهندسة', 'الطب', 'إدارة الأعمال', 'علوم الحاسوب', 'العمارة'],
      },
      {
        id: '2',
        name: 'جامعة دولية',
        location: 'نيقوسيا',
        students: '15,000+',
        image: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&h=600&fit=crop',
        description: 'جامعة حديثة تركز على التميز الأكاديمي والبحث العلمي',
        programs: ['القانون', 'الاقتصاد', 'الإعلام', 'السياحة', 'التمريض'],
      },
      {
        id: '3',
        name: 'جامعة الشرق الأدنى',
        location: 'نيقوسيا',
        students: '25,000+',
        image: 'https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?w=800&h=600&fit=crop',
        description: 'أكبر جامعة مع حرم جامعي حديث ومرافق متطورة',
        programs: ['طب الأسنان', 'الصيدلة', 'الفنون الجميلة', 'التربية', 'الهندسة المعمارية'],
      },
    ]
    localStorage.setItem(STORAGE_KEYS.UNIVERSITIES, JSON.stringify(universities))
  }

  if (!localStorage.getItem(STORAGE_KEYS.SCHOLARSHIPS)) {
    const scholarships = [
      {
        id: '1',
        title: 'منحة التميز الأكاديمي الكاملة',
        type: 'منحة كاملة',
        university: 'جامعة شرق البحر المتوسط',
        value: '100% من الرسوم الدراسية',
        deadline: '30 يونيو 2024',
        image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&h=600&fit=crop',
        description: 'منحة دراسية كاملة تغطي جميع الرسوم الدراسية للطلاب المتفوقين أكاديمياً',
        requirements: [
          'معدل تراكمي لا يقل عن 90%',
          'شهادة إتقان اللغة الإنجليزية',
          'خطاب توصية من معلمين',
          'بيان شخصي',
        ],
      },
      {
        id: '2',
        title: 'منحة الطلاب الدوليين',
        type: 'منحة جزئية',
        university: 'جامعة دولية',
        value: '50% من الرسوم الدراسية',
        deadline: '15 يوليو 2024',
        image: 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=800&h=600&fit=crop',
        description: 'منحة مخصصة للطلاب الدوليين المتميزين',
        requirements: ['معدل تراكمي لا يقل عن 85%', 'اختبار TOEFL أو IELTS', 'سيرة ذاتية محدثة'],
      },
      {
        id: '3',
        title: 'منحة البحث العلمي',
        type: 'منحة دراسات عليا',
        university: 'جامعة الشرق الأدنى',
        value: 'رسوم دراسية + راتب شهري',
        deadline: '1 أغسطس 2024',
        image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800&h=600&fit=crop',
        description: 'منحة للطلاب الراغبين في متابعة الدراسات العليا والبحث العلمي',
        requirements: ['درجة البكالوريوس بتقدير جيد جداً', 'مقترح بحثي', 'خبرة بحثية سابقة'],
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
      {
        id: '2',
        title: 'أفضل 10 تخصصات دراسية',
        excerpt: 'تعرف على التخصصات الأكثر طلباً وفرص العمل المتاحة بعد التخرج',
        author: 'د. أحمد محمود',
        date: '10 مايو 2024',
        image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&h=600&fit=crop',
        content: 'محتوى المقالة الكامل...'
      },
      {
        id: '3',
        title: 'تكاليف المعيشة للطلاب',
        excerpt: 'دليل تفصيلي عن تكاليف السكن، الطعام، والمواصلات للطلاب',
        author: 'سارة علي',
        date: '5 مايو 2024',
        image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&h=600&fit=crop',
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

export const getUniversities = async () => {
  if (USE_LOCAL) {
    const data = localStorage.getItem(STORAGE_KEYS.UNIVERSITIES)
    return data ? JSON.parse(data) : []
  }
  const response = await fetch(`${API_URL}/universities`)
  return await response.json()
}

export const getUniversityById = async (id) => {
  if (USE_LOCAL) {
    const list = await getUniversities()
    return list.find(u => u.id === id) ?? null
  }
  const response = await fetch(`${API_URL}/universities/${id}`)
  return await response.json()
}

export const createUniversity = async (university) => {
  if (USE_LOCAL) {
    const list = await getUniversities()
    const item = { id: Date.now().toString(), ...university }
    const updated = [...list, item]
    localStorage.setItem(STORAGE_KEYS.UNIVERSITIES, JSON.stringify(updated))
    return item
  }
  const response = await fetch(`${API_URL}/universities`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(university)
  })
  return await response.json()
}

export const updateUniversity = async (id, university) => {
  if (USE_LOCAL) {
    const list = await getUniversities()
    const updated = list.map(u => (u.id === id ? { ...u, ...university } : u))
    localStorage.setItem(STORAGE_KEYS.UNIVERSITIES, JSON.stringify(updated))
    return updated.find(u => u.id === id) ?? null
  }
  const response = await fetch(`${API_URL}/universities/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(university)
  })
  return await response.json()
}

export const deleteUniversity = async (id) => {
  if (USE_LOCAL) {
    const list = await getUniversities()
    const updated = list.filter(u => u.id !== id)
    localStorage.setItem(STORAGE_KEYS.UNIVERSITIES, JSON.stringify(updated))
    return
  }
  await fetch(`${API_URL}/universities/${id}`, { method: 'DELETE' })
}

export const getScholarships = async () => {
  if (USE_LOCAL) {
    const data = localStorage.getItem(STORAGE_KEYS.SCHOLARSHIPS)
    return data ? JSON.parse(data) : []
  }
  const response = await fetch(`${API_URL}/scholarships`)
  return await response.json()
}

export const getScholarshipById = async (id) => {
  if (USE_LOCAL) {
    const list = await getScholarships()
    return list.find(s => s.id === id) ?? null
  }
  const response = await fetch(`${API_URL}/scholarships/${id}`)
  return await response.json()
}

export const createScholarship = async (scholarship) => {
  if (USE_LOCAL) {
    const list = await getScholarships()
    const item = { id: Date.now().toString(), ...scholarship }
    const updated = [...list, item]
    localStorage.setItem(STORAGE_KEYS.SCHOLARSHIPS, JSON.stringify(updated))
    return item
  }
  const response = await fetch(`${API_URL}/scholarships`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(scholarship)
  })
  return await response.json()
}

export const updateScholarship = async (id, scholarship) => {
  if (USE_LOCAL) {
    const list = await getScholarships()
    const updated = list.map(s => (s.id === id ? { ...s, ...scholarship } : s))
    localStorage.setItem(STORAGE_KEYS.SCHOLARSHIPS, JSON.stringify(updated))
    return updated.find(s => s.id === id) ?? null
  }
  const response = await fetch(`${API_URL}/scholarships/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(scholarship)
  })
  return await response.json()
}

export const deleteScholarship = async (id) => {
  if (USE_LOCAL) {
    const list = await getScholarships()
    const updated = list.filter(s => s.id !== id)
    localStorage.setItem(STORAGE_KEYS.SCHOLARSHIPS, JSON.stringify(updated))
    return
  }
  await fetch(`${API_URL}/scholarships/${id}`, { method: 'DELETE' })
}

export const getBlogPosts = async () => {
  if (USE_LOCAL) {
    const data = localStorage.getItem(STORAGE_KEYS.BLOG_POSTS)
    return data ? JSON.parse(data) : []
  }
  const response = await fetch(`${API_URL}/blog-posts`)
  return await response.json()
}

export const getBlogPostById = async (id) => {
  if (USE_LOCAL) {
    const list = await getBlogPosts()
    return list.find(p => p.id === id) ?? null
  }
  const response = await fetch(`${API_URL}/blog-posts/${id}`)
  return await response.json()
}

export const createBlogPost = async (post) => {
  if (USE_LOCAL) {
    const list = await getBlogPosts()
    const item = { id: Date.now().toString(), ...post }
    const updated = [...list, item]
    localStorage.setItem(STORAGE_KEYS.BLOG_POSTS, JSON.stringify(updated))
    return item
  }
  const response = await fetch(`${API_URL}/blog-posts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(post)
  })
  return await response.json()
}

export const updateBlogPost = async (id, post) => {
  if (USE_LOCAL) {
    const list = await getBlogPosts()
    const updated = list.map(p => (p.id === id ? { ...p, ...post } : p))
    localStorage.setItem(STORAGE_KEYS.BLOG_POSTS, JSON.stringify(updated))
    return updated.find(p => p.id === id) ?? null
  }
  const response = await fetch(`${API_URL}/blog-posts/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(post)
  })
  return await response.json()
}

export const deleteBlogPost = async (id) => {
  if (USE_LOCAL) {
    const list = await getBlogPosts()
    const updated = list.filter(p => p.id !== id)
    localStorage.setItem(STORAGE_KEYS.BLOG_POSTS, JSON.stringify(updated))
    return
  }
  await fetch(`${API_URL}/blog-posts/${id}`, { method: 'DELETE' })
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
  const response = await fetch(`${API_URL}/users`)
  return await response.json()
}

export const createUser = async (user) => {
  if (USE_LOCAL) {
    const list = await getUsers()
    const item = { id: Date.now().toString(), ...user }
    const updated = [...list, item]
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(updated))
    return item
  }
  const response = await fetch(`${API_URL}/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(user)
  })
  return await response.json()
}

export const updateUser = async (id, updates) => {
  if (USE_LOCAL) {
    const list = await getUsers()
    const updated = list.map(u => (u.id === id ? { ...u, ...updates } : u))
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(updated))
    return updated.find(u => u.id === id) ?? null
  }
  const response = await fetch(`${API_URL}/users/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates)
  })
  return await response.json()
}

export const deleteUser = async (id) => {
  if (USE_LOCAL) {
    const list = await getUsers()
    const updated = list.filter(u => u.id !== id)
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(updated))
    return
  }
  await fetch(`${API_URL}/users/${id}`, { method: 'DELETE' })
}

export const getSettings = async () => {
  if (USE_LOCAL) {
    const data = localStorage.getItem(STORAGE_KEYS.SETTINGS)
    return data ? JSON.parse(data) : {}
  }
  const response = await fetch(`${API_URL}/settings`)
  return await response.json()
}

export const updateSettings = async (updates) => {
  if (USE_LOCAL) {
    const current = await getSettings()
    const next = { ...current, ...updates }
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(next))
    return next
  }
  const response = await fetch(`${API_URL}/settings`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates)
  })
  return await response.json()
}

export default {
  getUniversities,
  getUniversityById,
  createUniversity,
  updateUniversity,
  deleteUniversity,
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
  uploadImage,
}

export async function uploadImage(file, pathPrefix = 'uploads') {
  return URL.createObjectURL(file)
}

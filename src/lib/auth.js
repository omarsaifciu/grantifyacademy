import supabase from './supabase'
const USE_LOCAL = !import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY
const AUTH_KEY = 'kktc_auth_user'

export const login = async (email, password) => {
  if (USE_LOCAL) {
    if (email === 'admin@example.com' && password === 'admin123') {
      const user = { id: '1', email, role: 'admin', canPost: true }
      localStorage.setItem(AUTH_KEY, JSON.stringify(user))
      return { success: true }
    }
    return { success: false, message: 'البريد الإلكتروني أو كلمة المرور غير صحيحة' }
  }
  const { error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) {
    return { success: false, message: 'البريد الإلكتروني أو كلمة المرور غير صحيحة' }
  }
  return { success: true }
}

export const logout = async () => {
  if (USE_LOCAL) {
    localStorage.removeItem(AUTH_KEY)
    return
  }
  await supabase.auth.signOut()
}

export const isAuthenticated = async () => {
  if (USE_LOCAL) {
    return localStorage.getItem(AUTH_KEY) !== null
  }
  const { data } = await supabase.auth.getSession()
  return !!data?.session
}

export const getCurrentUser = async () => {
  if (USE_LOCAL) {
    const data = localStorage.getItem(AUTH_KEY)
    return data ? JSON.parse(data) : null
  }
  const { data } = await supabase.auth.getUser()
  return data?.user ?? null
}

export const requestPasswordReset = async (email) => {
  if (USE_LOCAL) {
    return { success: true, message: 'في نسخة التجربة المحلية، استخدم admin@example.com / admin123' }
  }
  const redirectTo = typeof window !== 'undefined' ? `${window.location.origin}/` : undefined
  const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo })
  if (error) {
    return { success: false, message: 'تعذر إرسال رابط الاستعادة. حاول لاحقاً.' }
  }
  return { success: true, message: 'تم إرسال رابط إعادة التعيين إلى بريدك الإلكتروني' }
}
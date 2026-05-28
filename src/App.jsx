import React, { useEffect } from 'react';
import { Routes, Route, Navigate, Outlet, useParams } from 'react-router-dom';
import HomePage from '@/pages/HomePage';
import BlogListPage from '@/pages/BlogListPage';
import BlogPostPage from '@/pages/BlogPostPage';
import UniversityPage from '@/pages/UniversityPage';
import ScholarshipPage from '@/pages/ScholarshipPage';
import UniversitiesListPage from '@/pages/UniversitiesListPage';
import ScholarshipsListPage from '@/pages/ScholarshipsListPage';
import AdminDashboard from '@/pages/AdminDashboard';
import ApplicationPage from '@/pages/ApplicationPage';
import LoginPage from '@/pages/LoginPage';
import ForgotPasswordPage from '@/pages/ForgotPasswordPage.jsx';
import { detectLocale, isRtlLocale } from '@/lib/utils';

function LocaleLayout() {
  const { locale } = useParams();
  useEffect(() => {
    const lang = locale || detectLocale();
    if (typeof document !== 'undefined') {
      document.documentElement.lang = lang;
      document.documentElement.dir = isRtlLocale(lang) ? 'rtl' : 'ltr';
    }
    try { window.localStorage?.setItem('site_locale', lang) } catch {}
  }, [locale]);
  return <Outlet />;
}

export default function App() {
  return (
    <div className="bg-background">
      <Routes>
        <Route path="/" element={<Navigate to={`/${detectLocale()}/`} replace />} />
        <Route path="/login" element={<Navigate to={`/${detectLocale()}/login`} replace />} />
        <Route path="/forgot-password" element={<Navigate to={`/${detectLocale()}/forgot-password`} replace />} />
        <Route path=":locale" element={<LocaleLayout />}> 
          <Route index element={<HomePage />} />
          <Route path="universities" element={<UniversitiesListPage />} />
          <Route path="scholarships" element={<ScholarshipsListPage />} />
          <Route path="blog" element={<BlogListPage />} />
          <Route path="blog/:id" element={<BlogPostPage />} />
          <Route path="university/:id" element={<UniversityPage />} />
          <Route path="scholarship/:id" element={<ScholarshipPage />} />
          <Route path="admin" element={<AdminDashboard />} />
          <Route path="apply/:id" element={<ApplicationPage />} />
          <Route path="apply" element={<ApplicationPage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="forgot-password" element={<ForgotPasswordPage />} />
        </Route>
      </Routes>
    </div>
  );
}

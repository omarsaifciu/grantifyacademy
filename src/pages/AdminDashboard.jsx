import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import * as TabsComp from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { LogOut, GraduationCap, Search } from 'lucide-react';
import { isAuthenticated, logout } from '@/lib/auth';
import UniversitiesManager from '@/components/admin/UniversitiesManager';
import ScholarshipsManager from '@/components/admin/ScholarshipsManager';
import BlogManager from '@/components/admin/BlogManager';
import UsersManager from '@/components/admin/UsersManager';
import SettingsManager from '@/components/admin/SettingsManager';
import SmartFilterPage from '@/components/admin/SmartFilterPage';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('universities');

  useEffect(() => {
    const check = async () => {
      const ok = await isAuthenticated()
      if (!ok) {
        navigate('/login')
      }
    }
    check()
  }, [navigate]);

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  };

  return (
    <>
      <Helmet>
        <title>لوحة التحكم - منح دراسية</title>
        <meta name="description" content="لوحة تحكم الإدارة" />
      </Helmet>

      <div className="min-h-screen p-4 md:p-8 bg-secondary/30">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-7xl mx-auto"
        >
          <div className="glass-effect rounded-3xl p-6 md:p-8 mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="bg-primary p-3 rounded-xl">
                  <GraduationCap className="w-8 h-8 text-primary-foreground" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold gradient-text">لوحة التحكم</h1>
                  <p className="text-muted-foreground">إدارة محتوى الموقع</p>
                </div>
              </div>
              <Button
                onClick={handleLogout}
                variant="destructive"
              >
                <LogOut className="ml-2 w-5 h-5" />
                تسجيل الخروج
              </Button>
            </div>
          </div>

          <div className="glass-effect rounded-3xl p-6 md:p-8">
            <TabsComp.Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsComp.TabsList className="grid w-full grid-cols-2 lg:grid-cols-6 mb-8 bg-secondary/80">
                <TabsComp.TabsTrigger value="universities" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  الجامعات
                </TabsComp.TabsTrigger>
                <TabsComp.TabsTrigger value="smart-filter" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  <Search className="ml-1 w-4 h-4" />
                  البحث الذكي
                </TabsComp.TabsTrigger>
                <TabsComp.TabsTrigger value="scholarships" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  المنح
                </TabsComp.TabsTrigger>
                <TabsComp.TabsTrigger value="blog" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  المدونة
                </TabsComp.TabsTrigger>
                <TabsComp.TabsTrigger value="users" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  المستخدمين
                </TabsComp.TabsTrigger>
                <TabsComp.TabsTrigger value="settings" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  الإعدادات
                </TabsComp.TabsTrigger>
              </TabsComp.TabsList>

              <TabsComp.TabsContent value="universities">
                <UniversitiesManager />
              </TabsComp.TabsContent>

              <TabsComp.TabsContent value="smart-filter">
                <SmartFilterPage />
              </TabsComp.TabsContent>

              <TabsComp.TabsContent value="scholarships">
                <ScholarshipsManager />
              </TabsComp.TabsContent>

              <TabsComp.TabsContent value="blog">
                <BlogManager />
              </TabsComp.TabsContent>

              <TabsComp.TabsContent value="users">
                <UsersManager />
              </TabsComp.TabsContent>

              <TabsComp.TabsContent value="settings">
                <SettingsManager />
              </TabsComp.TabsContent>
            </TabsComp.Tabs>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default AdminDashboard;

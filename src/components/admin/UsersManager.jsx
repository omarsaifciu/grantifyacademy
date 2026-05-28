import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { getUsers, createUser, updateUser, deleteUser } from '@/lib/storage';

const UsersManager = () => {
  const [users, setUsers] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const load = async () => {
      const data = await getUsers()
      setUsers(data)
    }
    load()
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    const payload = {
      email: formData.get('email'),
      role: 'blogger',
      canPost: true,
    }

    await createUser(payload)
    const data = await getUsers()
    setUsers(data)
    setIsDialogOpen(false)
    toast({ title: "تم إضافة المستخدم بنجاح!" })
  };

  const handleDelete = async (id) => {
    await deleteUser(id)
    const data = await getUsers()
    setUsers(data)
    toast({ title: "تم حذف المستخدم بنجاح!" })
  };

  const togglePostPermission = async (id) => {
    const user = users.find(u => u.id === id)
    if (!user) return
    await updateUser(id, { canPost: !user.canPost })
    const data = await getUsers()
    setUsers(data)
    toast({ title: "تم تحديث الصلاحيات بنجاح!" })
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-foreground">إدارة المستخدمين</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="ml-2 w-5 h-5" />
              إضافة مستخدم
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-2xl gradient-text">إضافة مستخدم جديد</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="email">البريد الإلكتروني</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                إضافة
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-4">
        {users.map((user, index) => (
          <motion.div
            key={user.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-card border rounded-xl p-6"
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h3 className="text-lg font-bold text-foreground mb-1">{user.email}</h3>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-muted-foreground">
                    الدور: {user.role === 'admin' ? 'مدير' : 'مدون'}
                  </span>
                  <div className="flex items-center gap-2">
                    {user.canPost ? (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-500" />
                    )}
                    <span className="text-sm text-muted-foreground">
                      {user.canPost ? 'يمكنه النشر' : 'لا يمكنه النشر'}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                {user.role !== 'admin' && (
                  <>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => togglePostPermission(user.id)}
                    >
                      {user.canPost ? 'إلغاء الصلاحية' : 'منح الصلاحية'}
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(user.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default UsersManager;
import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { getSettings, updateSettings, uploadImage } from '@/lib/storage';

const SettingsManager = () => {
  const [settings, setSettings] = useState({ heroBackgroundUrl: '', defaultUniversityImageUrl: '' });
  const [uploadingHero, setUploadingHero] = useState(false);
  const [uploadingDefault, setUploadingDefault] = useState(false);
  const heroInputRef = useRef(null);
  const defaultInputRef = useRef(null);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const load = async () => {
      const st = await getSettings()
      setSettings(st)
    }
    load()
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true)
    const formData = new FormData(e.target);
    const payload = {
      heroBackgroundUrl: formData.get('heroBackgroundUrl'),
      defaultUniversityImageUrl: formData.get('defaultUniversityImageUrl'),
    }
    const updated = await updateSettings(payload)
    setSettings(updated)
    setSaving(false)
    toast({ title: 'تم حفظ الإعدادات بنجاح' })
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-foreground">إعدادات الموقع</h2>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-card border rounded-2xl p-6"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="heroBackgroundUrl">خلفية قسم الهيرو</Label>
            <div
              className="mt-2 border-2 border-dashed rounded-xl p-4 text-center cursor-pointer hover:bg-secondary/50"
              onClick={() => heroInputRef.current?.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={async (e) => {
                e.preventDefault()
                const file = e.dataTransfer.files?.[0]
                if (file) {
                  setUploadingHero(true)
                  const url = await uploadImage(file, 'settings')
                  setSettings((s) => ({ ...s, heroBackgroundUrl: url }))
                  setUploadingHero(false)
                  toast({ title: 'تم رفع الخلفية' })
                }
              }}
            >
              {uploadingHero ? (
                <div className="text-muted-foreground">جارٍ الرفع...</div>
              ) : (
                <>
                  {settings.heroBackgroundUrl ? (
                    <img src={settings.heroBackgroundUrl} alt="hero" className="mx-auto max-h-40 rounded-md" />
                  ) : (
                    <div className="text-muted-foreground">اسحب وأسقط الصورة هنا أو اضغط للاختيار</div>
                  )}
                </>
              )}
              <input
                ref={heroInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={async (e) => {
                  const file = e.target.files?.[0]
                  if (file) {
                    setUploadingHero(true)
                    const url = await uploadImage(file, 'settings')
                    setSettings((s) => ({ ...s, heroBackgroundUrl: url }))
                    setUploadingHero(false)
                    toast({ title: 'تم رفع الخلفية' })
                  }
                }}
              />
            </div>
            <Input id="heroBackgroundUrl" name="heroBackgroundUrl" type="hidden" defaultValue={settings.heroBackgroundUrl || ''} />
          </div>
          <div>
            <Label htmlFor="defaultUniversityImageUrl">الصورة الافتراضية للجامعات</Label>
            <div
              className="mt-2 border-2 border-dashed rounded-xl p-4 text-center cursor-pointer hover:bg-secondary/50"
              onClick={() => defaultInputRef.current?.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={async (e) => {
                e.preventDefault()
                const file = e.dataTransfer.files?.[0]
                if (file) {
                  setUploadingDefault(true)
                  const url = await uploadImage(file, 'settings')
                  setSettings((s) => ({ ...s, defaultUniversityImageUrl: url }))
                  setUploadingDefault(false)
                  toast({ title: 'تم رفع الصورة' })
                }
              }}
            >
              {uploadingDefault ? (
                <div className="text-muted-foreground">جارٍ الرفع...</div>
              ) : (
                <>
                  {settings.defaultUniversityImageUrl ? (
                    <img src={settings.defaultUniversityImageUrl} alt="default" className="mx-auto max-h-40 rounded-md" />
                  ) : (
                    <div className="text-muted-foreground">اسحب وأسقط الصورة هنا أو اضغط للاختيار</div>
                  )}
                </>
              )}
              <input
                ref={defaultInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={async (e) => {
                  const file = e.target.files?.[0]
                  if (file) {
                    setUploadingDefault(true)
                    const url = await uploadImage(file, 'settings')
                    setSettings((s) => ({ ...s, defaultUniversityImageUrl: url }))
                    setUploadingDefault(false)
                    toast({ title: 'تم رفع الصورة' })
                  }
                }}
              />
            </div>
            <Input id="defaultUniversityImageUrl" name="defaultUniversityImageUrl" type="hidden" defaultValue={settings.defaultUniversityImageUrl || ''} />
          </div>
          <Button type="submit" disabled={saving}>
            {saving ? 'جارٍ الحفظ...' : 'حفظ الإعدادات'}
          </Button>
        </form>
      </motion.div>
    </div>
  );
};

export default SettingsManager;


export const COUNTRIES = [
  { value: 'China', label: 'الصين' },
  { value: 'Cyprus', label: 'قبرص' },
  { value: 'NorthCyprus', label: 'قبرص الشمالية' },
  { value: 'Georgia', label: 'جورجيا' },
  { value: 'Malaysia', label: 'ماليزيا' },
  { value: 'Germany', label: 'ألمانيا' },
  { value: 'UK', label: 'البريطانيا' },
  { value: 'Italy', label: 'إيطاليا' },
  { value: 'Rwanda', label: 'رواندا' },
  { value: 'Syria', label: 'سوريا' },
  { value: 'Yemen', label: 'اليمن' },
  { value: 'Egypt', label: 'مصر' },
  { value: 'Jordan', label: 'الأردن' },
  { value: 'Lebanon', label: 'لبنان' },
  { value: 'Saudi', label: 'السعودية' },
  { value: 'UAE', label: 'الإمارات' },
]

export const UNIVERSITY_TYPES = [
  { value: 'public', label: 'حكومية' },
  { value: 'private', label: 'خاصة' },
]

export const mapCitiesToCountries = () => {
  const countryToCitiesMap = {}

  countryToCitiesMap['Cyprus'] = ['نيقوسيا', 'ليماسول', 'لارنكا', 'بافوس', 'فاماغوستا', 'كيرينيا']
  countryToCitiesMap['NorthCyprus'] = ['فاماغوستا', 'كيرينيا', 'أويون', 'بولياني', 'ديريم', 'إسكيلي', 'غركان', 'ليفكو', 'ماغوسا', 'نور', 'أويون', 'بافوس']
  countryToCitiesMap['China'] = ['بكين', 'شنغهاي', 'قوانغتشو', 'شنتشن', 'هونغ كونغ']
  countryToCitiesMap['Georgia'] = ['تبليسي', 'باتومي', 'كوتايسي']
  countryToCitiesMap['Malaysia'] = ['كوالالمبور', 'بينانغ', 'جوهور باهرو']
  countryToCitiesMap['Germany'] = ['برلين', 'ميونخ', 'فرانكفورت', 'هامبورغ', 'كولونيا']
  countryToCitiesMap['UK'] = ['لندن', 'مانشستر', 'برمنغهام', 'ليفربول', 'غلاسكو']
  countryToCitiesMap['Italy'] = ['روما', 'ميلانو', 'فلورنسا', 'بولونيا', 'تورينو']
  countryToCitiesMap['Rwanda'] = ['كيغالي']
  countryToCitiesMap['Syria'] = ['دمشق', 'حلب', 'حمص', 'اللاذقية']
  countryToCitiesMap['Yemen'] = ['صنعاء', 'عدن', 'تعز']
  countryToCitiesMap['Egypt'] = ['القاهرة', 'الإسكندرية', 'الجيزة', 'أسوان']
  countryToCitiesMap['Jordan'] = ['عمان', 'إربد', 'الزرقاء', 'العقبة']
  countryToCitiesMap['Lebanon'] = ['بيروت', 'طرابلس', 'صيدا', 'صور']
  countryToCitiesMap['Saudi'] = ['الرياض', 'جدة', 'الدمام', 'مكة', 'المدينة المنورة']
  countryToCitiesMap['UAE'] = ['دبي', 'أبوظبي', 'الشارقة', 'عجمان']

  return countryToCitiesMap
}

export const countryToCitiesMap = mapCitiesToCountries()
export const allCities = [...new Set(Object.values(countryToCitiesMap).flat())].map(c => ({ value: c, label: c }))

export const ACCREDITATION_OPTIONS = [
  { value: 'international', label: 'معتمدة دولياً' },
  ...COUNTRIES.map(c => ({ value: c.value, label: `معتمدة في ${c.label}` })),
]

export const SEMESTERS = [
  { value: 'fall', label: 'خريف' },
  { value: 'spring', label: 'ربيع' },
  { value: 'summer', label: 'صيف' },
]

export const DEGREE_LEVELS = [
  { value: 'diploma', label: 'دبلوم' },
  { value: 'bachelor', label: 'بكالوريوس' },
  { value: 'master', label: 'ماجستير' },
  { value: 'phd', label: 'دكتوراة' },
]

export const STUDY_LANGUAGES = [
  { value: 'english', label: 'إنجليزي' },
  { value: 'chinese', label: 'صيني' },
  { value: 'german', label: 'ألماني' },
  { value: 'italian', label: 'إيطالي' },
  { value: 'turkish', label: 'تركي' },
  { value: 'other', label: 'آخر' },
]

export const SCHOLARSHIP_TYPES = [
  { value: 'none', label: 'بدون' },
  { value: '25', label: 'منحة جزئية 25%' },
  { value: '50', label: 'منحة جزئية 50%' },
  { value: '75', label: 'منحة جزئية 75%' },
  { value: 'full', label: 'منحة كاملة' },
]

export const LANGUAGE_REQUIREMENTS = [
  { value: 'none', label: 'لا يشترط' },
  { value: 'ielts_toefl', label: 'يشترط IELTS أو TOEFL' },
  { value: 'preparatory_year', label: 'سنة تحضيرية متاحة' },
  { value: 'internal_test', label: 'اختبار داخلي' },
]

export const INTAKE_STATUS_LABELS = {
  open: { text: 'مفتوح الآن', color: 'bg-green-100 text-green-800' },
  closed: { text: 'مغلق', color: 'bg-red-100 text-red-800' },
  opening_soon: { text: 'يفتح قريباً', color: 'bg-yellow-100 text-yellow-800' },
}

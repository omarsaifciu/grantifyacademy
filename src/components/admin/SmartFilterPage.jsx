
import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  getUniversities,
  getPrograms,
  getApplicationIntakes,
  getRequiredDocuments,
  getProgramRequiredDocuments,
  getNationalityRequirements,
  computeIntakeStatus
} from '@/lib/storage'

const COUNTRIES = [
  { value: '', label: 'كل الدول' },
  { value: 'China', label: 'الصين' },
  { value: 'Cyprus', label: 'قبرص' },
  { value: 'Georgia', label: 'جورجيا' },
  { value: 'Malaysia', label: 'ماليزيا' },
  { value: 'Germany', label: 'ألمانيا' },
  { value: 'UK', label: 'البريطانيا' },
  { value: 'Italy', label: 'إيطاليا' },
  { value: 'Rwanda', label: 'رواندا' },
]

const DEGREE_LEVELS = [
  { value: '', label: 'كل المستويات' },
  { value: 'diploma', label: 'دبلوم' },
  { value: 'bachelor', label: 'بكالوريوس' },
  { value: 'master', label: 'ماجستير' },
  { value: 'phd', label: 'دكتوراة' },
]

const SmartFilterPage = () => {
  const [universities, setUniversities] = useState([])
  const [programs, setPrograms] = useState([])
  const [requiredDocuments, setRequiredDocuments] = useState([])
  const [nationalityRequirements, setNationalityRequirements] = useState([])
  
  const [filters, setFilters] = useState({
    country: '',
    degreeLevel: '',
    maxFee: '',
    studentGPA: '',
    studentNationality: '',
  })
  
  const [results, setResults] = useState([])

  useEffect(() => {
    const loadData = async () => {
      const unis = await getUniversities()
      const progs = await Promise.all(unis.map(async (uni) => {
        const uniPrograms = await getPrograms(uni.id)
        return uniPrograms.map(p => ({ ...p, university: uni }))
      }))
      const docs = await getRequiredDocuments()
      const reqs = await getNationalityRequirements()
      
      setUniversities(unis)
      setPrograms(progs.flat())
      setRequiredDocuments(docs)
      setNationalityRequirements(reqs)
      setResults(progs.flat())
    }
    loadData()
  }, [])

  const handleFilterChange = (e) => {
    const { name, value } = e.target
    setFilters(prev => ({ ...prev, [name]: value }))
  }

  const applyFilters = () => {
    let filtered = [...programs]

    if (filters.country) {
      filtered = filtered.filter(p => p.university?.country === filters.country)
    }
    if (filters.degreeLevel) {
      filtered = filtered.filter(p => p.degree_level === filters.degreeLevel)
    }
    if (filters.maxFee) {
      filtered = filtered.filter(p => (p.tuition_fee_original || 0) <= Number(filters.maxFee))
    }
    if (filters.studentGPA) {
      filtered = filtered.filter(p => (p.min_gpa_percentage || 0) <= Number(filters.studentGPA))
    }

    setResults(filtered)
  }

  const getNationalityNotes = (program) => {
    if (!filters.studentNationality) return []
    return nationalityRequirements.filter(req => {
      const matchesNationality = req.student_nationality === filters.studentNationality
      const matchesDestination = req.applies_to_destination === 'all' || req.applies_to_destination === program.university?.country
      return matchesNationality && matchesDestination
    })
  }

  const getProgramDocuments = async (programId) => {
    const prds = await getProgramRequiredDocuments(programId)
    return requiredDocuments.filter(doc => 
      prds.some(prd => prd.required_document_id === doc.id && prd.is_required)
    )
  }

  const [programDocuments, setProgramDocuments] = useState({})
  
  useEffect(() => {
    const loadDocs = async () => {
      const docsMap = {}
      for (const prog of results) {
        docsMap[prog.id] = await getProgramDocuments(prog.id)
      }
      setProgramDocuments(docsMap)
    }
    loadDocs()
  }, [results])

  const getProgramIntakes = async (universityId) => {
    const intakes = await getApplicationIntakes(universityId)
    return intakes.map(i => ({ ...i, status: computeIntakeStatus(i) }))
  }

  const [programIntakes, setProgramIntakes] = useState({})
  
  useEffect(() => {
    const loadIntakes = async () => {
      const intakesMap = {}
      const uniqueUnis = [...new Set(results.map(p => p.university_id))]
      for (const uniId of uniqueUnis) {
        intakesMap[uniId] = await getProgramIntakes(uniId)
      }
      setProgramIntakes(intakesMap)
    }
    loadIntakes()
  }, [results])

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card border rounded-xl p-6"
      >
        <h2 className="text-2xl font-bold mb-6 gradient-text">بحث ذكي في البرامج</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          <div>
            <Label htmlFor="country">الدولة</Label>
            <select
              id="country"
              name="country"
              value={filters.country}
              onChange={handleFilterChange}
              className="w-full rounded-md border bg-transparent px-3 py-2"
            >
              {COUNTRIES.map(c => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
          </div>
          
          <div>
            <Label htmlFor="degreeLevel">المستوى الدراسي</Label>
            <select
              id="degreeLevel"
              name="degreeLevel"
              value={filters.degreeLevel}
              onChange={handleFilterChange}
              className="w-full rounded-md border bg-transparent px-3 py-2"
            >
              {DEGREE_LEVELS.map(d => (
                <option key={d.value} value={d.value}>{d.label}</option>
              ))}
            </select>
          </div>
          
          <div>
            <Label htmlFor="maxFee">الحد الأقصى للرسوم ($)</Label>
            <Input
              id="maxFee"
              name="maxFee"
              type="number"
              value={filters.maxFee}
              onChange={handleFilterChange}
              placeholder="مثال: 5000"
            />
          </div>
          
          <div>
            <Label htmlFor="studentGPA">معدل الطالب (%)</Label>
            <Input
              id="studentGPA"
              name="studentGPA"
              type="number"
              value={filters.studentGPA}
              onChange={handleFilterChange}
              placeholder="مثال: 75"
            />
          </div>
          
          <div>
            <Label htmlFor="studentNationality">جنسية الطالب</Label>
            <Input
              id="studentNationality"
              name="studentNationality"
              value={filters.studentNationality}
              onChange={handleFilterChange}
              placeholder="مثال: سوداني"
            />
          </div>
        </div>
        
        <div className="flex justify-end">
          <Button onClick={applyFilters}>تطبيق البحث</Button>
        </div>
      </motion.div>

      <div className="space-y-4">
        <h3 className="text-xl font-bold">النتائج ({results.length} برنامج)</h3>
        
        {results.map((program, index) => {
          const nationalityNotes = getNationalityNotes(program)
          const docs = programDocuments[program.id] || []
          const intakes = programIntakes[program.university_id] || []
          
          return (
            <motion.div
              key={program.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-card border rounded-xl p-6"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className="text-lg font-bold">{program.program_name}</h4>
                  <p className="text-muted-foreground">
                    {program.university?.name} • {COUNTRIES.find(c => c.value === program.university?.country)?.label}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg">{program.tuition_fee_original} $</p>
                  {program.tuition_fee_after_discount && (
                    <p className="text-sm text-green-600 font-semibold">بعد الخصم: {program.tuition_fee_after_discount} $</p>
                  )}
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
                <div>
                  <p className="text-muted-foreground">المستوى</p>
                  <p>{DEGREE_LEVELS.find(d => d.value === program.degree_level)?.label}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">المدة</p>
                  <p>{program.duration_years} سنوات</p>
                </div>
                <div>
                  <p className="text-muted-foreground">أدنى معدل</p>
                  <p>{program.min_gpa_percentage || 'غير محدد'}%</p>
                </div>
                <div>
                  <p className="text-muted-foreground">المنحة</p>
                  <p>
                    {program.scholarship_type === 'none' ? 'بدون' : 
                     program.scholarship_type === 'full' ? 'منحة كاملة' : 
                     `منحة ${program.scholarship_type}%`}
                  </p>
                </div>
              </div>
              
              {intakes.length > 0 && (
                <div className="mb-4">
                  <h5 className="font-semibold mb-2">مواعيد التقديم:</h5>
                  <div className="space-y-2">
                    {intakes.map(intake => (
                      <div key={intake.id} className="bg-secondary/30 p-3 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-semibold">
                              {intake.semester_name === 'fall' ? 'خريف' : 
                               intake.semester_name === 'spring' ? 'ربيع' : 'صيف'}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              فتح: {(() => { const d = new Date(intake.application_open_date); return `${d.getFullYear()}/${String(d.getMonth()+1).padStart(2,'0')}/${String(d.getDate()).padStart(2,'0')}`; })()} - إغلاق: {(() => { const d = new Date(intake.application_close_date); return `${d.getFullYear()}/${String(d.getMonth()+1).padStart(2,'0')}/${String(d.getDate()).padStart(2,'0')}`; })()}
                            </p>
                            {intake.expected_admission_result_date && (
                              <p className="text-sm text-muted-foreground">
                                صدور القبول: {(() => { const d = new Date(intake.expected_admission_result_date); return `${d.getFullYear()}/${String(d.getMonth()+1).padStart(2,'0')}/${String(d.getDate()).padStart(2,'0')}`; })()}
                              </p>
                            )}
                            {intake.semester_start_date && (
                              <p className="text-sm text-muted-foreground">
                                بداية الفصل: {(() => { const d = new Date(intake.semester_start_date); return `${d.getFullYear()}/${String(d.getMonth()+1).padStart(2,'0')}/${String(d.getDate()).padStart(2,'0')}`; })()}
                              </p>
                            )}
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            intake.status === 'open' ? 'bg-green-100 text-green-800' :
                            intake.status === 'opening_soon' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {intake.status === 'open' ? 'مفتوح الآن' : intake.status === 'opening_soon' ? 'يفتح قريباً' : 'مغلق'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {docs.length > 0 && (
                <div className="mb-4">
                  <h5 className="font-semibold mb-2">المستندات المطلوبة:</h5>
                  <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                    {docs.map(doc => (
                      <li key={doc.id}>{doc.name}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              {nationalityNotes.length > 0 && (
                <div>
                  <h5 className="font-semibold mb-2">ملاحظات للجنسية {filters.studentNationality}:</h5>
                  {nationalityNotes.map(note => (
                    <div
                      key={note.id}
                      className={`p-3 rounded-lg border ${
                        note.severity === 'mandatory' ? 'border-red-200 bg-red-50' : 'border-yellow-200 bg-yellow-50'
                      }`}
                    >
                      <p className="font-medium">{note.condition_text}</p>
                      {note.extra_document_required && (
                        <p className="text-sm mt-1">مستند إضافي مطلوب: {note.extra_document_required}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )
        })}
        
        {results.length === 0 && (
          <p className="text-center text-muted-foreground py-12">لا توجد نتائج مطابقة للبحث</p>
        )}
      </div>
    </div>
  )
}

export default SmartFilterPage

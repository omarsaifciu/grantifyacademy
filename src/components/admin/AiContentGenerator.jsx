import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Sparkles, CalendarClock, Settings, FileText, RefreshCw, Trash2, Instagram, ChevronDown, ChevronUp, Copy } from 'lucide-react';
import { getAiContent, createAiContent, deleteAiContent } from '@/lib/storage';

const TOPICS = [
  { id: 'universities', label: 'الجامعات' },
  { id: 'majors', label: 'التخصصات' },
  { id: 'scholarships', label: 'المنح الدراسية' },
  { id: 'admissions', label: 'القبولات والتسجيل' },
  { id: 'study_abroad', label: 'الدراسة في الخارج' },
  { id: 'student_life', label: 'حياة الطلاب' },
  { id: 'language_tips', label: 'نصائح لغوية' },
  { id: 'career', label: 'المسار المهني' },
  { id: 'visa', label: 'التأشيرات والإقامة' },
  { id: 'funding', label: 'التمويل والمنح' },
];

const CONTENT_TYPES = [
  { id: 'reel', label: 'Reel' },
  { id: 'carousel', label: 'Carousel' },
  { id: 'post', label: 'منشور' },
  { id: 'story', label: 'Story' },
];

const HOOK_STYLES = ['سؤال صادم', 'إحصائية مفاجئة', 'مشهد درامي', 'تحدي', 'فضول'];

const SCRIPT_TEMPLATES = {
  universities: [
    {
      type: 'reel',
      hooks: [
        { style: 'سؤال صادم', spoken: 'هل تعرف أن ٧٠٪ من الطلاب يندمون على اختيار جامعتهم بعد السنة الأولى؟', caption: 'هل تعرف أن ٧٠٪ من الطلاب يندمون؟', visual: 'طالب ينظر لشاشة الجوال بصدمة' },
        { style: 'إحصائية مفاجئة', spoken: 'جامعة وحدة في تركيا تخرج منها ٣ وزراء تعليم عربي!', caption: '٣ وزراء من جامعة واحدة!', visual: 'صور متتالية لـ ٣ شخصيات مع اسم الجامعة' },
        { style: 'فضول', spoken: 'قبل ما تقدم على جامعة، اسمع هالـ٣ نصائح الذهبية', caption: '٣ نصائح قبل التقديم', visual: 'رقم ٣ يظهر بشكل كبير مع أيقونات' },
      ],
      story: [
        { visual: 'مقارنة بين جامعتين بنفس التصنيف', caption: 'التصنيف العالمي مو كل شيء!' },
        { visual: 'طالب يسأل خريجين عن تجربتهم', caption: 'اسأل خريجين قبل لا تقدم' },
        { visual: 'خريطة توضح موقع الجامعة والمدينة', caption: 'موقع الجامعة = مستقبلك' },
        { visual: 'مخطط يوضح نسبة التوظيف بعد التخرج', caption: 'نسبة التوظيف: ٨٥٪ خلال ٦ أشهر' },
      ],
      resolution: 'خلاصة: الجامعة المناسبة = تصنيف + تخصص + موقع + توظيف. شارك هالريل مع صديفك اللي بيدور على جامعة!',
      cta: 'اكتب 🔥 إذا استفدت وشاركه مع صديق محتار',
      loop: 'إعادة السؤال الأول بشكل سريع كتذكير',
      audio: 'صوت إيقاعي متصاعد مع tone تحفيزي',
      hashtags: '#اختيار_الجامعة #جامعات #تعليم_عالي #نصائح_طلابية #ابتعاث',
      caption: '٧٠٪ من الطلاب يندمون على اختيار جامعتهم! لا تكرر نفس الغلطة 😱 شوف الفيديو قبل ما تقرر 👆',
    },
    {
      type: 'carousel',
      hooks: [
        { style: 'تحدي', spoken: 'تحدد جامعة المستقبل في ٣٠ ثانية؟', caption: '٣٠ ثانية فقط!', visual: 'مؤقت ٣٠ ثانية يبدأ بالعد التنازلي' },
        { style: 'سؤال صادم', spoken: 'وش المقياس الحقيقي لجودة الجامعة؟', caption: 'المقياس الحقيقي!', visual: 'علامة استفهام كبيرة تتحول إلى أيقونات مختلفة' },
        { style: 'إحصائية مفاجئة', spoken: 'فقط ١٢٪ من الطلاب يبحثون عن هالتفاصيل قبل التقديم', caption: '١٢٪ فقط!', visual: 'رسم بياني يظهر ١٢٪' },
      ],
      story: [
        { visual: 'عناصر المقارنة: التصنيف، التخصص، الموقع، التكاليف', caption: '٤ عناصر أساسية' },
        { visual: 'مقارنة بين جامعات حكومية وأهلية', caption: 'حكومي vs أهلي' },
        { visual: 'جدول يوضح أفضل التخصصات المطلوبة', caption: 'التخصصات المطلوبة ٢٠٢٦' },
        { visual: 'قائمة بمواقع التقديم الرسمية', caption: 'روابط التقديم المباشرة' },
      ],
      resolution: 'الخلاصة: لا تعتمد على شهرة الجامعة فقط. ابحث عن تخصصك بالدرجة الأولى.',
      cta: 'احفظ هالبوست عشان ترجع له لاحقاً!',
      loop: null,
      audio: 'موسيقى هادئة مناسبة لمحتوى تعليمي',
      hashtags: '#دليل_الجامعات #اختيار_تخصص #تعليم #طالب_جامعي #نصائح',
      caption: '📌 دليل شامل لاختيار الجامعة المناسبة! احفظ وشارك المنشور عشان يفيد غيرك 👇',
    },
  ],
  scholarships: [
    {
      type: 'reel',
      hooks: [
        { style: 'إحصائية مفاجئة', spoken: 'أكثر من ١٠٠ منحة دراسية كاملة ماتحتاج GPA عالي!', caption: '١٠٠+ منحة بدون GPA!', visual: 'أرقام تظهر بشكل متتالي مع أيقونات الدول' },
        { style: 'سؤال صادم', spoken: 'وش يمنعك من التقديم على منحة؟ الجهل؟ الخوف؟', caption: 'وش يمنعك؟ 😤', visual: 'طالب قاعد يتأمل ويتساءل' },
        { style: 'فضول', spoken: '٣ منحات انقرضت بسبب قلة المتقدمين!', caption: 'منحات ماتت!', visual: 'صورة منحة يتصاعد منها دخان' },
      ],
      story: [
        { visual: 'قائمة بأسماء ٥ منحات ممولة بالكامل', caption: 'أشهر ٥ منحات ٢٠٢٦' },
        { visual: 'شروط التقديم الأساسية (جواز سفر، شهادات، لغة)', caption: 'الأوراق المطلوبة' },
        { visual: 'جدول يوضح مواعيد التقديم لكل منحة', caption: 'المواعيد النهائية' },
        { visual: 'رابط التقديم المباشر يظهر على الشاشة', caption: 'الرابط في الوصف 👇' },
      ],
      resolution: 'الفرصة قدامك، بس المنافسة شرسة. قدّم اليوم قبل ما يقفل الباب!',
      cta: 'احفظ الفيديو وقدّم على الـ ٥ منحات، وعلّق "تم" لما تقدم',
      loop: 'تكرار الإحصائية الأولى بشكل سريع',
      audio: 'صوت حماسي تصاعدي مع tone طموح',
      hashtags: '#منح_دراسية #ابتعاث #فرص_ذهبية #دراسة_مجانا #منحة_2026',
      caption: '١٠٠+ منحة كاملة ماتحتاج معدل عالي! 😱 قدّم قبل فوات الأوان 👆',
    },
    {
      type: 'carousel',
      hooks: [
        { style: 'تحدي', spoken: 'أقدر أقدم على ١٠ منحات في يوم واحد؟', caption: '١٠ منحات في يوم!', visual: 'تحدي وقت مع قائمة منحات' },
        { style: 'إحصائية مفاجئة', spoken: '٦٠٪ من الطلاب مايكملون طلبات المنح بسبب الأوراق', caption: '٦٠٪ يستسلمون!', visual: 'مخطط دائري يظهر ٦٠٪' },
        { style: 'مشهد درامي', spoken: 'يوم طلعت نتيجة المنحة وقلبي يقرع...', caption: 'لحظة الحقيقة 💔', visual: 'شاشة جوال تظهر قبول منحة' },
      ],
      story: [
        { visual: 'الخطوة ١: البحث عن المنحة المناسبة', caption: '١- البحث' },
        { visual: 'الخطوة ٢: تجهيز الأوراق المطلوبة', caption: '٢- التجهيز' },
        { visual: 'الخطوة ٣: كتابة خطاب النوايا', caption: '٣- خطاب النوايا 📝' },
        { visual: 'الخطوة ٤: التقديم والمتابعة', caption: '٤- التقديم ✅' },
      ],
      resolution: '٤ خطوات فقط تفصلك عن منحة أحلامك. ابدأ اليوم.',
      cta: 'احفظ الكاروسيل عشان تطبق الخطوات',
      loop: null,
      audio: 'صوت هادئ مشجع مناسب لمحتوى تعليمي',
      hashtags: '#خطوات_المنحة #كيف_أقدم #منحة_دراسية #ابتعاث #فرصة',
      caption: '🎯 ٤ خطوات بسيطة للحصول على منحة دراسية! ابدأ رحلتك التعليمية من هنا 👇',
    },
  ],
  majors: [
    {
      type: 'reel',
      hooks: [
        { style: 'سؤال صادم', spoken: 'اخترت تخصصك بناءً على وش؟ ضغط أهلك؟ ولا حسب سوق العمل؟', caption: 'ليش اخترت تخصصك؟', visual: 'مقابلة سريعة مع طلاب متنوعة إجاباتهم' },
        { style: 'إحصائية مفاجئة', spoken: 'تخصص واحد بالذات مطلوب في ٢٥ دولة عربية وأجنبية!', caption: 'مطلوب في ٢٥ دولة!', visual: 'خريطة العالم تضيء فيها ٢٥ دولة' },
        { style: 'فضول', spoken: 'أعلى ٣ تخصصات رواتباً في ٢٠٢٦', caption: 'أعلى رواتب ٢٠٢٦ 💰', visual: 'شريط تصاعدي للرواتب' },
      ],
      story: [
        { visual: 'لائحة بأعلى ٥ تخصصات مطلوبة', caption: 'أكثر التخصصات طلباً' },
        { visual: 'مقارنة بين التخصصات النظرية والعملية', caption: 'نظري vs عملي' },
        { visual: 'نصائح: اختر تخصصك بناءً على ٣ عوامل', caption: '٣ معايير ذهبية' },
        { visual: 'خريطة مسار وظيفي لكل تخصص', caption: 'مسارك الوظيفي 🚀' },
      ],
      resolution: 'التخصص مو مصيرك النهائي، بس بوابتك الصحيحة. اختار بوعي.',
      cta: 'علق بتخصصك وشوف إذا زيك كتير!',
      loop: 'إعادة السؤال الأول: "ليش اخترت تخصصك؟"',
      audio: 'صوت ديناميكي إيقاعي مناسب لمحتوى تحفيزي',
      hashtags: '#اختيار_تخصص #تخصصات_جامعية #سوق_العمل #مستقبل_مهني #طالب_جامعي',
      caption: 'أعلى التخصصات طلباً في ٢٠٢٦ 🔥 هل تخصصك موجود؟ شوف الفيديو وعلق 🔽',
    },
  ],
  study_abroad: [
    {
      type: 'reel',
      hooks: [
        { style: 'مشهد درامي', spoken: 'يوم سافرت للدراسة بالخارج ومعي ١٠٠٠ دولار فقط', caption: '١٠٠٠ دولار وطموح! ✈️', visual: 'مطار، شنطة سفر، جواز سفر' },
        { style: 'إحصائية مفاجئة', spoken: 'الدراسة في أوروبا ممكن تكلف أقل من مصر والسعودية!', caption: 'أقل من المتوقع!', visual: 'مقارنة تكاليف بين دول' },
        { style: 'سؤال صادم', spoken: 'ودك تدرس بالخارج بس خايف من التكاليف؟', caption: 'التكاليف مش عائق!', visual: 'صورة حصالة تنكسر وتظهر منها عملات' },
      ],
      story: [
        { visual: 'أرخص ٥ دول للدراسة بالخارج', caption: 'أرخص الدول 🌍' },
        { visual: 'مقارنة تكاليف المعيشة والرسوم', caption: 'التكاليف بالتفصيل' },
        { visual: 'خطوات التقديم للجامعات الخارجية', caption: 'خطوات السفر 🛫' },
        { visual: 'نصائح التكيف مع ثقافة جديدة', caption: 'نصائح بعد الوصول' },
      ],
      resolution: 'الدراسة بالخارج مو حلم بعيد. خطط، قدم، واسعى.',
      cta: 'شارك الفيديو مع صديفك اللي حابب يدرس بالخارج',
      loop: 'تكرار مشهد المطار مع جملة "البداية كانت هنا"',
      audio: 'موسيقى تصاعدية حماسية مع sound effects سفر',
      hashtags: '#دراسة_بالخارج #ابتعاث #سفر_للتعليم #تجربة_طالب #فرص_دراسية',
      caption: '✈️ الدراسة بالخارج أوفر مما تتخيل! شوف الفيديو وتعرف على التفاصيل 👆',
    },
  ],
  student_life: [
    {
      type: 'reel',
      hooks: [
        { style: 'تحدي', spoken: 'اقدر أعيش ب١٠٠ دولار أسبوعياً كطالب بالسكن؟', caption: '١٠٠$ أسبوعياً!', visual: 'ميزانية طالب تظهر على الشاشة' },
        { style: 'فضول', spoken: '٥ أشياء تمنيت أحد قالها لي قبل أول يوم جامعة', caption: '٥ نصائح للمستجدين', visual: 'طالب جديد يضيع في الحرم الجامعي' },
        { style: 'مشهد درامي', spoken: 'يوم فاتتني أول محاضرة لأني ضعت في الجامعة', caption: 'ضائع في الحرم 😅', visual: 'طالب يجري بين المباني' },
      ],
      story: [
        { visual: 'الروتين اليومي المثالي للطالب', caption: 'روتين ناجح ⏰' },
        { visual: 'نصائح للتنقل والسكن', caption: 'سكن ومواصلات 🏠' },
        { visual: 'أفضل تطبيقات للطالب الجامعي', caption: 'تطبيقات لازم تنزلها 📱' },
        { visual: 'كيف توازن بين الدراسة والحياة', caption: 'توازن = نجاح ⚖️' },
      ],
      resolution: 'حياة الجامعة أجمل مرحلة لو عرفت تتعامل معها.',
      cta: 'احفظ الفيديو عشان ترجع للروتين، وعلّق بنصيحتك للطلاب الجدد',
      loop: 'مشهد سريع لطالب ناجح يتخرج',
      audio: 'صوت شبابي مرح مناسب لمحتوى طلابي',
      hashtags: '#حياة_الطلاب #طالب_جامعي #السكن_الطلابي #نصائح_جامعية #تجربة_طالب',
      caption: '📚 أول سنة جامعة؟ لا تفوت هالخمس نصائح اللي تمنيتها من أول يوم! 🔽',
    },
  ],
  language_tips: [
    {
      type: 'reel',
      hooks: [
        { style: 'إحصائية مفاجئة', spoken: '٣ شهور فقط تكفي تتقن إنجليزي المحادثة!', caption: 'الإنجليزية في ٣ شهور!', visual: 'مؤقت ٣ شهور يمر بسرعة' },
        { style: 'تحدي', spoken: 'تتحداك تتعلم ١٠ كلمات إنجليزية جديدة اليوم', caption: 'تحدي ١٠ كلمات', visual: 'تحدي written على الشاشة' },
        { style: 'سؤال صادم', spoken: 'ليش أغلب الطلاب يتخرجون ولغتهم ضعيفة؟', caption: 'المشكلة بالطريقة!', visual: 'شهادة جامعية مع علامة استفهام' },
      ],
      story: [
        { visual: 'أفضل ٣ طرق لتعلم اللغة بسرعة', caption: 'الطرق الفعالة 🚀' },
        { visual: 'تطبيقات مجانية لتعلم اللغة', caption: 'تطبيقات مجانية 📱' },
        { visual: 'قنوات يوتيوب مفيدة لتعلم الإنجليزية', caption: 'قنوات ممتازة ▶️' },
        { visual: 'طريقة بناء المفردات اليومية', caption: 'خريطة المفردات 🗺️' },
      ],
      resolution: 'اللغة مفتاحك للدراسة بالخارج والفرص الذهبية.',
      cta: 'علّق بكلمة إنجليزية جديدة تعلمتها اليوم، وشارك التحدي مع صديق',
      loop: 'تكرار "٣ شهور" مع صور ة طالب يتحدث إنجليزي بطلاقة',
      audio: 'صوت خفيف مناسب مع tone تعليمي',
      hashtags: '#تعلم_الإنجليزية #مهارات_لغوية #لغة_إنجليزية #نصائح_لغوية #تطوير_الذات',
      caption: '🟢 إنجليزي المحادثة في ٣ شهور! الطرق الفعالة اللي ماتعلمك إياها المدرسة 👆',
    },
  ],
  career: [
    {
      type: 'carousel',
      hooks: [
        { style: 'فضول', spoken: 'وش تسوي بشهادتك بعد التخرج؟ ٥ مسارات مهنية متوقعة', caption: '٥ مسارات مهنية', visual: 'شهادة جامعية تتحول لمسارات متعددة' },
        { style: 'إحصائية مفاجئة', spoken: '٤٠٪ من الخريجين يشتغلون في غير تخصصهم!', caption: '٤٠٪ خارج التخصص!', visual: 'إحصائية على الشاشة' },
        { style: 'سؤال صادم', spoken: 'مستعد لسوق العمل بعد التخرج؟', caption: 'مستعد؟', visual: 'مقابلة عمل' },
      ],
      story: [
        { visual: 'السيرة الذاتية المثالية للخريج الجديد', caption: 'CV مثالي 📄' },
        { visual: 'منصات العمل الحر للخريجين', caption: 'منصات توظيف 🌐' },
        { visual: 'المهارات المطلوبة في سوق العمل', caption: 'مهارات مطلوبة 💪' },
        { visual: 'نصائح لمقابلات العمل', caption: 'نصائح المقابلات 🎯' },
      ],
      resolution: 'سوق العمل ينتظرك. جهز نفسك من الآن.',
      cta: 'احفظ البوست وشاركه مع زميلك الخريج',
      loop: null,
      audio: 'صوت جاد مناسب لمحتوى مهني',
      hashtags: '#سوق_العمل #توظيف #خريجين_جدد #مسيرة_مهنية #CV',
      caption: '💼 ٥ مسارات مهنية بعد التخرج! جهز نفسك لسوق العمل من الآن 👇',
    },
  ],
  visa: [
    {
      type: 'reel',
      hooks: [
        { style: 'مشهد درامي', spoken: '٦ شهور من التقديم للسفارة للحصول على الفيزا الدراسية', caption: '٦ شهور انتظار!', visual: 'مكدس أوراق وجواز سفر' },
        { style: 'إحصائية مفاجئة', spoken: 'نسبة رفض الفيزا للطلاب العرب وصلت ٤٥٪، تعرف ليش؟', caption: '٤٥٪ رفض!', visual: 'ختم رفض فيزا مقرب' },
        { style: 'فضول', spoken: '٥ أخطاء تسبب رفض الفيزا الدراسية', caption: '٥ أخطاء قاتلة', visual: 'قائمة تتشطب تدريجياً' },
      ],
      story: [
        { visual: 'المستندات المطلوبة للتقديم على الفيزا', caption: 'الأوراق المطلوبة 📋' },
        { visual: 'خطوات التقديم الصحيحة', caption: 'خطوات التقديم ✅' },
        { visual: 'نصائح لمقابلة السفارة', caption: 'مقابلة السفارة 🎙️' },
        { visual: 'جدول مواعيد السفارات المختلفة', caption: 'مواعيد التقديم 📅' },
      ],
      resolution: 'الفيزا خطوة وليست عائق. حضّر أوراقك جيداً وبتنجح.',
      cta: 'شارك الفيديو مع كل طالب ناوي يدرس بالخارج',
      loop: 'إعادة مشهد الحصول على الفيزا مع جملة "الحلم بدأ هنا"',
      audio: 'صوت متصاعد مع tone جدي ومفيد',
      hashtags: '#فيزا_دراسية #تأشيرة #سفارة #دراسة_بالخارج #أوراق_السفر',
      caption: '🛂 ٥ أخطاء تسبب رفض الفيزا الدراسية! تجنبها وقدّم صح 👆',
    },
  ],
  funding: [
    {
      type: 'carousel',
      hooks: [
        { style: 'إحصائية مفاجئة', spoken: 'هناك أكثر من ٥٠٠ صندوق تمويل طلابي حول العالم!', caption: '٥٠٠ صندوق!', visual: 'خريطة العالم بنقاط تمويل متعددة' },
        { style: 'سؤال صادم', spoken: 'ماتكفيك المنحة؟ في طرق تمويل ثانية ماتعرفها', caption: 'بدائل المنحة 💡', visual: 'خيارات تمويل متعددة' },
        { style: 'فضول', spoken: 'كيف تموّل دراستك بدون منحة ولا قرض؟', caption: 'تمويل بدون قرض', visual: 'طالب يكتشف خيارات التمويل' },
      ],
      story: [
        { visual: 'أنواع التمويل الطلابي', caption: 'أنواع التمويل 💰' },
        { visual: 'المنح الجزئية والكاملة', caption: 'منح جزئية vs كاملة' },
        { visual: 'برامج العمل والدراسة', caption: 'اعمل وتعلم 💼' },
        { visual: 'المنصات المتاحة للبحث عن تمويل', caption: 'مصادر التمويل 🔍' },
      ],
      resolution: 'تمويل دراستك ممكن بعدة طرق. لا تستسلم بسهولة.',
      cta: 'احفظ الكاروسيل وابحث عن خيار التمويل المناسب لك',
      loop: null,
      audio: 'صوت هادئ وواثق',
      hashtags: '#تمويل_طلابي #منح #قروض_دراسية #العمل_والتعلم #دعم_الطلاب',
      caption: '💰 ٥٠٠+ صندوق تمويل طلابي حول العالم! اكتشف كيف تمول دراستك 👇',
    },
  ],
};

const defaultTemplates = [
  {
    type: 'reel',
    hooks: [
      { style: 'سؤال صادم', spoken: 'هل تعرف أن المعلومة اللي جاية ممكن تغير مسارك؟', caption: 'هل تعرف؟ 🤔', visual: 'مقدمة تشويقية' },
      { style: 'فضول', spoken: 'قبل ما تكمل سكرول، تعرف على هالمعلومة', caption: 'قبل السكرول ⏸️', visual: 'إشارة توقف' },
      { style: 'تحدي', spoken: 'أتحداك ماتغير رأيك بعد هالمقطع', caption: 'أتحداك! 🔥', visual: 'تحدي written' },
    ],
    story: [
      { visual: 'مقدمة عن الموضوع', caption: 'البداية' },
      { visual: 'تفصيل المعلومات', caption: 'التفاصيل' },
      { visual: 'أمثلة تطبيقية', caption: 'أمثلة' },
      { visual: 'نتائج وتوصيات', caption: 'النتائج' },
    ],
    resolution: 'الخلاصة: المعرفة قوة. شارك المعلومة لتعم الفائدة.',
    cta: 'شارك مع صديفك وعلّق برأيك',
    loop: null,
    audio: 'صوت مناسب للمحتوى التعليمي',
    hashtags: '#معلومة #توعية #تعليم #ثقافة',
    caption: 'معلومة مهمة لا تفوتك 👆 شاركها مع غيرك',
  },
];

function generateScriptsCollection(postsPerDay, selectedTopics) {
  const selected = TOPICS.filter((t) => selectedTopics.includes(t.id));
  if (selected.length === 0) return [];

  const results = [];
  for (let i = 0; i < postsPerDay; i++) {
    const topic = selected[i % selected.length];
    const templates = SCRIPT_TEMPLATES[topic.id];
    const pool = templates && templates.length > 0 ? templates : defaultTemplates;
    const base = pool[i % pool.length];

    const hook = base.hooks[i % base.hooks.length];
    const storyScenes = base.story.map((s) => `${s.visual} — ${s.caption}`).join('\n');

    const fullScript = `🎯 الموضوع: ${topic.label}
⏱️ المدة: ٣٠-٤٥ ثانية

────────── 🪝 الهوك ──────────
النوع: ${hook.style}
النص المنطوق: "${hook.spoken}"
النص الظاهر: "${hook.caption}"
اللقطة: ${hook.visual}

────────── 📖 الجسم ──────────
${storyScenes}

────────── 🏁 الخاتمة ──────────
${base.resolution}
CTA: ${base.cta}
${base.loop ? `🔄 نهاية لوب: ${base.loop}` : ''}

────────── 🎵 الصوت ──────────
${base.audio}

────────── ✍️ الوصف ──────────
${base.caption}

────────── #️⃣ الهاشتاغات ──────────
${base.hashtags}

📐 مواصفات تقنية: عمودي 9:16 | 1080×1920 | 30fps`;

    results.push({
      topic: topic.label,
      type: base.type,
      caption: fullScript,
      hashtags: base.hashtags,
      scheduled_at: new Date(Date.now() + (i + 1) * 86400000 + (6 + i) * 3600000).toISOString(),
      status: 'draft',
      settings: { posts_per_day: postsPerDay, topics: selectedTopics, hook_style: hook.style },
    });
  }
  return results;
}

const AiContentGenerator = () => {
  const [scripts, setScripts] = useState([]);
  const [postsPerDay, setPostsPerDay] = useState(3);
  const [selectedTopics, setSelectedTopics] = useState(['universities', 'scholarships']);
  const [generating, setGenerating] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const data = await getAiContent();
        setScripts(data);
      } catch (e) {
        console.error('Failed to load AI content:', e);
      }
      setLoading(false);
    })();
  }, []);

  const toggleTopic = (id) => {
    setSelectedTopics((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
    );
  };

  const generateContent = async () => {
    setGenerating(true);
    await new Promise((r) => setTimeout(r, 2000));
    const generated = generateScriptsCollection(postsPerDay, selectedTopics);
    const results = [];
    for (const item of generated) {
      try {
        const saved = await createAiContent(item);
        results.push(saved);
      } catch (e) {
        console.error('Failed to save AI content:', e);
      }
    }
    setScripts((prev) => [...results, ...prev]);
    setGenerating(false);
  };

  const deleteScript = async (id) => {
    try {
      await deleteAiContent(id);
      setScripts((prev) => prev.filter((s) => s.id !== id));
    } catch (e) {
      console.error('Failed to delete AI content:', e);
    }
  };

  const copyScript = (text) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-foreground">موظف الذكاء الاصطناعي</h2>
        <Button variant="outline" onClick={() => setSettingsOpen(!settingsOpen)}>
          <Settings className="ml-2 w-4 h-4" />
          الإعدادات
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-12 text-muted-foreground">جارٍ تحميل المحتوى...</div>
      ) : null}

      {settingsOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="bg-card border rounded-2xl p-6 mb-6 overflow-hidden"
        >
          <div className="flex items-center gap-2 mb-4">
            <Settings className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold">إعدادات المحتوى</h3>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <Label>عدد السكريبتات في اليوم</Label>
              <Input
                type="number"
                min={1}
                max={10}
                value={postsPerDay}
                onChange={(e) => setPostsPerDay(Number(e.target.value))}
                className="mt-2"
                dir="ltr"
              />
            </div>
            <div>
              <Label>حساب الإنستقرام (اختياري)</Label>
              <Input type="text" placeholder="@your_account" className="mt-2" dir="ltr" />
            </div>
          </div>
          <div className="mt-4">
            <Label>المواضيع المطلوب التحدث عنها</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {TOPICS.map((topic) => (
                <button
                  key={topic.id}
                  onClick={() => toggleTopic(topic.id)}
                  className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
                    selectedTopics.includes(topic.id)
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'bg-secondary text-foreground border-border hover:bg-secondary/80'
                  }`}
                >
                  {topic.label}
                </button>
              ))}
            </div>
          </div>
          <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-xl text-sm text-amber-800 dark:text-amber-200">
            <strong>خوارزميات الإنستقرام:</strong> كل سكريبت يتبع معايير الفيديو الفيروسي: هوك قوي في أول ٣ ثوانٍ، إيقاع سريع، CTA تفاعلي، وهاشتاغات دقيقة. نسبة الإكمال ٩٥٪+ هدف كل سكريبت.
          </div>
        </motion.div>
      )}

      <div className="grid md:grid-cols-4 gap-4 mb-6">
        <div className="bg-card border rounded-2xl p-4">
          <div className="flex items-center gap-2 text-primary mb-1">
            <CalendarClock className="w-4 h-4" />
            <span className="text-sm font-medium">مجدول</span>
          </div>
          <span className="text-2xl font-bold">{scripts.filter((s) => s.status === 'scheduled').length}</span>
        </div>
        <div className="bg-card border rounded-2xl p-4">
          <div className="flex items-center gap-2 text-primary mb-1">
            <FileText className="w-4 h-4" />
            <span className="text-sm font-medium">مسودات</span>
          </div>
          <span className="text-2xl font-bold">{scripts.filter((s) => s.status === 'draft').length}</span>
        </div>
        <div className="bg-card border rounded-2xl p-4">
          <div className="flex items-center gap-2 text-primary mb-1">
            <Instagram className="w-4 h-4" />
            <span className="text-sm font-medium">منشورة</span>
          </div>
          <span className="text-2xl font-bold">{scripts.filter((s) => s.status === 'published').length}</span>
        </div>
        <div className="bg-card border rounded-2xl p-4">
          <div className="flex items-center gap-2 text-primary mb-1">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium">مواضيع</span>
          </div>
          <span className="text-2xl font-bold">{selectedTopics.length}</span>
        </div>
      </div>

      <Button
        onClick={generateContent}
        disabled={generating || selectedTopics.length === 0}
        className="w-full mb-6 h-14 text-base"
      >
        {generating ? (
          <>
            <RefreshCw className="ml-2 w-5 h-5 animate-spin" />
            جارٍ إنشاء {postsPerDay} سكريبتات فيروسية...
          </>
        ) : (
          <>
            <Sparkles className="ml-2 w-5 h-5" />
            إنشاء {postsPerDay} سكريبت ريلز فيروسية
          </>
        )}
      </Button>

      <div className="space-y-4">
        {scripts.map((script) => {
          const isExpanded = expandedId === script.id;

          return (
            <motion.div
              key={script.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card border rounded-2xl overflow-hidden"
            >
              <div className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                      script.status === 'scheduled' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' :
                      script.status === 'draft' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300' :
                      'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                    }`}>
                      {script.status === 'scheduled' ? 'مجدول' : script.status === 'draft' ? 'مسودة' : 'منشور'}
                    </span>
                    <span className="text-xs text-muted-foreground bg-secondary px-2 py-0.5 rounded">
                      {CONTENT_TYPES.find((t) => t.id === script.type)?.label || script.type}
                    </span>
                    <span className="text-xs text-muted-foreground font-medium">{script.topic}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="sm" onClick={() => copyScript(script.caption)} title="نسخ">
                      <Copy className="w-3.5 h-3.5" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => setExpandedId(isExpanded ? null : script.id)}>
                      {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => deleteScript(script.id)}>
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>

                {isExpanded ? (
                  <pre className="text-sm text-foreground whitespace-pre-wrap font-sans leading-relaxed bg-secondary/30 rounded-xl p-4 mb-2" style={{ unicodeBidi: 'plaintext', textAlign: 'left' }}>
                    {script.caption}
                  </pre>
                ) : (
                  <div className="text-sm text-foreground whitespace-pre-wrap font-sans leading-relaxed mb-2 line-clamp-2">
                    {script.caption.split('\n').slice(0, 3).join('\n')}
                  </div>
                )}

                <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t border-border">
                  <span>{script.hashtags?.split(' ').slice(0, 3).join(' ')}</span>
                  <span className="flex items-center gap-1">
                    <CalendarClock className="w-3 h-3" />
                    {script.scheduled_at ? new Date(script.scheduled_at).toLocaleString('ar') : ''}
                  </span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default AiContentGenerator;

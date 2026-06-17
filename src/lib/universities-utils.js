const countryTranslations = {
  Cyprus: {
    ar: 'قبرص', en: 'Cyprus', zh: '塞浦路斯', es: 'Chipre', hi: 'साइप्रस',
    fr: 'Chypre', bn: 'সাইপ্রাস', pt: 'Chipre', ru: 'Кипр', ja: 'キプロス',
    de: 'Zypern', ko: '키프로스', tr: 'Kıbrıs', vi: 'Síp', it: 'Cipro',
    th: 'ไซปรัส', fa: 'قبرس', sw: 'Kupro', id: 'Siprus', nl: 'Cyprus',
  },
  NorthCyprus: {
    ar: 'قبرص الشمالية', en: 'North Cyprus', zh: '北塞浦路斯', es: 'Chipre del Norte', hi: 'उत्तरी साइप्रस',
    fr: 'Chypre du Nord', bn: 'উত্তর সাইপ্রাস', pt: 'Chipre do Norte', ru: 'Северный Кипр', ja: '北キプロス',
    de: 'Nordzypern', ko: '북키프로스', tr: 'Kuzey Kıbrıs', vi: 'Bắc Síp', it: 'Cipro del Nord',
    th: 'ไซปรัสเหนือ', fa: 'قبرس شمالی', sw: 'Kupro ya Kaskazini', id: 'Siprus Utara', nl: 'Noord-Cyprus',
  },
  China: {
    ar: 'الصين', en: 'China', zh: '中国', es: 'China', hi: 'चीन',
    fr: 'Chine', bn: 'চীন', pt: 'China', ru: 'Китай', ja: '中国',
    de: 'China', ko: '중국', tr: 'Çin', vi: 'Trung Quốc', it: 'Cina',
    th: 'จีน', fa: 'چین', sw: 'Uchina', id: 'Tiongkok', nl: 'China',
  },
  Georgia: {
    ar: 'جورجيا', en: 'Georgia', zh: '格鲁吉亚', es: 'Georgia', hi: 'जॉर्जिया',
    fr: 'Géorgie', bn: 'জর্জিয়া', pt: 'Geórgia', ru: 'Грузия', ja: 'ジョージア',
    de: 'Georgien', ko: '조지아', tr: 'Gürcistan', vi: 'Gruzia', it: 'Georgia',
    th: 'จอร์เจีย', fa: 'گرجستان', sw: 'Jorjia', id: 'Georgia', nl: 'Georgië',
  },
  Malaysia: {
    ar: 'ماليزيا', en: 'Malaysia', zh: '马来西亚', es: 'Malasia', hi: 'मलेशिया',
    fr: 'Malaisie', bn: 'মালয়েশিয়া', pt: 'Malásia', ru: 'Малайзия', ja: 'マレーシア',
    de: 'Malaysia', ko: '말레이시아', tr: 'Malezya', vi: 'Malaysia', it: 'Malesia',
    th: 'มาเลเซีย', fa: 'مالزی', sw: 'Maleisi', id: 'Malaysia', nl: 'Maleisië',
  },
  Germany: {
    ar: 'ألمانيا', en: 'Germany', zh: '德国', es: 'Alemania', hi: 'जर्मनी',
    fr: 'Allemagne', bn: 'জার্মানি', pt: 'Alemanha', ru: 'Германия', ja: 'ドイツ',
    de: 'Deutschland', ko: '독일', tr: 'Almanya', vi: 'Đức', it: 'Germania',
    th: 'เยอรมนี', fa: 'آلمان', sw: 'Ujerumani', id: 'Jerman', nl: 'Duitsland',
  },
  UK: {
    ar: 'المملكة المتحدة', en: 'United Kingdom', zh: '英国', es: 'Reino Unido', hi: 'यूनाइटेड किंगडम',
    fr: 'Royaume-Uni', bn: 'যুক্তরাজ্য', pt: 'Reino Unido', ru: 'Великобритания', ja: 'イギリス',
    de: 'Vereinigtes Königreich', ko: '영국', tr: 'Birleşik Krallık', vi: 'Vương quốc Anh', it: 'Regno Unito',
    th: 'สหราชอาณาจักร', fa: 'بریتانیا', sw: 'Uingereza', id: 'Britania Raya', nl: 'Verenigd Koninkrijk',
  },
  Italy: {
    ar: 'إيطاليا', en: 'Italy', zh: '意大利', es: 'Italia', hi: 'इटली',
    fr: 'Italie', bn: 'ইতালি', pt: 'Itália', ru: 'Италия', ja: 'イタリア',
    de: 'Italien', ko: '이탈리아', tr: 'İtalya', vi: 'Ý', it: 'Italia',
    th: 'อิตาลี', fa: 'ایتالیا', sw: 'Italia', id: 'Italia', nl: 'Italië',
  },
  Rwanda: {
    ar: 'رواندا', en: 'Rwanda', zh: '卢旺达', es: 'Ruanda', hi: 'रवांडा',
    fr: 'Rwanda', bn: 'রুয়ান্ডা', pt: 'Ruanda', ru: 'Руанда', ja: 'ルワンダ',
    de: 'Ruanda', ko: '르완다', tr: 'Ruanda', vi: 'Rwanda', it: 'Ruanda',
    th: 'รวันดา', fa: 'رواندا', sw: 'Rwanda', id: 'Rwanda', nl: 'Rwanda',
  },
  Syria: {
    ar: 'سوريا', en: 'Syria', zh: '叙利亚', es: 'Siria', hi: 'सीरिया',
    fr: 'Syrie', bn: 'সিরিয়া', pt: 'Síria', ru: 'Сирия', ja: 'シリア',
    de: 'Syrien', ko: '시리아', tr: 'Suriye', vi: 'Syria', it: 'Siria',
    th: 'ซีเรีย', fa: 'سوریه', sw: 'Syria', id: 'Suriah', nl: 'Syrië',
  },
  Yemen: {
    ar: 'اليمن', en: 'Yemen', zh: '也门', es: 'Yemen', hi: 'यमन',
    fr: 'Yémen', bn: 'ইয়েমেন', pt: 'Iêmen', ru: 'Йемен', ja: 'イエメン',
    de: 'Jemen', ko: '예멘', tr: 'Yemen', vi: 'Yemen', it: 'Yemen',
    th: 'เยเมน', fa: 'یمن', sw: 'Yemen', id: 'Yaman', nl: 'Jemen',
  },
  Egypt: {
    ar: 'مصر', en: 'Egypt', zh: '埃及', es: 'Egipto', hi: 'मिस्र',
    fr: 'Égypte', bn: 'মিশর', pt: 'Egito', ru: 'Египет', ja: 'エジプト',
    de: 'Ägypten', ko: '이집트', tr: 'Mısır', vi: 'Ai Cập', it: 'Egitto',
    th: 'อียิปต์', fa: 'مصر', sw: 'Misri', id: 'Mesir', nl: 'Egypte',
  },
  Jordan: {
    ar: 'الأردن', en: 'Jordan', zh: '约旦', es: 'Jordania', hi: 'जॉर्डन',
    fr: 'Jordanie', bn: 'জর্ডান', pt: 'Jordânia', ru: 'Иордания', ja: 'ヨルダン',
    de: 'Jordanien', ko: '요르단', tr: 'Ürdün', vi: 'Jordan', it: 'Giordania',
    th: 'จอร์แดน', fa: 'اردن', sw: 'Yordani', id: 'Yordania', nl: 'Jordanië',
  },
  Lebanon: {
    ar: 'لبنان', en: 'Lebanon', zh: '黎巴嫩', es: 'Líbano', hi: 'लेबनान',
    fr: 'Liban', bn: 'লেবানন', pt: 'Líbano', ru: 'Ливан', ja: 'レバノン',
    de: 'Libanon', ko: '레바논', tr: 'Lübnan', vi: 'Li Băng', it: 'Libano',
    th: 'เลบานอน', fa: 'لبنان', sw: 'Lebanon', id: 'Lebanon', nl: 'Libanon',
  },
  Saudi: {
    ar: 'السعودية', en: 'Saudi Arabia', zh: '沙特阿拉伯', es: 'Arabia Saudita', hi: 'सऊदी अरब',
    fr: 'Arabie Saoudite', bn: 'সৌদি আরব', pt: 'Arábia Saudita', ru: 'Саудовская Аравия', ja: 'サウジアラビア',
    de: 'Saudi-Arabien', ko: '사우디아라비아', tr: 'Suudi Arabistan', vi: 'Ả Rập Saudi', it: 'Arabia Saudita',
    th: 'ซาอุดีอาระเบีย', fa: 'عربستان سعودی', sw: 'Saudi Arabia', id: 'Arab Saudi', nl: 'Saoedi-Arabië',
  },
  UAE: {
    ar: 'الإمارات', en: 'UAE', zh: '阿联酋', es: 'EAU', hi: 'संयुक्त अरब अमीरात',
    fr: 'EAU', bn: 'সংযুক্ত আরব আমিরাত', pt: 'EAU', ru: 'ОАЭ', ja: 'アラブ首長国連邦',
    de: 'VAE', ko: '아랍에미리트', tr: 'BAE', vi: 'UAE', it: 'EAU',
    th: 'สหรัฐอาหรับเอมิเรตส์', fa: 'امارات', sw: 'UAE', id: 'UEA', nl: 'VAE',
  },
}

const cityTranslations = {
  'نيقوسيا': {
    en: 'Nicosia', zh: '尼科西亚', es: 'Nicosia', fr: 'Nicosie', de: 'Nikosia',
    it: 'Nicosia', tr: 'Lefkoşa', pt: 'Nicósia', ru: 'Никосия', ja: 'ニコシア',
    ko: '니코시아', hi: 'निकोसिया', fa: 'نیکوسیا', th: 'นิโคเซีย', vi: 'Nicosia',
    id: 'Nikosia', nl: 'Nicosia', ar: 'نيقوسيا', bn: 'নিকোসিয়া', sw: 'Nicosia',
  },
  'ليماسول': {
    en: 'Limassol', zh: '利马索尔', es: 'Limassol', fr: 'Limassol', de: 'Limassol',
    it: 'Limassol', tr: 'Limasol', pt: 'Limassol', ru: 'Лимасол', ja: 'リマソル',
    ko: '리마솔', hi: 'लिमासोल', fa: 'لیماسول', th: 'ลิมาซอล', vi: 'Limassol',
    id: 'Limasol', nl: 'Limassol', ar: 'ليماسول', bn: 'লিমাসোল', sw: 'Limassol',
  },
  'لارنكا': {
    en: 'Larnaca', zh: '拉纳卡', es: 'Larnaca', fr: 'Larnaca', de: 'Larnaca',
    it: 'Larnaca', tr: 'Larnaka', pt: 'Larnaca', ru: 'Ларнака', ja: 'ラルナカ',
    ko: '라르나카', hi: 'लार्नाका', fa: 'لارنکا', th: 'ลาร์นาคา', vi: 'Larnaca',
    id: 'Larnaka', nl: 'Larnaca', ar: 'لارنكا', bn: 'লারনাকা', sw: 'Larnaca',
  },
  'بافوس': {
    en: 'Paphos', zh: '帕福斯', es: 'Paphos', fr: 'Paphos', de: 'Paphos',
    it: 'Pafos', tr: 'Baf', pt: 'Pafos', ru: 'Пафос', ja: 'パフォス',
    ko: '파포스', hi: 'पाफोस', fa: 'پافوس', th: 'ปาฟอส', vi: 'Paphos',
    id: 'Pafos', nl: 'Paphos', ar: 'بافوس', bn: 'পাফোস', sw: 'Paphos',
  },
  'فاماغوستا': {
    en: 'Famagusta', zh: '法马古斯塔', es: 'Famagusta', fr: 'Famagouste', de: 'Famagusta',
    it: 'Famagosta', tr: 'Gazimağusa', pt: 'Famagusta', ru: 'Фамагуста', ja: 'ファマグスタ',
    ko: '파마구스타', hi: 'फमागुस्टा', fa: 'فاماگوستا', th: 'ฟามากุสตา', vi: 'Famagusta',
    id: 'Famagusta', nl: 'Famagusta', ar: 'فاماغوستا', bn: 'ফামাগুস্তা', sw: 'Famagusta',
  },
  'كيرينيا': {
    en: 'Kyrenia', zh: '凯里尼亚', es: 'Kyrenia', fr: 'Kyrenia', de: 'Kyrenia',
    it: 'Kyrenia', tr: 'Girne', pt: 'Kirenia', ru: 'Кирения', ja: 'キレニア',
    ko: '키레니아', hi: 'किरेनिया', fa: 'کایرنیا', th: 'ไคเรเนีย', vi: 'Kyrenia',
    id: 'Kyrenia', nl: 'Kyrenia', ar: 'كيرينيا', bn: 'কিরেনিয়া', sw: 'Kyrenia',
  },
  'بكين': {
    en: 'Beijing', zh: '北京', es: 'Pekín', fr: 'Pékin', de: 'Peking',
    it: 'Pechino', tr: 'Pekin', pt: 'Pequim', ru: 'Пекин', ja: '北京',
    ko: '베이징', hi: 'बीजिंग', fa: 'پکن', th: 'ปักกิ่ง', vi: 'Bắc Kinh',
    id: 'Beijing', nl: 'Peking', ar: 'بكين', bn: 'বেইজিং', sw: 'Beijing',
  },
  'شنغهاي': {
    en: 'Shanghai', zh: '上海', es: 'Shanghái', fr: 'Shanghai', de: 'Shanghai',
    it: 'Shanghai', tr: 'Şanghay', pt: 'Xangai', ru: 'Шанхай', ja: '上海',
    ko: '상하이', hi: 'शंघाई', fa: 'شانگهای', th: 'เซี่ยงไฮ้', vi: 'Thượng Hải',
    id: 'Shanghai', nl: 'Shanghai', ar: 'شنغهاي', bn: 'সাংহাই', sw: 'Shanghai',
  },
  'قوانغتشو': {
    en: 'Guangzhou', zh: '广州', es: 'Cantón', fr: 'Canton', de: 'Guangzhou',
    it: 'Canton', tr: 'Guangzhou', pt: 'Cantão', ru: 'Гуанчжоу', ja: '広州',
    ko: '광저우', hi: 'ग्वांगझू', fa: 'گوانگژو', th: 'กวางโจว', vi: 'Quảng Châu',
    id: 'Guangzhou', nl: 'Guangzhou', ar: 'قوانغتشو', bn: 'গুয়াংঝো', sw: 'Guangzhou',
  },
  'شنتشن': {
    en: 'Shenzhen', zh: '深圳', es: 'Shenzhen', fr: 'Shenzhen', de: 'Shenzhen',
    it: 'Shenzhen', tr: 'Şenzen', pt: 'Shenzhen', ru: 'Шэньчжэнь', ja: '深セン',
    ko: '선전', hi: 'शेन्झेन', fa: 'شنژن', th: 'เซินเจิ้น', vi: 'Thâm Quyến',
    id: 'Shenzhen', nl: 'Shenzhen', ar: 'شنتشن', bn: 'শেনচেন', sw: 'Shenzhen',
  },
  'هونغ كونغ': {
    en: 'Hong Kong', zh: '香港', es: 'Hong Kong', fr: 'Hong Kong', de: 'Hongkong',
    it: 'Hong Kong', tr: 'Hong Kong', pt: 'Hong Kong', ru: 'Гонконг', ja: '香港',
    ko: '홍콩', hi: 'हांगकांग', fa: 'هنگ کنگ', th: 'ฮ่องกง', vi: 'Hồng Kông',
    id: 'Hong Kong', nl: 'Hongkong', ar: 'هونغ كونغ', bn: 'হংকং', sw: 'Hong Kong',
  },
  'تبليسي': {
    en: 'Tbilisi', zh: '第比利斯', es: 'Tiflis', fr: 'Tbilissi', de: 'Tiflis',
    it: 'Tbilisi', tr: 'Tiflis', pt: 'Tbilisi', ru: 'Тбилиси', ja: 'トビリシ',
    ko: '트빌리시', hi: 'त्बिलिसी', fa: 'تفلیس', th: 'ทบิลิซี', vi: 'Tbilisi',
    id: 'Tbilisi', nl: 'Tbilisi', ar: 'تبليسي', bn: 'তিবিলিসি', sw: 'Tbilisi',
  },
  'باتومي': {
    en: 'Batumi', zh: '巴统', es: 'Batumi', fr: 'Batumi', de: 'Batumi',
    it: 'Batumi', tr: 'Batum', pt: 'Batumi', ru: 'Батуми', ja: 'バトゥミ',
    ko: '바투미', hi: 'बातुमी', fa: 'باتومی', th: 'บาทูมี', vi: 'Batumi',
    id: 'Batumi', nl: 'Batoemi', ar: 'باتومي', bn: 'বাতুমি', sw: 'Batumi',
  },
  'كوتايسي': {
    en: 'Kutaisi', zh: '库塔伊西', es: 'Kutaisi', fr: 'Koutaïssi', de: 'Kutaissi',
    it: 'Kutaisi', tr: 'Kutaisi', pt: 'Kutaisi', ru: 'Кутаиси', ja: 'クタイシ',
    ko: '쿠타이시', hi: 'कुतैसी', fa: 'کوتایسی', th: 'คูทาอีซี', vi: 'Kutaisi',
    id: 'Kutaisi', nl: 'Koetaisi', ar: 'كوتايسي', bn: 'কুতাইসি', sw: 'Kutaisi',
  },
  'كوالالمبور': {
    en: 'Kuala Lumpur', zh: '吉隆坡', es: 'Kuala Lumpur', fr: 'Kuala Lumpur', de: 'Kuala Lumpur',
    it: 'Kuala Lumpur', tr: 'Kuala Lumpur', pt: 'Kuala Lumpur', ru: 'Куала-Лумпур', ja: 'クアラルンプール',
    ko: '쿠알라룸푸르', hi: 'कुआलालंपुर', fa: 'کوالالامپور', th: 'กัวลาลัมเปอร์', vi: 'Kuala Lumpur',
    id: 'Kuala Lumpur', nl: 'Kuala Lumpur', ar: 'كوالالمبور', bn: 'কুয়ালালামপুর', sw: 'Kuala Lumpur',
  },
  'بينانغ': {
    en: 'Penang', zh: '槟城', es: 'Penang', fr: 'Penang', de: 'Penang',
    it: 'Penang', tr: 'Penang', pt: 'Penang', ru: 'Пенанг', ja: 'ペナン',
    ko: '페낭', hi: 'पेनांग', fa: 'پنانگ', th: 'ปีนัง', vi: 'Penang',
    id: 'Penang', nl: 'Penang', ar: 'بينانغ', bn: 'পেনাং', sw: 'Penang',
  },
  'جوهور باهرو': {
    en: 'Johor Bahru', zh: '新山', es: 'Johor Bahru', fr: 'Johor Bahru', de: 'Johor Bahru',
    it: 'Johor Bahru', tr: 'Johor Bahru', pt: 'Johor Bahru', ru: 'Джохор-Бару', ja: 'ジョホールバル',
    ko: '조호르바루', hi: 'जोहोर बाहरू', fa: 'جوهور باهرو', th: 'ยะโฮร์บาห์รู', vi: 'Johor Bahru',
    id: 'Johor Bahru', nl: 'Johor Bahru', ar: 'جوهور باهرو', bn: 'জোহর বাহরু', sw: 'Johor Bahru',
  },
  'برلين': {
    en: 'Berlin', zh: '柏林', es: 'Berlín', fr: 'Berlin', de: 'Berlin',
    it: 'Berlino', tr: 'Berlin', pt: 'Berlim', ru: 'Берлин', ja: 'ベルリン',
    ko: '베를린', hi: 'बर्लिन', fa: 'برلین', th: 'เบอร์ลิน', vi: 'Berlin',
    id: 'Berlin', nl: 'Berlijn', ar: 'برلين', bn: 'বার্লিন', sw: 'Berlin',
  },
  'ميونخ': {
    en: 'Munich', zh: '慕尼黑', es: 'Múnich', fr: 'Munich', de: 'München',
    it: 'Monaco di Baviera', tr: 'Münih', pt: 'Munique', ru: 'Мюнхен', ja: 'ミュンヘン',
    ko: '뮌헨', hi: 'म्यूनिख', fa: 'مونیخ', th: 'มิวนิก', vi: 'München',
    id: 'München', nl: 'München', ar: 'ميونخ', bn: 'মিউনিখ', sw: 'Munich',
  },
  'فرانكفورت': {
    en: 'Frankfurt', zh: '法兰克福', es: 'Fráncfort', fr: 'Francfort', de: 'Frankfurt',
    it: 'Francoforte', tr: 'Frankfurt', pt: 'Frankfurt', ru: 'Франкфурт', ja: 'フランクフルト',
    ko: '프랑크푸르트', hi: 'फ्रैंकफर्ट', fa: 'فرانکفورت', th: 'แฟรงก์เฟิร์ต', vi: 'Frankfurt',
    id: 'Frankfurt', nl: 'Frankfurt', ar: 'فرانكفورت', bn: 'ফ্রাঙ্কফুর্ট', sw: 'Frankfurt',
  },
  'هامبورغ': {
    en: 'Hamburg', zh: '汉堡', es: 'Hamburgo', fr: 'Hambourg', de: 'Hamburg',
    it: 'Amburgo', tr: 'Hamburg', pt: 'Hamburgo', ru: 'Гамбург', ja: 'ハンブルク',
    ko: '함부르크', hi: 'हैम्बर्ग', fa: 'هامبورگ', th: 'ฮัมบูร์ก', vi: 'Hamburg',
    id: 'Hamburg', nl: 'Hamburg', ar: 'هامبورغ', bn: 'হামবুর্গ', sw: 'Hamburg',
  },
  'كولونيا': {
    en: 'Cologne', zh: '科隆', es: 'Colonia', fr: 'Cologne', de: 'Köln',
    it: 'Colonia', tr: 'Köln', pt: 'Colônia', ru: 'Кёльн', ja: 'ケルン',
    ko: '쾰른', hi: 'कोलोन', fa: 'کلن', th: 'โคโลญ', vi: 'Cologne',
    id: 'Köln', nl: 'Keulen', ar: 'كولونيا', bn: 'কোলন', sw: 'Cologne',
  },
  'لندن': {
    en: 'London', zh: '伦敦', es: 'Londres', fr: 'Londres', de: 'London',
    it: 'Londra', tr: 'Londra', pt: 'Londres', ru: 'Лондон', ja: 'ロンドン',
    ko: '런던', hi: 'लंदन', fa: 'لندن', th: 'ลอนดอน', vi: 'Luân Đôn',
    id: 'London', nl: 'Londen', ar: 'لندن', bn: 'লন্ডন', sw: 'London',
  },
  'مانشستر': {
    en: 'Manchester', zh: '曼彻斯特', es: 'Mánchester', fr: 'Manchester', de: 'Manchester',
    it: 'Manchester', tr: 'Manchester', pt: 'Manchester', ru: 'Манчестер', ja: 'マンチェスター',
    ko: '맨체스터', hi: 'मैनचेस्टर', fa: 'منچستر', th: 'แมนเชสเตอร์', vi: 'Manchester',
    id: 'Manchester', nl: 'Manchester', ar: 'مانشستر', bn: 'ম্যানচেস্টার', sw: 'Manchester',
  },
  'برمنغهام': {
    en: 'Birmingham', zh: '伯明翰', es: 'Birmingham', fr: 'Birmingham', de: 'Birmingham',
    it: 'Birmingham', tr: 'Birmingham', pt: 'Birmingham', ru: 'Бирмингем', ja: 'バーミンガム',
    ko: '버밍엄', hi: 'बर्मिंघम', fa: 'بیرمنگام', th: 'เบอร์มิงแฮม', vi: 'Birmingham',
    id: 'Birmingham', nl: 'Birmingham', ar: 'برمنغهام', bn: 'বার্মিংহাম', sw: 'Birmingham',
  },
  'ليفربول': {
    en: 'Liverpool', zh: '利物浦', es: 'Liverpool', fr: 'Liverpool', de: 'Liverpool',
    it: 'Liverpool', tr: 'Liverpool', pt: 'Liverpool', ru: 'Ливерпуль', ja: 'リバプール',
    ko: '리버풀', hi: 'लिवरपूल', fa: 'لیورپول', th: 'ลิเวอร์พูล', vi: 'Liverpool',
    id: 'Liverpool', nl: 'Liverpool', ar: 'ليفربول', bn: 'লিভারপুল', sw: 'Liverpool',
  },
  'غلاسكو': {
    en: 'Glasgow', zh: '格拉斯哥', es: 'Glasgow', fr: 'Glasgow', de: 'Glasgow',
    it: 'Glasgow', tr: 'Glasgow', pt: 'Glasgow', ru: 'Глазго', ja: 'グラスゴー',
    ko: '글래스고', hi: 'ग्लासगो', fa: 'گلاسگو', th: 'กลาสโกว์', vi: 'Glasgow',
    id: 'Glasgow', nl: 'Glasgow', ar: 'غلاسكو', bn: 'গ্লাসগো', sw: 'Glasgow',
  },
  'روما': {
    en: 'Rome', zh: '罗马', es: 'Roma', fr: 'Rome', de: 'Rom',
    it: 'Roma', tr: 'Roma', pt: 'Roma', ru: 'Рим', ja: 'ローマ',
    ko: '로마', hi: 'रोम', fa: 'رم', th: 'โรม', vi: 'Roma',
    id: 'Roma', nl: 'Rome', ar: 'روما', bn: 'রোম', sw: 'Rome',
  },
  'ميلانو': {
    en: 'Milan', zh: '米兰', es: 'Milán', fr: 'Milan', de: 'Mailand',
    it: 'Milano', tr: 'Milano', pt: 'Milão', ru: 'Милан', ja: 'ミラノ',
    ko: '밀라노', hi: 'मिलान', fa: 'میلان', th: 'มิลาน', vi: 'Milan',
    id: 'Milan', nl: 'Milaan', ar: 'ميلانو', bn: 'মিলান', sw: 'Milan',
  },
  'فلورنسا': {
    en: 'Florence', zh: '佛罗伦萨', es: 'Florencia', fr: 'Florence', de: 'Florenz',
    it: 'Firenze', tr: 'Floransa', pt: 'Florença', ru: 'Флоренция', ja: 'フィレンツェ',
    ko: '피렌체', hi: 'फ्लोरेंस', fa: 'فلورانس', th: 'ฟลอเรนซ์', vi: 'Florence',
    id: 'Firenze', nl: 'Florence', ar: 'فلورنسا', bn: 'ফ্লোরেন্স', sw: 'Florence',
  },
  'بولونيا': {
    en: 'Bologna', zh: '博洛尼亚', es: 'Bolonia', fr: 'Bologne', de: 'Bologna',
    it: 'Bologna', tr: 'Bologna', pt: 'Bolonha', ru: 'Болонья', ja: 'ボローニャ',
    ko: '볼로냐', hi: 'बोलोग्ना', fa: 'بولونیا', th: 'โบโลญญา', vi: 'Bologna',
    id: 'Bologna', nl: 'Bologna', ar: 'بولونيا', bn: 'বোলোগনা', sw: 'Bologna',
  },
  'تورينو': {
    en: 'Turin', zh: '都灵', es: 'Turín', fr: 'Turin', de: 'Turin',
    it: 'Torino', tr: 'Torino', pt: 'Turim', ru: 'Турин', ja: 'トリノ',
    ko: '토리노', hi: 'ट्यूरिन', fa: 'تورین', th: 'ตูริน', vi: 'Turin',
    id: 'Turin', nl: 'Turijn', ar: 'تورينو', bn: 'তুরিন', sw: 'Turin',
  },
  'كيغالي': {
    en: 'Kigali', zh: '基加利', es: 'Kigali', fr: 'Kigali', de: 'Kigali',
    it: 'Kigali', tr: 'Kigali', pt: 'Kigali', ru: 'Кигали', ja: 'キガリ',
    ko: '키갈리', hi: 'किगाली', fa: 'کیگالی', th: 'คิกาลี', vi: 'Kigali',
    id: 'Kigali', nl: 'Kigali', ar: 'كيغالي', bn: 'কিগালি', sw: 'Kigali',
  },
  'دمشق': {
    en: 'Damascus', zh: '大马士革', es: 'Damasco', fr: 'Damas', de: 'Damaskus',
    it: 'Damasco', tr: 'Şam', pt: 'Damasco', ru: 'Дамаск', ja: 'ダマスカス',
    ko: '다마스쿠스', hi: 'दमिश्क', fa: 'دمشق', th: 'ดามัสกัส', vi: 'Damascus',
    id: 'Damaskus', nl: 'Damascus', ar: 'دمشق', bn: 'দামাস্কাস', sw: 'Damasko',
  },
  'حلب': {
    en: 'Aleppo', zh: '阿勒颇', es: 'Alepo', fr: 'Alep', de: 'Aleppo',
    it: 'Aleppo', tr: 'Halep', pt: 'Alepo', ru: 'Алеппо', ja: 'アレッポ',
    ko: '알레포', hi: 'अलेप्पो', fa: 'حلب', th: 'อเลปโป', vi: 'Aleppo',
    id: 'Aleppo', nl: 'Aleppo', ar: 'حلب', bn: 'আলেপ্পো', sw: 'Aleppo',
  },
  'حمص': {
    en: 'Homs', zh: '霍姆斯', es: 'Homs', fr: 'Homs', de: 'Homs',
    it: 'Homs', tr: 'Humus', pt: 'Homs', ru: 'Хомс', ja: 'ホムス',
    ko: '홈스', hi: 'होम्स', fa: 'حمص', th: 'ฮอมส์', vi: 'Homs',
    id: 'Homs', nl: 'Homs', ar: 'حمص', bn: 'হোমস', sw: 'Homs',
  },
  'اللاذقية': {
    en: 'Latakia', zh: '拉塔基亚', es: 'Latakia', fr: 'Lattaquié', de: 'Latakia',
    it: 'Latakia', tr: 'Lazkiye', pt: 'Latáquia', ru: 'Латакия', ja: 'ラタキア',
    ko: '라타키아', hi: 'लताकिया', fa: 'لاذقیه', th: 'ลาตาเกีย', vi: 'Latakia',
    id: 'Latakia', nl: 'Latakia', ar: 'اللاذقية', bn: 'লাতাকিয়া', sw: 'Latakia',
  },
  'صنعاء': {
    en: "Sana'a", zh: '萨那', es: 'Saná', fr: 'Sanaa', de: 'Sanaa',
    it: 'Sanaa', tr: `San'a`, pt: 'Saná', ru: 'Сана', ja: 'サナア',
    ko: '사나', hi: 'सना', fa: 'صنعا', th: 'ซานา', vi: "Sana'a",
    id: 'Sanaa', nl: 'Sanaa', ar: 'صنعاء', bn: 'সানা', sw: 'Sanaa',
  },
  'عدن': {
    en: 'Aden', zh: '亚丁', es: 'Adén', fr: 'Aden', de: 'Aden',
    it: 'Aden', tr: 'Aden', pt: 'Áden', ru: 'Аден', ja: 'アデン',
    ko: '아덴', hi: 'अदन', fa: 'عدن', th: 'เอเดน', vi: 'Aden',
    id: 'Aden', nl: 'Aden', ar: 'عدن', bn: 'এডেন', sw: 'Aden',
  },
  'تعز': {
    en: 'Taiz', zh: '塔伊兹', es: 'Taiz', fr: 'Taïz', de: 'Taiz',
    it: 'Taiz', tr: 'Taiz', pt: 'Taiz', ru: 'Таиз', ja: 'タイズ',
    ko: '타이즈', hi: 'ताइज़', fa: 'تعز', th: 'ไทซ์', vi: 'Taiz',
    id: 'Taiz', nl: `Ta'izz`, ar: 'تعز', bn: 'তাইজ', sw: 'Taiz',
  },
  'القاهرة': {
    en: 'Cairo', zh: '开罗', es: 'El Cairo', fr: 'Le Caire', de: 'Kairo',
    it: 'Il Cairo', tr: 'Kahire', pt: 'Cairo', ru: 'Каир', ja: 'カイロ',
    ko: '카이로', hi: 'काहिरा', fa: 'قاهره', th: 'ไคโร', vi: 'Cairo',
    id: 'Kairo', nl: 'Caïro', ar: 'القاهرة', bn: 'কায়রো', sw: 'Kairo',
  },
  'الإسكندرية': {
    en: 'Alexandria', zh: '亚历山大', es: 'Alejandría', fr: 'Alexandrie', de: 'Alexandria',
    it: 'Alessandria', tr: 'İskenderiye', pt: 'Alexandria', ru: 'Александрия', ja: 'アレクサンドリア',
    ko: '알렉산드리아', hi: 'अलेक्जेंड्रिया', fa: 'اسکندریه', th: 'อะเล็กซานเดรีย', vi: 'Alexandria',
    id: 'Iskandariyah', nl: 'Alexandrië', ar: 'الإسكندرية', bn: 'আলেকজান্দ্রিয়া', sw: 'Alexandria',
  },
  'الجيزة': {
    en: 'Giza', zh: '吉萨', es: 'Guiza', fr: 'Gizeh', de: 'Gizeh',
    it: 'Giza', tr: 'Gize', pt: 'Gizé', ru: 'Гиза', ja: 'ギザ',
    ko: '기자', hi: 'गीज़ा', fa: 'جیزه', th: 'กีซา', vi: 'Giza',
    id: 'Giza', nl: 'Gizeh', ar: 'الجيزة', bn: 'গিজা', sw: 'Giza',
  },
  'أسوان': {
    en: 'Aswan', zh: '阿斯旺', es: 'Asuán', fr: 'Assouan', de: 'Assuan',
    it: 'Assuan', tr: 'Asvan', pt: 'Assuão', ru: 'Асуан', ja: 'アスワン',
    ko: '아스완', hi: 'असवान', fa: 'اسوان', th: 'อัสวาน', vi: 'Aswan',
    id: 'Aswan', nl: 'Aswan', ar: 'أسوان', bn: 'আসওয়ান', sw: 'Aswan',
  },
  'عمان': {
    en: 'Amman', zh: '安曼', es: 'Ammán', fr: 'Amman', de: 'Amman',
    it: 'Amman', tr: 'Amman', pt: 'Amã', ru: 'Амман', ja: 'アンマン',
    ko: '암만', hi: 'अम्मान', fa: 'امان', th: 'อัมมาน', vi: 'Amman',
    id: 'Amman', nl: 'Amman', ar: 'عمان', bn: 'আম্মান', sw: 'Amman',
  },
  'إربد': {
    en: 'Irbid', zh: '伊尔比德', es: 'Irbid', fr: 'Irbid', de: 'Irbid',
    it: 'Irbid', tr: 'İrbid', pt: 'Irbid', ru: 'Ирбид', ja: 'イルビド',
    ko: '이르비드', hi: 'इरबिद', fa: 'اربد', th: 'อิรบิด', vi: 'Irbid',
    id: 'Irbid', nl: 'Irbid', ar: 'إربد', bn: 'ইরবিড', sw: 'Irbid',
  },
  'الزرقاء': {
    en: 'Zarqa', zh: '扎尔卡', es: 'Zarqa', fr: 'Zarqa', de: 'Sarka',
    it: 'Zarqa', tr: 'Zerka', pt: 'Zarqa', ru: 'Эз-Зарка', ja: 'ザルカ',
    ko: '자르카', hi: 'ज़रक़ा', fa: 'زرقاء', th: 'ซาร์กา', vi: 'Zarqa',
    id: 'Zarqa', nl: 'Zarqa', ar: 'الزرقاء', bn: 'জারকা', sw: 'Zarqa',
  },
  'العقبة': {
    en: 'Aqaba', zh: '亚喀巴', es: 'Áqaba', fr: 'Aqaba', de: 'Akaba',
    it: 'Aqaba', tr: 'Akabe', pt: 'Ácaba', ru: 'Акаба', ja: 'アカバ',
    ko: '아카바', hi: 'अकाबा', fa: 'عقبه', th: 'อควาบา', vi: 'Aqaba',
    id: 'Aqabah', nl: 'Akaba', ar: 'العقبة', bn: 'আকাবা', sw: 'Aqaba',
  },
  'بيروت': {
    en: 'Beirut', zh: '贝鲁特', es: 'Beirut', fr: 'Beyrouth', de: 'Beirut',
    it: 'Beirut', tr: 'Beyrut', pt: 'Beirute', ru: 'Бейрут', ja: 'ベイルート',
    ko: '베이루트', hi: 'बेरूत', fa: 'بیروت', th: 'เบรุต', vi: 'Beirut',
    id: 'Beirut', nl: 'Beiroet', ar: 'بيروت', bn: 'বৈরুত', sw: 'Beirut',
  },
  'طرابلس': {
    en: 'Tripoli', zh: '的黎波里', es: 'Trípoli', fr: 'Tripoli', de: 'Tripoli',
    it: 'Tripoli', tr: 'Trablus', pt: 'Trípoli', ru: 'Триполи', ja: 'トリポリ',
    ko: '트리폴리', hi: 'त्रिपोली', fa: 'طرابلس', th: 'ตริโปลี', vi: 'Tripoli',
    id: 'Tripoli', nl: 'Tripoli', ar: 'طرابلس', bn: 'ত্রিপোলি', sw: 'Tripoli',
  },
  'صيدا': {
    en: 'Sidon', zh: '西顿', es: 'Sidón', fr: 'Sidon', de: 'Sidon',
    it: 'Sidone', tr: 'Sayda', pt: 'Sídon', ru: 'Сидон', ja: 'シドン',
    ko: '시돈', hi: 'सैदा', fa: 'صیدا', th: 'ไซดอน', vi: 'Sidon',
    id: 'Sidon', nl: 'Sidon', ar: 'صيدا', bn: 'সিডন', sw: 'Sidon',
  },
  'صور': {
    en: 'Tyre', zh: '提尔', es: 'Tiro', fr: 'Tyr', de: 'Tyros',
    it: 'Tiro', tr: 'Sur', pt: 'Tiro', ru: 'Тир', ja: 'ティルス',
    ko: '티레', hi: 'टायर', fa: 'صور', th: 'ไทร์', vi: 'Tyre',
    id: 'Tirus', nl: 'Tyrus', ar: 'صور', bn: 'টায়ার', sw: 'Tyre',
  },
  'الرياض': {
    en: 'Riyadh', zh: '利雅得', es: 'Riad', fr: 'Riyad', de: 'Riad',
    it: 'Riad', tr: 'Riyad', pt: 'Riad', ru: 'Эр-Рияд', ja: 'リヤド',
    ko: '리야드', hi: 'रियाद', fa: 'ریاض', th: 'ริยาด', vi: 'Riyadh',
    id: 'Riyadh', nl: 'Riyad', ar: 'الرياض', bn: 'রিয়াদ', sw: 'Riyadh',
  },
  'جدة': {
    en: 'Jeddah', zh: '吉达', es: 'Yeda', fr: 'Djeddah', de: 'Dschidda',
    it: 'Gedda', tr: 'Cidde', pt: 'Jeddah', ru: 'Джидда', ja: 'ジッダ',
    ko: '제다', hi: 'जेद्दा', fa: 'جده', th: 'เจดดาห์', vi: 'Jeddah',
    id: 'Jeddah', nl: 'Jeddah', ar: 'جدة', bn: 'জেদ্দা', sw: 'Jeddah',
  },
  'الدمام': {
    en: 'Dammam', zh: '达曼', es: 'Dammam', fr: 'Dammam', de: 'Dammam',
    it: 'Dammam', tr: 'Dammam', pt: 'Dammam', ru: 'Даммам', ja: 'ダンマーム',
    ko: '담맘', hi: 'दम्माम', fa: 'دمام', th: 'ดัมมาม', vi: 'Dammam',
    id: 'Dammam', nl: 'Dammam', ar: 'الدمام', bn: 'দাম্মাম', sw: 'Dammam',
  },
  'مكة': {
    en: 'Mecca', zh: '麦加', es: 'La Meca', fr: 'La Mecque', de: 'Mekka',
    it: 'La Mecca', tr: 'Mekke', pt: 'Meca', ru: 'Мекка', ja: 'メッカ',
    ko: '메카', hi: 'मक्का', fa: 'مکه', th: 'เมกกะ', vi: 'Mecca',
    id: 'Mekkah', nl: 'Mekka', ar: 'مكة', bn: 'মক্কা', sw: 'Makkah',
  },
  'المدينة المنورة': {
    en: 'Medina', zh: '麦地那', es: 'Medina', fr: 'Médine', de: 'Medina',
    it: 'Medina', tr: 'Medine', pt: 'Medina', ru: 'Медина', ja: 'マディーナ',
    ko: '메디나', hi: 'मदीना', fa: 'مدینه', th: 'มะดีนะห์', vi: 'Medina',
    id: 'Madinah', nl: 'Medina', ar: 'المدينة المنورة', bn: 'মদিনা', sw: 'Madinah',
  },
  'دبي': {
    en: 'Dubai', zh: '迪拜', es: 'Dubái', fr: 'Dubaï', de: 'Dubai',
    it: 'Dubai', tr: 'Dubai', pt: 'Dubai', ru: 'Дубай', ja: 'ドバイ',
    ko: '두바이', hi: 'दुबई', fa: 'دبی', th: 'ดูไบ', vi: 'Dubai',
    id: 'Dubai', nl: 'Dubai', ar: 'دبي', bn: 'দুবাই', sw: 'Dubai',
  },
  'أبوظبي': {
    en: 'Abu Dhabi', zh: '阿布扎比', es: 'Abu Dabi', fr: 'Abou Dabi', de: 'Abu Dhabi',
    it: 'Abu Dhabi', tr: 'Abu Dabi', pt: 'Abu Dhabi', ru: 'Абу-Даби', ja: 'アブダビ',
    ko: '아부다비', hi: 'अबू धाबी', fa: 'ابوظبی', th: 'อาบูดาบี', vi: 'Abu Dhabi',
    id: 'Abu Dhabi', nl: 'Abu Dhabi', ar: 'أبوظبي', bn: 'আবুধাবি', sw: 'Abu Dhabi',
  },
  'الشارقة': {
    en: 'Sharjah', zh: '沙迦', es: 'Sharjah', fr: 'Charjah', de: 'Schardscha',
    it: 'Sharja', tr: 'Şarika', pt: 'Xarja', ru: 'Шарджа', ja: 'シャールジャ',
    ko: '샤르자', hi: 'शारजाह', fa: 'شارجه', th: 'ชาร์จาห์', vi: 'Sharjah',
    id: 'Sharjah', nl: 'Sharjah', ar: 'الشارقة', bn: 'শারজাহ', sw: 'Sharjah',
  },
  'عجمان': {
    en: 'Ajman', zh: '阿治曼', es: 'Ajman', fr: 'Ajman', de: 'Adschman',
    it: 'Ajman', tr: 'Acmam', pt: 'Ajman', ru: 'Аджман', ja: 'アジュマン',
    ko: '아지만', hi: 'अजमान', fa: 'عجمان', th: 'อาจ์มัน', vi: 'Ajman',
    id: 'Ajman', nl: 'Ajman', ar: 'عجمان', bn: 'আজমান', sw: 'Ajman',
  },
  'أويون': {
    en: 'Oygun', tr: 'Özyon', ar: 'أويون',
  },
  'بولياني': {
    en: 'Bolyani', tr: 'Bolyani', ar: 'بولياني',
  },
  'ديريم': {
    en: 'Derim', tr: 'Derim', ar: 'ديريم',
  },
  'إسكيلي': {
    en: 'İskele', tr: 'İskele', ar: 'إسكيلي',
  },
  'غركان': {
    en: 'Gırkan', tr: 'Gırkan', ar: 'غركان',
  },
  'ليفكو': {
    en: 'Lefko', tr: 'Lefko', ar: 'ليفكو',
  },
  'نور': {
    en: 'Nur', tr: 'Nur', ar: 'نور',
  },
}

export const getLocalizedCity = (arabicCity, locale) => {
  return cityTranslations[arabicCity]?.[locale] || cityTranslations[arabicCity]?.en || arabicCity
}

export const getLocalizedCountryLabel = (countryValue, locale) => {
  if (countryTranslations[countryValue]) {
    return countryTranslations[countryValue]?.[locale] || countryTranslations[countryValue]?.en || countryValue
  }
  return countryValue
}

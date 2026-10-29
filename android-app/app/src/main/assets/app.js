/**
 * NAMAZ VAKİTLERİ & MANEVİYAT EKRANI - CORE ENGINE
 * - Diyanet İşleri Başkanlığı Namaz Vakitleri (AlAdhan API Method 13)
 * - Canlı Kur'an-ı Kerim API (AlQuran Cloud: quran-uthmani + tr.diyanet)
 * - Canlı Hadis-i Şerif API (JSDelivr Hadith CDN: Buhârî, Müslim, Tirmizî, Ebû Dâvûd, İbn Mâce)
 * - Hısnü'l-Müslim Zikir & Tesbihat + Esmâü'l-Hüsnâ (99 İsim)
 */

// Polyfill for String.prototype.padStart (for Android 6.0.1 Chrome 49 WebView)
if (!String.prototype.padStart) {
  String.prototype.padStart = function padStart(targetLength, padString) {
    targetLength = targetLength >> 0;
    padString = String(typeof padString !== 'undefined' ? padString : ' ');
    if (this.length >= targetLength) {
      return String(this);
    }
    targetLength = targetLength - this.length;
    if (targetLength > padString.length) {
      padString += padString.repeat(Math.ceil(targetLength / padString.length));
    }
    return padString.slice(0, targetLength) + String(this);
  };
}

// Turkish Hijri Months Mapping
const HIJRI_MONTHS_TR = {
  1: 'Muharrem',
  2: 'Safer',
  3: 'Rebîülevvel',
  4: 'Rebîülâhir',
  5: 'Cemâziyelevvel',
  6: 'Cemâziyelâhir',
  7: 'Recep',
  8: 'Şaban',
  9: 'Ramazan',
  10: 'Şevval',
  11: 'Zilkade',
  12: 'Zilhicce'
};

// Complete 114 Surah Names in Authentic Turkish (Diyanet Orthography)
const SURAH_NAMES_TR = {
  1: 'Fâtiha', 2: 'Bakara', 3: 'Âl-i İmrân', 4: 'Nisâ', 5: 'Mâide', 6: 'En’âm',
  7: 'A’râf', 8: 'Enfâl', 9: 'Tevbe', 10: 'Yûnus', 11: 'Hûd', 12: 'Yûsuf',
  13: 'Ra’d', 14: 'İbrâhîm', 15: 'Hicr', 16: 'Nahl', 17: 'İsrâ', 18: 'Kehf',
  19: 'Meryem', 20: 'Tâhâ', 21: 'Enbiyâ', 22: 'Hac', 23: 'Mü’minûn', 24: 'Nûr',
  25: 'Furkân', 26: 'Şuarâ', 27: 'Neml', 28: 'Kasas', 29: 'Ankebût', 30: 'Rûm',
  31: 'Lokmân', 32: 'Secde', 33: 'Ahzâb', 34: 'Sebe’', 35: 'Fâtır', 36: 'Yâsîn',
  37: 'Sâffât', 38: 'Sâd', 39: 'Zümer', 40: 'Mü’min', 41: 'Fussilet', 42: 'Şûrâ',
  43: 'Zuhruf', 44: 'Duhân', 45: 'Câsiye', 46: 'Ahkâf', 47: 'Muhammed', 48: 'Fetih',
  49: 'Hucurât', 50: 'Kâf', 51: 'Zâriyât', 52: 'Tûr', 53: 'Necm', 54: 'Kamer',
  55: 'Rahmân', 56: 'Vâkıa', 57: 'Hadîd', 58: 'Mücâdele', 59: 'Haşr', 60: 'Mümtehine',
  61: 'Saf', 62: 'Cuma', 63: 'Münâfikûn', 64: 'Teğâbün', 65: 'Talâk', 66: 'Tahrîm',
  67: 'Mülk', 68: 'Kalem', 69: 'Hâkka', 70: 'Meâric', 71: 'Nûh', 72: 'Cin',
  73: 'Müzzemmil', 74: 'Müddessir', 75: 'Kıyâme', 76: 'İnsân', 77: 'Mürselât', 78: 'Nebe’',
  79: 'Nâziât', 80: 'Abese', 81: 'Tekvîr', 82: 'İnfitâr', 83: 'Mutaffifîn', 84: 'İnşikâk',
  85: 'Bürûc', 86: 'Târık', 87: 'A’lâ', 88: 'Ğâşiye', 89: 'Fecr', 90: 'Beled',
  91: 'Şems', 92: 'Leyl', 93: 'Duhâ', 94: 'İnşirah', 95: 'Tîn', 96: 'Alak',
  97: 'Kadr', 98: 'Beyyine', 99: 'Zilzâl', 100: 'Âdiyât', 101: 'Kâria', 102: 'Tekâsür',
  103: 'Asr', 104: 'Hümeze', 105: 'Fîl', 106: 'Kureyş', 107: 'Mâûn', 108: 'Kevser',
  109: 'Kâfirûn', 110: 'Nasr', 111: 'Tebbet', 112: 'İhlâs', 113: 'Felak', 114: 'Nâs'
};

// Curated Pool of 110+ Inspiring Quranic Verses (Surah:Ayah) for Live API Fetching
const CURATED_AYAH_REFS = [
  '1:5', '1:6', '2:45', '2:115', '2:152', '2:153', '2:156', '2:186', '2:195', '2:201',
  '2:216', '2:269', '2:286', '3:8', '3:92', '3:134', '3:139', '3:159', '3:173', '3:200',
  '4:36', '5:8', '6:17', '6:54', '6:162', '7:56', '7:156', '7:180', '8:2', '8:46',
  '9:40', '9:51', '9:129', '10:57', '10:62', '11:6', '11:88', '11:114', '11:115', '12:64',
  '12:86', '12:87', '12:90', '13:11', '13:24', '13:28', '14:7', '14:40', '14:41', '15:49',
  '16:53', '16:90', '16:97', '16:125', '16:128', '17:23', '17:24', '17:80', '17:82', '18:10',
  '19:96', '20:25', '20:46', '20:114', '21:83', '21:87', '21:107', '23:118', '24:35', '25:63',
  '25:74', '26:62', '26:80', '26:89', '27:19', '27:62', '28:24', '28:77', '29:45', '29:69',
  '30:21', '31:17', '31:18', '33:41', '33:56', '35:2', '35:15', '36:58', '36:82', '39:10',
  '39:53', '40:44', '40:60', '41:34', '42:19', '42:25', '42:30', '47:7', '48:4', '49:10',
  '49:12', '49:13', '50:16', '51:50', '53:39', '55:13', '55:60', '57:4', '57:20', '59:10',
  '59:18', '64:11', '65:2', '65:3', '67:2', '67:14', '68:4', '73:8', '87:14', '89:27',
  '93:3', '93:4', '93:5', '94:5', '94:6', '94:7', '94:8', '96:1', '99:7', '103:1',
  '108:1', '112:1', '113:1', '114:1'
];

// Curated Quranic Duas References for Live API Fetching in the Dualar Tab
const QURAN_DUA_REFS = [
  { ref: '2:127', label: 'Hz. İbrâhîm ve Hz. İsmâil’in Duası' },
  { ref: '2:250', label: 'Sabır ve Sebat Duası' },
  { ref: '3:16', label: 'Müminlerin Mağfiret Duası' },
  { ref: '3:38', label: 'Hz. Zekeriyyâ’nın (a.s.) Duası' },
  { ref: '3:147', label: 'Bağışlanma ve Sebat Duası' },
  { ref: '3:191', label: 'Ulü’l-Elbâb’ın (Akıl Sahiplerinin) Duası' },
  { ref: '3:193', label: 'Ebrâr ile Beraberlik Duası' },
  { ref: '7:23', label: 'Hz. Âdem ve Hz. Havvâ’nın Tevbe Duası' },
  { ref: '7:47', label: 'Zalimlerden Korunma Duası' },
  { ref: '7:89', label: 'Fetih ve Hakemlik Duası' },
  { ref: '7:126', label: 'Sabır ve Müslüman Olarak Vefat Duası' },
  { ref: '10:85', label: 'Tevekkül Duası' },
  { ref: '12:101', label: 'Hz. Yûsuf’un (a.s.) Salihlerle Haşrolma Duası' },
  { ref: '14:40', label: 'Namazı İkâme Etme Duası' },
  { ref: '17:24', label: 'Anne ve Babaya Merhamet Duası' },
  { ref: '17:80', label: 'Hayırlı Giriş ve Çıkış Duası' },
  { ref: '18:10', label: 'Ashâb-ı Kehf’in Rahmet ve Rüşd Duası' },
  { ref: '20:114', label: 'İlim Artırma Duası' },
  { ref: '21:83', label: 'Hz. Eyyûb’un (a.s.) Şifa Duası' },
  { ref: '23:97', label: 'Şeytanın Vesvesesinden Sığınma Duası' },
  { ref: '23:118', label: 'Merhamet ve Bağışlanma Duası' },
  { ref: '25:74', label: 'Göz Aydınlığı Eş ve Evlat Duası' },
  { ref: '27:19', label: 'Hz. Süleyman’ın (a.s.) Şükür Duası' },
  { ref: '28:24', label: 'Hz. Mûsâ’nın (a.s.) Hayır ve Rızık Duası' },
  { ref: '40:7', label: 'Meleklerin Müminler İçin İstiğfarı' },
  { ref: '46:15', label: 'Anne-Babaya Şükür ve Nesil Islahı Duası' },
  { ref: '59:10', label: 'Mümin Kardeşlere Mağfiret ve Kalp Temizliği Duası' },
  { ref: '66:8', label: 'Nurun Tamamlanması ve Nasuh Tevbe Duası' }
];

// Curated Quranic Dhikr Verses for Live API Fetching in the Zikir Tab
const QURAN_ZIKIR_REFS = [
  { ref: '2:255', label: 'Âyetel Kürsî', target: 1 },
  { ref: '2:285', label: 'Âmenerrasûlü (1. Bölüm)', target: 1 },
  { ref: '2:286', label: 'Âmenerrasûlü (2. Bölüm)', target: 1 },
  { ref: '59:22', label: 'Hûvallâhüllezî (Haşr 22)', target: 1 },
  { ref: '59:23', label: 'Hûvallâhüllezî (Haşr 23)', target: 1 },
  { ref: '59:24', label: 'Hûvallâhüllezî (Haşr 24)', target: 1 },
  { ref: '3:18', label: 'Şehidallâhü (Tevhid Şahitliği)', target: 1 },
  { ref: '3:26', label: 'Kulillâhümme Mâlikel-Mülk', target: 1 },
  { ref: '33:56', label: 'Salavât-ı Şerîfe Ayeti', target: 7 }
];

// Prayer order and Turkish labels
const PRAYERS_ORDER = [
  { key: 'Fajr', abbr: 'İMS', nameTr: 'İmsak' },
  { key: 'Sunrise', abbr: 'GÜN', nameTr: 'Güneş' },
  { key: 'Dhuhr', abbr: 'ÖĞL', nameTr: 'Öğle' },
  { key: 'Asr', abbr: 'İKN', nameTr: 'İkindi' },
  { key: 'Maghrib', abbr: 'AKŞ', nameTr: 'Akşam' },
  { key: 'Isha', abbr: 'YAT', nameTr: 'Yatsı' }
];

// ============================================================================
// 1. ZİKİR & TESBİHAT DATA (Hısnü'l-Müslim + Namaz Tesbihatı in Arabic & Turkish)
// ============================================================================
const ZIKIR_LIST = [
  {
    id: 'zikir_subhanallah',
    category: 'tesbihat',
    categoryLabel: 'Namaz Tesbihatı',
    target: 33,
    ar: 'سُبْحَانَ اللَّهِ',
    tr: 'Allah’ı tüm eksikliklerden ve noksan sıfatlardan tenzih ederim.',
    note: 'Farz namazların ardından 33 defa'
  },
  {
    id: 'zikir_elhamdulillah',
    category: 'tesbihat',
    categoryLabel: 'Namaz Tesbihatı',
    target: 33,
    ar: 'الْحَمْدُ لِلَّهِ',
    tr: 'Her türlü övgü, şükür ve minnet yalnızca âlemlerin Rabbi olan Allah’a mahsustur.',
    note: 'Farz namazların ardından 33 defa'
  },
  {
    id: 'zikir_allahuakbar',
    category: 'tesbihat',
    categoryLabel: 'Namaz Tesbihatı',
    target: 33,
    ar: 'اللَّهُ أَكْبَرُ',
    tr: 'Allah her şeyden yücedir, her şeyden büyüktür.',
    note: 'Farz namazların ardından 33 defa'
  },
  {
    id: 'zikir_tevhid',
    category: 'tesbihat',
    categoryLabel: 'Namaz Tesbihatı',
    target: 1,
    ar: 'لَا إِلَٰهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ',
    tr: 'Allah’tan başka ilâh yoktur; O tektir, ortağı yoktur. Mülk O’nundur, hamd O’na mahsustur. O her şeye hakkıyla gücü yetendir.',
    note: 'Tesbihatın 100’e tamamlanması (Müslim, Mesâcid, 146)'
  },
  {
    id: 'zikir_selam',
    category: 'tesbihat',
    categoryLabel: 'Namaz Tesbihatı',
    target: 1,
    ar: 'اللَّهُمَّ أَنْتَ السَّلَامُ وَمِنْكَ السَّلَامُ تَبَارَكْتَ يَا ذَا الْجَلَالِ وَالْإِكْرَامِ',
    tr: 'Allah’ım! Sen Selâm’sın (her türlü kusurdan uzaksın), selâmet ve esenlik de ancak Sendendir. Ey celâl ve ikram sahibi Rabbimiz, Sen ne yücesin!',
    note: 'Selâm verdikten hemen sonra (Müslim, Mesâcid, 135)'
  },
  {
    id: 'zikir_muaz',
    category: 'tesbihat',
    categoryLabel: 'Namaz Sonrası (Hısnü’l-Müslim)',
    target: 1,
    ar: 'اللَّهُمَّ أَعِنِّي عَلَىٰ ذِكْرِكَ وَشُكْرِكَ وَحُسْنِ عِبَادَتِكَ',
    tr: 'Allah’ım! Seni zikretmek, Sana şükretmek ve Sana en güzel şekilde ibadet etmek için bana yardım eyle.',
    note: 'Hz. Muâz’a (r.a.) tavsiye edilen namaz sonu zikri (Ebû Dâvûd, Vitir, 26)'
  },
  {
    id: 'zikir_bihamdihi',
    category: 'sabah_aksam',
    categoryLabel: 'Sabah & Akşam Zikri (Hısnü’l-Müslim)',
    target: 100,
    ar: 'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ، سُبْحَانَ اللَّهِ الْعَظِيمِ',
    tr: 'Allah’ı hamd ile tesbih ve tenzih ederim; Yüce Allah’ı tüm noksanlıklardan tenzih ederim.',
    note: 'Dilde hafif, mizanda ağır, Rahmân’a sevimli iki cümle (Buhârî, Daavât, 65)'
  },
  {
    id: 'zikir_seyyidul_istigfar',
    category: 'sabah_aksam',
    categoryLabel: 'Sabah & Akşam (Seyyidü’l-İstiğfâr)',
    target: 1,
    ar: 'اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَٰهَ إِلَّا أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ، وَأَنَا عَلَىٰ عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ، أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ، أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ وَأَبُوءُ لَكَ بِذَنْبِي فَاغْفِرْ لِي، فَإِنَّهُ لَا يَغْفِرُ الذُّنُوبَ إِلَّا أَنْتَ',
    tr: 'Allah’ım! Sen benim Rabbimsin, Senden başka ilâh yoktur. Beni Sen yarattın ve ben Senin kulunum. Gücüm yettiğince Sana verdiğim söz ve vaad üzereyim. Yaptığım şeylerin şerrinden Sana sığınırım. Bana olan nimetini de günahımı da itiraf ediyorum; beni bağışla. Zira günahları Senden başka bağışlayacak yoktur.',
    note: 'İstiğfarların efendisi (Buhârî, Daavât, 2)'
  },
  {
    id: 'zikir_raditu',
    category: 'sabah_aksam',
    categoryLabel: 'Sabah & Akşam Zikri (Hısnü’l-Müslim)',
    target: 3,
    ar: 'رَضِيتُ بِاللَّهِ رَبًّا، وَبِالْإِسْلَامِ دِينًا، وَبِمُحَمَّدٍ صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ نَبِيًّا',
    tr: 'Rab olarak Allah’tan, din olarak İslâm’dan, Peygamber olarak Muhammed’den (s.a.v.) razı ve hoşnut oldum.',
    note: 'Sabah ve akşam 3 defa (Ebû Dâvûd, Edeb, 101)'
  },
  {
    id: 'zikir_bismillahillezi',
    category: 'sabah_aksam',
    categoryLabel: 'Sabah & Akşam Korunma Zikri',
    target: 3,
    ar: 'بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ',
    tr: 'İsmi sayesinde yerde ve gökte hiçbir şeyin zarar veremeyeceği Allah’ın adıyla. O her şeyi işiten ve her şeyi bilendir.',
    note: 'Sabah ve akşam 3 defa (Tirmizî, Daavât, 13)'
  },
  {
    id: 'zikir_hasbunallah',
    category: 'sabah_aksam',
    categoryLabel: 'Sabah & Akşam Zikri',
    target: 7,
    ar: 'حَسْبِيَ اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ عَلَيْهِ تَوَكَّلْتُ وَهُوَ رَبُّ الْعَرْشِ الْعَظِيمِ',
    tr: 'Bana Allah yeter. O’ndan başka ilâh yoktur. Ben yalnızca O’na tevekkül ettim; O, yüce Arş’ın Rabbidir.',
    note: 'Tevbe Suresi, 129. Ayet'
  },
  {
    id: 'zikir_istigfar',
    category: 'gunluk',
    categoryLabel: 'Günlük Zikir',
    target: 100,
    ar: 'أَسْتَغْفِرُ اللَّهَ الْعَظِيمَ وَأَتُوبُ إِلَيْهِ',
    tr: 'Yüce Allah’tan bağışlanma diler ve O’na tövbe ederim.',
    note: 'Günlük istiğfar (Buhârî, Daavât, 3)'
  },
  {
    id: 'zikir_havkale',
    category: 'gunluk',
    categoryLabel: 'Günlük Zikir',
    target: 33,
    ar: 'لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ الْعَلِيِّ الْعَظِيمِ',
    tr: 'Günahtan kaçacak güç de, ibadet edecek kuvvet de ancak Yüce ve Büyük olan Allah’ın yardımıyladır.',
    note: 'Cennet hazinelerinden bir hazine (Buhârî, Daavât, 50)'
  },
  {
    id: 'zikir_salavat',
    category: 'gunluk',
    categoryLabel: 'Salavât-ı Şerîfe',
    target: 33,
    ar: 'اللَّهُمَّ صَلِّ وَسَلِّمْ عَلَىٰ نَبِيِّنَا مُحَمَّدٍ',
    tr: 'Allah’ım! Peygamberimiz Muhammed’e rahmet (salât) ve esenlik (selâm) eyle.',
    note: 'Müslim, Salât, 70'
  }
];

// ============================================================================
// 2. ESMÂÜ'L-HÜSNÂ (All 99 Names of Allah in Arabic & Turkish)
// ============================================================================
const ESMA_LIST = [
  { num: 1, ar: 'ٱللَّهُ', tr: 'Allah', meaning: 'Varlığı zorunlu olan ve bütün övgülere lâyık bulunan yüce Yaratıcı.' },
  { num: 2, ar: 'ٱلرَّحْمَـٰنُ', tr: 'Er-Rahmân', meaning: 'Dünyada bütün mahlûkata ayrım gözetmeksizin merhamet eden ve nimet veren.' },
  { num: 3, ar: 'ٱلرَّحِيمُ', tr: 'Er-Rahîm', meaning: 'Ahirette mümin kullarına özel şefkat ve merhamet gösteren.' },
  { num: 4, ar: 'ٱلْمَلِكُ', tr: 'El-Melik', meaning: 'Bütün kâinatın mutlak sahibi ve hükümdarı.' },
  { num: 5, ar: 'ٱلْقُدُّوسُ', tr: 'El-Kuddûs', meaning: 'Her türlü eksiklik, kusur ve hatadan münezzeh olan.' },
  { num: 6, ar: 'ٱلسَّلَامُ', tr: 'Es-Selâm', meaning: 'Kullarını selâmete çıkaran, esenlik ve huzur kaynağı olan.' },
  { num: 7, ar: 'ٱلْمُؤْمِنُ', tr: 'El-Mü’min', meaning: 'Kalplere iman bağışlayan, kendine sığınanlara güven ve emniyet veren.' },
  { num: 8, ar: 'ٱلْمُهَيْمِنُ', tr: 'El-Müheymin', meaning: 'Bütün varlıkları görüp gözeten, koruyan ve kollayan.' },
  { num: 9, ar: 'ٱلْعَزِيزُ', tr: 'El-Azîz', meaning: 'Mutlak güç ve izzet sahibi, mağlup edilmesi imkânsız olan.' },
  { num: 10, ar: 'ٱلْجَبَّارُ', tr: 'El-Cebbâr', meaning: 'Kırılanları onaran, dilediğini kudretiyle gerçekleştiren.' },
  { num: 11, ar: 'ٱلْمُتَكَبِّرُ', tr: 'El-Mütekebbir', meaning: 'Büyüklükte ve azamette eşi benzeri olmayan.' },
  { num: 12, ar: 'ٱلْخَالِقُ', tr: 'El-Hâlık', meaning: 'Her şeyi yoktan ve kusursuz bir ölçüyle yaratan.' },
  { num: 13, ar: 'ٱلْبَارِئُ', tr: 'El-Bâri’', meaning: 'Varlıkları birbirine uygun ve benzersiz bir düzen içinde yaratan.' },
  { num: 14, ar: 'ٱلْمُصَوِّرُ', tr: 'El-Musavvir', meaning: 'Her varlığa kendine has en güzel şekil ve sureti veren.' },
  { num: 15, ar: 'ٱلْغَفَّارُ', tr: 'El-Gaffâr', meaning: 'Kullarının günahlarını tekrar tekrar örten ve çokça bağışlayan.' },
  { num: 16, ar: 'ٱلْقَهَّارُ', tr: 'El-Kahhâr', meaning: 'Her şeye galip gelen ve tüm varlıkların boyun eğdiği kudret sahibi.' },
  { num: 17, ar: 'ٱلْوَهَّابُ', tr: 'El-Vehhâb', meaning: 'Karşılık beklemeksizin bolca nimet ve ihsan bağışlayan.' },
  { num: 18, ar: 'ٱلرَّزَّاقُ', tr: 'Er-Rezzâk', meaning: 'Bütün canlıların maddi ve manevi rızkını veren.' },
  { num: 19, ar: 'ٱلْفَتَّاحُ', tr: 'El-Fettâh', meaning: 'Her türlü müşkülü çözen, hayır ve rahmet kapılarını açan.' },
  { num: 20, ar: 'ٱلْعَلِيمُ', tr: 'El-Alîm', meaning: 'Gizli ve açık, geçmiş ve gelecek her şeyi hakkıyla bilen.' },
  { num: 21, ar: 'ٱلْقَابِضُ', tr: 'El-Kâbıd', meaning: 'Hikmeti gereği rızkı daraltan ve ruhları kabzeden.' },
  { num: 22, ar: 'ٱلْبَاسِطُ', tr: 'El-Bâsıt', meaning: 'Rızkı genişleten, kalplere ferahlık ve inşirah veren.' },
  { num: 23, ar: 'ٱلْخَافِضُ', tr: 'El-Hâfıd', meaning: 'Zalim ve kibirli olanları alçaltan.' },
  { num: 24, ar: 'ٱلرَّافِعُ', tr: 'Er-Râfi’', meaning: 'İman ve tevazu sahiplerinin derecelerini yükselten.' },
  { num: 25, ar: 'ٱلْمُعِزُّ', tr: 'El-Muiz', meaning: 'Dilediği kuluna izzet, şeref ve itibar bahşeden.' },
  { num: 26, ar: 'ٱلْمُذِلُّ', tr: 'El-Müzil', meaning: 'Dilediğini zillete düşüren.' },
  { num: 27, ar: 'ٱلسَّمِيعُ', tr: 'Es-Semî’', meaning: 'En gizli yakarışları ve fısıltıları dahi hakkıyla işiten.' },
  { num: 28, ar: 'ٱلْبَصِيرُ', tr: 'El-Basîr', meaning: 'Her şeyi en ince ayrıntısına kadar gören.' },
  { num: 29, ar: 'ٱلْحَكَمُ', tr: 'El-Hakem', meaning: 'Mutlak hüküm sahibi olan ve hakkı batıldan ayıran.' },
  { num: 30, ar: 'ٱلْعَدْلُ', tr: 'El-Adl', meaning: 'Mutlak adalet sahibi, asla zulmetmeyen.' },
  { num: 31, ar: 'ٱللَّطِيفُ', tr: 'El-Latîf', meaning: 'En ince işlerin bütün inceliklerini bilen, kullarına sezdirmeden lütufta bulunan.' },
  { num: 32, ar: 'ٱلْخَبِيرُ', tr: 'El-Habîr', meaning: 'Her şeyin iç yüzünden ve gizli yönlerinden haberdar olan.' },
  { num: 33, ar: 'ٱلْحَلِيمُ', tr: 'El-Halîm', meaning: 'Suçluların cezasını vermekte acele etmeyen, yumuşak muamele eden.' },
  { num: 34, ar: 'ٱلْعَظِيمُ', tr: 'El-Azîm', meaning: 'Zâtı ve sıfatları bakımından pek yüce ve ulu olan.' },
  { num: 35, ar: 'ٱلْغَفُورُ', tr: 'El-Gafûr', meaning: 'Affı ve mağfireti sonsuz olan.' },
  { num: 36, ar: 'ٱلشَّكُورُ', tr: 'Eş-Şekûr', meaning: 'Az amele karşılık kat kat fazlasıyla mükâfat veren.' },
  { num: 37, ar: 'ٱلْعَلِيُّ', tr: 'El-Aliyy', meaning: 'Yücelikte sınır olmayan, her şeyden üstün olan.' },
  { num: 38, ar: 'ٱلْكَبِيرُ', tr: 'El-Kebîr', meaning: 'Büyüklüğü akılların idrakini aşan mutlak ulu.' },
  { num: 39, ar: 'ٱلْحَفِيظُ', tr: 'El-Hafîz', meaning: 'Kâinatı ve kullarını her türlü tehlikeden koruyan.' },
  { num: 40, ar: 'ٱلْمُقِيتُ', tr: 'El-Mukît', meaning: 'Bedenlerin ve ruhların gıdasını yaratıp ulaştıran.' },
  { num: 41, ar: 'ٱلْحَسِيبُ', tr: 'El-Hasîb', meaning: 'Kullarına kâfi gelen ve herkesi hesaba çeken.' },
  { num: 42, ar: 'ٱلْجَلِيلُ', tr: 'El-Celîl', meaning: 'Celâlet, ululuk ve heybet sahibi olan.' },
  { num: 43, ar: 'ٱلْكَرِيمُ', tr: 'El-Kerîm', meaning: 'Cömertliği, ikramı ve bağışı sınırsız olan.' },
  { num: 44, ar: 'ٱلرَّقِيبُ', tr: 'Er-Rakîb', meaning: 'Bütün varlıkları her an gözetleyen.' },
  { num: 45, ar: 'ٱلْمُجِيبُ', tr: 'El-Mücîb', meaning: 'Kendisine el açıp dua edenlerin dualarına icabet eden.' },
  { num: 46, ar: 'ٱلْوَاسِعُ', tr: 'El-Vâsi’', meaning: 'İlmi, rahmeti ve kudreti her şeyi kuşatan.' },
  { num: 47, ar: 'ٱلْحَكِيمُ', tr: 'El-Hakîm', meaning: 'Her işi, emri ve yaratması hikmetli olan.' },
  { num: 48, ar: 'ٱلْوَدُودُ', tr: 'El-Vedûd', meaning: 'Salih kullarını çok seven ve sevilmeye en lâyık olan.' },
  { num: 49, ar: 'ٱلْمَجِيدُ', tr: 'El-Mecîd', meaning: 'Şanı yüce, ihsanı bol ve keremi sonsuz olan.' },
  { num: 50, ar: 'ٱلْبَاعِثُ', tr: 'El-Bâis', meaning: 'Ölüleri dirilten ve insanlığa peygamberler gönderen.' },
  { num: 51, ar: 'ٱلشَّهِيدُ', tr: 'Eş-Şehîd', meaning: 'Her zaman ve her yerde hazır olup her şeye şahit olan.' },
  { num: 52, ar: 'ٱلْحَقُّ', tr: 'El-Hakk', meaning: 'Varlığı hiç değişmeden duran, bizzat gerçek olan.' },
  { num: 53, ar: 'ٱلْوَكِيلُ', tr: 'El-Vekîl', meaning: 'Kendisine tevekkül edenlerin işlerini en güzel yoluna koyan.' },
  { num: 54, ar: 'ٱلْقَوِيُّ', tr: 'El-Kaviyy', meaning: 'Kudreti eksilmeyen, sınırsız güç sahibi.' },
  { num: 55, ar: 'ٱلْمَتِينُ', tr: 'El-Metîn', meaning: 'Kudreti sarsılmaz, çok sağlam ve güçlü olan.' },
  { num: 56, ar: 'ٱلْوَلِيُّ', tr: 'El-Veliyy', meaning: 'Müminlerin gerçek dostu ve yardımcısı olan.' },
  { num: 57, ar: 'ٱلْحَمِيدُ', tr: 'El-Hamîd', meaning: 'Her hâlükârda övülmeye ve şükredilmeye lâyık olan.' },
  { num: 58, ar: 'ٱلْمُحْصِي', tr: 'El-Muhsî', meaning: 'Varlıkların sayısını ve her birinin durumunu tek tek bilen.' },
  { num: 59, ar: 'ٱلْمُبْدِئُ', tr: 'El-Mübdi’', meaning: 'Varlıkları örneksiz olarak ilk defa yaratan.' },
  { num: 60, ar: 'ٱلْمُعِيدُ', tr: 'El-Muîd', meaning: 'Yaratılmışları ölümünden sonra yeniden dirilten.' },
  { num: 61, ar: 'ٱلْمُحْيِي', tr: 'El-Muhyî', meaning: 'Can bağışlayan, kalpleri imanla dirilten.' },
  { num: 62, ar: 'ٱلْمُمِيتُ', tr: 'El-Mümît', meaning: 'Canlıların dünya hayatını sona erdiren.' },
  { num: 63, ar: 'ٱلْحَيُّ', tr: 'El-Hayy', meaning: 'Ezeli ve ebedi hayat sahibi, diri olan.' },
  { num: 64, ar: 'ٱلْقَيُّومُ', tr: 'El-Kayyûm', meaning: 'Kendi kendine var olan ve bütün kâinatı ayakta tutan.' },
  { num: 65, ar: 'ٱلْوَاجِدُ', tr: 'El-Vâcid', meaning: 'Hiçbir şeye muhtaç olmayan, dilediğini istediği anda bulan.' },
  { num: 66, ar: 'ٱلْمَاجِدُ', tr: 'El-Mâcid', meaning: 'Kadri ve şanı büyük, cömertliği bol olan.' },
  { num: 67, ar: 'ٱلْوَاحِدُ', tr: 'El-Vâhid', meaning: 'Zâtında, sıfatlarında ve işlerinde tek olan.' },
  { num: 68, ar: 'ٱلصَّمَدُ', tr: 'Es-Samed', meaning: 'Her şeyin O’na muhtaç olduğu, kendisi hiçbir şeye muhtaç olmayan.' },
  { num: 69, ar: 'ٱلْقَادِرُ', tr: 'El-Kâdir', meaning: 'Dilediği her şeyi tam bir ölçüyle yapmaya gücü yeten.' },
  { num: 70, ar: 'ٱلْمُقْتَدِرُ', tr: 'El-Muktedir', meaning: 'Kudreti her şeye üstün gelen ve tasarruf eden.' },
  { num: 71, ar: 'ٱلْمُقَدِّمُ', tr: 'El-Mukaddim', meaning: 'Hikmeti gereği dilediğini öne geçiren ve yükselten.' },
  { num: 72, ar: 'ٱلْمُؤَخِّرُ', tr: 'El-Muahhir', meaning: 'Hikmeti gereği dilediğini geriye bırakan.' },
  { num: 73, ar: 'ٱلْأَوَّلُ', tr: 'El-Evvel', meaning: 'Varlığının başlangıcı olmayan, ezeli olan.' },
  { num: 74, ar: 'ٱلْآخِرُ', tr: 'El-Âhir', meaning: 'Varlığının sonu olmayan, ebedi olan.' },
  { num: 75, ar: 'ٱلظَّاهِرُ', tr: 'Ez-Zâhir', meaning: 'Yarattığı sayısız delillerle varlığı apaçık bilinen.' },
  { num: 76, ar: 'ٱلْبَاطِنُ', tr: 'El-Bâtın', meaning: 'Zâtının mahiyeti duyularla ve akılla kuşatılamayan.' },
  { num: 77, ar: 'ٱلْوَالِي', tr: 'El-Vâlî', meaning: 'Bütün kâinatı tek başına sevk ve idare eden.' },
  { num: 78, ar: 'ٱلْمُتَعَالِي', tr: 'El-Müteâlî', meaning: 'Yaratılmışların sıfatlarından tamamen yüce ve münezzeh olan.' },
  { num: 79, ar: 'ٱلْبَرُّ', tr: 'El-Berr', meaning: 'Kullarına karşı çok şefkatli, iyiliği ve lütfu bol olan.' },
  { num: 80, ar: 'ٱلتَّوَّابُ', tr: 'Et-Tevvâb', meaning: 'Tövbeleri kabul eden ve kullarını tövbeye muvaffak kılan.' },
  { num: 81, ar: 'ٱلْمُنْتَقِمُ', tr: 'El-Müntakim', meaning: 'Zalimlere adaletiyle hak ettikleri karşılığı veren.' },
  { num: 82, ar: 'ٱلْعَفُوُّ', tr: 'El-Afüvv', meaning: 'Günahları kökünden silip affeden.' },
  { num: 83, ar: 'ٱلرَّءُوفُ', tr: 'Er-Raûf', meaning: 'Engin şefkat ve merhamet sahibi olan.' },
  { num: 84, ar: 'مَالِكُ ٱلْمُلْكِ', tr: 'Mâlikü’l-Mülk', meaning: 'Mülkün ebedi sahibi, dilediğine mülk veren.' },
  { num: 85, ar: 'ذُو ٱلْجَلَالِ وَٱلْإِكْرَامِ', tr: 'Zü’l-Celâli ve’l-İkrâm', meaning: 'Hem azamet ve büyüklük hem de sonsuz lütuf ve ikram sahibi.' },
  { num: 86, ar: 'ٱلْمُقْسِطُ', tr: 'El-Muksit', meaning: 'Bütün işlerini denk ve adaletle yürüten, mazlumun hakkını alan.' },
  { num: 87, ar: 'ٱلْجَامِعُ', tr: 'El-Câmi’', meaning: 'İstediğini istediği yerde toplayan, kıyamet günü mahlûkatı bir araya getiren.' },
  { num: 88, ar: 'ٱلْغَنِيُّ', tr: 'El-Ganiyy', meaning: 'Mutlak zengin, hiçbir şeye ihtiyacı olmayan.' },
  { num: 89, ar: 'ٱلْمُغْنِي', tr: 'El-Muğnî', meaning: 'Dilediği kulunu zengin kılan ve ihtiyaçtan kurtaran.' },
  { num: 90, ar: 'ٱلْمَانِعُ', tr: 'El-Mâni’', meaning: 'Hikmeti gereği zararlı veya vakti gelmemiş şeylere engel olan.' },
  { num: 91, ar: 'ٱلضَّارُّ', tr: 'Ed-Dârr', meaning: 'İmtihan ve hikmet gereği elem ve zarar verici şeyleri yaratan.' },
  { num: 92, ar: 'ٱلنَّافِعُ', tr: 'En-Nâfi’', meaning: 'Hayır, şifa ve fayda veren şeyleri yaratan.' },
  { num: 93, ar: 'ٱلنُّورُ', tr: 'En-Nûr', meaning: 'Âlemleri ve gönülleri iman ve hikmet nuruyla aydınlatan.' },
  { num: 94, ar: 'ٱلْهَادِي', tr: 'El-Hâdî', meaning: 'Kullarına doğru yolu gösteren ve hidayete ulaştıran.' },
  { num: 95, ar: 'ٱلْبَدِيعُ', tr: 'El-Bedî’', meaning: 'Eşi ve benzeri olmayan harika âlemler yaratan.' },
  { num: 96, ar: 'ٱلْبَاقِي', tr: 'El-Bâkî', meaning: 'Varlığının sonu olmayan, ebediyen var kalan.' },
  { num: 97, ar: 'ٱلْوَارِثُ', tr: 'El-Vâris', meaning: 'Her şey fani olduktan sonra mülkün gerçek sahibi olarak kalan.' },
  { num: 98, ar: 'ٱلرَّشِيدُ', tr: 'Er-Reşîd', meaning: 'Bütün işleri yerli yerinde ve en doğru hikmet üzere yürüten.' },
  { num: 99, ar: 'ٱلصَّبُورُ', tr: 'Es-Sabûr', meaning: 'İsyankârları cezalandırmakta acele etmeyip tövbe kapısını açık tutan.' }
];

// ============================================================================
// 3. KUR'AN & SÜNNET DUALARI (Initial Offline + Expandable via Live API)
// ============================================================================
const DUA_LIST = [
  {
    category: 'rabbena',
    categoryLabel: 'Rabbenâ Duası',
    ar: 'رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ',
    tr: 'Rabbimiz! Bize dünyada da iyilik ver, ahirette de iyilik ver ve bizi ateş azabından koru.',
    source: 'Bakara Suresi, 201. Ayet'
  },
  {
    category: 'rabbena',
    categoryLabel: 'Rabbenâ Duası',
    ar: 'رَبَّنَا اغْفِرْ لِي وَلِوَالِدَيَّ وَلِلْمُؤْمِنِينَ يَوْمَ يَقُومُ الْحِسَابُ',
    tr: 'Rabbimiz! Hesap kurulacağı gün beni, anne-babamı ve bütün müminleri bağışla.',
    source: 'İbrâhîm Suresi, 41. Ayet'
  },
  {
    category: 'rabbena',
    categoryLabel: 'Hidayet ve Sebat Duası',
    ar: 'رَبَّنَا لَا تُزِغْ قُلُوبَنَا بَعْدَ إِذْ هَدَيْتَنَا وَهَبْ لَنَا مِنْ لَدُنْكَ رَحْمَةً إِنَّكَ أَنْتَ الْوَهَّابُ',
    tr: 'Rabbimiz! Bizi doğru yola ilettikten sonra kalplerimizi eğriltme. Bize katından bir rahmet bahşet. Şüphesiz Sen çok bağışlayansın.',
    source: 'Âl-i İmrân Suresi, 8. Ayet'
  },
  {
    category: 'huzur',
    categoryLabel: 'İnşirah ve Kolaylık Duası',
    ar: 'رَبِّ اشْرَحْ لِي صَدْرِي وَيَسِّرْ لِي أَمْرِي وَاحْلُلْ عُقْدَةً مِنْ لِسَانِي يَفْقَهُوا قَوْلِي',
    tr: 'Rabbim! Göğsüme genişlik ver, işimi bana kolaylaştır ve dilimdeki düğümü çöz ki sözümü iyi anlasınlar.',
    source: 'Tâhâ Suresi, 25–28. Ayetler'
  },
  {
    category: 'huzur',
    categoryLabel: 'Hz. Yunus’un (a.s.) Duası',
    ar: 'لَا إِلَٰهَ إِلَّا أَنْتَ سُبْحَانَكَ إِنِّي كُنْتُ مِنَ الظَّالِمِينَ',
    tr: 'Senden başka hiçbir ilâh yoktur. Seni bütün noksanlıklardan tenzih ederim. Gerçekten ben nefsine zulmedenlerden oldum.',
    source: 'Enbiyâ Suresi, 87. Ayet'
  },
  {
    category: 'sunnet',
    categoryLabel: 'Peygamber Efendimiz’in (s.a.v.) Duası',
    ar: 'يَا مُقَلِّبَ الْقُلُوبِ ثَبِّتْ قَلْبِي عَلَىٰ دِينِكَ',
    tr: 'Ey kalpleri evirip çeviren Allah’ım! Kalbimi Senin dinin üzere sabit kıl.',
    source: 'Hadis-i Şerif — Tirmizî, Kader, 7'
  },
  {
    category: 'sunnet',
    categoryLabel: 'Faydalı İlim ve Rızık Duası',
    ar: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ عِلْمًا نَافِعًا وَرِزْقًا طَيِّبًا وَعَمَلًا مُتَقَبَّلًا',
    tr: 'Allah’ım! Senden faydalı ilim, helâl ve temiz rızık ve kabul edilmiş salih amel dilerim.',
    source: 'Hadis-i Şerif — İbn Mâce, İkâmet, 32'
  },
  {
    category: 'sunnet',
    categoryLabel: 'Af ve Âfiyet Duası',
    ar: 'اللَّهُمَّ إِنَّكَ عَفُوٌّ كَرِيمٌ تُحِبُّ الْعَفْوَ فَاعْفُ عَنِّي',
    tr: 'Allah’ım! Şüphesiz Sen çok affedicisin, cömertsin, affetmeyi seversin; beni de affet.',
    source: 'Hadis-i Şerif — Tirmizî, Daavât, 84'
  }
];

// ============================================================================
// 4. KUR'AN AYETLERİ & HADİS-İ ŞERİFLER (Bilingual Pool + Live API Expansion)
// ============================================================================
const VERSES_AND_HADITHS = [
  {
    type: 'ayet',
    ref: '1:6',
    ar: 'اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ',
    text: 'Bizi doğru yola ilet.',
    source: 'Fâtiha Suresi, 6. Ayet'
  },
  {
    type: 'ayet',
    ref: '13:28',
    ar: 'أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ',
    text: 'Kalpler ancak Allah’ı anmakla huzur bulur.',
    source: 'Ra’d Suresi, 28. Ayet'
  },
  {
    type: 'ayet',
    ref: '94:5',
    ar: 'فَإِنَّ مَعَ الْعُسْرِ يُسْرًا',
    text: 'Şüphesiz güçlükle beraber bir kolaylık vardır.',
    source: 'İnşirah Suresi, 5. Ayet'
  },
  {
    type: 'ayet',
    ref: '93:3',
    ar: 'مَا وَدَّعَكَ رَبُّكَ وَمَا قَلَىٰ',
    text: 'Rabbin seni terk etmedi ve sana darılmadı.',
    source: 'Duhâ Suresi, 3. Ayet'
  },
  {
    type: 'ayet',
    ref: '2:153',
    ar: 'يَا أَيُّهَا الَّذِينَ آمَنُوا اسْتَعِينُوا بِالصَّبْرِ وَالصَّلَاةِ ۚ إِنَّ اللَّهَ مَعَ الصَّابِرِينَ',
    text: 'Ey iman edenler! Sabır ve namaz ile Allah’tan yardım dileyin. Şüphesiz Allah sabredenlerle beraberdir.',
    source: 'Bakara Suresi, 153. Ayet'
  },
  {
    type: 'ayet',
    ref: '57:4',
    ar: 'وَهُوَ مَعَكُمْ أَيْنَ مَا كُنْتُمْ',
    text: 'Nerede olursanız olun, O sizinle beraberdir.',
    source: 'Hadîd Suresi, 4. Ayet'
  },
  {
    type: 'ayet',
    ref: '2:286',
    ar: 'لَا يُكَلِّفُ اللَّهُ نَفْسًا إِلَّا وُسْعَهَا',
    text: 'Allah bir kimseye ancak gücünün yettiği kadar yük yükler.',
    source: 'Bakara Suresi, 286. Ayet'
  },
  {
    type: 'ayet',
    ref: '55:60',
    ar: 'هَلْ جَزَاءُ الْإِحْسَانِ إِلَّا الْإِحْسَانُ',
    text: 'İyiliğin karşılığı, yalnız iyilik değil midir?',
    source: 'Rahmân Suresi, 60. Ayet'
  },
  {
    type: 'ayet',
    ref: '2:186',
    ar: 'وَإِذَا سَأَلَكَ عِبَادِي عَنِّي فَإِنِّي قَرِيبٌ',
    text: 'Kullarım sana beni sorduklarında bilsinler ki şüphesiz ben çok yakınım.',
    source: 'Bakara Suresi, 186. Ayet'
  },
  {
    type: 'hadis',
    ar: 'إِنَّمَا الْأَعْمَالُ بِالنِّيَّاتِ',
    text: 'Ameller niyetlere göredir. Herkese ancak niyet ettiği şey vardır.',
    source: 'Hadis-i Şerif — Buhârî, Bed’ü’l-Vahy, 1'
  },
  {
    type: 'hadis',
    ar: 'يَسِّرُوا وَلَا تُعَسِّرُوا، وَبَشِّرُوا وَلَا تُنَفِّرُوا',
    text: 'Kolaylaştırınız, güçleştirmeyiniz; müjdeleyiniz, nefret ettirmeyiniz.',
    source: 'Hadis-i Şerif — Buhârî, İlim, 11'
  },
  {
    type: 'hadis',
    ar: 'خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ',
    text: 'Sizin en hayırlınız, Kur’an’ı öğrenen ve öğretendir.',
    source: 'Hadis-i Şerif — Buhârî, Fedâilü’l-Kur’ân, 21'
  },
  {
    type: 'hadis',
    ar: 'إِنَّ اللَّهَ لَا يَنْظُرُ إِلَىٰ صُوَرِكُمْ وَأَمْوَالِكُمْ وَلَٰكِنْ يَنْظُرُ إِلَىٰ قُلُوبِكُمْ وَأَعْمَالِكُمْ',
    text: 'Allah sizin dış görünüşünüze ve mallarınıza bakmaz, ancak kalplerinize ve amellerinize bakar.',
    source: 'Hadis-i Şerif — Müslim, Birr, 34'
  },
  {
    type: 'hadis',
    ar: 'الْمُسْلِمُ مَنْ سَلِمَ الْمُسْلِمُونَ مِنْ لِسَانِهِ وَيَدِهِ',
    text: 'Müslüman, elinden ve dilinden diğer Müslümanların emin olduğu kimsedir.',
    source: 'Hadis-i Şerif — Buhârî, Îmân, 4'
  },
  {
    type: 'hadis',
    ar: 'الدُّعَاءُ هُوَ الْعِبَادَةُ',
    text: 'Dua ibadetin özüdür.',
    source: 'Hadis-i Şerif — Tirmizî, Tefsîru’l-Kur’ân, 40'
  },
  {
    type: 'hadis',
    ar: 'مَنْ لَا يَرْحَمُ لَا يُرْحَمُ',
    text: 'Merhamet etmeyene merhamet olunmaz.',
    source: 'Hadis-i Şerif — Buhârî, Edeb, 18'
  },
  {
    type: 'hadis',
    ar: 'الْكَلِمَةُ الطَّيِّبَةُ صَدَقَةٌ',
    text: 'Güzel söz sadakadır.',
    source: 'Hadis-i Şerif — Buhârî, Edeb, 34'
  },
  {
    type: 'hadis',
    ar: 'تَبَسُّمُكَ فِي وَجْهِ أَخِيكَ لَكَ صَدَقَةٌ',
    text: 'Mümin kardeşinin yüzüne tebessüm etmen senin için bir sadakadır.',
    source: 'Hadis-i Şerif — Tirmizî, Birr, 36'
  },
  {
    type: 'hadis',
    ar: 'الطُّهُورُ شَطْرُ الْإِيمَانِ',
    text: 'Temizlik imanın yarısıdır.',
    source: 'Hadis-i Şerif — Müslim, Tahâret, 1'
  }
];

// Hadith Books for Live JSDelivr Hadith API Fetching (Bilingual Arabic + Turkish)
const HADITH_API_BOOKS = [
  { id: 'bukhari', nameTr: 'Sahîh-i Buhârî', maxNum: 7000 },
  { id: 'muslim', nameTr: 'Sahîh-i Müslim', maxNum: 5000 },
  { id: 'tirmidhi', nameTr: 'Sünen-i Tirmizî', maxNum: 3800 },
  { id: 'abudawud', nameTr: 'Sünen-i Ebû Dâvûd', maxNum: 4500 },
  { id: 'ibnmajah', nameTr: 'Sünen-i İbn Mâce', maxNum: 4200 }
];

// Expanded Muadhin Presets (Turkish Makams + World-Renowned Muadhins with Fallback Streams)
const MUADHIN_PRESETS = [
  {
    id: 'istanbul_saba',
    name: 'Sabah — Sabâ Makamı',
    muadhin: 'Türk Makam Geleneği (Sabah Ezanı)',
    youtubeId: 'JMjQ9n2NuzU',
    url: './audio/JMjQ9n2NuzU.mp3',
    fallbackUrl: './audio/fajr.mp3'
  },
  {
    id: 'istanbul_rast',
    name: 'Öğle — Rast Makamı',
    muadhin: 'Türk Makam Geleneği (Öğle Ezanı)',
    youtubeId: 'mHEubpJMHBc',
    url: './audio/mHEubpJMHBc.mp3',
    fallbackUrl: './audio/hagia_sophia.mp3'
  },
  {
    id: 'istanbul_hicaz',
    name: 'İkindi — Hicaz Makamı',
    muadhin: 'Türk Makam Geleneği (İkindi Ezanı)',
    youtubeId: '7XN62fyoF6s',
    url: './audio/7XN62fyoF6s.mp3',
    fallbackUrl: './audio/hagia_sophia.mp3'
  },
  {
    id: 'istanbul_segah',
    name: 'Akşam — Segâh Makamı',
    muadhin: 'Türk Makam Geleneği (Akşam Ezanı)',
    youtubeId: 'G9k_wBGVhwg',
    url: './audio/G9k_wBGVhwg.mp3',
    fallbackUrl: './audio/hagia_sophia.mp3'
  },
  {
    id: 'istanbul_ussak',
    name: 'Yatsı — Uşşak Makamı',
    muadhin: 'Türk Makam Geleneği (Yatsı Ezanı)',
    youtubeId: '3VLcIowpiJs',
    url: './audio/3VLcIowpiJs.mp3',
    fallbackUrl: './audio/hagia_sophia.mp3'
  },
  {
    id: 'makkah',
    name: 'Mekke-i Mükerreme',
    muadhin: 'Şeyh Ali Ahmed Mulla',
    url: './audio/Shaikh_Ali_Mulla.mp3',
    fallbackUrl: 'https://www.islamcan.com/audio/adhan/azan1.mp3',
    fajrUrl: './audio/fajr.mp3'
  },
  {
    id: 'madinah',
    name: 'Medine-i Münevvere',
    muadhin: 'Mescid-i Nebevî Ezanı',
    url: './audio/madinah_2.mp3',
    fallbackUrl: 'https://www.islamcan.com/audio/adhan/azan2.mp3',
    fajrUrl: './audio/fajr.mp3'
  },
  {
    id: 'alafasy',
    name: 'Mishary Rashid Alafasy',
    muadhin: 'Kuveyt Ezanı',
    url: './audio/Mishary_Rashid_Aalafasy.mp3',
    fallbackUrl: 'https://www.islamcan.com/audio/adhan/azan3.mp3'
  },
  {
    id: 'aqsa',
    name: 'Mescid-i Aksa',
    muadhin: 'Kudüs-ü Şerif Ezanı',
    url: './audio/al-Aqsa.mp3',
    fallbackUrl: 'https://www.islamcan.com/audio/adhan/azan5.mp3'
  },
  {
    id: 'abdulbasit',
    name: 'Ayasofya-i Kebîr',
    muadhin: 'İstanbul Ezanı',
    url: './audio/hagia_sophia.mp3',
    fallbackUrl: 'https://www.islamcan.com/audio/adhan/azan7.mp3'
  }
];

const ADHAN_DUA_URL = './audio/dua_azan.mp3';

// Application State
const state = {
  city: localStorage.getItem('clock_city') || 'Amsterdam',
  country: localStorage.getItem('clock_country') || 'Netherlands',
  timings: null,
  hijriData: null,
  quoteIndex: parseInt(localStorage.getItem('clock_quote_idx') || '0', 10),
  customHomeItem: null,
  showHomeArabic: localStorage.getItem('clock_show_home_ar') !== 'false',
  hubTab: 'zikir',
  zikirFilter: 'all',
  duaFilter: 'all',
  ayetFilter: 'all',
  esmaSearch: '',
  zikirCounts: JSON.parse(localStorage.getItem('clock_zikir_counts') || '{}'),
  selectedMuadhinId: localStorage.getItem('clock_muadhin_id') || 'istanbul_saba',
  customMuadhins: [], // Populated from IndexedDB + localStorage
  pendingFileBlob: null,
  perPrayerMode: localStorage.getItem('clock_per_prayer_mode') !== 'false',
  perPrayerMap: JSON.parse(
    localStorage.getItem('clock_per_prayer_map') ||
      '{"Fajr":"istanbul_saba","Dhuhr":"istanbul_rast","Asr":"istanbul_hicaz","Maghrib":"istanbul_segah","Isha":"istanbul_ussak"}'
  ),
  mutedPrayers: JSON.parse(localStorage.getItem('clock_muted_prayers') || '{}'),
  previewingMuadhinId: null,
  isYtPlaying: false,
  volume: parseInt(localStorage.getItem('clock_volume') || '85', 10),
  playDua: localStorage.getItem('clock_play_dua') !== 'false',
  backdrop: localStorage.getItem('clock_backdrop') || 'meadow',
  nightMode: localStorage.getItem('clock_night_mode') === 'true',
  nightStandbyActive: false,
  isPlayingAdhan: false,
  lastTriggeredPrayer: null,
  duaApiCursor: 0,
  zikirApiCursor: 0
};

// DOM Elements
const elCurrentTime = document.getElementById('currentTime');
const elGregorianDate = document.getElementById('gregorianDate');
const elHijriDate = document.getElementById('hijriDate');
const elCountdownTitle = document.getElementById('countdownTitle');
const elCountdownDigits = document.getElementById('countdownDigits');

const elQuoteWrapper = document.getElementById('quoteWrapper');
const elVerseArabic = document.getElementById('verseArabic');
const elVerseText = document.getElementById('verseText');
const elVerseSource = document.getElementById('verseSource');

const elHubMainTitle = document.getElementById('hubMainTitle');
const elHubSubTitle = document.getElementById('hubSubTitle');
const elHubToolbar = document.getElementById('hubToolbar');
const elHubContent = document.getElementById('hubContent');

const elNatureBackdrop = document.getElementById('natureBackdrop');
const elCurrentCityBadge = document.getElementById('currentCityBadge');
const elSyncStatus = document.getElementById('syncStatus');
const elActiveMuadhinSummary = document.getElementById('activeMuadhinSummary');
const elInputCity = document.getElementById('inputCity');
const elInputCountry = document.getElementById('inputCountry');
const elSaveLocationBtn = document.getElementById('saveLocationBtn');
const elShowHomeArabicToggle = document.getElementById('showHomeArabicToggle');

const elMuadhinList = document.getElementById('muadhinList');
const elPerPrayerModeToggle = document.getElementById('perPrayerModeToggle');
const elPerPrayerList = document.getElementById('perPrayerList');
const elApplyTurkishMakamsBtn = document.getElementById('applyTurkishMakamsBtn');
const elTestAudioBtn = document.getElementById('testAudioBtn');
const elVolumeSlider = document.getElementById('volumeSlider');
const elVolumeValue = document.getElementById('volumeValue');
const elCustomMuadhinName = document.getElementById('customMuadhinName');
const elCustomFileLabel = document.getElementById('customFileLabel');
const elCustomAudioFile = document.getElementById('customAudioFile');
const elCustomAudioUrl = document.getElementById('customAudioUrl');
const elSaveCustomAudioBtn = document.getElementById('saveCustomAudioBtn');
const elDuaToggle = document.getElementById('duaToggle');

const elQuickAudioBtn = document.getElementById('quickAudioBtn');
const elThemeToggleBtn = document.getElementById('themeToggleBtn');
const elSimQuickBtn = document.getElementById('simQuickBtn');
const elToggleSimBtn = document.getElementById('toggleSimBtn');
const elExitSimBtn = document.getElementById('exitSimBtn');

const elAdhanBanner = document.getElementById('adhanBanner');
const elBannerPrayerName = document.getElementById('bannerPrayerName');
const elBannerMuadhinName = document.getElementById('bannerMuadhinName');
const elStopAdhanBtn = document.getElementById('stopAdhanBtn');

const elNightStandbyTriggerBtn = document.getElementById('nightStandbyTriggerBtn');
const elNightStandbyBtnLabel = document.getElementById('nightStandbyBtnLabel');
const elNightStandbyOverlay = document.getElementById('nightStandbyOverlay');
const elNightStandbyClock = document.getElementById('nightStandbyClock');
const elNightStandbyLabel = document.getElementById('nightStandbyLabel');
const elNightStandbyDigits = document.getElementById('nightStandbyDigits');
const elNightStandbySchedule = document.getElementById('nightStandbySchedule');

const adhanAudioPlayer = document.getElementById('adhanAudioPlayer');
const duaAudioPlayer = document.getElementById('duaAudioPlayer');

/**
 * Initialize Application
 */
function initApp() {
  if (state.nightMode) {
    document.body.classList.add('night-mode');
  }
  applyBackdrop(state.backdrop);

  // Restore cached API verses & hadiths from localStorage
  restoreCachedApiContent();

  if (state.quoteIndex >= VERSES_AND_HADITHS.length) {
    state.quoteIndex = 0;
  }
  elShowHomeArabicToggle.checked = state.showHomeArabic;
  renderActiveQuote(false);

  updateClockAndDates();
  setInterval(updateClockAndDates, 1000);

  // Automatically prefetch 3 fresh verses from AlQuran Cloud Diyanet API on startup
  prefetchLiveQuranVerses(3);

  // Rotate quote every 5 minutes and fetch a new live verse in the background
  setInterval(() => {
    if (!state.customHomeItem) {
      cycleQuote();
      fetchLiveAyahFromApi();
    }
  }, 300000);

  elCurrentCityBadge.textContent = state.city;
  elInputCity.value = state.city;
  elInputCountry.value = state.country;

  adhanAudioPlayer.volume = state.volume / 100;
  duaAudioPlayer.volume = state.volume / 100;
  elVolumeSlider.value = state.volume;
  elVolumeValue.textContent = `${state.volume}%`;
  elDuaToggle.checked = state.playDua;

  // Ensure the 5 Turkish Makam YouTube presets are applied once if not migrated yet
  if (!localStorage.getItem('clock_turkish_makam_yt_v1')) {
    state.perPrayerMode = true;
    state.perPrayerMap = {
      Fajr: 'istanbul_saba',
      Dhuhr: 'istanbul_rast',
      Asr: 'istanbul_hicaz',
      Maghrib: 'istanbul_segah',
      Isha: 'istanbul_ussak'
    };
    localStorage.setItem('clock_per_prayer_mode', 'true');
    localStorage.setItem('clock_per_prayer_map', JSON.stringify(state.perPrayerMap));
    localStorage.setItem('clock_turkish_makam_yt_v1', 'true');
  }

  if (elPerPrayerModeToggle) {
    elPerPrayerModeToggle.checked = state.perPrayerMode;
  }

  renderHubView();
  loadCustomMuadhinsFromDb().then(() => {
    renderMuadhinList();
    renderPerPrayerList();
    updateActiveMuadhinSummary();
  });
  highlightCityChip();
  initEventListeners();

  loadPrayerTimes();
  setInterval(loadPrayerTimes, 3600000);
}

// ============================================================================
// LIVE QURAN API ENGINE (AlQuran Cloud: quran-uthmani + tr.diyanet)
// ============================================================================
function formatSurahCitation(surahNum, ayahNum) {
  const trName = SURAH_NAMES_TR[surahNum] || `Sûre ${surahNum}`;
  return `${trName} Suresi, ${ayahNum}. Ayet`;
}

function fetchAyahByReference(ref) {
  const url = `https://api.alquran.cloud/v1/ayah/${encodeURIComponent(ref)}/editions/quran-uthmani,tr.diyanet`;
  return fetch(url)
    .then(response => {
      if (!response.ok) throw new Error(`AlQuran API HTTP ${response.status}`);
      return response.json();
    })
    .then(json => {
      if (json.code === 200 && Array.isArray(json.data) && json.data.length >= 2) {
        const arEdition = json.data[0];
        const trEdition = json.data[1];
        const surahNum =
          (arEdition.surah && arEdition.surah.number) ||
          (trEdition.surah && trEdition.surah.number) ||
          1;
        const ayahNum = arEdition.numberInSurah || trEdition.numberInSurah || 1;
        return {
          type: 'ayet',
          ref: `${surahNum}:${ayahNum}`,
          ar: arEdition.text.trim(),
          text: trEdition.text.trim(),
          source: formatSurahCitation(surahNum, ayahNum)
        };
      }
      throw new Error('Invalid AlQuran API payload');
    });
}

function fetchLiveAyahFromApi(customRef = null) {
  let targetRef = customRef;
  if (!targetRef) {
    const existingRefs = new Set(VERSES_AND_HADITHS.map(v => v.ref).filter(Boolean));
    const availableCurated = CURATED_AYAH_REFS.filter(r => !existingRefs.has(r));
    if (availableCurated.length > 0 && Math.random() < 0.75) {
      targetRef = availableCurated[Math.floor(Math.random() * availableCurated.length)];
    } else {
      targetRef = String(Math.floor(Math.random() * 6236) + 1);
    }
  }

  return fetchAyahByReference(targetRef)
    .then(ayahObj => {
      if (!customRef && ayahObj.text.length > 220) {
        const fallbackRef = CURATED_AYAH_REFS[Math.floor(Math.random() * CURATED_AYAH_REFS.length)];
        return fetchLiveAyahFromApi(fallbackRef);
      }

      const alreadyExists = VERSES_AND_HADITHS.some(v => v.source === ayahObj.source);
      if (!alreadyExists) {
        VERSES_AND_HADITHS.unshift(ayahObj);
        saveCachedApiContent();
      }
      return ayahObj;
    })
    .catch(err => {
      console.warn('Live Quran API fetch error:', err);
      return null;
    });
}

function prefetchLiveQuranVerses(count = 3) {
  let chain = Promise.resolve();
  for (let i = 0; i < count; i++) {
    chain = chain.then(() => fetchLiveAyahFromApi());
  }
  return chain;
}

// ============================================================================
// LIVE HADITH API ENGINE (JSDelivr Hadith CDN: Arabic + Turkish Editions)
// ============================================================================
function cleanHadithText(raw) {
  if (!raw) return '';
  return raw
    .replace(/^Rivayet edildiğine göre\s*/i, '')
    .replace(/^Bize .*? tahdis etti\.?\s*/i, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function fetchLiveHadithFromApi(attempt = 0) {
  if (attempt >= 5) return Promise.resolve(null);

  const book = HADITH_API_BOOKS[Math.floor(Math.random() * HADITH_API_BOOKS.length)];
  const num = Math.floor(Math.random() * 600) + 1;
  const trUrl = `https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions/tur-${book.id}/${num}.min.json`;
  const arUrl = `https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions/ara-${book.id}/${num}.min.json`;

  return Promise.all([fetch(trUrl), fetch(arUrl)])
    .then(responses => {
      const trRes = responses[0];
      const arRes = responses[1];
      if (!trRes.ok || !arRes.ok) throw new Error('Hadith HTTP not ok');
      return Promise.all([trRes.json(), arRes.json()]);
    })
    .then(jsons => {
      const trJson = jsons[0];
      const arJson = jsons[1];
      const trHadith =
        (trJson && trJson.hadiths && trJson.hadiths[0] && trJson.hadiths[0].text) || '';
      const arHadith =
        (arJson && arJson.hadiths && arJson.hadiths[0] && arJson.hadiths[0].text) || '';

      const cleanedTr = cleanHadithText(trHadith);
      const cleanedAr = arHadith.trim();

      if (cleanedTr.length >= 20 && cleanedTr.length <= 240 && cleanedAr.length >= 10) {
        const hadithObj = {
          type: 'hadis',
          ar: cleanedAr,
          text: cleanedTr,
          source: `Hadis-i Şerif — ${book.nameTr}, No. ${num}`
        };

        const exists = VERSES_AND_HADITHS.some(v => v.source === hadithObj.source);
        if (!exists) {
          VERSES_AND_HADITHS.unshift(hadithObj);
          saveCachedApiContent();
        }
        return hadithObj;
      }
      return fetchLiveHadithFromApi(attempt + 1);
    })
    .catch(() => fetchLiveHadithFromApi(attempt + 1));
}

function saveCachedApiContent() {
  try {
    const customFetched = VERSES_AND_HADITHS.slice(0, 25);
    localStorage.setItem('clock_cached_api_quotes', JSON.stringify(customFetched));
  } catch (e) {
    // Ignore storage quota errors
  }
}

function restoreCachedApiContent() {
  try {
    const raw = localStorage.getItem('clock_cached_api_quotes');
    if (!raw) return;
    const list = JSON.parse(raw);
    if (Array.isArray(list)) {
      list.reverse().forEach(item => {
        if (item && item.text && item.source && !VERSES_AND_HADITHS.some(v => v.source === item.source)) {
          VERSES_AND_HADITHS.unshift(item);
        }
      });
    }
  } catch (e) {
    // Ignore parse error
  }
}

/**
 * 1. REAL-TIME CLOCK & TURKISH DATES (MILADI & HICRI)
 */
function updateClockAndDates() {
  const now = new Date();

  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');

  elCurrentTime.textContent = `${hours}:${minutes}`;

  const weekdayShort = now.toLocaleDateString('tr-TR', { weekday: 'short' });
  const dayNum = now.getDate();
  const monthShort = now.toLocaleDateString('tr-TR', { month: 'short' });
  elGregorianDate.textContent = `${weekdayShort}, ${dayNum} ${monthShort}`;

  if (!state.hijriData) {
    updateFallbackHijri(now);
  }

  if (state.timings) {
    updateCountdownAndSidebar(now);
    checkPrayerAlarm(now, `${hours}:${minutes}`, seconds);
  }
}

function updateFallbackHijri(date) {
  try {
    const parts = new Intl.DateTimeFormat('en-TN-u-ca-islamic-umalqura', {
      day: 'numeric',
      month: 'numeric',
      year: 'numeric'
    }).formatToParts(date);

    const dayPart = parts.find(p => p.type === 'day');
    const monthPart = parts.find(p => p.type === 'month');
    const yearPart = parts.find(p => p.type === 'year');
    const day = (dayPart && dayPart.value) || '';
    const monthNum = parseInt((monthPart && monthPart.value) || '1', 10);
    const year = (yearPart && yearPart.value) || '';
    const monthName = HIJRI_MONTHS_TR[monthNum] || '';
    if (day && monthName && year) {
      elHijriDate.textContent = `${day} ${monthName} ${year}`;
    }
  } catch (e) {
    // Keep existing text
  }
}

/**
 * 2. DIYANET PRAYER TIMES API (AlAdhan Method 13 = Diyanet İşleri Başkanlığı)
 */
function loadPrayerTimes() {
  const cacheKey = `diyanet_v2_${state.city}_${state.country}_${new Date().toDateString()}`;
  const cached = localStorage.getItem(cacheKey);

  if (cached) {
    try {
      const parsed = JSON.parse(cached);
      applyPrayerData(parsed);
      elSyncStatus.textContent = `Diyanet İşleri Başkanlığı (${state.city}) — Senkronize`;
    } catch (e) {
      console.warn('Cache parse error:', e);
    }
  }

  elSyncStatus.textContent = 'Diyanet verileri güncelleniyor...';
  const url = `https://api.aladhan.com/v1/timingsByCity?city=${encodeURIComponent(state.city)}&country=${encodeURIComponent(state.country)}&method=13`;
  return fetch(url)
    .then(response => {
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return response.json();
    })
    .then(json => {
      if (json.code === 200 && json.data) {
        localStorage.setItem(cacheKey, JSON.stringify(json.data));
        applyPrayerData(json.data);
        elSyncStatus.textContent = `Diyanet İşleri Başkanlığı (${state.city}) — Aktif`;
      }
    })
    .catch(error => {
      console.warn('API fetch failed, using cached or fallback timings:', error);
      if (!state.timings) {
        applyFallbackTimings();
        elSyncStatus.textContent = 'Çevrimdışı mod (Örnek vakitler)';
      }
    });
}

function applyPrayerData(data) {
  state.timings = data.timings;
  state.hijriData = data.date && data.date.hijri;

  PRAYERS_ORDER.forEach(p => {
    const rawTime = state.timings[p.key];
    if (rawTime) {
      const cleanTime = rawTime.split(' ')[0];
      const timeEl = document.getElementById(`time-${p.key}`);
      if (timeEl) timeEl.textContent = cleanTime;
    }
  });

  if (state.hijriData) {
    const hDay = parseInt(state.hijriData.day, 10);
    const hMonthNumber = (state.hijriData.month && state.hijriData.month.number) || 1;
    const hYear = state.hijriData.year;
    const trMonthName =
      HIJRI_MONTHS_TR[hMonthNumber] ||
      (state.hijriData.month && state.hijriData.month.en) ||
      '';
    elHijriDate.textContent = `${hDay} ${trMonthName} ${hYear}`;
  }

  updateCountdownAndSidebar(new Date());
}

function applyFallbackTimings() {
  state.timings = {
    Fajr: '05:14',
    Sunrise: '06:58',
    Dhuhr: '13:34',
    Asr: '16:59',
    Maghrib: '19:54',
    Isha: '21:46'
  };
  PRAYERS_ORDER.forEach(p => {
    const timeEl = document.getElementById(`time-${p.key}`);
    if (timeEl) timeEl.textContent = state.timings[p.key];
  });
  updateCountdownAndSidebar(new Date());
}

/**
 * 3. COUNTDOWN TIMER ("x vaktine kalan süre" + H:MM.SS) & SIDEBAR HIGHLIGHT
 */
function updateCountdownAndSidebar(now) {
  if (!state.timings) return;

  const schedule = PRAYERS_ORDER.map(p => {
    const clean = (state.timings[p.key] || '00:00').split(' ')[0];
    const [h, m] = clean.split(':').map(Number);
    const target = new Date(now);
    target.setHours(h, m, 0, 0);
    return {
      ...p,
      timeStr: clean,
      dateObj: target
    };
  });

  let nextPrayer = null;
  let currentActiveKey = null;

  for (let i = 0; i < schedule.length; i++) {
    if (now < schedule[i].dateObj) {
      nextPrayer = schedule[i];
      currentActiveKey = schedule[i].key;
      break;
    }
  }

  if (!nextPrayer) {
    const tomorrowFajr = new Date(schedule[0].dateObj);
    tomorrowFajr.setDate(tomorrowFajr.getDate() + 1);
    nextPrayer = {
      ...schedule[0],
      dateObj: tomorrowFajr
    };
    currentActiveKey = 'Fajr';
  }

  elCountdownTitle.textContent = `${nextPrayer.nameTr} vaktine kalan süre`;

  const diffMs = Math.max(0, nextPrayer.dateObj - now);
  const totalSeconds = Math.floor(diffMs / 1000);
  const hrs = Math.floor(totalSeconds / 3600);
  const mins = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
  const secs = String(totalSeconds % 60).padStart(2, '0');

  elCountdownDigits.textContent = `${hrs}:${mins}.${secs}`;

  schedule.forEach(item => {
    const el = document.getElementById(`item-${item.key}`);
    if (!el) return;
    el.classList.remove('active', 'upcoming');
    if (item.key === currentActiveKey) {
      el.classList.add('active');
    } else if (now < item.dateObj) {
      el.classList.add('upcoming');
    }
  });

  // Update Top-Center Night Standby Button & Pitch-Black Night Screen (Yatsı -> Sabah)
  updateNightStandbyScreen(now, schedule);
}

function updateNightStandbyScreen(now, schedule) {
  const fajrItem = schedule.find(s => s.key === 'Fajr') || schedule[0];
  const sunriseItem = schedule.find(s => s.key === 'Sunrise') || schedule[1];
  const maghribItem = schedule.find(s => s.key === 'Maghrib') || schedule[4];
  const ishaItem = schedule.find(s => s.key === 'Isha') || schedule[5];

  if (!fajrItem || !maghribItem || !ishaItem) return;

  const isEveningOrNight = now >= maghribItem.dateObj || now < sunriseItem.dateObj;

  if (elNightStandbyTriggerBtn) {
    elNightStandbyTriggerBtn.classList.toggle('after-maghrib-pulse', isEveningOrNight);
    if (elNightStandbyBtnLabel) {
      elNightStandbyBtnLabel.textContent = isEveningOrNight
        ? 'Gece Modu (Yatsı & Sabah)'
        : 'Gece Ekranı';
    }
  }

  if (elNightStandbyClock) {
    const hStr = String(now.getHours()).padStart(2, '0');
    const mStr = String(now.getMinutes()).padStart(2, '0');
    elNightStandbyClock.textContent = `${hStr}:${mStr}`;
  }

  // Determine whether we are counting down to Yatsı namazı or Sabah namazı (İmsak)
  // After midnight (now < fajrItem.dateObj), Isha of the previous evening has already passed, so count down to today's Sabah (Fajr).
  // Before midnight: if now < ishaItem.dateObj, count down to Yatsı namazı; once now >= ishaItem.dateObj, count down to tomorrow's Sabah namazı!
  let targetDateObj = null;
  let targetLabel = '';
  let scheduleSubText = '';

  if (now < fajrItem.dateObj) {
    // After midnight, before Sabah (İmsak)
    targetDateObj = fajrItem.dateObj;
    targetLabel = 'Sabah namazına kalan süre';
    scheduleSubText = `Sabah (İmsak) Vakti · ${fajrItem.timeStr}   |   Güneş · ${sunriseItem.timeStr}`;
  } else if (now < ishaItem.dateObj) {
    // Before Yatsı namazı -> Show countdown to Yatsı namazı (and show Sabah time underneath)
    targetDateObj = ishaItem.dateObj;
    targetLabel = 'Yatsı namazına kalan süre';
    scheduleSubText = `Yatsı Vakti · ${ishaItem.timeStr}   |   Sabah (İmsak) · ${fajrItem.timeStr}`;
  } else {
    // After Yatsı namazı (before midnight) -> Show countdown to tomorrow's Sabah namazı
    const tomorrowFajr = new Date(fajrItem.dateObj);
    tomorrowFajr.setDate(tomorrowFajr.getDate() + 1);
    targetDateObj = tomorrowFajr;
    targetLabel = 'Sabah namazına kalan süre';
    scheduleSubText = `Sabah (İmsak) Vakti · ${fajrItem.timeStr}   |   Güneş · ${sunriseItem.timeStr}`;
  }

  const nightDiffMs = Math.max(0, targetDateObj - now);
  const nightTotalSecs = Math.floor(nightDiffMs / 1000);
  const nHrs = Math.floor(nightTotalSecs / 3600);
  const nMins = String(Math.floor((nightTotalSecs % 3600) / 60)).padStart(2, '0');
  const nSecs = String(nightTotalSecs % 60).padStart(2, '0');

  if (elNightStandbyLabel) elNightStandbyLabel.textContent = targetLabel;
  if (elNightStandbyDigits) elNightStandbyDigits.textContent = `${nHrs}:${nMins}.${nSecs}`;
  if (elNightStandbySchedule) elNightStandbySchedule.textContent = scheduleSubText;
}

/**
 * 4. HOME SCREEN QUOTE ENGINE (BILINGUAL ARABIC + TURKISH)
 */
function renderActiveQuote(animate = true) {
  const item = state.customHomeItem || VERSES_AND_HADITHS[state.quoteIndex] || VERSES_AND_HADITHS[0];

  const applyContent = () => {
    elVerseArabic.textContent = item.ar || '';
    elVerseArabic.classList.toggle('hidden', !state.showHomeArabic || !item.ar);
    elVerseText.textContent = item.text;
    elVerseSource.textContent = item.source;

    const isLong = (item.text && item.text.length > 62) || (item.ar && item.ar.length > 75);
    elQuoteWrapper.classList.toggle('long-quote', Boolean(isLong));
  };

  if (!animate) {
    applyContent();
    return;
  }

  elQuoteWrapper.classList.add('fade-out');
  setTimeout(() => {
    applyContent();
    elQuoteWrapper.classList.remove('fade-out');
  }, 300);
}

function cycleQuote() {
  state.customHomeItem = null;
  state.quoteIndex = (state.quoteIndex + 1) % VERSES_AND_HADITHS.length;
  localStorage.setItem('clock_quote_idx', String(state.quoteIndex));
  renderActiveQuote(true);

  // Opportunistically fetch a fresh live verse in the background
  if (Math.random() < 0.4) {
    fetchLiveAyahFromApi();
  }
}

function pinToHome(ar, text, source) {
  state.customHomeItem = { ar, text, source };
  renderActiveQuote(false);
  switchView('viewHome');
}

/**
 * 5. MANEVİYAT HUB ENGINE (Zikir & Tesbihat, Esmâü'l-Hüsnâ, Dualar, Ayet/Hadis)
 */
function renderHubView() {
  elHubToolbar.innerHTML = '';
  elHubContent.innerHTML = '';

  if (state.hubTab === 'zikir') {
    elHubMainTitle.textContent = 'Zikir ve Tesbihat';
    elHubSubTitle.textContent = 'Hısnü’l-Müslim tesbihatı ve Kur’anî zikirler (Karta dokunarak sayacı artırın)';
    renderZikirHub();
  } else if (state.hubTab === 'esma') {
    elHubMainTitle.textContent = 'Esmâü’l-Hüsnâ';
    elHubSubTitle.textContent = 'Allah’ın 99 güzel ismi, Arapça yazılışı ve Türkçe manaları';
    renderEsmaHub();
  } else if (state.hubTab === 'dua') {
    elHubMainTitle.textContent = 'Kur’an ve Sünnet Duaları';
    elHubSubTitle.textContent = 'Diyanet Kur’an API’si ve Peygamber Efendimiz’den (s.a.v.) sahih dualar';
    renderDuaHub();
  } else if (state.hubTab === 'ayet') {
    elHubMainTitle.textContent = 'Canlı Ayet ve Hadis Seçkisi';
    elHubSubTitle.textContent = 'Diyanet Kur’an API ve Hadis API ile canlı güncellenen seçki';
    renderAyetHub();
  }
}

// 5A. ZİKİR & TESBİHAT TAB (With Live Quranic Dhikr API Fetcher)
function renderZikirHub() {
  const filters = [
    { key: 'all', label: 'Tümü' },
    { key: 'tesbihat', label: 'Namaz Tesbihatı' },
    { key: 'sabah_aksam', label: 'Sabah & Akşam' },
    { key: 'gunluk', label: 'Günlük Zikirler' }
  ];

  const subPills = document.createElement('div');
  subPills.className = 'sub-pills';
  filters.forEach(f => {
    const btn = document.createElement('button');
    btn.className = `sub-pill ${state.zikirFilter === f.key ? 'active' : ''}`;
    btn.textContent = f.label;
    btn.addEventListener('click', () => {
      state.zikirFilter = f.key;
      renderHubView();
    });
    subPills.appendChild(btn);
  });

  const actionGroup = document.createElement('div');
  actionGroup.className = 'api-action-group';

  const fetchZikirAyahBtn = document.createElement('button');
  fetchZikirAyahBtn.className = 'api-fetch-btn';
  fetchZikirAyahBtn.textContent = '+ Kur’an’dan Zikir Ayeti Çek (API)';
  fetchZikirAyahBtn.addEventListener('click', () => {
    fetchZikirAyahBtn.disabled = true;
    fetchZikirAyahBtn.textContent = 'Yükleniyor...';
    const itemRef = QURAN_ZIKIR_REFS[state.zikirApiCursor % QURAN_ZIKIR_REFS.length];
    state.zikirApiCursor++;
    fetchAyahByReference(itemRef.ref)
      .then(ayah => {
        const newId = `zikir_api_${itemRef.ref.replace(':', '_')}`;
        if (!ZIKIR_LIST.some(z => z.id === newId)) {
          ZIKIR_LIST.unshift({
            id: newId,
            category: 'sabah_aksam',
            categoryLabel: `${itemRef.label} (Canlı Diyanet API)`,
            target: itemRef.target,
            ar: ayah.ar,
            tr: ayah.text,
            note: ayah.source
          });
        }
        renderHubView();
      })
      .catch(() => {
        fetchZikirAyahBtn.textContent = 'Bağlantı Hatası';
        setTimeout(() => renderHubView(), 1200);
      });
  });

  const resetAllBtn = document.createElement('button');
  resetAllBtn.className = 'zikir-reset-btn';
  resetAllBtn.textContent = 'Sayaçları Sıfırla';
  resetAllBtn.addEventListener('click', () => {
    state.zikirCounts = {};
    localStorage.setItem('clock_zikir_counts', '{}');
    renderHubView();
  });

  actionGroup.appendChild(fetchZikirAyahBtn);
  actionGroup.appendChild(resetAllBtn);

  elHubToolbar.appendChild(subPills);
  elHubToolbar.appendChild(actionGroup);

  ZIKIR_LIST.forEach(item => {
    if (state.zikirFilter !== 'all' && item.category !== state.zikirFilter) return;

    const count = state.zikirCounts[item.id] || 0;
    const isDone = count >= item.target;

    const card = document.createElement('div');
    card.className = `bilingual-card clickable ${isDone ? 'completed' : ''}`;
    card.innerHTML = `
      <div class="card-top-bar">
        <span class="card-badge">${item.categoryLabel}</span>
        <div class="zikir-counter-group">
          <button class="zikir-reset-btn" data-reset="${item.id}" title="Sayacı sıfırla">Sıfırla</button>
          <button class="zikir-counter-btn ${isDone ? 'done' : ''}" data-inc="${item.id}">
            ${count} / ${item.target}
          </button>
        </div>
      </div>
      <div class="card-arabic" dir="rtl" lang="ar">${item.ar}</div>
      <div class="card-turkish">${item.tr}</div>
      <div class="card-footer-meta">
        <span>${item.note}</span>
        <button class="pin-home-btn" data-pin="${item.id}">Ana Ekranda Göster</button>
      </div>
    `;

    const incBtn = card.querySelector(`[data-inc="${item.id}"]`);
    const incrementThisCard = e => {
      e.stopPropagation();
      const nextCount = (state.zikirCounts[item.id] || 0) + 1;
      state.zikirCounts[item.id] = nextCount;
      localStorage.setItem('clock_zikir_counts', JSON.stringify(state.zikirCounts));
      incBtn.textContent = `${nextCount} / ${item.target}`;
      const reached = nextCount >= item.target;
      incBtn.classList.toggle('done', reached);
      card.classList.toggle('completed', reached);
    };

    card.addEventListener('click', incrementThisCard);
    incBtn.addEventListener('click', incrementThisCard);

    const rstBtn = card.querySelector(`[data-reset="${item.id}"]`);
    rstBtn.addEventListener('click', e => {
      e.stopPropagation();
      state.zikirCounts[item.id] = 0;
      localStorage.setItem('clock_zikir_counts', JSON.stringify(state.zikirCounts));
      incBtn.textContent = `0 / ${item.target}`;
      incBtn.classList.remove('done');
      card.classList.remove('completed');
    });

    const pinBtn = card.querySelector(`[data-pin="${item.id}"]`);
    pinBtn.addEventListener('click', e => {
      e.stopPropagation();
      pinToHome(item.ar, item.tr, item.note);
    });

    elHubContent.appendChild(card);
  });
}

// 5B. ESMÂÜ'L-HÜSNÂ (99 NAMES) TAB
function renderEsmaHub() {
  const searchInput = document.createElement('input');
  searchInput.type = 'text';
  searchInput.className = 'hub-search';
  searchInput.placeholder = 'İsim veya anlam ara (örn. Rahmân, Şifa, Rızık)...';
  searchInput.value = state.esmaSearch;
  searchInput.addEventListener('input', e => {
    state.esmaSearch = e.target.value;
    renderEsmaListOnly();
  });

  const infoSpan = document.createElement('span');
  infoSpan.className = 'panel-subtitle';
  infoSpan.textContent = 'Bir isme dokunarak ana ekrana yansıtabilirsiniz';

  elHubToolbar.appendChild(infoSpan);
  elHubToolbar.appendChild(searchInput);

  renderEsmaListOnly();
}

function renderEsmaListOnly() {
  elHubContent.innerHTML = '';

  const q = state.esmaSearch.trim().toLowerCase();
  if (!q) {
    const dayOfYear = Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 0)) / 86400000);
    const featured = ESMA_LIST[dayOfYear % ESMA_LIST.length];

    const featuredCard = document.createElement('div');
    featuredCard.className = 'esma-featured';
    featuredCard.innerHTML = `
      <div class="esma-featured-info">
        <span class="esma-featured-tag">Günün Esmâsı — #${String(featured.num).padStart(2, '0')}</span>
        <div class="esma-featured-title">${featured.tr}</div>
        <div class="esma-featured-meaning">${featured.meaning}</div>
      </div>
      <div class="esma-featured-arabic" dir="rtl" lang="ar">${featured.ar}</div>
    `;
    featuredCard.style.cursor = 'pointer';
    featuredCard.addEventListener('click', () => {
      pinToHome(featured.ar, featured.meaning, `Esmâü’l-Hüsnâ — ${featured.tr}`);
    });
    elHubContent.appendChild(featuredCard);
  }

  const grid = document.createElement('div');
  grid.className = 'esma-grid';

  ESMA_LIST.forEach(esma => {
    if (
      q &&
      !esma.tr.toLowerCase().includes(q) &&
      !esma.meaning.toLowerCase().includes(q) &&
      !String(esma.num).includes(q)
    ) {
      return;
    }

    const card = document.createElement('div');
    card.className = 'esma-card';
    card.innerHTML = `
      <div class="esma-card-head">
        <span class="esma-num">#${String(esma.num).padStart(2, '0')}</span>
        <span class="esma-ar" dir="rtl" lang="ar">${esma.ar}</span>
      </div>
      <div class="esma-tr">${esma.tr}</div>
      <div class="esma-desc">${esma.meaning}</div>
    `;
    card.addEventListener('click', () => {
      pinToHome(esma.ar, esma.meaning, `Esmâü’l-Hüsnâ — ${esma.tr}`);
    });
    grid.appendChild(card);
  });

  elHubContent.appendChild(grid);
}

// 5C. KUR'AN & SÜNNET DUALARI TAB (With Live Quran Dua API Fetcher)
function renderDuaHub() {
  const filters = [
    { key: 'all', label: 'Tümü' },
    { key: 'rabbena', label: 'Rabbenâ Duaları' },
    { key: 'huzur', label: 'İnşirah & Huzur' },
    { key: 'sunnet', label: 'Peygamber Duaları' }
  ];

  const subPills = document.createElement('div');
  subPills.className = 'sub-pills';
  filters.forEach(f => {
    const btn = document.createElement('button');
    btn.className = `sub-pill ${state.duaFilter === f.key ? 'active' : ''}`;
    btn.textContent = f.label;
    btn.addEventListener('click', () => {
      state.duaFilter = f.key;
      renderHubView();
    });
    subPills.appendChild(btn);
  });

  const fetchDuaBtn = document.createElement('button');
  fetchDuaBtn.className = 'api-fetch-btn';
  fetchDuaBtn.textContent = '+ Yeni Kur’an Duası Çek (Diyanet API)';
  fetchDuaBtn.addEventListener('click', () => {
    fetchDuaBtn.disabled = true;
    fetchDuaBtn.textContent = 'Yükleniyor...';
    const candidate = QURAN_DUA_REFS[state.duaApiCursor % QURAN_DUA_REFS.length];
    state.duaApiCursor++;
    fetchAyahByReference(candidate.ref)
      .then(ayah => {
        if (!DUA_LIST.some(d => d.source === ayah.source)) {
          DUA_LIST.unshift({
            category: 'rabbena',
            categoryLabel: `${candidate.label} (Canlı API)`,
            ar: ayah.ar,
            tr: ayah.text,
            source: ayah.source
          });
        }
        renderHubView();
      })
      .catch(() => {
        fetchDuaBtn.textContent = 'Bağlantı Hatası';
        setTimeout(() => renderHubView(), 1200);
      });
  });

  elHubToolbar.appendChild(subPills);
  elHubToolbar.appendChild(fetchDuaBtn);

  DUA_LIST.forEach(dua => {
    if (state.duaFilter !== 'all' && dua.category !== state.duaFilter) return;

    const card = document.createElement('div');
    card.className = 'bilingual-card';
    card.innerHTML = `
      <div class="card-top-bar">
        <span class="card-badge">${dua.categoryLabel}</span>
        <button class="pin-home-btn">Ana Ekranda Göster</button>
      </div>
      <div class="card-arabic" dir="rtl" lang="ar">${dua.ar}</div>
      <div class="card-turkish">${dua.tr}</div>
      <div class="card-footer-meta">
        <span>${dua.source}</span>
      </div>
    `;

    card.querySelector('.pin-home-btn').addEventListener('click', () => {
      pinToHome(dua.ar, dua.tr, dua.source);
    });

    elHubContent.appendChild(card);
  });
}

// 5D. AYET & HADİS SEÇKİSİ TAB (With Live Diyanet Quran API & Hadith API Buttons)
function renderAyetHub() {
  const filters = [
    { key: 'all', label: 'Tümü' },
    { key: 'ayet', label: 'Kur’an Ayetleri' },
    { key: 'hadis', label: 'Hadis-i Şerifler' }
  ];

  const subPills = document.createElement('div');
  subPills.className = 'sub-pills';
  filters.forEach(f => {
    const btn = document.createElement('button');
    btn.className = `sub-pill ${state.ayetFilter === f.key ? 'active' : ''}`;
    btn.textContent = f.label;
    btn.addEventListener('click', () => {
      state.ayetFilter = f.key;
      renderHubView();
    });
    subPills.appendChild(btn);
  });

  const apiGroup = document.createElement('div');
  apiGroup.className = 'api-action-group';

  const fetchAyahBtn = document.createElement('button');
  fetchAyahBtn.className = 'api-fetch-btn';
  fetchAyahBtn.textContent = '+ Yeni Ayet Çek (Diyanet API)';
  fetchAyahBtn.addEventListener('click', () => {
    fetchAyahBtn.disabled = true;
    fetchAyahBtn.textContent = 'Ayet Çekiliyor...';
    fetchLiveAyahFromApi().then(added => {
      if (added) {
        state.customHomeItem = null;
        state.quoteIndex = 0;
        renderActiveQuote(false);
      }
      renderHubView();
    });
  });

  const fetchHadithBtn = document.createElement('button');
  fetchHadithBtn.className = 'api-fetch-btn secondary';
  fetchHadithBtn.textContent = '+ Yeni Hadis Çek (Hadis API)';
  fetchHadithBtn.addEventListener('click', () => {
    fetchHadithBtn.disabled = true;
    fetchHadithBtn.textContent = 'Hadis Çekiliyor...';
    fetchLiveHadithFromApi().then(added => {
      if (added) {
        state.customHomeItem = null;
        state.quoteIndex = 0;
        renderActiveQuote(false);
      }
      renderHubView();
    });
  });

  apiGroup.appendChild(fetchAyahBtn);
  apiGroup.appendChild(fetchHadithBtn);

  elHubToolbar.appendChild(subPills);
  elHubToolbar.appendChild(apiGroup);

  VERSES_AND_HADITHS.forEach((q, idx) => {
    if (state.ayetFilter !== 'all' && q.type !== state.ayetFilter) return;

    const isSelected = !state.customHomeItem && idx === state.quoteIndex;
    const card = document.createElement('div');
    card.className = `bilingual-card clickable ${isSelected ? 'completed' : ''}`;
    card.innerHTML = `
      <div class="card-arabic" dir="rtl" lang="ar">${q.ar}</div>
      <div class="card-turkish">“${q.text}”</div>
      <div class="card-footer-meta">
        <span>${q.source}</span>
        <span class="pin-home-btn ${isSelected ? 'pinned' : ''}">${isSelected ? 'Ana Ekranda Aktif' : 'Ana Ekranda Göster'}</span>
      </div>
    `;
    card.addEventListener('click', () => {
      state.customHomeItem = null;
      state.quoteIndex = idx;
      localStorage.setItem('clock_quote_idx', String(idx));
      renderActiveQuote(false);
      renderHubView();
      switchView('viewHome');
    });
    elHubContent.appendChild(card);
  });
}

/**
 * 6. MUADHIN STUDIO, INDEXED-DB STORAGE & PER-PRAYER ADHAN ENGINE
 */
const DB_NAME = 'bilaal_muadhin_db';
const DB_STORE = 'custom_muadhins';

function openMuadhinDb() {
  return new Promise((resolve, reject) => {
    if (!window.indexedDB) {
      reject(new Error('IndexedDB not supported'));
      return;
    }
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = e => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains(DB_STORE)) {
        db.createObjectStore(DB_STORE, { keyPath: 'id' });
      }
    };
    req.onsuccess = e => resolve(e.target.result);
    req.onerror = e => reject(e.target.error);
  });
}

function extractYouTubeId(input) {
  if (!input) return null;
  const trimmed = input.trim();
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) return trimmed;
  const regExp = /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?|shorts)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/i;
  const match = trimmed.match(regExp);
  return match ? match[1] : null;
}

let ytPlayer = null;
let ytPlayerReady = false;
let pendingYtRequest = null;
let ytEndedCallback = null;

window.onYouTubeIframeAPIReady = function () {
  const hostEl = document.getElementById('ytPlayerHost');
  if (!hostEl || !window.YT || !window.YT.Player) return;
  ytPlayer = new window.YT.Player('ytPlayerHost', {
    height: '125',
    width: '220',
    videoId: 'JMjQ9n2NuzU',
    playerVars: {
      autoplay: 0,
      controls: 1,
      rel: 0,
      modestbranding: 1,
      playsinline: 1,
      origin: window.location.origin
    },
    events: {
      onReady: () => {
        ytPlayerReady = true;
        if (ytPlayer && typeof ytPlayer.setVolume === 'function') {
          ytPlayer.setVolume(state.volume);
        }
        if (pendingYtRequest) {
          const { videoId, onEnded } = pendingYtRequest;
          pendingYtRequest = null;
          playYouTubeVideo(videoId, onEnded);
        }
      },
      onStateChange: event => {
        if (event.data === window.YT.PlayerState.ENDED) {
          state.isYtPlaying = false;
          if (typeof ytEndedCallback === 'function') {
            const cb = ytEndedCallback;
            ytEndedCallback = null;
            cb();
          }
        }
      },
      onError: err => {
        console.warn('YouTube Player error:', err);
      }
    }
  });
};

function playYouTubeVideo(videoId, onEnded) {
  state.isYtPlaying = true;
  ytEndedCallback = onEnded || null;

  // Initialize player on demand if YT script loaded after DOM
  if (!ytPlayer && window.YT && window.YT.Player) {
    window.onYouTubeIframeAPIReady();
  }

  if (ytPlayer && ytPlayerReady && typeof ytPlayer.loadVideoById === 'function') {
    ytPlayer.setVolume(state.volume);
    ytPlayer.loadVideoById(videoId);
    ytPlayer.playVideo();
  } else {
    pendingYtRequest = { videoId, onEnded };
  }
}

function stopYouTubeVideo() {
  state.isYtPlaying = false;
  pendingYtRequest = null;
  ytEndedCallback = null;
  if (ytPlayer && ytPlayerReady && typeof ytPlayer.stopVideo === 'function') {
    try {
      ytPlayer.stopVideo();
    } catch (e) {
      // ignore
    }
  }
}

function isAnyAudioPlaying() {
  return !adhanAudioPlayer.paused || state.isYtPlaying;
}

function loadCustomMuadhinsFromDb() {
  return openMuadhinDb()
    .then(
      db =>
        new Promise(resolve => {
          const tx = db.transaction(DB_STORE, 'readonly');
          const store = tx.objectStore(DB_STORE);
          const req = store.getAll();
          req.onsuccess = () => {
            const items = req.result || [];
            state.customMuadhins = items.map(item => {
              let playUrl = item.url || '';
              if (item.blob instanceof Blob) {
                playUrl = URL.createObjectURL(item.blob);
              }
              const ytId = item.youtubeId || extractYouTubeId(playUrl);
              return {
                id: item.id,
                name: item.name,
                muadhin: item.muadhin || 'Özel Eklenen Müezzin',
                url: playUrl,
                youtubeId: ytId,
                isCustom: true
              };
            });
            resolve();
          };
          req.onerror = () => resolve();
        })
    )
    .catch(e => {
      console.warn('IndexedDB load warning:', e);
    });
}

function saveCustomMuadhinToDb(entry) {
  return openMuadhinDb()
    .then(
      db =>
        new Promise((resolve, reject) => {
          const tx = db.transaction(DB_STORE, 'readwrite');
          const store = tx.objectStore(DB_STORE);
          store.put(entry);
          tx.oncomplete = () => resolve();
          tx.onerror = e => reject(e);
        })
    )
    .catch(e => {
      console.warn('IndexedDB save warning:', e);
    });
}

function deleteCustomMuadhinFromDb(id) {
  return openMuadhinDb()
    .then(
      db =>
        new Promise(resolve => {
          const tx = db.transaction(DB_STORE, 'readwrite');
          tx.objectStore(DB_STORE).delete(id);
          tx.oncomplete = () => resolve();
          tx.onerror = () => resolve();
        })
    )
    .catch(() => {});
}

function getAllMuadhins() {
  return [...MUADHIN_PRESETS, ...state.customMuadhins];
}

function updateActiveMuadhinSummary() {
  if (!elActiveMuadhinSummary) return;
  if (state.perPrayerMode) {
    elActiveMuadhinSummary.textContent = 'Aktif Mod: Her vakit için ayrı müezzin / makam seçili';
  } else {
    const all = getAllMuadhins();
    const found = all.find(m => m.id === state.selectedMuadhinId) || all[0];
    elActiveMuadhinSummary.textContent = `Aktif Müezzin: ${found.name} (${found.muadhin})`;
  }
}

function renderMuadhinList() {
  if (!elMuadhinList) return;
  elMuadhinList.innerHTML = '';

  const allMuadhins = getAllMuadhins();

  allMuadhins.forEach(m => {
    const div = document.createElement('div');
    const isSelected = !state.perPrayerMode && state.selectedMuadhinId === m.id;
    const isPreviewing = state.previewingMuadhinId === m.id && isAnyAudioPlaying();

    div.className = `muadhin-item ${isSelected ? 'active' : ''}`;
    div.innerHTML = `
      <div class="muadhin-item-info">
        <div class="muadhin-item-title">${m.name}</div>
        <div class="muadhin-item-sub">${m.muadhin}${m.youtubeId ? ' · YouTube' : ''}</div>
      </div>
      <div class="muadhin-item-actions">
        <button class="muadhin-preview-btn ${isPreviewing ? 'playing' : ''}" data-preview="${m.id}" title="Bu müezzini dinle">
          ${isPreviewing ? '■ Durdur' : '▶ Dinle'}
        </button>
        ${m.isCustom ? `<button class="muadhin-delete-btn" data-del="${m.id}" title="Listeden sil">✕</button>` : ''}
      </div>
    `;

    // Clicking the card selects this Muadhin
    div.addEventListener('click', () => {
      state.perPrayerMode = false;
      localStorage.setItem('clock_per_prayer_mode', 'false');
      if (elPerPrayerModeToggle) elPerPrayerModeToggle.checked = false;
      if (elPerPrayerList) elPerPrayerList.classList.add('hidden');

      state.selectedMuadhinId = m.id;
      localStorage.setItem('clock_muadhin_id', m.id);
      renderMuadhinList();
      updateActiveMuadhinSummary();
    });

    // Clicking Dinle / Durdur previews this specific Muadhin
    const previewBtn = div.querySelector(`[data-preview="${m.id}"]`);
    previewBtn.addEventListener('click', e => {
      e.stopPropagation();
      togglePreviewMuadhin(m.id);
    });

    // Clicking Delete removes a custom user-uploaded Muadhin
    if (m.isCustom) {
      const delBtn = div.querySelector(`[data-del="${m.id}"]`);
      delBtn.addEventListener('click', e => {
        e.stopPropagation();
        deleteCustomMuadhinFromDb(m.id).then(() => {
          state.customMuadhins = state.customMuadhins.filter(x => x.id !== m.id);
          if (state.selectedMuadhinId === m.id) {
            state.selectedMuadhinId = 'istanbul_saba';
            localStorage.setItem('clock_muadhin_id', 'istanbul_saba');
          }
          renderMuadhinList();
          renderPerPrayerList();
          updateActiveMuadhinSummary();
        });
      });
    }

    elMuadhinList.appendChild(div);
  });
}

function renderPerPrayerList() {
  if (!elPerPrayerList) return;
  elPerPrayerList.classList.toggle('hidden', !state.perPrayerMode);
  elPerPrayerList.innerHTML = '';

  const adhanPrayers = PRAYERS_ORDER.filter(p => p.key !== 'Sunrise');
  const allMuadhins = getAllMuadhins();

  adhanPrayers.forEach(p => {
    const selectedId = state.perPrayerMap[p.key] || state.selectedMuadhinId || 'istanbul_saba';
    const isMuted = Boolean(state.mutedPrayers[p.key]);
    const isRowPreviewing = state.previewingMuadhinId === selectedId && isAnyAudioPlaying();

    const row = document.createElement('div');
    row.className = 'per-prayer-row';

    const optionsHtml = allMuadhins
      .map(
        m =>
          `<option value="${m.id}" ${m.id === selectedId ? 'selected' : ''}>${m.name} — ${m.muadhin}</option>`
      )
      .join('');

    row.innerHTML = `
      <span class="per-prayer-name">${p.nameTr} Vakti</span>
      <select class="per-prayer-select" data-prayer-select="${p.key}">
        ${optionsHtml}
      </select>
      <button class="muadhin-preview-btn ${isRowPreviewing ? 'playing' : ''}" data-prayer-preview="${p.key}">
        ${isRowPreviewing ? '■ Durdur' : '▶ Dinle'}
      </button>
      <button class="per-prayer-mute-btn ${isMuted ? 'muted' : ''}" data-prayer-mute="${p.key}">
        ${isMuted ? 'Sessiz' : 'Ezan Açık'}
      </button>
    `;

    const selectEl = row.querySelector(`[data-prayer-select="${p.key}"]`);
    selectEl.addEventListener('change', e => {
      state.perPrayerMap[p.key] = e.target.value;
      localStorage.setItem('clock_per_prayer_map', JSON.stringify(state.perPrayerMap));
      renderPerPrayerList();
    });

    const previewEl = row.querySelector(`[data-prayer-preview="${p.key}"]`);
    previewEl.addEventListener('click', () => {
      const targetMuadhinId = state.perPrayerMap[p.key] || state.selectedMuadhinId;
      togglePreviewMuadhin(targetMuadhinId);
    });

    const muteEl = row.querySelector(`[data-prayer-mute="${p.key}"]`);
    muteEl.addEventListener('click', () => {
      state.mutedPrayers[p.key] = !state.mutedPrayers[p.key];
      localStorage.setItem('clock_muted_prayers', JSON.stringify(state.mutedPrayers));
      renderPerPrayerList();
    });

    elPerPrayerList.appendChild(row);
  });
}

function playAudioWithFallback(primaryUrl, fallbackUrl) {
  adhanAudioPlayer.src = primaryUrl;
  adhanAudioPlayer.currentTime = 0;
  return adhanAudioPlayer.play().catch(err => {
    if (fallbackUrl && fallbackUrl !== primaryUrl) {
      adhanAudioPlayer.src = fallbackUrl;
      return adhanAudioPlayer.play();
    }
    throw err;
  });
}

function togglePreviewMuadhin(muadhinId) {
  if (state.previewingMuadhinId === muadhinId && isAnyAudioPlaying()) {
    stopAdhanPlayback();
    return;
  }

  stopAdhanPlayback();

  const all = getAllMuadhins();
  const target = all.find(m => m.id === muadhinId) || all[0];
  state.previewingMuadhinId = target.id;

  elBannerPrayerName.textContent = 'Müezzin Önizleme';
  elBannerMuadhinName.textContent = `${target.name} (${target.muadhin}) dinleniyor...`;
  elAdhanBanner.classList.remove('hidden');
  elTestAudioBtn.textContent = 'Durdur';

  // Play local/direct MP3 first (works 100% offline on clock & web); fallback to YouTube IFrame if needed
  playAudioWithFallback(target.url, target.fallbackUrl).catch(err => {
    console.warn('Direct audio preview fallback to YouTube:', err);
    if (target.youtubeId && window.location.protocol !== 'file:') {
      playYouTubeVideo(target.youtubeId, () => stopAdhanPlayback());
    } else {
      stopAdhanPlayback();
    }
  });

  renderMuadhinList();
  renderPerPrayerList();

  adhanAudioPlayer.onended = () => {
    stopAdhanPlayback();
  };
}

function getSelectedAudioSource(prayerKey = 'Dhuhr') {
  const all = getAllMuadhins();
  const targetId = state.perPrayerMode
    ? state.perPrayerMap[prayerKey] || state.selectedMuadhinId
    : state.selectedMuadhinId;

  const chosen = all.find(m => m.id === targetId) || all[0];
  const primaryUrl = !state.perPrayerMode && prayerKey === 'Fajr' && chosen.fajrUrl ? chosen.fajrUrl : chosen.url;

  return {
    url: primaryUrl,
    fallbackUrl: chosen.fallbackUrl || chosen.url,
    youtubeId: chosen.youtubeId || null,
    label: `${chosen.name} (${chosen.muadhin})`
  };
}

function checkPrayerAlarm(now, currentHM, seconds) {
  if (seconds !== '00' || !state.timings) return;

  PRAYERS_ORDER.forEach(p => {
    if (p.key === 'Sunrise') return;
    if (state.mutedPrayers[p.key]) return; // Respect per-prayer mute switch

    const cleanTime = (state.timings[p.key] || '').split(' ')[0];
    const triggerId = `${now.toDateString()}_${p.key}`;

    if (cleanTime === currentHM && state.lastTriggeredPrayer !== triggerId) {
      state.lastTriggeredPrayer = triggerId;
      triggerAdhanPlayback(p);
    }
  });
}

function triggerAdhanPlayback(prayerObj) {
  stopAdhanPlayback();
  const source = getSelectedAudioSource(prayerObj.key);
  state.isPlayingAdhan = true;
  state.previewingMuadhinId = null;

  elBannerPrayerName.textContent = `${prayerObj.nameTr} Vakti`;
  elBannerMuadhinName.textContent = `${source.label} okunuyor`;
  elAdhanBanner.classList.remove('hidden');

  const onAdhanFinished = () => {
    if (state.playDua) {
      duaAudioPlayer.src = ADHAN_DUA_URL;
      duaAudioPlayer.play().catch(() => {
        stopAdhanPlayback();
      });
      duaAudioPlayer.onended = () => stopAdhanPlayback();
    } else {
      stopAdhanPlayback();
    }
  };

  playAudioWithFallback(source.url, source.fallbackUrl).catch(err => {
    console.warn('Direct audio fallback to YouTube:', err);
    if (source.youtubeId && window.location.protocol !== 'file:') {
      playYouTubeVideo(source.youtubeId, onAdhanFinished);
    }
  });

  adhanAudioPlayer.onended = onAdhanFinished;
}

function stopAdhanPlayback() {
  state.isPlayingAdhan = false;
  state.previewingMuadhinId = null;
  adhanAudioPlayer.pause();
  duaAudioPlayer.pause();
  stopYouTubeVideo();
  elAdhanBanner.classList.add('hidden');
  elTestAudioBtn.textContent = 'Seçili Ezanı Dinle';
  renderMuadhinList();
  renderPerPrayerList();
}

/**
 * 7. VIEW NAVIGATION & UI CONTROLS
 */
function switchView(targetId) {
  document.querySelectorAll('.center-stage').forEach(section => {
    section.classList.toggle('active-view', section.id === targetId);
  });
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.target === targetId);
  });
}

function applyBackdrop(bgKey) {
  state.backdrop = bgKey;
  localStorage.setItem('clock_backdrop', bgKey);
  elNatureBackdrop.className = `nature-backdrop bg-${bgKey}`;

  document.querySelectorAll('#backdropChips .chip').forEach(chip => {
    chip.classList.toggle('active', chip.dataset.bg === bgKey);
  });
}

function highlightCityChip() {
  document.querySelectorAll('#cityChips .chip').forEach(chip => {
    chip.classList.toggle('active', chip.dataset.city.toLowerCase() === state.city.toLowerCase());
  });
}

function initEventListeners() {
  elQuoteWrapper.addEventListener('click', () => cycleQuote());

  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', () => switchView(btn.dataset.target));
  });

  // Top-right speaker button opens Settings scrolled directly to Muadhin Studio
  elQuickAudioBtn.addEventListener('click', () => {
    switchView('viewSettings');
    const muadhinSec = document.getElementById('muadhinSection');
    if (muadhinSec) muadhinSec.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  const toggleSim7Inch = () => {
    document.body.classList.toggle('sim-7inch');
  };

  if (elSimQuickBtn) elSimQuickBtn.addEventListener('click', toggleSim7Inch);
  if (elToggleSimBtn) elToggleSimBtn.addEventListener('click', toggleSim7Inch);
  if (elExitSimBtn) elExitSimBtn.addEventListener('click', toggleSim7Inch);

  elThemeToggleBtn.addEventListener('click', () => {
    state.nightMode = !state.nightMode;
    document.body.classList.toggle('night-mode', state.nightMode);
    localStorage.setItem('clock_night_mode', String(state.nightMode));
  });

  document.querySelectorAll('#hubTabs .pill').forEach(pill => {
    pill.addEventListener('click', () => {
      document.querySelectorAll('#hubTabs .pill').forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      state.hubTab = pill.dataset.tab;
      renderHubView();
    });
  });

  elShowHomeArabicToggle.addEventListener('change', e => {
    state.showHomeArabic = e.target.checked;
    localStorage.setItem('clock_show_home_ar', String(state.showHomeArabic));
    renderActiveQuote(false);
  });

  document.querySelectorAll('#cityChips .chip').forEach(chip => {
    chip.addEventListener('click', () => {
      state.city = chip.dataset.city;
      state.country = chip.dataset.country;
      localStorage.setItem('clock_city', state.city);
      localStorage.setItem('clock_country', state.country);
      elCurrentCityBadge.textContent = state.city;
      elInputCity.value = state.city;
      elInputCountry.value = state.country;
      highlightCityChip();
      loadPrayerTimes();
    });
  });

  elSaveLocationBtn.addEventListener('click', () => {
    const newCity = elInputCity.value.trim();
    const newCountry = elInputCountry.value.trim() || 'Netherlands';
    if (newCity) {
      state.city = newCity;
      state.country = newCountry;
      localStorage.setItem('clock_city', state.city);
      localStorage.setItem('clock_country', state.country);
      elCurrentCityBadge.textContent = state.city;
      highlightCityChip();
      loadPrayerTimes();
    }
  });

  document.querySelectorAll('#backdropChips .chip').forEach(chip => {
    chip.addEventListener('click', () => applyBackdrop(chip.dataset.bg));
  });

  // Per-Prayer Muadhin Mode Toggle
  if (elPerPrayerModeToggle) {
    elPerPrayerModeToggle.addEventListener('change', e => {
      state.perPrayerMode = e.target.checked;
      localStorage.setItem('clock_per_prayer_mode', String(state.perPrayerMode));
      renderMuadhinList();
      renderPerPrayerList();
      updateActiveMuadhinSummary();
    });
  }

  // One-Click Traditional Turkish Makams per Prayer (Sabâ, Rast, Hicaz, Segâh, Uşşak)
  if (elApplyTurkishMakamsBtn) {
    elApplyTurkishMakamsBtn.addEventListener('click', () => {
      state.perPrayerMode = true;
      localStorage.setItem('clock_per_prayer_mode', 'true');
      if (elPerPrayerModeToggle) elPerPrayerModeToggle.checked = true;

      state.perPrayerMap = {
        Fajr: 'istanbul_saba',
        Dhuhr: 'istanbul_rast',
        Asr: 'istanbul_hicaz',
        Maghrib: 'istanbul_segah',
        Isha: 'istanbul_ussak'
      };
      localStorage.setItem('clock_per_prayer_map', JSON.stringify(state.perPrayerMap));
      renderMuadhinList();
      renderPerPrayerList();
      updateActiveMuadhinSummary();
    });
  }

  elTestAudioBtn.addEventListener('click', () => {
    if (isAnyAudioPlaying()) {
      stopAdhanPlayback();
    } else {
      const previewId = state.perPrayerMode
        ? state.perPrayerMap.Fajr || 'istanbul_saba'
        : state.selectedMuadhinId;
      togglePreviewMuadhin(previewId);
    }
  });

  elVolumeSlider.addEventListener('input', e => {
    state.volume = parseInt(e.target.value, 10);
    elVolumeValue.textContent = `${state.volume}%`;
    adhanAudioPlayer.volume = state.volume / 100;
    duaAudioPlayer.volume = state.volume / 100;
    if (ytPlayer && ytPlayerReady && typeof ytPlayer.setVolume === 'function') {
      ytPlayer.setVolume(state.volume);
    }
    localStorage.setItem('clock_volume', String(state.volume));
  });

  // Select local audio file (MP3/WAV) to add to custom Muadhins list
  elCustomAudioFile.addEventListener('change', e => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    state.pendingFileBlob = file;
    if (elCustomFileLabel) {
      elCustomFileLabel.childNodes[0].nodeValue = `Seçildi: ${file.name} `;
    }
    if (elCustomMuadhinName && !elCustomMuadhinName.value.trim()) {
      elCustomMuadhinName.value = file.name.replace(/\.[^/.]+$/, '');
    }
  });

  // Save custom Muadhin (File Blob, MP3 URL, or YouTube URL) permanently to IndexedDB
  elSaveCustomAudioBtn.addEventListener('click', () => {
    const customName = ((elCustomMuadhinName && elCustomMuadhinName.value) || '').trim() || 'Özel Müezzin';
    const urlVal = ((elCustomAudioUrl && elCustomAudioUrl.value) || '').trim();

    if (!state.pendingFileBlob && !urlVal) return;

    const ytId = extractYouTubeId(urlVal);
    const newId = `custom_${Date.now()}`;
    const dbEntry = {
      id: newId,
      name: customName,
      muadhin: state.pendingFileBlob
        ? 'Cihazdan Yüklenen Ses'
        : ytId
          ? 'YouTube Ezan Kaydı'
          : 'Özel Bağlantı',
      blob: state.pendingFileBlob || null,
      url: urlVal || '',
      youtubeId: ytId || null
    };

    saveCustomMuadhinToDb(dbEntry)
      .then(() => loadCustomMuadhinsFromDb())
      .then(() => {
        state.selectedMuadhinId = newId;
        localStorage.setItem('clock_muadhin_id', newId);
        state.pendingFileBlob = null;
        if (elCustomMuadhinName) elCustomMuadhinName.value = '';
        if (elCustomAudioUrl) elCustomAudioUrl.value = '';
        if (elCustomFileLabel) elCustomFileLabel.childNodes[0].nodeValue = 'Ses Dosyası Seç (MP3/WAV) ';

        renderMuadhinList();
        renderPerPrayerList();
        updateActiveMuadhinSummary();
      });
  });

  elDuaToggle.addEventListener('change', e => {
    state.playDua = e.target.checked;
    localStorage.setItem('clock_play_dua', String(state.playDua));
  });

  elStopAdhanBtn.addEventListener('click', stopAdhanPlayback);

  // Top-Center Night Standby Button -> Opens pitch-black Yatsı & Sabah countdown screen
  if (elNightStandbyTriggerBtn) {
    elNightStandbyTriggerBtn.addEventListener('click', () => {
      state.nightStandbyActive = true;
      if (elNightStandbyOverlay) elNightStandbyOverlay.classList.remove('hidden');
      updateCountdownAndSidebar(new Date());
    });
  }

  // Tap anywhere on the pitch-black Night Standby Screen to return to normal view
  if (elNightStandbyOverlay) {
    elNightStandbyOverlay.addEventListener('click', () => {
      state.nightStandbyActive = false;
      elNightStandbyOverlay.classList.add('hidden');
    });
  }
}

document.addEventListener('DOMContentLoaded', initApp);

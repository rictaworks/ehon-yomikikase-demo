export type Locale = "ja" | "en" | "fr" | "zh" | "ru" | "es" | "ar"

export const DEFAULT_LOCALE: Locale = "ja"

export const STRINGS = {
  ja: {
    appTitle: "えほん よみきかせ",
    appDescription: "子ども向け絵本読み聞かせアプリ",
    nav: {
      home: "トップ",
      history: "履歴",
    },
    home: {
      heading: "絵本をえらぼう",
      filterLabel: "しぼりこみ",
      categoryLabel: "カテゴリ",
      ageLabel: "対象年齢",
      ageAll: "すべての年齢",
      categoryAll: "すべて",
      noBooks: "絵本が見つかりませんでした",
    },
    bookCard: {
      ageRange: "{min}〜{max}歳",
      readButton: "読む",
    },
    bookDetail: {
      author: "作：",
      ageRange: "対象年齢：{min}〜{max}歳",
      category: "カテゴリ：",
      totalPages: "全{total}ページ",
      readButton: "はじめから読む",
      continueButton: "{page}ページから続きを読む",
      backButton: "もどる",
    },
    readPage: {
      pageIndicator: "{current} / {total}ページ",
      prevButton: "まえへ",
      nextButton: "つぎへ",
      backButton: "もどる",
      speakButton: "読み上げ",
      stopButton: "停止",
      speedLabel: "速さ",
    },
    history: {
      heading: "最近読んだ絵本",
      empty: "まだ読んだ絵本がありません",
      backButton: "トップへもどる",
    },
    speechWarning: {
      message: "お使いのブラウザは読み上げ機能に対応していません",
    },
    notFound: {
      heading: "ページが見つかりません",
      message: "お探しのページは存在しないか、移動した可能性があります",
      backButton: "トップへもどる",
    },
    error: {
      loadFailed: "データの読み込みに失敗しました",
      saveFailed: "データの保存に失敗しました",
    },
  },
  en: {
    appTitle: "Storybook Reader",
    appDescription: "Picture book read-aloud app for children",
    nav: {
      home: "Home",
      history: "History",
    },
    home: {
      heading: "Choose a Book",
      filterLabel: "Filter",
      categoryLabel: "Category",
      ageLabel: "Age Range",
      ageAll: "All Ages",
      categoryAll: "All",
      noBooks: "No books found",
    },
    bookCard: {
      ageRange: "Ages {min}–{max}",
      readButton: "Read",
    },
    bookDetail: {
      author: "By: ",
      ageRange: "Ages: {min}–{max}",
      category: "Category: ",
      totalPages: "{total} pages",
      readButton: "Read from the beginning",
      continueButton: "Continue from page {page}",
      backButton: "Back",
    },
    readPage: {
      pageIndicator: "Page {current} of {total}",
      prevButton: "Previous",
      nextButton: "Next",
      backButton: "Back",
      speakButton: "Read aloud",
      stopButton: "Stop",
      speedLabel: "Speed",
    },
    history: {
      heading: "Recently Read",
      empty: "No reading history yet",
      backButton: "Back to Home",
    },
    speechWarning: {
      message: "Your browser does not support the speech synthesis feature",
    },
    notFound: {
      heading: "Page Not Found",
      message: "The page you are looking for does not exist or has been moved",
      backButton: "Back to Home",
    },
    error: {
      loadFailed: "Failed to load data",
      saveFailed: "Failed to save data",
    },
  },
  fr: {
    appTitle: "Lecteur de livres",
    appDescription: "Application de lecture de livres illustrés pour enfants",
    nav: {
      home: "Accueil",
      history: "Historique",
    },
    home: {
      heading: "Choisir un livre",
      filterLabel: "Filtrer",
      categoryLabel: "Catégorie",
      ageLabel: "Tranche d'âge",
      ageAll: "Tous les âges",
      categoryAll: "Tous",
      noBooks: "Aucun livre trouvé",
    },
    bookCard: {
      ageRange: "{min}–{max} ans",
      readButton: "Lire",
    },
    bookDetail: {
      author: "Par : ",
      ageRange: "Âges : {min}–{max}",
      category: "Catégorie : ",
      totalPages: "{total} pages",
      readButton: "Lire depuis le début",
      continueButton: "Continuer depuis la page {page}",
      backButton: "Retour",
    },
    readPage: {
      pageIndicator: "Page {current} sur {total}",
      prevButton: "Précédent",
      nextButton: "Suivant",
      backButton: "Retour",
      speakButton: "Lire à voix haute",
      stopButton: "Arrêter",
      speedLabel: "Vitesse",
    },
    history: {
      heading: "Livres récents",
      empty: "Aucun historique de lecture",
      backButton: "Retour à l'accueil",
    },
    speechWarning: {
      message: "Votre navigateur ne prend pas en charge la synthèse vocale",
    },
    notFound: {
      heading: "Page introuvable",
      message: "La page que vous recherchez n'existe pas ou a été déplacée",
      backButton: "Retour à l'accueil",
    },
    error: {
      loadFailed: "Échec du chargement des données",
      saveFailed: "Échec de la sauvegarde des données",
    },
  },
  zh: {
    appTitle: "绘本朗读",
    appDescription: "儿童绘本朗读应用",
    nav: {
      home: "首页",
      history: "历史",
    },
    home: {
      heading: "选择绘本",
      filterLabel: "筛选",
      categoryLabel: "类别",
      ageLabel: "适合年龄",
      ageAll: "所有年龄",
      categoryAll: "全部",
      noBooks: "未找到绘本",
    },
    bookCard: {
      ageRange: "{min}–{max}岁",
      readButton: "阅读",
    },
    bookDetail: {
      author: "作者：",
      ageRange: "适合年龄：{min}–{max}岁",
      category: "类别：",
      totalPages: "共{total}页",
      readButton: "从头开始读",
      continueButton: "从第{page}页继续",
      backButton: "返回",
    },
    readPage: {
      pageIndicator: "第{current}页 / 共{total}页",
      prevButton: "上一页",
      nextButton: "下一页",
      backButton: "返回",
      speakButton: "朗读",
      stopButton: "停止",
      speedLabel: "速度",
    },
    history: {
      heading: "最近阅读",
      empty: "暂无阅读记录",
      backButton: "返回首页",
    },
    speechWarning: {
      message: "您的浏览器不支持语音合成功能",
    },
    notFound: {
      heading: "页面未找到",
      message: "您查找的页面不存在或已被移动",
      backButton: "返回首页",
    },
    error: {
      loadFailed: "数据加载失败",
      saveFailed: "数据保存失败",
    },
  },
  ru: {
    appTitle: "Чтение книг",
    appDescription: "Приложение для чтения детских книг вслух",
    nav: {
      home: "Главная",
      history: "История",
    },
    home: {
      heading: "Выбрать книгу",
      filterLabel: "Фильтр",
      categoryLabel: "Категория",
      ageLabel: "Возраст",
      ageAll: "Все возрасты",
      categoryAll: "Все",
      noBooks: "Книги не найдены",
    },
    bookCard: {
      ageRange: "{min}–{max} лет",
      readButton: "Читать",
    },
    bookDetail: {
      author: "Автор: ",
      ageRange: "Возраст: {min}–{max}",
      category: "Категория: ",
      totalPages: "{total} страниц",
      readButton: "Читать с начала",
      continueButton: "Продолжить со страницы {page}",
      backButton: "Назад",
    },
    readPage: {
      pageIndicator: "Страница {current} из {total}",
      prevButton: "Назад",
      nextButton: "Вперёд",
      backButton: "Назад",
      speakButton: "Читать вслух",
      stopButton: "Стоп",
      speedLabel: "Скорость",
    },
    history: {
      heading: "Недавно читали",
      empty: "История чтения пуста",
      backButton: "На главную",
    },
    speechWarning: {
      message: "Ваш браузер не поддерживает синтез речи",
    },
    notFound: {
      heading: "Страница не найдена",
      message: "Запрашиваемая страница не существует или была перемещена",
      backButton: "На главную",
    },
    error: {
      loadFailed: "Ошибка загрузки данных",
      saveFailed: "Ошибка сохранения данных",
    },
  },
  es: {
    appTitle: "Cuentos en voz alta",
    appDescription: "Aplicación de lectura de libros ilustrados para niños",
    nav: {
      home: "Inicio",
      history: "Historial",
    },
    home: {
      heading: "Elige un libro",
      filterLabel: "Filtrar",
      categoryLabel: "Categoría",
      ageLabel: "Rango de edad",
      ageAll: "Todas las edades",
      categoryAll: "Todos",
      noBooks: "No se encontraron libros",
    },
    bookCard: {
      ageRange: "{min}–{max} años",
      readButton: "Leer",
    },
    bookDetail: {
      author: "Por: ",
      ageRange: "Edades: {min}–{max}",
      category: "Categoría: ",
      totalPages: "{total} páginas",
      readButton: "Leer desde el principio",
      continueButton: "Continuar desde la página {page}",
      backButton: "Volver",
    },
    readPage: {
      pageIndicator: "Página {current} de {total}",
      prevButton: "Anterior",
      nextButton: "Siguiente",
      backButton: "Volver",
      speakButton: "Leer en voz alta",
      stopButton: "Detener",
      speedLabel: "Velocidad",
    },
    history: {
      heading: "Leídos recientemente",
      empty: "Sin historial de lectura",
      backButton: "Volver al inicio",
    },
    speechWarning: {
      message: "Tu navegador no admite la síntesis de voz",
    },
    notFound: {
      heading: "Página no encontrada",
      message: "La página que buscas no existe o ha sido movida",
      backButton: "Volver al inicio",
    },
    error: {
      loadFailed: "Error al cargar los datos",
      saveFailed: "Error al guardar los datos",
    },
  },
  ar: {
    appTitle: "قراءة الكتب",
    appDescription: "تطبيق لقراءة الكتب المصوّرة للأطفال",
    nav: {
      home: "الرئيسية",
      history: "السجل",
    },
    home: {
      heading: "اختر كتاباً",
      filterLabel: "تصفية",
      categoryLabel: "الفئة",
      ageLabel: "الفئة العمرية",
      ageAll: "جميع الأعمار",
      categoryAll: "الكل",
      noBooks: "لم يتم العثور على كتب",
    },
    bookCard: {
      ageRange: "{min}–{max} سنوات",
      readButton: "اقرأ",
    },
    bookDetail: {
      author: "بقلم: ",
      ageRange: "الأعمار: {min}–{max}",
      category: "الفئة: ",
      totalPages: "{total} صفحات",
      readButton: "اقرأ من البداية",
      continueButton: "تابع من الصفحة {page}",
      backButton: "رجوع",
    },
    readPage: {
      pageIndicator: "صفحة {current} من {total}",
      prevButton: "السابق",
      nextButton: "التالي",
      backButton: "رجوع",
      speakButton: "القراءة بصوت عالٍ",
      stopButton: "إيقاف",
      speedLabel: "السرعة",
    },
    history: {
      heading: "المقروء مؤخراً",
      empty: "لا يوجد سجل قراءة",
      backButton: "العودة للرئيسية",
    },
    speechWarning: {
      message: "متصفحك لا يدعم ميزة تحويل النص إلى كلام",
    },
    notFound: {
      heading: "الصفحة غير موجودة",
      message: "الصفحة التي تبحث عنها غير موجودة أو تم نقلها",
      backButton: "العودة للرئيسية",
    },
    error: {
      loadFailed: "فشل تحميل البيانات",
      saveFailed: "فشل حفظ البيانات",
    },
  },
} as const

export type StringTree = (typeof STRINGS)[Locale]

export function getStrings(locale: Locale = DEFAULT_LOCALE): StringTree {
  return STRINGS[locale]
}

export const COOKIE_SESSION_ID = "ehon_session_id"
export const COOKIE_MAX_AGE = 60 * 60 * 24 * 365
export const ADMIN_INTERNAL_KEY_HEADER = "Authorization"
export const SPEECH_SPEEDS = [0.5, 0.75, 1.0, 1.5, 2.0] as const
export type SpeechSpeed = (typeof SPEECH_SPEEDS)[number]
export const DEFAULT_SPEECH_SPEED: SpeechSpeed = 1.0
export const HISTORY_DEFAULT_LIMIT = 20

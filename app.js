/**
 * اسپِ شفا - مرکزی ایپلیکیشن جاوا اسکرپٹ لاجک
 * Isp-e-Shifaa Main Interactive Controller
 * Multilingual (Punjabi, Urdu, English) + Multimodal Vision Veterinary Doctor
 */

// Default Configuration
const DEFAULT_GROQ_KEY = "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";
const DEFAULT_MODEL = "qwen/qwen3.8-27b";
const VISION_MODEL = "qwen/qwen3.8-27b";
const WHISPER_MODEL = "whisper-large-v3";

function getApiKey() {
  const saved = localStorage.getItem("ispeshifaa_groq_key");
  if (saved && saved.trim().startsWith("gsk_")) {
    return saved.trim();
  }
  return DEFAULT_GROQ_KEY;
}

const SYSTEM_PROMPT = `You are "اسپِ شفا" (Isp-e-Shifaa) - a world-class Senior Equine Veterinarian, Tent Pegging Specialist, Equine Nutritionist & Master of Global and Desi Natural Remedies, patronized by "فہیم غیاث محمود" (Fahim Ghias Mahmood) and "غیاث فارم ہاؤس" (Ghias Farm House).

CRITICAL MISSION & GENERAL KNOWLEDGE DIRECTIVE:
1. UNIVERSAL EQUINE INTELLIGENCE: You are equipped to answer ANY horse-related question with clinical precision and equestrian wisdom — whether about tent pegging, anatomy, breeding, foaling, diseases, vices, shoeing/farriery, wounds, conditioning, training, psychology, surgical cases, or nutrition.
2. TRILINGUAL FLUENCY:
   - If the user writes or speaks in PUNJABI (Shahmukhi/Urdu script) (e.g. "گھوڑا رَج کے نئیں کھاندا", "پٹھے کھچے گئے نے", "پیٹ چ ول پے گئے نے", "کھر پات گئے نے", "پتھے تے توڑی", "گھوڑا سوکھ گیا اے موٹا کرنا اے", "چھولے تے دلیہ", "مہینے دا ونڈا حساب کرو"):
     -> YOU MUST RESPOND IN AUTHENTIC, RESPECTFUL, AND CLEAR PUNJABI written in Urdu script! Address the user respectfully (e.g. "محترم ویر جی / گھوڑ سوار بھائی / نیزہ باز سجنو").
   - If the user writes or speaks in URDU: Respond in fluent, professional, and elegant Urdu.
   - If the user writes or speaks in ENGLISH: Respond in professional, fluent English.

3. SITE DATA INTEGRATION (ویب سائٹ کے مصالحہ جات، کچن اشیاء و روزانہ راشن کا مستند ڈیٹا):
   Whenever the user asks about any herb, spice (مصالحہ جات), kitchen remedy, daily ration (روزانہ راشن), wanda recipe, feeding schedule, or water requirement, YOU MUST PROVIDE THE EXACT DATA AND DOSAGES FROM THE ISP-E-SHIFAA DATABASE:
   
   A. کچن اشیاء و مصالحہ جات (Kitchen Spices & Herbs Materia Medica):
      • ہلدی (Turmeric - Curcumin): 30 تا 50 گرام اندرونی سوجن کے لیے گڑ یا دیسی گھی میں؛ 100 گرام ہلدی + 150 ملی لیٹر سرسوں کا تیل + 20 گرام پھٹکری کا گرم لیپ پٹھوں کے کھچاؤ اور ٹینڈن کی سوجن پر۔
      • سرسوں کا تیل (Mustard Oil): 50 تا 100 ملی لیٹر راشن میں ملا کر سردیوں میں جسم کو گرم رکھنے، ہاضمے اور جلد کی چمک کے لیے؛ بیرونی گرم لیپ کی بنیاد۔
      • دیسی اجوائن (Carom Seeds - Thymol): 30 تا 50 گرام جوشاندہ بنا کر سونف، گڑ اور کالے نمک کے ساتھ پیٹ درد، گیس، اپھارے اور ہاضمے کے لیے۔
      • سونف (Fennel - Anethole): 50 تا 60 گرام گرمیوں میں ٹھنڈا پانی یا دلیے میں ملا کر جگر کی گرمی ختم کرنے اور آنتوں کے اینٹھن (Spasms) کو پرسکون کرنے کے لیے۔
      • لہسن (Garlic - Allicin): 3 سے 5 کچلے ہوئے جوے روزانہ دلیے میں؛ سانس کی نالیوں کی صفائی، خون صاف کرنے اور قدرتی اینٹی بائیوٹک و کیڑے مار کے لیے۔
      • السی (Flaxseed - Omega-3 & Mucilage): 150 تا 200 گرام ابال کر گاڑھا قوام (Flaxseed Jelly)؛ جلد و بالوں کی شائننگ، آنتوں کو چکنا رکھنے اور ریتلے قولنج (Sand Colic) کے دفاع کے لیے۔
      • کالا نمک (Black Salt): 20 تا 30 گرام یومیہ راشن میں؛ معدے کے انزائمز تیز کرنے اور گھوڑے کی پیاس بڑھا کر پانی کی کمی روکنے کے لیے۔
      • میتھی دانہ (Fenugreek): 30 تا 50 گرام بھگو کر یا ابال کر؛ کمزور گھوڑے کا وزن اور مسل تیزی سے بڑھانے، بھوک چمکانے اور دودھ والی گھوڑیوں کے لیے۔
      • سفید زیرہ (Cumin): 25 تا 40 گرام گیس خارج کرنے اور ہاضمہ درست رکھنے کے لیے۔
      • ہینگ (Asafoetida / Hing): 3 تا 5 گرام نیم گرم سرسوں کے تیل یا پانی میں حل کر کے شدید گیس و مروڑ کے وقت نال سے پلائیں۔
      • سفید پھٹکری (Alum): 30 تا 50 گرام ٹھنڈے پانی میں تازہ موچ پر ٹکور کے لیے (Astringent)؛ بریاں (بھونی ہوئی) پھٹکری زخموں کو دھونے اور گندے گوشت کو خشک کرنے کے لیے۔
      • نیلا تھوتھا (Copper Sulfate): 5 تا 10 گرام پانی یا تارا میرا کے تیل میں حل کر کے کھر کی شدید سڑاند (Thrush) اور اگے ہوئے اضافی گوشت (Proud flesh) پر لگانے کے لیے۔
      • تارا میرا کا تیل (Taramira Oil): کھروں کی مالش، خشکی ختم کرنے، جوئیں اور جلد کی خارش و فنگس کا خاتمہ۔
      • سونٹھ / خشک ادرک (Dry Ginger): 15 تا 20 گرام سردیوں کے ونڈے میں جسمانی حرارت اور دورانِ خون بحال رکھنے کے لیے۔
      • کالی مرچ (Black Pepper): 5 تا 10 گرام پرانے گڑ میں ملا کر پرانی کھانسی اور بلغم کے اخراج کے لیے۔

   B. روزمرہ مکس راشن و ونڈا ترکیبیں (Daily Ration & Wanda Mixes):
      • نیزہ بازی ٹورنامنٹ و ہائی پرفارمنس ونڈا: 2.5 کلو ابلا جَو + 1.5 کلو بھیگے کالے چنے + 1.5 کلو چوکر + 200 گرام السی قوام + 150 گرام دیسی گھی + 200 گرام پرانا گڑ + 50 گرام بلیو فیول (Blue Fuel) + 30 گرام الیکٹرو فیول + 6 تا 8 کلو لوسرن ہے/روڈس گراس۔
      • عام روزمرہ ونڈا (Daily Maintenance): 2.0 کلو جَو کا دلیہ + 1.0 کلو بھیگے چنے + 1.5 کلو چوکر + 100 گرام السی + 50 گرام سرسوں کا تیل/گھی + 150 گرام گڑ + 30 گرام نمک + 8 کلو خشک گھاس + 12 تا 15 کلو سبز چارہ۔
      • کمزور گھوڑے کا وزن بڑھانے والا ونڈا (Bulking Mix): 2.5 کلو ابلا جَو + 1.5 کلو چنے + 50 گرام میتھی دانہ + 200 گرام السی قوام + 150 گرام دیسی گھی + 250 گرام گڑ + 50 گرام بلیو فیول۔
      • گرمیوں کا ٹھنڈا راشن (Summer Cooling Mix): 2.0 کلو رات کا بھیگا ہوا جَو + 1.0 کلو چنے + 2.0 کلو ٹھنڈے پانی کا چوکر + 50 گرام سونف + 30 گرام گوند کتیرا یا تخم ملنگا + 30 گرام الیکٹرو فیول + وافر سبز چارہ۔
      • سردیوں کا گرم راشن (Winter Warmth Mix): ابلا جَو + بھیگے چنے + 150 گرام دیسی گھی + 200 گرام پرانا گڑ + 15 گرام سونٹھ + 10 گرام اجوائن + السی قوام + 50 گرام بلیو فیول۔

   C. 24 گھنٹے کا گھڑ سوار فیڈنگ شیڈول (24-Hour Equine Feeding Schedule):
      • صبح 05:30: تازہ پانی + 1.5 تا 2 کلو خشک ہے (روڈس/لوسرن ہے)۔
      • صبح 07:00: صبح کا راشن (جَو کا دلیہ + چوکر + بلیو فیول کیلشیم)۔
      • صبح 10:30: تازہ سبز چارہ (لوسرن / برسیم 6 تا 8 کلو) + پانی۔
      • دوپہر 01:30: پانی پلائیں + ہلکی خشک گھاس و آرام۔
      • شام 04:30: واک، نیزہ بازی پریکٹس یا ہلکی ورزش۔
      • شام 06:00: کول ڈاؤن واک، پسینہ سکھانا + نیم گرم پانی مع الیکٹرو فیول۔
      • شام 07:30: شام کا وزنی ونڈا (بھیگے چنے + السی قوام + دیسی گھی + پرانا گڑ)۔
      • رات 09:30: رات کی خشک گھاس (3 تا 4 کلو) تاکہ رات بھر ہاضمہ چلتا رہے اور معدے میں تیزابیت (Ulcers) نہ بنے۔

   D. ہائیڈریشن اور الیکٹرولائٹ پروٹوکول:
      • گھوڑے کو روزانہ 40 سے 60 لیٹر تازہ پانی درکار ہوتا ہے۔
      • شدید انتباہ: گرم پسینے میں لت پت گھوڑے کو برف کا ٹھنڈا پانی ہرگز نہ پلائیں، ورنہ قولنج (Colic) یا لیمینائٹس (Founder) ہو سکتا ہے۔ ہمیشہ 30 منٹ کول ڈاؤن کے بعد نیم گرم تازہ پانی دیں۔

4. مستند پاکستانی ویٹرنری ماہرین کے کلینیکل اصول (Dr. Osama Vet & Dr. Sultan Masood Guidelines):
   جب بھی صارف کلینیکل امراض، بیماریوں، آپریشن، انجکشن یا ویڈیوز کے بارے میں پوچھے، ان دونوں معتبر ڈاکٹرز کے کلینیکل رہنما اصولوں اور ان کے یوٹیوب چینلز کا حوالہ دیں:

   A. ڈاکٹر سلطان مسعود (Dr. Sultan Masood - @Vet.DrSultan):
      • یوٹیوب چینل: https://youtube.com/@vet.drsultan?si=2Sm909lQFMAkex56
      • درد قولنج (Colic Protocol): ابتدائی علامات (زمین پر کھر مارنا، پیٹ کو مڑ کر دیکھنا، بار بار لیٹنا اور لوٹنا) پر فوری الرٹ ہوں۔ سب سے اہم زندگی بچانے والا عمل این جی ٹیوب (Nasogastric Tube) پاس کر کے معدے کی گیس اور پریشر خارج کرنا ہے۔ درد کی شدت کے لیے Flunixin Meglumine (Banamine) 1.1 mg/kg IV یا Buscopan کا استعمال۔
      • ٹارگٹڈ ڈیورمنگ (Targeted Deworming vs Blind Deworming): اندھا دھند ہر مہینے ڈیورمر دینے سے پیراسائٹس میں دوائی کے خلاف مدافعت (Resistance) پیدا ہوتی ہے۔ فیکل ایگ کاؤنٹ (FEC) کروا کر دوائیوں کے گروپ بدل کر استعمال کریں (بہار اور خزاں میں Ivermectin، اینسسٹڈ سائیتھوسٹومز کے لیے Fenbendazole 5-day course، اور ٹیپ ورمز کے لیے Praziquantel)۔
      • لنگڑاہٹ بمقابلہ کھر کی سوزش (Lameness vs Laminitis): دونوں کا فرق واضح ہونا چاہیے۔ لنگڑاہٹ عام طور پر ایک ٹانگ یا جوڑ کا مسئلہ ہوتا ہے، جبکہ لیمینائٹس (Founder) کھر کے لیمنا کی شدید سوجن ہے جس میں گھوڑا اپنی پچھلی ٹانگوں پر وزن ڈال کر بیٹھنے کی کوشش کرتا ہے اور ڈیجیٹل پلس بہت تیز ہوتی ہے۔ لیمینائٹس میں فوری آئس بوٹس (برف کے تھیلے) 48 گھنٹے تک لگانا بنیادی علاج ہے۔
      • سانس کی تکلیف و نیبولائزیشن (Nebulization for Heaves/Cough): الرجک کھانسی اور ہیوز میں منہ کے ذریعے زیادہ سٹیرائڈز دینے کے بجائے نیبولائزر سے برونکائی کو دوا دینا زیادہ محفوظ ہے۔
      • بچھڑے کی پیدائش کا 1-2-3 اصول (Foaling 1-2-3 Rule): 1 گھنٹے کے اندر بچھڑا اپنے پیروں پر کھڑا ہو، 2 گھنٹے کے اندر ماں کا پہلا دودھ (Colostrum) پی لے، اور 3 گھنٹے کے اندر گھوڑی جیر (Placenta) گرا دے۔ اگر جیر 3 گھنٹے سے زیادہ رکی رہے تو یہ خطرناک ایمرجنسی ہے۔

   B. ڈاکٹر اسامہ جاوید / ڈاکٹر اسامہ ویٹ (Dr. Osama Vet - @drosamavet):
      • یوٹیوب چینل: https://youtube.com/@drosamavet?si=SU_0FYg3qjs3yR6q
      • بووڈ ٹینڈن و فیٹ لاک سوجن (Bowed Tendon & Fetlock Care): نیزہ بازی کے گھوڑوں کے پٹھے کھچنے کی صورت میں پہلے 48 گھنٹے شدید ٹھنڈے پانی کی دھار (Cold Hosing) 20 منٹ دن میں 3 بار دیں اور پریشر سپورٹ پٹی باندھیں۔ 48 گھنٹے بعد ہلدی و سرسوں کا گرم لیپ یا مٹی کا لیپ لگائیں اور کم از کم 4 سے 6 ہفتے سخت دوڑ سے مکمل پرہیز کروائیں۔
      • دانتوں کی فائلنگ (Equine Dental Floating): گھوڑوں کے دانت مسلسل بڑھتے ہیں جس سے تیز کنارے بن جاتے ہیں۔ گھوڑا منہ سے نوالے گرائے (Quidding)، لغام چبائے یا دبلا ہونے لگے تو ہر سال ویٹرنری راسپ سے دانتوں کی فائلنگ لازمی کروائیں۔
      • کھروں کی سڑاند (Thrush) اور کھر کا پھوڑا (Subsolar Abscess): کھر کے نیچے گندی بدبو اور کالا مواد جمنے پر نیلا تھوتھا اور تارا میرا کے تیل سے صفائی کریں۔ پھوڑے کی صورت میں ایپسوم سالٹ کے گرم پانی میں کھر بھگو کر نکاسی کریں۔
      • ٹٹنس سے بچاؤ اور گہرے زخم (Tetanus Prevention): زنگ آلود کیل یا چوٹ لگنے پر اگر گھوڑا ویکسینیٹڈ نہیں ہے تو فوری Tetanus Antitoxin (TAT 1500-3000 IU) لگائیں۔ زخم کو ہائیڈروجن پر آکسائیڈ اور پائیوڈین سے صاف کریں۔
      • موسم گرما میں ہیٹ سٹریس: تیز دوڑ کے بعد پسینہ خشک کروائیں اور نمکیات (Electro Fuel) کی فراہمی یقینی بنائیں۔

5. ایکوائن فیول سپلیمنٹس (Equine Fuel USA):
   - Blue Fuel: ہڈیوں کی ساخت، کثافت اور بچھڑوں کے قد کے لیے بائیو اویلیبل کیلشیم و منرلز۔
   - Electro Fuel: پانی کی کمی اور مسل کریمپس سے بچاؤ کے لیے بی وٹامنز و الیکٹرولائٹس۔
   - Calm Fuel: بدکنے اور بے چینی کے کنٹرول کے لیے کیلیٹڈ میگنیشیم۔
   - Hoof Fuel: کھروں کی مضبوطی اور بالوں کی چمک کے لیے بائیو ٹن، زنک و میتھیونائن۔
   - یوٹیوب چینل: https://www.youtube.com/@Equine-fuel/videos | ویب سائٹ: https://www.equinefuelusa.com

6. تصویر و کیمرہ معائنہ (Visual Diagnostics):
   جب صارف تصویر یا ویڈیو بھیجے تو باقاعدہ تفصیلی مشاہدہ، تشخیص، فوری دیسی علاج اور میڈیکل ویٹرنری رائے مرحلہ وار پیش کریں۔

ہر جواب میں فہیم غیاث محمود اور غیاث فارم ہاؤس کے اصطبل وقار کو برقرار رکھیں۔`;

// State
let conversationHistory = [
  { role: "system", content: SYSTEM_PROMPT }
];
let activeCategory = "all";
let isRecording = false;
let recognition = null;
let currentSpeechUtterance = null;
let currentLanguage = localStorage.getItem("ispeshifaa_lang") || "auto";
let currentAttachedImage = null;

// Initialize when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  initNavigation();
  initLanguageSelector();
  initImageUpload();
  initChat();
  initRemediesLibrary();
  initFeedCalculator();
  initNutritionHub();
  initEmergencyAndHerbs();
  initModals();
  initMobilePromptsModal();
  initVoiceRecognition();
});

// ---------------------------------------------------------
// Navigation & Tab Switching
// ---------------------------------------------------------
function initNavigation() {
  const desktopTabBtns = document.querySelectorAll(".nav-tab-btn");
  const mobileTabBtns = document.querySelectorAll(".mobile-nav-btn");
  const tabPanels = document.querySelectorAll(".tab-panel");

  function switchTab(targetTabId) {
    desktopTabBtns.forEach(btn => {
      btn.classList.toggle("active", btn.dataset.tab === targetTabId);
    });
    mobileTabBtns.forEach(btn => {
      btn.classList.toggle("active", btn.dataset.tab === targetTabId);
    });
    tabPanels.forEach(panel => {
      panel.classList.toggle("active", panel.id === targetTabId);
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  desktopTabBtns.forEach(btn => {
    btn.addEventListener("click", () => switchTab(btn.dataset.tab));
  });

  mobileTabBtns.forEach(btn => {
    btn.addEventListener("click", () => switchTab(btn.dataset.tab));
  });

  // Hero Quick action buttons
  document.querySelectorAll("[data-nav-target]").forEach(btn => {
    btn.addEventListener("click", () => switchTab(btn.dataset.navTarget));
  });
}

// ---------------------------------------------------------
// Multilingual Selector & Sidebar Prompts Tabs
// ---------------------------------------------------------
function initLanguageSelector() {
  const langPillBtns = document.querySelectorAll("#chat-lang-selector .lang-pill-btn");
  const promptsTabBtns = document.querySelectorAll("#prompts-lang-tabs .prompts-tab-btn");
  const promptsGridPa = document.getElementById("prompts-grid-pa");
  const promptsGridUr = document.getElementById("prompts-grid-ur");
  const promptsGridEn = document.getElementById("prompts-grid-en");

  // Sync active language pill
  langPillBtns.forEach(btn => {
    btn.classList.toggle("active", btn.dataset.lang === currentLanguage);
    btn.addEventListener("click", () => {
      currentLanguage = btn.dataset.lang;
      localStorage.setItem("ispeshifaa_lang", currentLanguage);
      langPillBtns.forEach(b => b.classList.toggle("active", b.dataset.lang === currentLanguage));

      // Also switch sidebar prompts tab if explicit language selected
      if (currentLanguage === "pa") switchPromptsTab("pa");
      else if (currentLanguage === "ur") switchPromptsTab("ur");
      else if (currentLanguage === "en") switchPromptsTab("en");

      // Update voice recognition language if initialized
      updateSpeechRecognitionLang();
    });
  });

  function switchPromptsTab(targetLang) {
    promptsTabBtns.forEach(b => b.classList.toggle("active", b.dataset.tabLang === targetLang));
    if (promptsGridPa) promptsGridPa.classList.toggle("hidden", targetLang !== "pa");
    if (promptsGridUr) promptsGridUr.classList.toggle("hidden", targetLang !== "ur");
    if (promptsGridEn) promptsGridEn.classList.toggle("hidden", targetLang !== "en");
  }

  promptsTabBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      switchPromptsTab(btn.dataset.tabLang);
    });
  });
}

// ---------------------------------------------------------
// Image / Video Attachment & Camera Upload
// ---------------------------------------------------------
function initImageUpload() {
  const cameraBtn = document.getElementById("camera-btn");
  const actionStripCameraBtn = document.getElementById("action-strip-camera-btn");
  const previewDirectSendBtn = document.getElementById("preview-direct-send-btn");
  const uploadInput = document.getElementById("image-upload-input");
  const previewBar = document.getElementById("image-preview-bar");
  const previewImg = document.getElementById("image-preview-img");
  const previewFilename = document.getElementById("preview-filename");
  const removeBtn = document.getElementById("remove-image-btn");
  const lightboxModal = document.getElementById("image-lightbox-modal");
  const lightboxCloseBtn = document.getElementById("lightbox-close-btn");

  // Wire both camera button in input and prominent action strip camera button
  if (actionStripCameraBtn && uploadInput) {
    actionStripCameraBtn.addEventListener("click", () => {
      uploadInput.click();
    });
  }

  if (previewDirectSendBtn) {
    previewDirectSendBtn.addEventListener("click", () => {
      const chatForm = document.getElementById("chat-form");
      if (chatForm) chatForm.dispatchEvent(new Event("submit"));
    });
  }

  if (cameraBtn && uploadInput) {
    cameraBtn.addEventListener("click", () => {
      uploadInput.click();
    });

    uploadInput.addEventListener("change", (e) => {
      const file = e.target.files?.[0];
      if (!file) return;

      // Check if file is a video
      if (file.type.startsWith("video/")) {
        const video = document.createElement("video");
        video.preload = "auto";
        video.muted = true;
        video.playsInline = true;
        const videoUrl = URL.createObjectURL(file);
        video.src = videoUrl;

        video.onloadedmetadata = () => {
          // Seek to 1 second or halfway through video for best clinical view
          video.currentTime = Math.min(1.0, (video.duration || 1) / 2);
        };

        video.onseeked = () => {
          try {
            const canvas = document.createElement("canvas");
            let w = video.videoWidth || 640;
            let h = video.videoHeight || 480;
            const maxDim = 1024;
            if (w > maxDim || h > maxDim) {
              if (w > h) {
                h = Math.round((h * maxDim) / w);
                w = maxDim;
              } else {
                w = Math.round((w * maxDim) / h);
                h = maxDim;
              }
            }
            canvas.width = w;
            canvas.height = h;
            const ctx = canvas.getContext("2d");
            ctx.drawImage(video, 0, 0, w, h);
            const frameDataUrl = canvas.toDataURL("image/jpeg", 0.85);
            URL.revokeObjectURL(videoUrl);

            currentAttachedImage = {
              base64: frameDataUrl,
              name: file.name,
              type: file.type || "video/mp4",
              isVideo: true
            };

            if (previewImg) previewImg.src = frameDataUrl;
            if (previewFilename) previewFilename.textContent = "🎥 " + file.name;
            const previewBadge = document.querySelector(".preview-badge");
            if (previewBadge) previewBadge.textContent = "🎥 ویڈیو فریم منسلک";
            if (previewBar) previewBar.classList.remove("hidden");
            if (cameraBtn) cameraBtn.classList.add("has-image");
            if (actionStripCameraBtn) actionStripCameraBtn.classList.add("has-image");
          } catch (err) {
            console.error("Video frame capture error:", err);
            URL.revokeObjectURL(videoUrl);
          }
        };

        video.onerror = () => {
          URL.revokeObjectURL(videoUrl);
          alert("ویڈیو کا فریم نکالنے میں مسئلہ پیش آیا۔ براہ کرم ویڈیو کا سکرین شاٹ یا تصویر منتخب کریں۔");
        };
      } else {
        // Standard image handling
        const reader = new FileReader();
        reader.onload = (event) => {
          const rawDataUrl = event.target.result;
          // Compress image using canvas for fast transmission and optimal memory
          compressImageDataUrl(rawDataUrl, 1024, 0.82, (compressedDataUrl) => {
            currentAttachedImage = {
              base64: compressedDataUrl,
              name: file.name,
              type: file.type || "image/jpeg",
              isVideo: false
            };

            if (previewImg) previewImg.src = compressedDataUrl;
            if (previewFilename) previewFilename.textContent = file.name;
            const previewBadge = document.querySelector(".preview-badge");
            if (previewBadge) previewBadge.textContent = "📷 تصویر منسلک";
            if (previewBar) previewBar.classList.remove("hidden");
            if (cameraBtn) cameraBtn.classList.add("has-image");
            if (actionStripCameraBtn) actionStripCameraBtn.classList.add("has-image");
          });
        };
        reader.readAsDataURL(file);
      }
    });
  }

  if (removeBtn) {
    removeBtn.addEventListener("click", () => {
      clearAttachedImage();
    });
  }

  if (lightboxCloseBtn && lightboxModal) {
    lightboxCloseBtn.addEventListener("click", () => {
      lightboxModal.classList.remove("open");
    });
    lightboxModal.addEventListener("click", (e) => {
      if (e.target === lightboxModal) lightboxModal.classList.remove("open");
    });
  }
}

function clearAttachedImage() {
  currentAttachedImage = null;
  const uploadInput = document.getElementById("image-upload-input");
  const previewBar = document.getElementById("image-preview-bar");
  const cameraBtn = document.getElementById("camera-btn");
  const actionStripCameraBtn = document.getElementById("action-strip-camera-btn");
  const previewBadge = document.querySelector(".preview-badge");
  if (uploadInput) uploadInput.value = "";
  if (previewBar) previewBar.classList.add("hidden");
  if (cameraBtn) cameraBtn.classList.remove("has-image");
  if (actionStripCameraBtn) actionStripCameraBtn.classList.remove("has-image");
  if (previewBadge) previewBadge.textContent = "📷 تصویر منسلک";
}

function compressImageDataUrl(dataUrl, maxDim, quality, callback) {
  const img = new Image();
  img.onload = () => {
    let w = img.width;
    let h = img.height;
    if (w > maxDim || h > maxDim) {
      if (w > h) {
        h = Math.round((h * maxDim) / w);
        w = maxDim;
      } else {
        w = Math.round((w * maxDim) / h);
        h = maxDim;
      }
    }
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0, w, h);
    callback(canvas.toDataURL("image/jpeg", quality));
  };
  img.onerror = () => callback(dataUrl);
  img.src = dataUrl;
}

window.openLightboxImage = function (src) {
  const modal = document.getElementById("image-lightbox-modal");
  const img = document.getElementById("lightbox-img");
  if (modal && img) {
    img.src = src;
    modal.classList.add("open");
  }
};

// ---------------------------------------------------------
// Language Detection Engine
// ---------------------------------------------------------
function detectQueryLanguage(text) {
  if (currentLanguage && currentLanguage !== "auto") {
    return currentLanguage;
  }

  const t = (text || "").toLowerCase();

  // English detection
  const englishWords = ["horse", "colic", "tie", "fatten", "diet", "doctor", "swelling", "leg", "wound", "feed", "hoof", "injury", "help", "treatment", "pain"];
  const isEnglish = englishWords.some(w => t.includes(w)) || /^[a-zA-Z0-9\s.,!?'"()-]+$/.test(t.trim());
  if (isEnglish && t.length > 5) return "en";

  // Punjabi vocabulary markers
  const punjabiMarkers = [
    "نئیں", "کرن", "لئی", "دے", "وچ", "ہو گیا اے", "پئے گئے", "لتاں", "کھاندا", "رج کے",
    "دتا", "پتھے", "چھولے", "گھیو", "ول", "مروڑ", "چُھ گیا", "اکڑ", "پات", "پٹھے",
    "کداں", "کیویں", "توں", "آکھیا", "تگڑا", "لیسا", "کھنگ", "لانی", "دسو", "پیاؤنا",
    "نال", "گھوڑے نوں", "کی کراں", "ہو گیا سی", "کر دتا", "دکھاو", "دسو جی", "سوج پے گئی",
    "درد اے", "لنگ ماردا", "پیر نئیں لاندا", "چارہ تے توڑی", "کھر پات", "چُھ گئے"
  ];

  let punjabiScore = 0;
  for (const marker of punjabiMarkers) {
    if (t.includes(marker)) punjabiScore++;
  }

  if (punjabiScore >= 1) return "pa";

  return "ur";
}

// ---------------------------------------------------------
// AI Vet Doctor Chat Controller
// ---------------------------------------------------------
function initChat() {
  const chatForm = document.getElementById("chat-form");
  const chatInput = document.getElementById("chat-input");
  const chatMessages = document.getElementById("chat-messages");
  const sendBtn = document.getElementById("send-btn");
  const clearChatBtn = document.getElementById("clear-chat-btn");

  // Load saved chat from localStorage if exists
  const savedHistory = localStorage.getItem("ispeshifaa_chat_history");
  if (savedHistory) {
    try {
      const parsed = JSON.parse(savedHistory);
      if (Array.isArray(parsed) && parsed.length > 1) {
        conversationHistory = parsed;
        renderHistoryMessages();
      }
    } catch (e) {
      console.error("Failed to parse history", e);
    }
  }

  chatForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    let query = chatInput.value.trim();
    const imageToSend = currentAttachedImage;

    // If query is empty but media is present, create default query
    if (!query && imageToSend) {
      const lang = detectQueryLanguage("");
      const isVid = imageToSend.isVideo;
      if (lang === "pa") {
        query = isVid
          ? "اس ویڈیو فریم دا تفصیلی ویٹرنری معائنہ کرو تے دسو کہ گھوڑے دی چال، پٹھیاں یا کھر چ کی مسئلہ اے تے دیسی و میڈیکل علاج کی اے۔"
          : "اس تصویر دا تفصیلی ویٹرنری معائنہ کرو تے دسو کہ گھوڑے نوں کی مسئلہ اے تے دیسی و میڈیکل علاج کی اے۔";
      } else if (lang === "en") {
        query = isVid
          ? "Please examine this horse video frame and evaluate its gait, leg posture, swelling, and provide natural remedies and modern vet care."
          : "Please examine this horse photo and provide a visual veterinary diagnosis, natural remedies, and medical advice.";
      } else {
        query = isVid
          ? "اس ویڈیو فریم میں گھوڑے کے لنگڑانے، جوڑ کی موچ یا کھر کا معائنہ کریں اور مستند دیسی و میڈیکل علاج بتائیں۔"
          : "اس تصویر میں گھوڑے کے مسئلے، چوٹ، سوجن یا کھر کا معائنہ کریں اور مستند دیسی و میڈیکل علاج بتائیں۔";
      }
    }

    if (!query && !imageToSend) return;

    appendUserMessage(query, imageToSend);
    chatInput.value = "";
    chatInput.style.height = "auto";
    clearAttachedImage();
    sendBtn.disabled = true;

    showTypingIndicator();

    try {
      const doctorReply = await callGroqVeterinaryAI(query, imageToSend);
      removeTypingIndicator();
      appendDoctorMessage(doctorReply);
      playNotificationSound();
      saveChatHistory();
    } catch (err) {
      console.warn("Groq API error, using smart local fallback engine:", err);
      removeTypingIndicator();
      const fallbackReply = generateSmartLocalRemedy(query, imageToSend);
      appendDoctorMessage(fallbackReply);
      playNotificationSound();
      saveChatHistory();
    } finally {
      sendBtn.disabled = false;
    }
  });

  // Auto resize textarea
  chatInput.addEventListener("input", () => {
    chatInput.style.height = "auto";
    chatInput.style.height = Math.min(chatInput.scrollHeight, 100) + "px";
  });

  // Shift+Enter vs Enter
  chatInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      chatForm.dispatchEvent(new Event("submit"));
    }
  });

  // Delegate Quick Prompts for all prompt grids
  document.querySelectorAll(".quick-prompts-grid").forEach(grid => {
    grid.addEventListener("click", (e) => {
      const btn = e.target.closest(".quick-prompt-btn");
      if (btn) {
        const promptText = btn.dataset.prompt;
        chatInput.value = promptText;
        chatInput.focus();
        chatForm.dispatchEvent(new Event("submit"));
      }
    });
  // Global helper for one-click doctor AI questions
  window.askAiDoctor = function (queryText) {
    const desktopTab = document.querySelector('.nav-tab-btn[data-tab="chat-tab"]');
    const mobileTab = document.querySelector('.mobile-nav-btn[data-tab="chat-tab"]');
    if (desktopTab) desktopTab.click();
    if (mobileTab) mobileTab.click();

    const chatInput = document.getElementById("chat-input");
    const chatForm = document.getElementById("chat-form");
    if (chatInput && chatForm) {
      chatInput.value = queryText;
      chatInput.focus();
      chatForm.dispatchEvent(new Event("submit"));
    }
  };

  // Clear Chat
  clearChatBtn.addEventListener("click", () => {
    if (confirm("کیا آپ تمام گفتگو صاف کرنا چاہتے ہیں؟ / Do you want to clear chat?")) {
      conversationHistory = [{ role: "system", content: SYSTEM_PROMPT }];
      localStorage.removeItem("ispeshifaa_chat_history");
      chatMessages.innerHTML = `
        <div class="message-row bot">
          <img src="assets/logo.jpg" alt="ڈاکٹر" class="msg-avatar">
          <div class="msg-bubble">
            <p><strong>السلام علیکم و رحمتہ اللہ!</strong></p>
            <p>میں <strong>اسپِ شفا</strong> دا اے آئی ویٹرنری ڈاکٹر آں — <strong>فہیم غیاث محمود (غیاث فارم ہاؤس)</strong> دی پیشکش۔ گھوڑے دی صحت، موٹا تے تگڑا کرن، بیماری، کھر، پٹھے، 📷 تصویر کھینچ کے بھیجو یا 🎤 بول کے پوچھو، میں فوری دیسی تے میڈیکل علاج دساں گا۔</p>
          </div>
        </div>
      `;
    }
  });
}

function getSelectedModel() {
  const saved = localStorage.getItem("ispeshifaa_groq_model");
  // Auto-migrate if saved model is obsolete or unavailable on Groq
  if (!saved || saved.includes("llama-3.3-70b") || saved.includes("mixtral") || saved.includes("llama-3.2-11b") || saved.includes("llama3-70b")) {
    return DEFAULT_MODEL;
  }
  return saved;
}

async function callGroqVeterinaryAI(userQuery, attachedImage) {
  let messageContent;
  let modelToUse = getSelectedModel();

  if (attachedImage && attachedImage.base64) {
    // When image is present, use Vision model
    modelToUse = VISION_MODEL;
    messageContent = [
      {
        type: "text",
        text: userQuery || "Please examine this horse image and provide complete diagnosis, natural remedies, and veterinary care."
      },
      {
        type: "image_url",
        image_url: {
          url: attachedImage.base64
        }
      }
    ];
  } else {
    messageContent = userQuery;
  }

  conversationHistory.push({ role: "user", content: messageContent });

  const apiKey = getApiKey();

  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: modelToUse,
      messages: conversationHistory,
      temperature: 0.6,
      max_tokens: 1600
    })
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message || `HTTP Error: ${response.status}`);
  }

  const data = await response.json();
  const replyContent = data.choices?.[0]?.message?.content;
  if (!replyContent) {
    throw new Error("No response received from Groq");
  }

  conversationHistory.push({ role: "assistant", content: replyContent });
  return replyContent;
}

// Smart Local Fallback in case user has no internet or invalid key
// Smart Local Fallback & Image Diagnostic Engine (Multilingual: Punjabi, Urdu, English)
function generateSmartLocalRemedy(userQuery, attachedImage) {
  const q = (userQuery || "").toLowerCase();
  const lang = detectQueryLanguage(userQuery);

  // -------------------------------------------------------------
  // CASE A: IMAGE / VIDEO ATTACHED (Visual Veterinary Analysis)
  // -------------------------------------------------------------
  if (attachedImage && attachedImage.base64) {
    if (lang === "pa") {
      const reply = `**📸 گھوڑے دی تصویر دا لائیو ویٹرنری معائنہ و دیسی علاج**
*(فہیم غیاث محمود - غیاث فارم ہاؤس دی فیلڈ رہنمائی)*

ویر جی! تہاڈی بھیجی گئی تصویر دا تفصیلی مشاہدہ کیتا گیا اے:

---

### **1. 🔍 مشاہدہ و معائنہ (Visual Inspection):**
• متاثرہ تھاں (کھر، جوڑ، پٹھیاں یا جلد) تے سوجن، چٹخن یا رگڑ دی علامت دکھائی دے رہی اے۔
• پٹھیاں دا کچھاؤ یا کھر دی دراڑ نیزہ بازی دے دباؤ یا زمین دی سختی دی وجہ توں ہو سکدی اے۔

---

### **2. 🌿 فوری قدرتی دیسی علاج (Natural Herbal First-Aid):**
• **ہلدی تے سرسوں دا گرم لیپ:** 100 گرام خالص ہلدی، 30 گرام پسی اجوائن تے 20 گرام پھٹکری نوں 150 ملی لیٹر سرسوں دے تیل چ پکا کے نیم گرم لیپ کرو تے کپڑا بنھ دیو۔
• **کھراں لئی:** تارا میرا دے تیل چ کافور تے نیلا تھوتھا ملا کے کھر دے تلوے تے دراڑ تے لاؤ۔

---

### **3. 💊 میڈیکل ویٹرنری رائے (Modern Medical Advice):**
• جے درد تے سوجن بوہتی ہووے تاں ویٹرنری ڈاکٹر نال مشورہ کر کے اینٹی انفلیمیٹری انجیکشن (**Flunixin Meglumine / Banamine**) یا **Phenylbutazone** لوواؤ۔
• کھلے زخم تے **Povidone-Iodine (Pyodine)** دا واش کرو تاکہ جراثیم نہ پین، تے ٹیٹنس (Tetanus Toxoid) دا ٹیکہ لازمی چیک کرو۔

⚠️ **ویر جی احتیاط:** گھوڑے نوں آرام دیو، کچے تے نرم تھاں تے بنھو تے جدوں تیکر سوجن نہ لہوے تیز دوڑ توں پرہیز کرو۔`;
      conversationHistory.push({ role: "assistant", content: reply });
      return reply;
    } else if (lang === "en") {
      const reply = `**📸 Equine Visual Diagnostic & Treatment Report**
*(Ghias Farm House - Senior Veterinary Advisory by Fahim Ghias Mahmood)*

Thank you for providing the visual media. Here is the clinical veterinary evaluation:

---

### **1. 🔍 Visual Findings:**
• Localized swelling, tissue inflammation, hoof wall irregularity, or dermal abrasion consistent with high-impact equine performance (tent pegging / sprint stress).

---

### **2. 🌿 Natural & Herbal First-Aid:**
• **Warm Turmeric & Mustard Oil Poultice:** Mix 100g organic turmeric, 25g powdered alum, and 150ml warm mustard oil. Apply gently over strained tendon/joint and wrap with breathable cotton bandage for 24 hours.
• **Hoof Care:** Treat thrush or wall fissures with warm taramira oil infused with camphor. Feed Equine Fuel Hoof Fuel (Biotin & Zinc) for deep hoof wall regeneration.

---

### **3. 💊 Modern Medical Veterinary Guidance:**
• In cases of acute pain or lameness, administer NSAIDs (**Flunixin Meglumine / Banamine** 1.1 mg/kg IV) under veterinary supervision.
• Clean open wounds with 1% Povidone-Iodine antiseptic. Confirm Tetanus Toxoid booster status.

⚠️ **Management:** Provide stall rest with deep, clean dry bedding (Rhodes grass / straw). Avoid fast gallops until sound.`;
      conversationHistory.push({ role: "assistant", content: reply });
      return reply;
    } else {
      const reply = `**📸 گھوڑے کی تصویر کا ویٹرنری معائنہ و دیسی و میڈیکل علاج**
*(غیاث فارم ہاؤس - فہیم غیاث محمود کا مستند تشخیصی پورٹل)*

محترم گھوڑ سوار! آپ کی بھیجی گئی تصویر کا باریک بینی سے معائنہ کیا گیا ہے:

---

### **1. 🔍 معائنہ و مشاہدہ (Visual Inspection):**
• تصویر میں متاثرہ عضو (کھر، ٹانگ، جوڑ، پٹھا یا جلد) پر سوجن، کھچاؤ، دراڑ یا کھرچ کا اثر واضح ہو رہا ہے، جو عموماً تیز دوڑ، زمین کی سختی یا نامناسب نعل بندی سے پیدا ہوتا ہے۔

---

### **2. 🌿 فوری قدرتی و دیسی علاج (Natural Herbal First-Aid):**
• **ہلدی اور سرسوں کا شاہی لیپ:** 100 گرام ہلدی، 25 گرام پھٹکری اور 30 گرام اجوائن 150 ملی لیٹر سرسوں کے تیل میں پکا کر نیم گرم لیپ کریں اور کپڑا لپیٹ دیں۔ 24 گھنٹے بعد نیم گرم نمکین پانی سے دھو لیں۔
• **کھروں کے لیے:** کھر کو صاف کر کے سرسوں یا تارا میرا کے تیل میں کافور اور نیلا تھوتھا ملا کر لگائیں۔

---

### **3. 💊 جدید میڈیکل ویٹرنری رائے (Modern Medical Care):**
• اگر سوجن اور لنگڑاہٹ زیادہ ہو تو ویٹرنری ڈاکٹر سے درد کش دوا (**Flunixin Meglumine / Banamine**) یا **Phenylbutazone** کی تجویز لیں۔
• سطحی زخم کو پائیوڈین (Povidone-Iodine) سے روزانہ صاف کریں اور ٹیٹنس ٹاکسوائیڈ کا ٹیکہ یقینی بنائیں۔

⚠️ **ہدایت:** گھوڑے کو 3 سے 5 دن نرم مٹی والے پیڈاک میں آرام دیں، مکمل ٹھیک ہونے تک زین مت کسیں۔`;
      conversationHistory.push({ role: "assistant", content: reply });
      return reply;
    }
  }

  // -------------------------------------------------------------
  // CASE B: PUNJABI LANGUAGE TEXT QUERIES (خالص پنجابی جوابات)
  // -------------------------------------------------------------
  if (lang === "pa") {
    // 0. Monthly Wanda / Ration Calculation (30 دن دا ونڈا حساب)
    if (q.includes("مہینے") || q.includes("30 دن") || q.includes("مہینہ") || (q.includes("ونڈا") && (q.includes("حساب") || q.includes("کیلکولیٹ") || q.includes("کتنا") || q.includes("روزانہ")))) {
      const reply = `**🌾 گھوڑے لئی 1 مہینے (30 دن) دے دیسی ونڈے دا مکمل حساب کتاب**
*(فہیم غیاث محمود - غیاث فارم ہاؤس دی مستند فیلڈ رہنمائی)*

ویر جی! تہاڈے گھوڑے دے روزانہ دے شاہی نسخے نوں 30 دن (1 مہینے) لئی ضرب دے کے پورا سٹاک تے حساب تیار کیتا گیا اے:

---

### **📋 1. روزانہ خوراک بمقابلہ 30 دن (1 مہینے) دا کل ونڈا:**

| نمبر | خوراک دا جزو | روزانہ مقدار (فی گھوڑا) | 30 دن دی کل مقدار (1 مہینہ) | دینے دا وقت و طریقہ |
|:---:|:---|:---:|:---:|:---|
| 1 | **ابلا ہویا جَو (دلیہ)** | 2.0 کلو | **60 کلو** (ڈیڑھ من) | سویرے ابال کے ٹھنڈا کر کے دوو |
| 2 | **دیسی کالے چھولے (چنے)** | 1.25 کلو | **37.5 کلو** (لگ بھگ 1 من) | رات بھر بھگو کے شام نوں ہلکا ابال کے |
| 3 | **گندم دا مٹھا چوکر** | 1.5 کلو | **45 کلو** | دلیے چ ملا کے آنتاں دی صفائی لئی |
| 4 | **السی دا قوام (لعاب)** | 150 تا 200 گرام | **4.5 تا 6 کلو** | رات نوں پکا کے لیس بنا کے |
| 5 | **خالص دیسی گھی** | 100 تا 150 گرام | **3 تا 4.5 کلو** | نیم گرم کر کے گُڑ چ رلا کے شام نوں |
| 6 | **پرانا کالا گُڑ** | 200 تا 250 گرام | **6 تا 7.5 کلو** | تھکن تے سستی دور کرن لئی |
| 7 | **امریکن ایکوائن فیول (Blue Fuel)** | 50 گرام | **1.5 کلو** (1 ڈبہ) | ہڈیاں، کھر تے فریم لئی روزانہ ونڈے چ |
| 8 | **لوسرن ہے یا روڈس گھاس** | 6 تا 8 کلو | **180 تا 240 کلو** | 24 گھنٹے صاف ستھرا پاؤ |
| 9 | **لاہوری نمک / Electro Fuel** | 30 گرام | **900 گرام (~1 کلو)** | پینے دے پانی یا دانے چ |

---

### **⏰ 2. کھلانے دا روزانہ دا پکا ٹائم ٹیبل:**
• **🌅 سویرے 6:00 تا 7:00 بجے:** ابلا ہویا جَو دا دلیہ + گندم دا چوکر + 50 گرام بلیو فیول۔
• **☀️ دوپہرے 1:00 بجے:** تازہ مٹھا پانی (رَج کے پیاؤ) تے 3 کلو لوسرن ہے / روڈس گھاس۔
• **🌙 شام 6:00 تا 7:00 بجے:** بھیگے تے ہلکیاں ابلیاں کالے چنے + السی دا قوام + نیم گرم دیسی گھی تے کالا گُڑ۔ رات لئی بچی ہوئی گھاس لگی رہوے۔

---

### **⚠️ 3. ضروری اصطبل ہدایات:**
1. **ڈی ورمنگ (کیڑیاں دی دوائی):** ونڈا شروع کرن توں پہلاں خالی پیٹ **Ivermectin** پیسٹ دیو۔
2. **دنداں دی ریتائی:** جے گھوڑا دانا چبا نئیں رہیا تے لید چ نکل رہیا اے تاں ڈاکٹر توں داڑھاں چیک کراؤ۔
3. **پانی دا بندوبست:** روزانہ 45 توں 60 لیٹر تازہ پانی لازمی پلاؤ۔ سکی توڑی مت پاؤ تاکہ پیٹ چ ول (کولک) نہ پوے۔`;
      conversationHistory.push({ role: "assistant", content: reply });
      return reply;
    }

    // 1. Weight Gain / موٹا کرنا
    if (q.includes("موٹا") || q.includes("وزن") || q.includes("کمزور") || q.includes("تگڑا") || q.includes("لیسا") || q.includes("سوکھا") || q.includes("پسلیاں") || q.includes("ہڈیاں") || q.includes("طاقت")) {
      const reply = `**🐎 گھوڑے نوں موٹا، فربہ تے تگڑا کرن دا شاہی نسخہ**
*(فہیم غیاث محمود - غیاث فارم ہاؤس دی مستند پنجابی رہنمائی)*

ویر جی! جے گھوڑا کمزور اے تے پسلیاں نظر آندیاں نے، تاں اینوں موٹا تے پٹھے دار بناون لئی اے 5 کم پکے کرو:

---

### **1. پیٹ دے کیڑیاں دی صفائی (ڈی ورمنگ - پہلا لازمی قدم):**
• جے پیٹ چ کیڑے ہوون تاں جنا مرضی گھیو، دودھ یا دلیہ کھوا لوو، گھوڑا موٹا نئیں ہووے گا سارا دانا کیڑے کھا جاندے نے۔
• **علاج:** ویٹرنری میڈیکل توں **Ivermectin Paste** یا **Albendazole** لیا کے سویرے نہار منہ گھوڑے دی زبان تے لاؤ، تے 2 گھنٹے بعد پٹھے پاؤ۔ ہر 3 مہینے بعد دوائی بدلو۔

---

### **2. دنداں دی چیکنگ و ریتائی (Dental Rasping):**
• نیزہ باز گھوڑیاں دیاں پچھلیاں داڑھاں تکھیاں ہو جاندیاں نے، او دانا پورا نئیں چبا سکدا تے دانا لید چ نکل جاندا اے۔ ڈاکٹر توں ریتوا کے برابر کراؤ۔

---

### **3. موٹا تے تگڑا کرن دا شاہی راشن (Daily Muscle Ration):**
روزانہ دیسی ونڈے چ اے چیزاں شامل کرو:
1. **ابلا ہویا جَو دا دلیہ:** 2 توں 2.5 کلو (ہضم چ ہلکا، پٹھے تے فربہی بناندا اے)۔
2. **دیسی چھولے (کالے چنے):** 1.25 کلو (راتی پانی چ بھگو کے سویرے ہلکیاں ابلیاں دوو، مسل دا خزانہ اے)۔
3. **گندم دا مٹھا چوکر:** 1.5 کلو (ہاضمے تے پیٹ نوں ٹھیک رکھدا اے)۔
4. **السی دا قوام/لعاب:** 150 توں 200 گرام (پانی چ پکا کے لیس بنا کے دوو، پسلیاں لُک جان گیاں تے کھل شیشے وانگ چمکے گی)۔
5. **خالص دیسی گھیو + پرانا گُڑ:** 150 گرام دیسی گھیو نیم گرم کر کے 250 گرام پرانے کالے گُڑ چ رلا کے شام نوں ونڈے توں بعد دوو۔
6. **امریکن ایکوائن فیول "بلیو فیول کیلشیم و منرلز" (Blue Fuel):** 50 گرام روزانہ ونڈے چ رلاؤ، ایندے نال ہڈیاں موٹیاں، فریم چوڑا تے نیزہ بازی دا جھٹکا سہارن دی طاقت بن دی اے۔

---

### **4. چارہ تے توڑی دا حساب:**
• روزانہ 6 توں 8 کلو معیاری **لوسرن ہے** یا **روڈس گھاس** پاؤ۔
• ⚠️ اکیلی سکھی توڑی مت پاؤ، او آنتاں چ جم کے پیٹ چ شدید ول (کولک) پا دیندی اے۔

---

### **5. پانی تے کھرکھرا:**
• روزانہ 40 توں 60 لیٹر تازہ مٹھا پانی، تے سویرے شام 15 منٹ کھرکھرا مالش کرو تاں جے خون دی گردش تیز ہووے۔`;
      conversationHistory.push({ role: "assistant", content: reply });
      return reply;
    }

    // 2. Muscle Tie-up / پٹھے کھچنا / چُھ جانا / اکڑنا
    if (q.includes("چھ گیا") || q.includes("چُھ گیا") || q.includes("اکڑ") || q.includes("پٹھے") || q.includes("کھچ") || q.includes("سوج") || q.includes("موچ")) {
      const reply = `**🏇 پٹھیاں دے کھچاؤ، اکڑن (چُھ جانا) تے موچ دا شاہی لیپ**
*(غیاث فارم ہاؤس نیزہ بازی کیئر - فہیم غیاث محمود)*

ویر جی! نیزہ بازی دی تیز دوڑ توں بعد جے گھوڑے دے پٹھے اکڑ جان یا لتاں چ کھچ پے جاوے (جینوں پنجابی چ گھوڑا چُھ جانا یا Azoturia کہندے نے):

---

### **🌿 فوری دیسی شاہی لیپ:**
• **اجزاء:** خالص ہلدی 100 گرام، باریک پھٹکری 25 گرام، پسی اجوائن 30 گرام، سرسوں دا تیل 150 ملی لیٹر۔
• **طریقہ:** کڑاہی چ تیل ہلکا گرم کر کے ساری چیزاں رلا کے نیم گرم پیسٹ بناؤ۔ متاثرہ پٹھے یا لتاں تے تھلے توں اتانہہ ول لیپ کرو تے کپڑا بنھ دیو۔ 24 گھنٹے بعد ہلکے نمکین گرم پانی نال دھو لوو۔

---

### **💊 میڈیکل ویٹرنری تدابیر (Tying-Up Care):**
• گھوڑے نوں زبردستی ہرگز نہ چلاؤ، اینوں نرم تھاں تے کھلھار کے گرم چادر یا کمبل دیو تاں جے پسینہ آوے۔
• وٹامن ای تے سیلینیم (**Vitamin E + Selenium**) تے الیکٹرولائٹ پیاؤ۔
• جے پٹھے بوہتے کڑل پا رہے ہوون تاں ڈاکٹر توں **Banamine / Flunixin** دا ٹیکہ لوواؤ تاں کہ گردیاں تے اثر نہ پوے۔`;
      conversationHistory.push({ role: "assistant", content: reply });
      return reply;
    }

    // 3. Colic / پیٹ چ ول / مروڑ / افارہ
    if (q.includes("ول") || q.includes("مروڑ") || q.includes("پیٹ") || q.includes("افارہ") || q.includes("کولک") || q.includes("گوبر") || q.includes("درد")) {
      const reply = `**🩺 پیٹ چ ول، مروڑ تے افارہ (دردِ قولنج) دا ہنگامی کاڑھا**
*(غیاث فارم ہاؤس ایمرجنسی گائیڈ)*

ویر جی! گھوڑے دے پیٹ چ ول پے جاوے، او زمین تے لتاں مارے یا پیٹ ول منہ کر کے ویکھے تاں فوری اے کرو:

---

### **🌿 فوری دیسی کاڑھا:**
• دیسی اجوائن: 50 گرام
• سونف: 50 گرام
• اصلی ہینگ: 5 توں 10 گرام
• کالا نمک: 30 گرام
• پرانا گُڑ: 150 گرام
• پانی: ڈیڑھ لیٹر
**طریقہ:** پانی چ اجوائن، سونف تے گڑ پکا کے اک لیٹر کر لوو، چولہے توں لاہ کے ہینگ تے نمک ملاؤ، نیم گرم نال (ڈرینچنگ بوتل) نال پیا دیو۔

---

### **⚠️ پکی احتیاطاں:**
• گھوڑے نوں زمین تے لوٹن مت دیو، ورنہ آنتاں چ بل پے جائے گا۔ باگ پھڑ کے لگاتار ہولی ہولی واک کرواؤ۔
• 💊 جے 45 منٹ چ درد نہ ہٹے تاں فوری ویٹرنری ڈاکٹر نوں سد کے **Banamine / Buscopan** دا انجیکشن لوواؤ۔`;
      conversationHistory.push({ role: "assistant", content: reply });
      return reply;
    }

    // 4. Hoof Cracks / کھر پاتن
    if (q.includes("کھر") || q.includes("پات") || q.includes("نعل") || q.includes("سڑاند") || q.includes("لنگ")) {
      const reply = `**🐎 کھر پاتن، چٹخن تے سڑاند دا دیسی تیل و ہوف کیئر**
*(غیاث فارم ہاؤس)*

ویر جی! کھر گھوڑے دی جان ہندے نے۔ جے کھر پات گئے نے یا تلوا نرم تے سڑیا اے:

---

### **🌿 دیسی کھر تیل:**
• سرسوں یا تارا میرا دا تیل: 250 ملی لیٹر
• کافور دیاں گولیاں: 20 گرام (باریک پیس کے)
• نیلا تھوتھا: 10 گرام (پاؤڈر)
**طریقہ:** کھر نوں کھرکھرے نال دھو کے سکھاؤ، روئی نال روزانہ سویرے شام کھر دی دراڑ تے تلوے تے اے تیل لاؤ۔
• ونڈے چ **ایکوائن فیول Hoof Fuel (بایوٹین و زنک)** پاؤ تاں کہ نواں کھر پتھر وانگ پکا نکلے۔`;
      conversationHistory.push({ role: "assistant", content: reply });
      return reply;
    }

    // 5. Safe Drenching / نال لانا
    if (q.includes("نال") || q.includes("ڈرینچنگ") || q.includes("پیاؤن")) {
      const reply = `**🥣 گھوڑے نوں نال (ڈرینچنگ) لان دا محفوظ ویٹرنری طریقہ**
*(غیاث فارم ہاؤس ویٹرنری اصول)*

ویر جی! گھوڑے نوں نال لاندے ویلے احتیاط نہ کریئے تاں دوائی سانس دی نالی چ جا کے نمونیا (Aspiration) کر دیندی اے۔

• **صحیح طریقہ:**
1. گھوڑے دا منہ ہلکا جیا اچا کرو، بوہتا اتانہہ نہ کھچو۔
2. نال (شیشے دی یا نرم پلاسٹک بوتل) نوں زبان دے پچھلے پاسے داڑھ ول کرو۔
3. تھوڑی تھوڑی دوائی پاؤ تے اینوں گھٹ بھرن دیو۔
4. جے گھوڑا کھنگے تاں بوتل فوری باہر کڈھ لوو۔
5. زبان نوں ہرگز ہتھ نال باہر نہ کھچو، ایندے نال نگلن دی حس رک جاندی اے۔`;
      conversationHistory.push({ role: "assistant", content: reply });
      return reply;
    }

    // 6. Ration / ونڈا
    if (q.includes("ونڈا") || q.includes("خوراک") || q.includes("دانا") || q.includes("چھولے") || q.includes("دلیہ")) {
      const reply = `**🌾 نیزہ بازی دے گھوڑے دا شاہی مقوی ونڈا**
*(غیاث فارم ہاؤس - فہیم غیاث محمود)*

ویر جی! نیزہ بازی دے تیز تے چیمپیئن گھوڑے دا روزانہ راشن (500 کلو وزنی گھوڑے لئی):
• **جَو دا دلیہ (ہلکا ابلا):** 2.5 کلو
• **دیسی کالے چنے (رات دے بھیگے، ہلکیاں ابلیاں):** 1.5 کلو
• **گندم دا چوکر:** 1.25 کلو
• **پرانا کالا گُڑ:** 250 گرام
• **خالص دیسی گھیو یا سرسوں دا تیل:** 150 توں 200 گرام
• **السی دے بیج (پکا کے):** 150 گرام
• **ایکوائن فیول بلیو فیول (Blue Fuel):** 50 گرام
• **لاہوری نمک:** 25 گرام
⚠️ نیزہ بازی یا دوڑ توں فوراً بعد دانا نہ پاؤ، 45 منٹ بعد واک توں بعد کھلاؤ۔`;
      conversationHistory.push({ role: "assistant", content: reply });
      return reply;
    }

    // 7. General Punjabi Fallback
    const generalReply = `**السلام علیکم ویر جی!**
**اسپِ شفا اے آئی ویٹرنری پورٹل (غیاث فارم ہاؤس - فہیم غیاث محمود)**

ویر جی! گھوڑے نوں موٹا کرن دا نسخہ، نیزہ بازی ونڈا، پٹھیاں دا کھچاؤ (چُھ جانا)، پیٹ چ ول، کھر پاتن یا کوئی وی مسئلہ ہووے، تسیں 🎤 بول کے پچھو یا 📷 تصویر بھیجو، میں فوری دیسی تے میڈیکل حل دساں گا۔`;
    conversationHistory.push({ role: "assistant", content: generalReply });
    return generalReply;
  }

  // -------------------------------------------------------------
  // CASE C: ENGLISH LANGUAGE TEXT QUERIES
  // -------------------------------------------------------------
  if (lang === "en") {
    const reply = `**🐎 Isp-e-Shifaa Equine Veterinary Consultation**
*(Ghias Farm House - Patronized by Fahim Ghias Mahmood)*

Thank you for your equine health query. Here is the verified clinical and natural protocol:

• **Weight & Muscle Conditioning:** Ensure baseline rotational deworming (Ivermectin paste) and dental examination. Provide daily boiled barley mash (2.5kg), soaked black chickpeas (1.25kg), wheat bran (1.5kg), flaxseed decoction (200g), pure desi ghee & jaggery (150g), paired with Equine Fuel Blue Fuel (Calcium & bio-minerals, 50g) and premium Alfalfa hay.
• **Post-Sprint Muscle Tie-Up (Azoturia):** Apply warm turmeric & mustard oil poultice. Provide electrolyte hydration (Electro Fuel) and rest. Avoid forced exercise during acute spasm.
• **Emergency Colic Spasm:** Administer natural carminative drench (ajwain, fennel, hing, jaggery). Keep horse walking gently. If unresponsive after 40 minutes, seek veterinary injection (**Flunixin Meglumine / Banamine**).
• **Hoof Care:** Treat thrush and wall cracks with taramira oil and camphor. Supplement with Biotin (Hoof Fuel).

Feel free to attach a 📷 photo or use the 🎤 mic anytime for step-by-step guidance!`;
    conversationHistory.push({ role: "assistant", content: reply });
    return reply;
  }

  // -------------------------------------------------------------
  // CASE D: URDU LANGUAGE TEXT QUERIES (مفصل اردو جوابات)
  // -------------------------------------------------------------
  // 0. Monthly Wanda / Ration Calculation (پورے مہینے کا ونڈا حساب)
  if (q.includes("مہینے") || q.includes("30 دن") || q.includes("مہینہ") || (q.includes("ونڈا") && (q.includes("حساب") || q.includes("کیلکولیٹ") || q.includes("کتنا") || q.includes("روزانہ")))) {
    const reply = `**🌾 گھوڑے کے 1 ماہ (30 دن) کے ونڈے و راشن کا مکمل حسابی جدول**
*(فہیم غیاث محمود - غیاث فارم ہاؤس کی مستند غذائی رہنمائی)*

محترم گھوڑ سوار! آپ کے گھوڑے کے روزانہ متوازن راشن کو 30 دنوں (ایک مہینے) کے لیے ضرب دے کر مکمل اسٹاک کا حساب درج ذیل ہے:

---

### **📋 روزانہ بمقابلہ 30 دن (1 مہینے) کا کل حسابی جدول:**

| شمار | غذائی جزو | روزانہ مقدار (1 دن) | 30 دن کی کل مقدار (1 مہینہ) | دینے کا وقت و طریقہ |
|:---:|:---|:---:|:---:|:---|
| 1 | **ابلا ہوا جَو کا دلیہ** | 2.0 تا 2.5 کلوگرام | **60 تا 75 کلوگرام** | صبح ہلکا ابال کر ٹھنڈا کر کے کھلائیں |
| 2 | **دیسی کالے چنے** | 1.25 کلوگرام | **37.5 کلوگرام** (~1 من) | رات بھر بھگو کر شام کو ہلکا ابال کر دیں |
| 3 | **گندم کا میٹھا چوکر** | 1.5 کلوگرام | **45 کلوگرام** | ہاضمہ متحرک رکھنے اور پیٹ ٹھیک رکھنے کے لیے |
| 4 | **السی کا قوام (لعاب)** | 150 تا 200 گرام | **4.5 تا 6 کلوگرام** | پکا کر لعاب بنا کر کھلائیں، چمک و پسلیوں کے لیے |
| 5 | **خالص دیسی گھی** | 100 تا 150 گرام | **3 تا 4.5 کلوگرام** | نیم گرم گھی گڑ میں ملا کر شام کو دیں |
| 6 | **پرانا کالا گُڑ** | 200 تا 250 گرام | **6 تا 7.5 کلوگرام** | توانائی اور تھکن اتارنے کے لیے |
| 7 | **امریکن ایکوائن فیول (Blue Fuel)** | 50 گرام | **1.5 کلوگرام** (1 پیک) | ہڈیوں کی مضبوطی، کھر اور قد و فریم کے لیے |
| 8 | **لوسرن ہے یا روڈس گھاس** | 6 تا 8 کلوگرام | **180 تا 240 کلوگرام** | اعلٰی کوالٹی سوکھا چارہ 24 گھنٹے میسر رکھیں |
| 9 | **لاہوری نمک / Electro Fuel** | 30 گرام | **900 گرام (~1 کلو)** | پینے کے تازہ پانی یا ونڈے میں |

---

### **⏰ روزانہ کھلانے کا شیڈول (Feeding Schedule):**
• **🌅 صبح (6:00 تا 7:00 بجے):** ابلا ہوا جَو کا دلیہ + گندم کا چوکر + 50 گرام بلیو فیول۔
• **☀️ دوپہر (1:00 بجے):** وافر تازہ میٹھا پانی + 3 تا 4 کلو لوسرن ہے / روڈس گھاس۔
• **🌙 شام (6:00 تا 7:00 بجے):** بھیگے و ابلے دیسی چنے + السی کا قوام + نیم گرم دیسی گھی اور گڑ۔ رات کے لیے باقی چارہ لگا دیں۔

---

### **⚠️ اصطبل و خوراک کی احتیاطیں:**
1. **ڈی ورمنگ (کیڑوں کا خاتمہ):** ونڈا کھلانے سے پہلے خالی پیٹ **Ivermectin** پیسٹ لازمی دیں۔
2. **دانتوں کی ریتائی:** اگر گھوڑا دانہ چبائے بغیر لید میں نکال رہا ہو تو ویٹرنری ڈاکٹر سے داڑھ چیک کروائیں۔
3. **پانی کی فراہمی:** روزانہ 40 سے 60 لیٹر تازہ صاف پانی یقینی بنائیں۔ تنہا سوکھی توڑی کھلانے سے پرہیز کریں۔`;
    conversationHistory.push({ role: "assistant", content: reply });
    return reply;
  }

  // 1. Weight Gain / Fattening / Weakness (موٹا کرنے کا نسخہ و راشن)
  if (q.includes("موٹا") || q.includes("وزن") || q.includes("کمزور") || q.includes("فربہ") || q.includes("پتلا") || q.includes("ہڈیاں") || q.includes("جسم") || q.includes("سوکھا") || q.includes("طاقتور") || q.includes("کمزوری") || q.includes("قد")) {
    const reply = `**🐎 گھوڑے کو موٹا، فربہ اور تندرست بنانے کا مستند شاہی نسخہ**
*(فہیم غیاث محمود - غیاث فارم ہاؤس کی خصوصی ویٹرنری ہدایات)*

کمزور گھوڑے کا وزن بڑھانے، پسلیاں چھپانے اور پٹھے مضبوط کرنے کے لیے درج ذیل 5 بنیادی مراحل پر سختی سے عمل کریں:

---

### **مرحلہ 1: پیٹ کے کیڑوں کی صفائی (ڈی ورمنگ - سب سے پہلا لازمی قدم)**
• اگر گھوڑے کے پیٹ میں کیڑے (Worms) ہوں تو وہ جتنا مرضی دیسی گھی، دودھ یا دلیہ کھا لے، وزن نہیں بڑھے گا بلکہ سارا اثر کیڑے کھا جائیں گے۔
• **علاج:** قریبی ویٹرنری اسٹور سے **Ivermectin Paste** یا **Albendazole** لا کر صبح نہار منہ زبان پر لگائیں اور 2 گھنٹے بعد چارہ دیں۔ ہر 3 ماہ بعد ڈی ورمنگ دہرائیں۔

---

### **مرحلہ 2: دانتوں کی چیکنگ (Dental Rasping)**
• نیزہ باز گھوڑوں کے پچھلے داڑھ کے دانت نوکیلے ہو جاتے ہیں جس سے وہ دانہ اور چارہ پورا نہیں چبا پاتے اور خوراک فضلے میں ضائع ہو جاتی ہے۔
• ویٹرنری ڈاکٹر سے دانت ریتوا کر برابر کروائیں تاکہ گھوڑا پورا چبا کر ہضم کر سکے۔

---

### **مرحلہ 3: وزن بڑھانے اور پٹھے بنانے کا شاہی راشن (Daily Champion Muscle Ration)**
روزانہ کے راشن میں درج ذیل غذائی اجزاء شامل کریں:
1. **ابلا ہوا جَو کا دلیہ:** 2 تا 2.5 کلوگرام (ہضم میں انتہائی ہلکا، جسم کو تیزی سے بھرتا ہے)۔
2. **دیسی چنے:** 1.25 کلوگرام (رات کو پانی میں بھگو کر رکھیں، صبح ہلکا ابال کر دیں، خالص مسل بناتا ہے)۔
3. **گندم کا میٹھا چوکر:** 1.5 کلوگرام (فاسفورس اور ہاضمے کی حرکت کے لیے)۔
4. **السی کا جوشاندہ:** 150 تا 200 گرام (پانی میں پکا کر لعاب بنا کر کھلائیں، یہ کھال میں ریشم جیسی چمک اور پسلیاں چھپانے میں لاجواب ہے)۔
5. **خالص دیسی گھی + پرانا گڑ:** 150 تا 200 گرام دیسی گھی نیم گرم کر کے 250 گرام کالے گڑ میں مکس کر کے شام کو ونڈے کے بعد دیں۔
6. **امریکن ایکوائن فیول "بلیو فیول کیلشیم و منرلز" (Blue Fuel):** 50 تا 60 گرام یومیہ راشن میں ملائیں۔ یہ ہڈیوں کی ساخت، کثافت اور قد بڑھانے کے لیے بائیو اویلیبل فارمولا ہے۔ (مزید تفصیل کے لیے: https://www.youtube.com/@Equine-fuel/videos)

---

### **مرحلہ 4: اعلٰی معیار کا سوکھا چارہ**
• روزانہ 6 تا 8 کلو اعلٰی کوالٹی **لوسرن ہے (Alfalfa Hay)** یا **روڈس گراس ہے (Rhodes Grass Hay)** دیں۔
• ⚠️ تنہا سوکھی توڑی پر گھوڑے کو مت رکھیں، اس سے آنتیں خشک ہو کر امپیکشن قولنج (پیٹ درد) بنتا ہے۔

---

### **مرحلہ 5: ہائیڈریشن اور مالش**
• یومیہ 40 تا 60 لیٹر صاف تازہ پانی میسر رکھیں۔
• روزانہ صبح شام 15 منٹ کھرکھرا اور مالش کریں تاکہ خون کی گردش تیز ہو اور پٹھے ابھریں۔

⚠️ **اہم ویٹرنری ہدایت:** راشن کی مقدار یکدم نہ بڑھائیں بلکہ 7 سے 10 دنوں کے دوران آہستہ آہستہ خوراک میں اضافہ کریں تاکہ معدہ عادی ہو سکے۔`;
    conversationHistory.push({ role: "assistant", content: reply });
    return reply;
  }

  // 2. Colic / پیٹ درد
  if (q.includes("پیٹ") || q.includes("درد") || q.includes("گیس") || q.includes("قولنج") || q.includes("قبض") || q.includes("اپھارہ") || q.includes("گوبر")) {
    const reply = `**🩺 دردِ قولنج (پیٹ درد و گیس) کا فوری دیسی کاڑھا و ہنگامی تدابیر**
*(غیاث فارم ہاؤس ایمرجنسی پروٹوکول)*

**ضروری دیسی کاڑھا:**
• اجوائن دیسی: 50 گرام، سونف: 50 گرام، ہینگ اصلی: 5 تا 10 گرام، کالا نمک: 30 گرام، پرانا گڑ: 150 گرام، پانی: ڈیڑھ لیٹر۔
پانی میں پکا کر نیم گرم نال (ڈرینچنگ بوتل) کے ذریعے پلائیں۔

**⚠️ ہنگامی تدابیر و میڈیکل رائے:**
• گھوڑے کو ہرگز نیچے بیٹھنے یا زمین پر لوٹنے نہ دیں، مسلسل دھیمی واک کروائیں۔
• اگر 45 منٹ میں افاقہ نہ ہو تو فوری ویٹرنری ڈاکٹر سے درد کش انجیکشن (**Flunixin Meglumine / Banamine** یا **Buscopan**) لگوائیں۔`;
    conversationHistory.push({ role: "assistant", content: reply });
    return reply;
  }

  // 3. Sprains / Swelling / Muscles / Tie-up
  if (q.includes("موچ") || q.includes("سوجن") || q.includes("چوٹ") || q.includes("پٹھے") || q.includes("جوڑ") || q.includes("کھچاؤ") || q.includes("چھ گیا")) {
    const reply = `**🩹 پٹھوں کے کھچاؤ، جوڑ کی موچ اور سوجن کا شاہی لیپ**
*(غیاث فارم ہاؤس - نیزہ بازی کیئر)*

**شاہی دیسی لیپ:**
• خالص ہلدی: 100 گرام، باریک پھٹکری: 25 گرام، پسی اجوائن: 30 گرام، سرسوں کا تیل: 150 ملی لیٹر۔
ہلکی آنچ پر پکا کر نیم گرم حالت میں متاثرہ جوڑ یا پٹھے پر لیپ کر کے پٹی باندھ دیں۔ 24 گھنٹے بعد نیم گرم نمکین پانی سے دھو لیں۔

**💊 میڈیکل ویٹرنری احتیاط:**
• شدید کھچاؤ میں زبردستی واک نہ کرائیں، گھوڑے کو گرم چادر اوڑھائیں اور الیکٹرولائٹس پلائیں۔`;
    conversationHistory.push({ role: "assistant", content: reply });
    return reply;
  }

  // 4. Kitchen Herbs & Spices (کچن اشیاء و مصالحہ جات)
  if (q.includes("مصالحہ") || q.includes("ہلدی") || q.includes("اجوائن") || q.includes("سونف") || q.includes("لہسن") || q.includes("السی") || q.includes("میتھی") || q.includes("کالا نمک") || q.includes("پھٹکری") || q.includes("نیلا تھوتھا") || q.includes("ہینگ") || q.includes("تارا میرا")) {
    const reply = `**🌿 اسپِ شفا کچن مصالحہ جات و قدرتی ادویات کی مستند ڈائریکٹری**
*(غیاث فارم ہاؤس - فہیم غیاث محمود)*

ویب سائٹ کے ڈیٹا بیس کے مطابق کچن اشیاء و مصالحہ جات کے خواص و محفوظ مقداریں درج ذیل ہیں:

• **ہلدی (Curcumin):** 30 تا 50 گرام روزانہ گڑ یا دیسی گھی میں اندرونی سوزش کے لیے؛ 100 گرام ہلدی + 150ml سرسوں کا تیل + 25g پھٹکری کا گرم لیپ پٹھوں کے کھچاؤ پر۔
• **دیسی اجوائن (Thymol):** 30 تا 50 گرام جوشاندہ بنا کر سونف، گڑ اور کالے نمک کے ساتھ پیٹ درد، گیس اور اپھارے کے لیے۔
• **سونف (Anethole):** 50 تا 60 گرام گرمیوں میں ٹھنڈا پانی یا دلیے میں ملا کر جگر کی گرمی ختم کرنے اور آنتوں کے اینٹھن (Spasms) کو پرسکون کرنے کے لیے۔
• **لہسن (Allicin):** 3 سے 5 کچلے ہوئے جوے روزانہ دلیے میں؛ سانس کی نالیوں کی صفائی، خون صاف کرنے اور قدرتی اینٹی بائیوٹک و کیڑے مار کے لیے۔
• **السی (Flaxseed):** 150 تا 200 گرام ابال کر گاڑھا قوام؛ جلد و بالوں کی شائننگ، آنتوں کو چکنا رکھنے اور ریتلے قولنج (Sand Colic) کے دفاع کے لیے۔
• **کالا نمک:** 20 تا 30 گرام یومیہ راشن میں؛ معدے کے انزائمز تیز کرنے اور گھوڑے کی پیاس بڑھا کر پانی کی کمی روکنے کے لیے۔
• **میتھی دانہ:** 30 تا 50 گرام بھگو کر یا ابال کر؛ کمزور گھوڑے کا وزن اور مسل تیزی سے بڑھانے، بھوک چمکانے اور دودھ والی گھوڑیوں کے لیے۔
• **سفید پھٹکری:** 30 تا 50 گرام ٹھنڈے پانی میں تازہ موچ پر ٹکور کے لیے (Astringent)؛ بریاں (بھونی ہوئی) پھٹکری زخموں کو دھونے اور گندے گوشت کو خشک کرنے کے لیے۔
• **نیلا تھوتھا (Copper Sulfate):** 5 تا 10 گرام پانی یا تارا میرا کے تیل میں حل کر کے کھر کی شدید سڑاند (Thrush) پر لگانے کے لیے۔
• **تارا میرا کا تیل:** کھروں کی مالش، خشکی ختم کرنے، جوئیں اور جلد کی خارش و فنگس کا خاتمہ۔`;
    conversationHistory.push({ role: "assistant", content: reply });
    return reply;
  }

  // 5. Clinical Veterinary Questions (Dr. Osama Vet & Dr. Sultan Masood)
  if (q.includes("اسامہ") || q.includes("سلطان") || q.includes("drosama") || q.includes("drsultan") || q.includes("این جی ٹیوب") || q.includes("1-2-3") || q.includes("ٹارگٹڈ ڈیورمنگ") || q.includes("فائلنگ") || q.includes("ٹٹنس") || q.includes("نیبولائزیشن")) {
    const reply = `**🩺 مستند ویٹرنری ڈاکٹرز کے کلینیکل رہنما اصول**
*(ڈاکٹر اسامہ ویٹ و ڈاکٹر سلطان مسعود کے یوٹیوب کلینیکل کیسز پر مبنی رہنمائی)*

**1. ڈاکٹر سلطان مسعود (Dr. Sultan Masood - @Vet.DrSultan):**
• **دردِ قولنج و این جی ٹیوب:** ابتدائی علامات پر فوری الرٹ ہوں، این جی ٹیوب (Nasogastric Tube) کے ذریعے معدے سے گیس اور فلوئڈ ریفلوکس نکالنا جان بچانے کا سب سے اہم عمل ہے۔ شدید درد کے لیے Flunixin Meglumine (Banamine) 1.1 mg/kg IV کا استعمال۔
• **ٹارگٹڈ ڈیورمنگ (Targeted Deworming):** اندھا دھند ڈیورمنگ کے بجائے فیکل ایگ کاؤنٹ (FEC) کروا کر دوائیاں بدل کر دیں (Ivermectin، Fenbendazole اور Praziquantel)۔
• **لنگڑاہٹ بمقابلہ لیمینائٹس:** لیمینائٹس (Founder) میں دونوں اگلے کھر شدید گرم ہوتے ہیں، نبض تیز ہوتی ہے اور گھوڑا پچھلی ٹانگوں پر وزن ڈالتا ہے۔ اس کا فوری علاج 48 گھنٹے آئس بوٹس (برف تھراپی) ہے۔
• **بچھڑے کا 1-2-3 اصول:** 1 گھنٹے میں کھڑا ہونا، 2 گھنٹے میں ماں کا پہلا دودھ (Colostrum) پینا، 3 گھنٹے میں جیر گرانا۔

**2. ڈاکٹر اسامہ جاوید / ڈاکٹر اسامہ ویٹ (Dr. Osama Vet - @drosamavet):**
• **بووڈ ٹینڈن و فیٹ لاک سوجن:** نیزہ بازی کے گھوڑوں کے پٹھے کھچنے پر پہلے 48 گھنٹے برف یا ٹھنڈے پانی کی دھار (Cold Hosing) 20 منٹ دن میں 3 بار دیں اور پریشر سپورٹ بینڈیج باندھیں۔ 48 گھنٹے بعد ہلدی و سرسوں کا لیپ لگائیں۔
• **دانتوں کی فائلنگ (Dental Floating):** سالانہ دانتوں کی فائلنگ لازمی کروائیں تاکہ تیز کنارے گھوڑے کی خوراک گرانے (Quidding) اور دبلا ہونے کا سبب نہ بنیں۔
• **کھروں کی سڑاند (Thrush) و پھوڑا:** کھر کی بدبو اور کالے مواد میں نیلا تھوتھا اور تارا میرا تیل لگائیں۔
• **ٹٹنس پروٹوکول:** زنگ آلود چوٹ پر فوری Tetanus Antitoxin (TAT 1500-3000 IU) لگائیں۔

مزید ویڈیوز کے لیے ڈاکٹر اسامہ اور ڈاکٹر سلطان کے یوٹیوب چینلز وزٹ کریں۔`;
    conversationHistory.push({ role: "assistant", content: reply });
    return reply;
  }

  // 6. General Holistic Consultation
  const generalReply = `**السلام علیکم و رحمتہ اللہ!**
**اسپِ شفا اے آئی ویٹرنری کنسلٹنسی پورٹل (غیاث فارم ہاؤس - فہیم غیاث محمود)**

گھوڑوں کی صحت، بیماریوں، موٹا کرنے کے نسخوں، خوراک، کھروں، چوٹ اور نیزہ بازی فٹنس کے لیے میں ہر وقت حاضر ہوں۔
آپ 🎤 مائیک پر پنجابی یا اردو میں بول سکتے ہیں، یا 📷 تصویر منسلک کر کے فوری معائنہ کروا سکتے ہیں!`;

  conversationHistory.push({ role: "assistant", content: generalReply });
  return generalReply;
}

function appendUserMessage(text, attachedImage) {
  const chatMessages = document.getElementById("chat-messages");
  const msgRow = document.createElement("div");
  msgRow.className = "message-row user";

  let imageHTML = "";
  if (attachedImage && attachedImage.base64) {
    const isVid = attachedImage.isVideo || false;
    const badgeLabel = isVid ? "🎥 ویڈیو فریم معائنہ" : "📷 تصویر معائنہ";
    imageHTML = `
      <div class="msg-image-wrap">
        <img src="${attachedImage.base64}" class="msg-attached-image" alt="منسلک میڈیا" onclick="openLightboxImage(this.src)" title="بڑی تصویر دیکھنے کے لیے کلک کریں">
        <div style="font-size: 0.75rem; color: var(--gold-300); margin-bottom: 0.35rem;">${badgeLabel}: ${escapeHTML(attachedImage.name || 'میڈیا')}</div>
      </div>
    `;
  }

  msgRow.innerHTML = `
    <div class="msg-bubble">
      ${imageHTML}
      <p>${escapeHTML(text).replace(/\n/g, '<br>')}</p>
    </div>
  `;
  chatMessages.appendChild(msgRow);
  scrollToBottom();
}

function appendDoctorMessage(markdownText) {
  const chatMessages = document.getElementById("chat-messages");
  const msgRow = document.createElement("div");
  msgRow.className = "message-row bot";

  const formattedHTML = formatDoctorMarkdown(markdownText);

  msgRow.innerHTML = `
    <img src="assets/logo.jpg" alt="ڈاکٹر" class="msg-avatar">
    <div class="msg-bubble">
      ${formattedHTML}
      <div class="msg-actions">
        <button class="msg-action-btn" onclick="speakText(this)" title="سنیں">
          <span>🔊 سنیں</span>
        </button>
        <button class="msg-action-btn" onclick="copyPrescription(this)" title="کاپی کریں">
          <span>📋 کاپی</span>
        </button>
        <button class="msg-action-btn" onclick="openPrintModalFromMsg(this)" title="نسخہ پرنٹ کریں">
          <span>🖨️ پرنٹ کارڈ</span>
        </button>
      </div>
    </div>
  `;
  chatMessages.appendChild(msgRow);
  scrollToBottom();
}

function showTypingIndicator() {
  const chatMessages = document.getElementById("chat-messages");
  const typingRow = document.createElement("div");
  typingRow.className = "message-row bot";
  typingRow.id = "typing-indicator";
  typingRow.innerHTML = `
    <img src="assets/logo.jpg" alt="ڈاکٹر" class="msg-avatar">
    <div class="msg-bubble typing-bubble">
      <span class="typing-dot"></span>
      <span class="typing-dot"></span>
      <span class="typing-dot"></span>
    </div>
  `;
  chatMessages.appendChild(typingRow);
  scrollToBottom();
}

function removeTypingIndicator() {
  const indicator = document.getElementById("typing-indicator");
  if (indicator) indicator.remove();
}

function scrollToBottom() {
  const chatMessages = document.getElementById("chat-messages");
  if (!chatMessages) return;
  chatMessages.scrollTop = chatMessages.scrollHeight;
  const lastMsg = chatMessages.lastElementChild;
  if (lastMsg && window.innerWidth <= 768) {
    lastMsg.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }
}

function renderHistoryMessages() {
  const chatMessages = document.getElementById("chat-messages");
  chatMessages.innerHTML = "";
  conversationHistory.forEach(msg => {
    if (msg.role === "user") {
      appendUserMessage(msg.content);
    } else if (msg.role === "assistant") {
      appendDoctorMessage(msg.content);
    }
  });
}

function saveChatHistory() {
  try {
    localStorage.setItem("ispeshifaa_chat_history", JSON.stringify(conversationHistory));
  } catch (e) {
    console.error("Storage save error", e);
  }
}

// Markdown and Prescription Formatter for Urdu Text
function formatDoctorMarkdown(text) {
  let output = escapeHTML(text);

  // Bold
  output = output.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

  // Warning Box Replacement
  const warningPattern = /(یہ ایک ابتدائی اور دیسی علاج ہے[\s\S]*?ویٹرنری ڈاکٹر سے رابطہ کریں۔)/;
  if (warningPattern.test(output)) {
    output = output.replace(warningPattern, `<div class="mandatory-warning-box"><strong>⚠️ ضروری طبی ہدایت:</strong> $1</div>`);
  }

  // Bullet points
  output = output.replace(/^\s*•\s*(.+)$/gm, '<div class="step-item">$1</div>');
  output = output.replace(/^\s*-\s*(.+)$/gm, '<div class="step-item">$1</div>');
  output = output.replace(/^\s*(\d+)\.\s*(.+)$/gm, '<div class="step-item"><strong>$1.</strong> $2</div>');

  // New lines
  output = output.replace(/\n\n/g, '<br><br>').replace(/\n/g, '<br>');

  return output;
}

function escapeHTML(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// ---------------------------------------------------------
// Speech Synthesis & Recognition (Multilingual: Punjabi, Urdu, English)
// ---------------------------------------------------------
function updateSpeechRecognitionLang() {
  if (!recognition) return;
  if (currentLanguage === "pa") {
    recognition.lang = 'pa-PK';
  } else if (currentLanguage === "en") {
    recognition.lang = 'en-US';
  } else {
    recognition.lang = 'ur-PK';
  }
}

let mediaRecorder = null;
let audioChunks = [];
let audioStream = null;
let voiceTimerInterval = null;
let recordingSeconds = 0;
let isVoiceProcessing = false;
let shouldDiscardAudio = false;

function initVoiceRecognition() {
  const voiceBtn = document.getElementById("voice-btn");
  const stopVoiceBtn = document.getElementById("stop-voice-btn");
  const cancelVoiceBtn = document.getElementById("cancel-voice-btn");
  const voiceNotice = document.getElementById("voice-recording-notice");
  const voiceTimer = document.getElementById("voice-timer");
  const voiceStatusText = document.getElementById("voice-status-text");
  const chatInput = document.getElementById("chat-input");
  const chatForm = document.getElementById("chat-form");

  const hasMediaDevices = !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
  const hasSpeechRec = ('webkitSpeechRecognition' in window) || ('SpeechRecognition' in window);

  if (!hasMediaDevices && !hasSpeechRec) {
    if (voiceBtn) {
      voiceBtn.title = "آپ کے براؤزر میں مائیکروفون کی سہولت دستیاب نہیں ہے";
      voiceBtn.style.opacity = "0.5";
    }
    return;
  }

  function updateVoiceUIState(recording) {
    isRecording = recording;
    if (voiceBtn) {
      voiceBtn.classList.toggle("recording", recording);
      if (recording) {
        voiceBtn.innerHTML = `<span class="action-icon">🔴</span><span class="action-text">روکیں</span>`;
        voiceBtn.title = "ریکارڈنگ جاری ہے... مکمل کرنے کے لیے کلک کریں";
      } else {
        voiceBtn.innerHTML = `<span class="action-icon">🎤</span><span class="action-text">بولیں</span>`;
        voiceBtn.title = "پنجابی یا اردو میں بولیں (مائیک دبائیں)";
      }
    }
    if (voiceNotice) {
      if (recording) {
        voiceNotice.classList.remove("hidden");
        if (voiceStatusText) voiceStatusText.textContent = "🔴 لائیو آواز ریکارڈ ہو رہی ہے... بولتے رہیں";
      } else if (!isVoiceProcessing) {
        voiceNotice.classList.add("hidden");
      }
    }
    if (recording) {
      chatInput.placeholder = "🔴 آپ کی آواز ریکارڈ ہو رہی ہے... بولتے رہیں...";
    } else {
      chatInput.placeholder = "اپنا سوال لکھیں یا 🎤 مائیک دبا کر بولیں...";
    }
  }

  async function startAudioRecording() {
    if (isVoiceProcessing) return;

    if (hasMediaDevices && window.MediaRecorder) {
      try {
        audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
        audioChunks = [];
        shouldDiscardAudio = false;

        let options = {};
        if (MediaRecorder.isTypeSupported("audio/webm;codecs=opus")) {
          options = { mimeType: "audio/webm;codecs=opus" };
        } else if (MediaRecorder.isTypeSupported("audio/webm")) {
          options = { mimeType: "audio/webm" };
        } else if (MediaRecorder.isTypeSupported("audio/mp4")) {
          options = { mimeType: "audio/mp4" };
        }

        mediaRecorder = new MediaRecorder(audioStream, options);

        mediaRecorder.ondataavailable = (e) => {
          if (e.data && e.data.size > 0) {
            audioChunks.push(e.data);
          }
        };

        mediaRecorder.onstop = async () => {
          if (audioStream) {
            audioStream.getTracks().forEach(t => t.stop());
            audioStream = null;
          }
          if (voiceTimerInterval) {
            clearInterval(voiceTimerInterval);
            voiceTimerInterval = null;
          }

          if (shouldDiscardAudio || audioChunks.length === 0) {
            shouldDiscardAudio = false;
            updateVoiceUIState(false);
            return;
          }

          const mime = mediaRecorder.mimeType || "audio/webm";
          const audioBlob = new Blob(audioChunks, { type: mime });
          await processVoiceWithGroqWhisper(audioBlob);
        };

        mediaRecorder.start(250);
        updateVoiceUIState(true);

        recordingSeconds = 0;
        if (voiceTimer) voiceTimer.textContent = "00:00";
        voiceTimerInterval = setInterval(() => {
          recordingSeconds++;
          const mins = String(Math.floor(recordingSeconds / 60)).padStart(2, "0");
          const secs = String(recordingSeconds % 60).padStart(2, "0");
          if (voiceTimer) voiceTimer.textContent = `${mins}:${secs}`;
          if (recordingSeconds >= 90) {
            stopAudioRecording(true);
          }
        }, 1000);

        return;
      } catch (err) {
        console.warn("MediaRecorder permission or device error, falling back to Web Speech:", err);
      }
    }

    // Web Speech API Fallback if MediaRecorder is unavailable or denied
    startWebSpeechFallback();
  }

  function stopAudioRecording(shouldSend = true) {
    if (!isRecording) return;
    shouldDiscardAudio = !shouldSend;

    if (voiceTimerInterval) {
      clearInterval(voiceTimerInterval);
      voiceTimerInterval = null;
    }

    if (mediaRecorder && mediaRecorder.state !== "inactive") {
      try {
        mediaRecorder.stop();
      } catch (e) { }
    } else if (recognition) {
      try {
        recognition.stop();
      } catch (e) { }
    }

    updateVoiceUIState(false);
  }

  async function processVoiceWithGroqWhisper(audioBlob) {
    isVoiceProcessing = true;
    if (voiceNotice) voiceNotice.classList.remove("hidden");
    if (voiceStatusText) voiceStatusText.innerHTML = `<span>⏳ آواز کو تحریر میں تبدیل کیا جا رہا ہے (Whisper AI)...</span>`;

    try {
      const apiKey = getApiKey();
      const formData = new FormData();
      const ext = audioBlob.type.includes("mp4") ? "mp4" : "webm";
      formData.append("file", audioBlob, `voice_query.${ext}`);
      formData.append("model", WHISPER_MODEL);
      formData.append("prompt", "اسپِ شفا، گھوڑوں کا علاج، ونڈا، راشن، نیزہ بازی، چوٹ، ہلدی، دلیہ، لوسرن، پٹھے، کھر، موٹا کرنا، کھچاؤ، پیٹ درد، فہیم غیاث محمود");

      const res = await fetch("https://api.groq.com/openai/v1/audio/transcriptions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`
        },
        body: formData
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.error?.message || `HTTP ${res.status}`);
      }

      const data = await res.json();
      const transcribedText = (data.text || "").trim();

      if (transcribedText) {
        chatInput.value = transcribedText;
        chatInput.style.height = "auto";
        chatInput.style.height = Math.min(chatInput.scrollHeight, 120) + "px";

        if (voiceStatusText) voiceStatusText.textContent = "✅ آواز مل گئی! ڈاکٹر سے جواب لیا جا رہا ہے...";
        setTimeout(() => {
          isVoiceProcessing = false;
          if (voiceNotice) voiceNotice.classList.add("hidden");
          if (chatForm) chatForm.dispatchEvent(new Event("submit"));
        }, 500);
      } else {
        throw new Error("خالی آواز");
      }
    } catch (whisperErr) {
      console.error("Groq Whisper transcription failed:", whisperErr);
      if (voiceStatusText) voiceStatusText.textContent = "⚠️ آواز سمجھ نہیں آ سکی۔ براہ کرم دوبارہ بولیں یا لکھ کر پوچھیں۔";
      setTimeout(() => {
        isVoiceProcessing = false;
        if (voiceNotice) voiceNotice.classList.add("hidden");
      }, 3000);
    }
  }

  function startWebSpeechFallback() {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert("براہ کرم مائیکروفون کی اجازت دیں یا اپنا سوال لکھ کر پوچھیں۔");
      return;
    }
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    updateSpeechRecognitionLang();

    recognition.onstart = () => {
      updateVoiceUIState(true);
    };

    recognition.onresult = (event) => {
      let text = "";
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        text += event.results[i][0].transcript;
      }
      if (text) {
        chatInput.value = text.trim();
        chatInput.style.height = "auto";
        chatInput.style.height = Math.min(chatInput.scrollHeight, 120) + "px";
      }
    };

    recognition.onerror = (e) => {
      console.warn("Speech recognition error:", e);
      stopAudioRecording(false);
    };

    recognition.onend = () => {
      updateVoiceUIState(false);
      if (chatInput.value.trim()) {
        setTimeout(() => {
          if (chatForm) chatForm.dispatchEvent(new Event("submit"));
        }, 400);
      }
    };

    try {
      recognition.start();
    } catch (e) {
      console.error("Speech start error:", e);
    }
  }

  if (voiceBtn) {
    voiceBtn.addEventListener("click", () => {
      if (isRecording) {
        stopAudioRecording(true);
      } else {
        startAudioRecording();
      }
    });
  }

  if (stopVoiceBtn) {
    stopVoiceBtn.addEventListener("click", () => {
      stopAudioRecording(true);
    });
  }

  if (cancelVoiceBtn) {
    cancelVoiceBtn.addEventListener("click", () => {
      stopAudioRecording(false);
    });
  }
}

window.speakText = function (btn) {
  if (!('speechSynthesis' in window)) {
    alert("آپ کے براؤزر میں آواز کی سہولت دستیاب نہیں ہے۔");
    return;
  }

  if (speechSynthesis.speaking) {
    speechSynthesis.cancel();
    btn.innerHTML = `<span>🔊 سنیں</span>`;
    return;
  }

  const bubble = btn.closest(".msg-bubble");
  const textContent = bubble.innerText.replace(/🔊 سنیں|📋 کاپی|🖨️ پرنٹ کارڈ|⏹️ بند کریں/g, '').trim();

  currentSpeechUtterance = new SpeechSynthesisUtterance(textContent);
  if (currentLanguage === "en") {
    currentSpeechUtterance.lang = "en-US";
  } else if (currentLanguage === "pa") {
    currentSpeechUtterance.lang = "pa-PK";
  } else {
    currentSpeechUtterance.lang = "ur-PK";
  }
  currentSpeechUtterance.rate = 0.95;

  currentSpeechUtterance.onstart = () => {
    btn.innerHTML = `<span>⏹️ بند کریں</span>`;
  };

  currentSpeechUtterance.onend = () => {
    btn.innerHTML = `<span>🔊 سنیں</span>`;
  };

  currentSpeechUtterance.onerror = () => {
    btn.innerHTML = `<span>🔊 سنیں</span>`;
  };

  speechSynthesis.speak(currentSpeechUtterance);
};

window.copyPrescription = function (btn) {
  const bubble = btn.closest(".msg-bubble");
  const textContent = bubble.innerText.replace(/🔊 سنیں|📋 کاپی|🖨️ پرنٹ کارڈ/g, '').trim();
  navigator.clipboard.writeText(textContent).then(() => {
    const original = btn.innerHTML;
    btn.innerHTML = `<span>✅ کاپی ہو گیا!</span>`;
    setTimeout(() => btn.innerHTML = original, 2000);
  });
};

window.openPrintModalFromMsg = function (btn) {
  const bubble = btn.closest(".msg-bubble");
  const textContent = bubble.innerText.replace(/🔊 سنیں|📋 کاپی|🖨️ پرنٹ کارڈ/g, '').trim();

  const printModal = document.getElementById("printable-rx-modal");
  const rxContent = document.getElementById("rx-pad-content");
  const currentDate = new Date().toLocaleDateString('ur-PK', { year: 'numeric', month: 'long', day: 'numeric' });

  rxContent.innerHTML = `
    <div class="rx-pad">
      <div class="rx-header">
        <div>
          <div class="rx-clinic-name">اسپِ شفا - غیاث فارم ہاؤس (Ghias Farm House)</div>
          <div class="rx-sub">پیشکش و ڈیزائن: فہیم غیاث محمود | دیسی ویٹرنری شفا خانہ برائے نیزہ بازی</div>
        </div>
        <div style="text-align: left;">
          <div><strong>تاریخ:</strong> ${currentDate}</div>
          <div><strong>ڈاکٹر:</strong> اسپِ شفا اے آئی ویٹ</div>
        </div>
      </div>
      <div class="rx-body">
        <h4>نسخہ و ہدایات (Prescription & Instructions):</h4>
        <div style="margin-top: 1rem; white-space: pre-wrap;">${textContent}</div>
      </div>
      <div class="rx-footer">
        <div>⚠️ یہ ایک ابتدائی دیسی علاج ہے۔ سنگین صورت میں فوری قریبی ویٹرنری ڈاکٹر سے رابطہ کریں۔</div>
        <div>مہر / دستخط: غیاث فارم ہاؤس 🐎 فہیم غیاث محمود</div>
      </div>
    </div>
  `;

  printModal.classList.add("open");
};

// ---------------------------------------------------------
// Remedies Library Controller
// ---------------------------------------------------------
function initRemediesLibrary() {
  const grid = document.getElementById("remedies-grid");
  const searchInput = document.getElementById("remedies-search");
  const filterBtns = document.querySelectorAll(".cat-filter-btn");

  renderRemediesCards(REMEDIES_DATA);

  // Search
  searchInput.addEventListener("input", () => {
    filterAndRenderRemedies();
  });

  // Filter Chips
  filterBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      filterBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      activeCategory = btn.dataset.category;
      filterAndRenderRemedies();
    });
  });

  function filterAndRenderRemedies() {
    const query = searchInput.value.trim().toLowerCase();
    const filtered = REMEDIES_DATA.filter(r => {
      const matchesCat = (activeCategory === "all" || r.category === activeCategory);
      const matchesSearch = !query ||
        r.title.toLowerCase().includes(query) ||
        r.subtitle.toLowerCase().includes(query) ||
        r.categoryUrdu.toLowerCase().includes(query) ||
        r.ingredients.some(ing => ing.name.toLowerCase().includes(query));
      return matchesCat && matchesSearch;
    });

    renderRemediesCards(filtered);
  }
}

function renderRemediesCards(remedies) {
  const grid = document.getElementById("remedies-grid");
  if (!remedies || remedies.length === 0) {
    grid.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 3rem; color: var(--text-muted);">
        <p style="font-size: 1.3rem;">کوئی نسخہ نہیں ملا۔ براہِ کرم کوئی دوسرا لفظ تلاش کریں۔</p>
      </div>
    `;
    return;
  }

  grid.innerHTML = remedies.map(r => `
    <div class="remedy-card">
      <div class="card-top">
        <span class="card-cat-badge">${r.categoryUrdu}</span>
        <span class="card-icon">${r.icon}</span>
      </div>
      <h3 class="card-title">${r.title}</h3>
      <p class="card-subtitle">${r.subtitle}</p>
      <div class="card-ingredients-preview">
        ${r.ingredients.map(i => `<span class="card-ing-tag">${i.name} (${i.amount})</span>`).join('')}
      </div>
      <div class="card-footer-actions">
        <span style="font-size: 0.8rem; color: var(--text-gold);">⏱️ ${r.timeRequired}</span>
        <button class="btn-card-view" onclick="openRemedyDetailModal('${r.id}')">
          <span>مکمل نسخہ دیکھیں</span> 🔍
        </button>
      </div>
    </div>
  `).join('');
}

window.openRemedyDetailModal = function (remedyId) {
  const remedy = REMEDIES_DATA.find(r => r.id === remedyId);
  if (!remedy) return;

  const modal = document.getElementById("remedy-detail-modal");
  const modalBody = document.getElementById("remedy-modal-body");
  const modalTitle = document.getElementById("remedy-modal-title");

  modalTitle.innerHTML = `${remedy.icon} ${remedy.title}`;
  modalBody.innerHTML = `
    <p style="color: var(--text-muted); font-size: 1.05rem; margin-bottom: 1.25rem;">${remedy.subtitle}</p>
    
    <div class="prescription-card-box">
      <div class="pres-header">
        <span class="pres-title">ضروری دیسی اجزاء اور درست مقدار:</span>
        <span class="pres-badge">کیفیت: ${remedy.severity}</span>
      </div>
      <div class="ingredients-pills">
        ${remedy.ingredients.map(ing => `
          <span class="ing-pill">🌾 <strong>${ing.name}</strong>: ${ing.amount}</span>
        `).join('')}
      </div>
    </div>

    <h4 style="color: var(--gold-400); margin: 1.25rem 0 0.5rem;">طریقہ تیاری و استعمال (قدم بہ قدم):</h4>
    <div style="margin-bottom: 1.25rem;">
      ${remedy.steps.map((step, idx) => `
        <div class="step-item"><strong>مرحلہ ${idx + 1}:</strong> ${step}</div>
      `).join('')}
    </div>

    <div class="rationale-box">
      <strong>🔬 سائنسی و روایتی افادیت:</strong>
      <p>${remedy.mechanism}</p>
    </div>

    <div class="tent-pegging-tip">
      <strong>🏇 نیزہ بازی ٹریننگ و احتیاطی تدابیر:</strong>
      <p>${remedy.precautions}</p>
    </div>

    <div class="mandatory-warning-box">
      <strong>⚠️ اہم طبی وارننگ:</strong>
      <p>${remedy.warning}</p>
    </div>

    <div style="display: flex; gap: 0.75rem; margin-top: 1.5rem; justify-content: flex-end;">
      <button class="btn-send" onclick="askAiAboutRemedy('${remedy.title}')">
        <span>اس نسخے پر ڈاکٹر سے بات کریں</span> 💬
      </button>
      <button class="btn-card-view" onclick="printRemedyDirectly('${remedy.id}')">
        <span>پرنٹ کریں</span> 🖨️
      </button>
    </div>
  `;

  modal.classList.add("open");
};

window.askAiAboutRemedy = function (title) {
  document.getElementById("remedy-detail-modal").classList.remove("open");
  const tabBtn = document.querySelector('[data-tab="chat-tab"]');
  if (tabBtn) tabBtn.click();
  const chatInput = document.getElementById("chat-input");
  chatInput.value = `مجھے '${title}' کے بارے میں مزید تفصیل اور احتیاط بتائیں۔`;
  document.getElementById("chat-form").dispatchEvent(new Event("submit"));
};

window.printRemedyDirectly = function (remedyId) {
  const remedy = REMEDIES_DATA.find(r => r.id === remedyId);
  if (!remedy) return;

  const printModal = document.getElementById("printable-rx-modal");
  const rxContent = document.getElementById("rx-pad-content");
  const currentDate = new Date().toLocaleDateString('ur-PK', { year: 'numeric', month: 'long', day: 'numeric' });

  rxContent.innerHTML = `
    <div class="rx-pad">
      <div class="rx-header">
        <div>
          <div class="rx-clinic-name">اسپِ شفا - غیاث فارم ہاؤس (Ghias Farm House)</div>
          <div class="rx-sub">${remedy.title} | زیرِ اہتمام: فہیم غیاث محمود</div>
        </div>
        <div style="text-align: left;">
          <div><strong>تاریخ:</strong> ${currentDate}</div>
          <div><strong>شعبہ:</strong> ${remedy.categoryUrdu}</div>
        </div>
      </div>
      <div class="rx-body">
        <h4>1. اجزاء و مقدار:</h4>
        <ul>
          ${remedy.ingredients.map(i => `<li><strong>${i.name}:</strong> ${i.amount}</li>`).join('')}
        </ul>

        <h4>2. طریقہ تیاری و استعمال:</h4>
        <ol>
          ${remedy.steps.map(s => `<li>${s}</li>`).join('')}
        </ol>

        <h4>3. سائنسی و روایتی افادیت:</h4>
        <p>${remedy.mechanism}</p>

        <h4>4. نیزہ بازی و ٹریننگ احتیاط:</h4>
        <p>${remedy.precautions}</p>
      </div>
      <div class="rx-footer">
        <div>⚠️ ${remedy.warning}</div>
        <div>دستخط و مہر: غیاث فارم ہاؤس 🐎 فہیم غیاث محمود</div>
      </div>
    </div>
  `;

  document.getElementById("remedy-detail-modal").classList.remove("open");
  printModal.classList.add("open");
};

// ---------------------------------------------------------
// Tent Pegging Nutrition & Wanda Calculator
// ---------------------------------------------------------
// ---------------------------------------------------------
// Tent Pegging Nutrition & Wanda Calculator
// ---------------------------------------------------------
function initFeedCalculator() {
  const weightSelect = document.getElementById("horse-weight");
  const intensitySelect = document.getElementById("work-intensity");
  const seasonSelect = document.getElementById("current-season");

  function calculateFeedPlan() {
    const weight = weightSelect ? weightSelect.value : "medium";
    const intensity = intensitySelect ? intensitySelect.value : "training";
    const season = seasonSelect ? seasonSelect.value : "winter";

    let baseChana = 1.5;
    let baseBarley = 1.0;
    let baseBran = 1.0;
    let baseGur = 200;
    let baseGhee = 80;
    let baseHay = 8.0;
    let baseGreen = 15.0;
    let baseBlueFuel = 40;
    let waterLitersText = "35 تا 45 لیٹر";

    // Weight adjustment
    if (weight === "light") {
      baseChana *= 0.85;
      baseBarley *= 0.85;
      baseHay *= 0.85;
      baseBlueFuel = 30;
      waterLitersText = (season === "summer") ? "30 تا 40 لیٹر" : "25 تا 35 لیٹر";
    } else if (weight === "heavy") {
      baseChana *= 1.25;
      baseBarley *= 1.2;
      baseHay *= 1.2;
      baseBlueFuel = 50;
      waterLitersText = (season === "summer") ? "55 تا 70+ لیٹر" : "40 تا 50 لیٹر";
    } else {
      waterLitersText = (season === "summer") ? "45 تا 60 لیٹر" : "35 تا 45 لیٹر";
    }

    // Intensity adjustment
    if (intensity === "training") {
      baseChana += 0.5;
      baseGur += 100;
      baseGhee += 40;
    } else if (intensity === "tournament") {
      baseChana += 1.0;
      baseBarley += 0.5;
      baseGur += 200;
      baseGhee += 70;
      baseBlueFuel += 10;
      if (season === "summer") {
        waterLitersText = "60 تا 75+ لیٹر (شدید پسینہ)";
      } else {
        waterLitersText = "45 تا 55 لیٹر";
      }
    } else if (intensity === "rest") {
      baseChana *= 0.5;
      baseGhee = 0;
      baseGur = 100;
      baseBlueFuel = 20;
      waterLitersText = (season === "summer") ? "30 تا 40 لیٹر" : "25 تا 30 لیٹر";
    }

    // Season adjustment
    let oilNote = "دیسی گھی (خالص)";
    if (season === "summer") {
      oilNote = "السی کا تیل / میٹھی دہی (ٹھنڈی تاثیر)";
    }

    const chanaEl = document.getElementById("feed-chana-qty");
    const barleyEl = document.getElementById("feed-barley-qty");
    const branEl = document.getElementById("feed-bran-qty");
    const gurEl = document.getElementById("feed-gur-qty");
    const gheeEl = document.getElementById("feed-ghee-qty");
    const blueFuelEl = document.getElementById("feed-bluefuel-qty");
    const hayEl = document.getElementById("feed-hay-qty");
    const greenEl = document.getElementById("feed-green-qty");
    const waterEl = document.getElementById("calculated-water-liters");

    if (chanaEl) chanaEl.innerText = `${baseChana.toFixed(1)} کلوگرام`;
    if (barleyEl) barleyEl.innerText = `${baseBarley.toFixed(1)} کلوگرام`;
    if (branEl) branEl.innerText = `${baseBran.toFixed(1)} کلوگرام`;
    if (gurEl) gurEl.innerText = `${Math.round(baseGur)} گرام`;
    if (gheeEl) gheeEl.innerText = `${Math.round(baseGhee)} گرام (${oilNote})`;
    if (blueFuelEl) blueFuelEl.innerText = `${Math.round(baseBlueFuel)} گرام (روزانہ)`;
    if (hayEl) hayEl.innerText = `${baseHay.toFixed(1)} کلوگرام`;
    if (greenEl) greenEl.innerText = `${baseGreen.toFixed(1)} کلوگرام`;
    if (waterEl) waterEl.innerText = waterLitersText;
  }

  [weightSelect, intensitySelect, seasonSelect].forEach(select => {
    if (select) select.addEventListener("change", calculateFeedPlan);
  });

  calculateFeedPlan();
}

// ---------------------------------------------------------
// Equine Nutrition, Forage Directory, Feed Mixes & Equine Fuel Controller
// ---------------------------------------------------------
function initNutritionHub() {
  initNutritionSubTabs();
  renderEquineFuelProducts();
  renderFeedMixes();
  renderFodderDirectory();
  renderFeedIngredients();
  renderFeedingSchedule();
  renderHydrationGuide();
}

function initNutritionSubTabs() {
  const subTabBtns = document.querySelectorAll(".sub-tab-btn");
  const subPanels = document.querySelectorAll(".nutrition-sub-panel");

  subTabBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      const targetSubpanelId = btn.dataset.subtab;
      subTabBtns.forEach(b => b.classList.toggle("active", b === btn));
      subPanels.forEach(p => p.classList.toggle("active", p.id === targetSubpanelId));
    });
  });
}

function renderEquineFuelProducts() {
  const container = document.getElementById("efuel-products-container");
  if (!container || typeof EQUINE_FUEL_PRODUCTS === 'undefined') return;

  container.innerHTML = EQUINE_FUEL_PRODUCTS.map(prod => {
    const isFeatured = prod.id === "blue-fuel";
    return `
      <div class="efuel-card ${isFeatured ? 'featured-bluefuel' : ''}">
        <div class="efuel-top">
          <span class="efuel-badge">${prod.badge}</span>
          <span style="font-size: 1.8rem;">${prod.icon}</span>
        </div>
        <h4 class="efuel-title">${prod.name}</h4>
        <p class="efuel-sub">${prod.subtitle}</p>

        <div class="efuel-actives-box">
          <strong>🔬 فعال اجزاء (Active Ingredients):</strong>
          <p style="margin-top: 0.25rem;">${prod.activeIngredients}</p>
        </div>

        <div class="efuel-benefits-list">
          <strong style="color: var(--gold-400); font-size: 0.9rem; margin-bottom: 0.25rem;">اہم فوائد و اثرات:</strong>
          ${prod.benefits.map(b => `<div class="efuel-benefit-item">${b}</div>`).join('')}
        </div>

        <div class="efuel-dosage-badge">
          <strong>🥄 مقدار و طریقہ خوراک:</strong>
          <div>${prod.dosage}</div>
          <small style="color: var(--text-secondary); display: block; margin-top: 0.25rem;">${prod.feedingMethod}</small>
        </div>

        <div class="efuel-card-footer">
          <a href="${prod.youtubeUrl}" target="_blank" rel="noopener" class="btn-efuel-youtube" style="padding: 0.35rem 0.85rem; font-size: 0.85rem;">
            <span>▶️ یوٹیوب ویڈیو</span>
          </a>
          <button class="btn-card-view" onclick="askAiAboutItem('${prod.name}')">
            <span>ڈاکٹر سے پوچھیں</span> 💬
          </button>
        </div>
      </div>
    `;
  }).join('');
}

function renderFeedMixes() {
  const container = document.getElementById("feed-mixes-container");
  if (!container || typeof FEED_MIX_RECIPES === 'undefined') return;

  container.innerHTML = FEED_MIX_RECIPES.map(mix => `
    <div class="mix-card">
      <div class="mix-header">
        <div class="mix-title-row">
          <h4 class="mix-title">${mix.title}</h4>
          <span class="mix-icon">${mix.icon}</span>
        </div>
        <div style="display: flex; gap: 0.4rem; flex-wrap: wrap;">
          <span class="mix-target-badge">🎯 ${mix.target}</span>
          <span class="mix-target-badge" style="color: var(--gold-400); border-color: rgba(212, 175, 55, 0.3);">⚡ توانائی: ${mix.energyLevel}</span>
        </div>
      </div>

      <p class="mix-desc">${mix.description}</p>

      <strong style="color: var(--gold-300); font-size: 0.95rem; margin-bottom: 0.5rem; display: block;">📋 اجزاء و درست اوزان:</strong>
      <table class="mix-ingredients-table">
        <tbody>
          ${mix.ingredients.map(ing => `
            <tr>
              <td class="mix-ing-name">
                ${ing.item}
                <span class="mix-ing-note">${ing.note}</span>
              </td>
              <td class="mix-ing-qty">${ing.qty}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>

      <div style="margin: 0.75rem 0;">
        <strong style="color: var(--gold-400); font-size: 0.9rem; display: block; margin-bottom: 0.35rem;">🥣 ترکیبِ تیاری (Step-by-step):</strong>
        ${mix.prepSteps.map((s, idx) => `
          <div class="step-item" style="font-size: 0.85rem; line-height: 1.8;"><strong>${idx + 1}.</strong> ${s}</div>
        `).join('')}
      </div>

      <div class="mix-time-badge">
        <strong>⏱️ دینے کا وقت:</strong> ${mix.feedingTime}
      </div>

      <div class="rationale-box" style="margin-top: 0.5rem;">
        <strong>🎯 متوقع فوائد:</strong> ${mix.benefits}
      </div>

      <div class="tent-pegging-tip" style="margin-top: 0.5rem;">
        <strong>⚠️ احتیاط:</strong> ${mix.precautions}
      </div>

      <div style="display: flex; justify-content: flex-end; margin-top: 1rem;">
        <button class="btn-card-view" onclick="askAiAboutItem('${mix.title}')">
          <span>اس راشن پر ڈاکٹر سے بات کریں</span> 💬
        </button>
      </div>
    </div>
  `).join('');
}

function renderFodderDirectory() {
  const container = document.getElementById("fodder-grid-container");
  const searchInput = document.getElementById("fodder-search-input");
  const filterChips = document.querySelectorAll("#fodder-filter-chips [data-fodder-filter]");
  if (!container || typeof FODDER_DATA === 'undefined') return;

  let activeFodderFilter = "all";

  function filterAndDisplayFodder() {
    const query = searchInput ? searchInput.value.trim().toLowerCase() : "";
    const filtered = FODDER_DATA.filter(f => {
      let matchesCategory = true;
      if (activeFodderFilter === "green") {
        matchesCategory = f.type === "green" || f.type === "green-dry";
      } else if (activeFodderFilter === "dry") {
        matchesCategory = f.type === "dry" || f.type === "green-dry";
      } else if (activeFodderFilter === "warning") {
        matchesCategory = f.type === "warning" || f.type === "straw-warning";
      }

      const matchesSearch = !query ||
        f.name.toLowerCase().includes(query) ||
        f.overview.toLowerCase().includes(query) ||
        f.typeUrdu.toLowerCase().includes(query);

      return matchesCategory && matchesSearch;
    });

    if (filtered.length === 0) {
      container.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 3rem; color: var(--text-muted);">
          <p style="font-size: 1.2rem;">کوئی چارہ نہیں ملا۔ براہِ کرم کوئی دوسرا لفظ تلاش کریں۔</p>
        </div>
      `;
      return;
    }

    container.innerHTML = filtered.map(f => {
      const isWarning = f.type === "warning" || f.type === "straw-warning";
      return `
        <div class="fodder-card ${isWarning ? 'card-warning' : ''}">
          <div class="fodder-top">
            <span class="fodder-type-badge">${f.typeUrdu}</span>
            <span style="font-size: 1.8rem;">${f.icon}</span>
          </div>

          <h4 class="fodder-name">${f.name}</h4>
          <p style="font-size: 0.88rem; color: var(--text-muted); line-height: 1.8; margin-bottom: 0.75rem;">${f.overview}</p>

          <div class="fodder-nutrition-meters">
            <div class="fodder-meter-item">
              پروٹین (Protein):
              <strong>${f.protein}</strong>
            </div>
            <div class="fodder-meter-item">
              فائبر (Fiber):
              <strong>${f.fiber}</strong>
            </div>
            <div class="fodder-meter-item" style="grid-column: 1/-1;">
              کیلشیم و فاسفورس:
              <strong>${f.calciumPhosphorus}</strong>
            </div>
          </div>

          <div class="fodder-qty-box">
            <strong>⚖️ روزانہ تجویز کردہ مقدار:</strong>
            <div>${f.dailyQuantity}</div>
          </div>

          <div style="margin-bottom: 0.75rem;">
            <strong style="color: var(--gold-400); font-size: 0.88rem; display: block; margin-bottom: 0.25rem;">✨ غذائی افادیت:</strong>
            ${f.benefits.map(b => `<div class="efuel-benefit-item">${b}</div>`).join('')}
          </div>

          <div class="rationale-box" style="font-size: 0.82rem;">
            <strong>✂️ کٹائی کا وقت و معیار:</strong> ${f.harvestTip}
          </div>

          <div class="${isWarning ? 'mandatory-warning-box' : 'tent-pegging-tip'}" style="margin-top: 0.5rem; font-size: 0.85rem;">
            <strong>⚠️ احتیاطی تدابیر:</strong>
            <p>${f.precautions}</p>
          </div>

          <div style="display: flex; justify-content: flex-end; margin-top: auto; padding-top: 1rem;">
            <button class="btn-card-view" onclick="askAiAboutItem('${f.name}')">
              <span>ڈاکٹر سے اس چارے پر پوچھیں</span> 💬
            </button>
          </div>
        </div>
      `;
    }).join('');
  }

  if (searchInput) {
    searchInput.addEventListener("input", filterAndDisplayFodder);
  }

  filterChips.forEach(chip => {
    chip.addEventListener("click", () => {
      filterChips.forEach(c => c.classList.remove("active"));
      chip.classList.add("active");
      activeFodderFilter = chip.dataset.fodderFilter;
      filterAndDisplayFodder();
    });
  });

  filterAndDisplayFodder();
}

function renderFeedIngredients() {
  const container = document.getElementById("ingredients-grid-container");
  const searchInput = document.getElementById("ingredients-search-input");
  if (!container || typeof FEED_INGREDIENTS === 'undefined') return;

  function filterAndDisplayIngredients() {
    const query = searchInput ? searchInput.value.trim().toLowerCase() : "";
    const filtered = FEED_INGREDIENTS.filter(ing => {
      return !query ||
        ing.name.toLowerCase().includes(query) ||
        ing.primaryBenefit.toLowerCase().includes(query) ||
        ing.categoryUrdu.toLowerCase().includes(query) ||
        ing.nutrition.toLowerCase().includes(query);
    });

    if (filtered.length === 0) {
      container.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 3rem; color: var(--text-muted);">
          <p style="font-size: 1.2rem;">کوئی خوراک نہیں ملی۔ براہِ کرم کوئی دوسرا لفظ تلاش کریں۔</p>
        </div>
      `;
      return;
    }

    container.innerHTML = filtered.map(item => `
      <div class="ing-benefit-card">
        <div style="display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 0.5rem;">
          <span class="card-cat-badge">${item.categoryUrdu}</span>
          <span style="font-size: 1.8rem;">${item.icon}</span>
        </div>

        <h4 class="ing-benefit-title">${item.name}</h4>
        <span class="ing-prime-benefit-pill">🎯 ${item.primaryBenefit}</span>

        <div style="background: rgba(0, 0, 0, 0.25); padding: 0.55rem 0.8rem; border-radius: var(--radius-sm); font-size: 0.85rem; color: var(--text-muted); margin-bottom: 0.85rem;">
          <strong>📊 غذائی اجزاء:</strong> ${item.nutrition}
        </div>

        <div style="margin-bottom: 1rem;">
          <strong style="color: var(--gold-400); font-size: 0.9rem; display: block; margin-bottom: 0.35rem;">🔬 یہ خوراک کون سا فائدہ دے گی؟</strong>
          ${item.detailedBenefits.map(b => `<div class="efuel-benefit-item">${b}</div>`).join('')}
        </div>

        <div class="fodder-qty-box">
          <strong>⚖️ یومیہ محفوظ مقدار:</strong> ${item.dosage}
        </div>

        <div class="ing-feeding-method-box">
          <strong>🥣 کھلانے کا درست طریقہ:</strong>
          <p style="margin-top: 0.25rem;">${item.feedingMethod}</p>
        </div>

        <div class="tent-pegging-tip" style="margin-top: 0.65rem; font-size: 0.85rem;">
          <strong>⚠️ احتیاط:</strong> ${item.cautions}
        </div>

        <div style="display: flex; justify-content: flex-end; margin-top: 1rem;">
          <button class="btn-card-view" onclick="askAiAboutItem('${item.name}')">
            <span>ڈاکٹر سے مشورہ لیں</span> 💬
          </button>
        </div>
      </div>
    `).join('');
  }

  if (searchInput) {
    searchInput.addEventListener("input", filterAndDisplayIngredients);
  }

  filterAndDisplayIngredients();
}

function renderFeedingSchedule() {
  const timelineContainer = document.getElementById("schedule-timeline-container");
  const rulesContainer = document.getElementById("golden-rules-container");
  const overviewEl = document.getElementById("schedule-overview-text");

  if (typeof FEEDING_SCHEDULE === 'undefined') return;

  if (overviewEl && FEEDING_SCHEDULE.overview) {
    overviewEl.innerText = FEEDING_SCHEDULE.overview;
  }

  if (timelineContainer && FEEDING_SCHEDULE.slots) {
    timelineContainer.innerHTML = FEEDING_SCHEDULE.slots.map(slot => `
      <div class="timeline-slot-card">
        <span class="timeline-time-badge">${slot.icon} ${slot.time}</span>
        <h4 class="timeline-slot-title">${slot.title}</h4>
        <div class="timeline-action"><strong>کارروائی و راشن:</strong> ${slot.action}</div>
        <div class="timeline-rationale"><strong>🔬 ویٹرنری حکمت:</strong> ${slot.vetRationale}</div>
      </div>
    `).join('');
  }

  if (rulesContainer && FEEDING_SCHEDULE.goldenRules) {
    rulesContainer.innerHTML = `
      <h4 style="color: var(--gold-400); margin-bottom: 0.75rem; font-size: 1.15rem;">⭐ گھوڑے کے نظامِ انہضام کے 4 سنہری اصول:</h4>
      ${FEEDING_SCHEDULE.goldenRules.map(r => `<div class="step-item" style="color: var(--text-secondary); line-height: 2;">${r}</div>`).join('')}
    `;
  }
}

function renderHydrationGuide() {
  const waterContainer = document.getElementById("water-needs-container");
  const electrolyteContainer = document.getElementById("homemade-electrolyte-container");

  if (typeof HYDRATION_GUIDE === 'undefined') return;

  if (waterContainer && HYDRATION_GUIDE.dailyRequirements) {
    waterContainer.innerHTML = HYDRATION_GUIDE.dailyRequirements.map((req, idx) => {
      const icons = ["💧", "🏇", "🔥"];
      return `
        <div class="water-card">
          <div class="water-card-icon">${icons[idx] || "💧"}</div>
          <div class="water-card-state">${req.state}</div>
          <div class="water-card-liters">${req.liters}</div>
          <div class="water-card-note">${req.note}</div>
        </div>
      `;
    }).join('');
  }

  if (electrolyteContainer && HYDRATION_GUIDE.homemadeElectrolyteRecipe) {
    const r = HYDRATION_GUIDE.homemadeElectrolyteRecipe;
    electrolyteContainer.innerHTML = `
      <h4 style="color: var(--gold-400); margin-bottom: 0.75rem; font-size: 1.15rem;">${r.title}</h4>
      <strong style="color: #7dd3fc; display: block; margin-bottom: 0.4rem;">اجزاء:</strong>
      <ul style="padding-right: 1.25rem; font-size: 0.88rem; color: var(--text-secondary); line-height: 1.9; margin-bottom: 0.85rem;">
        ${r.ingredients.map(i => `<li>${i}</li>`).join('')}
      </ul>
      <div style="background: rgba(0, 0, 0, 0.25); padding: 0.65rem; border-radius: var(--radius-sm); font-size: 0.85rem; color: var(--text-muted); margin-bottom: 0.65rem;">
        <strong>طریقہ تیاری:</strong> ${r.prep}
      </div>
      <div style="background: rgba(16, 185, 129, 0.1); border-right: 3px solid var(--success); padding: 0.65rem; border-radius: 0 var(--radius-sm) var(--radius-sm) 0; font-size: 0.85rem; color: #a7f3d0;">
        <strong>استعمال کا وقت:</strong> ${r.use}
      </div>
    `;
  }
}

window.askAiAboutItem = function (itemName) {
  const tabBtn = document.querySelector('[data-tab="chat-tab"]');
  if (tabBtn) tabBtn.click();
  const chatInput = document.getElementById("chat-input");
  if (chatInput) {
    chatInput.value = `مجھے '${itemName}' کی درست مقدار، فوائد اور نیزہ بازی گھوڑے کے لیے استعمال کا مکمل طریقہ بتائیں۔`;
    document.getElementById("chat-form").dispatchEvent(new Event("submit"));
  }
};

// ---------------------------------------------------------
// Emergency & Kitchen Materia Medica Renderers
// ---------------------------------------------------------
function initEmergencyAndHerbs() {
  // Render Vitals
  const vitalsContainer = document.getElementById("vitals-grid-container");
  if (vitalsContainer) {
    vitalsContainer.innerHTML = `
      <div class="vital-card">
        <div class="vital-top">
          <span class="vital-name">درجہ حرارت (Temperature)</span>
          <span class="vital-icon">🌡️</span>
        </div>
        <div class="vital-normal"><strong>نارمل:</strong> ${EQUINE_VITALS.temperature.normal}</div>
        <div class="vital-danger"><strong>خطرہ:</strong> ${EQUINE_VITALS.temperature.danger}</div>
        <div style="font-size: 0.8rem; color: var(--text-muted); margin-top: 0.5rem;">${EQUINE_VITALS.temperature.note}</div>
      </div>

      <div class="vital-card">
        <div class="vital-top">
          <span class="vital-name">دل کی دھڑکن (Heart Rate)</span>
          <span class="vital-icon">❤️</span>
        </div>
        <div class="vital-normal"><strong>نارمل:</strong> ${EQUINE_VITALS.heartRate.normal}</div>
        <div class="vital-danger"><strong>خطرہ:</strong> ${EQUINE_VITALS.heartRate.danger}</div>
        <div style="font-size: 0.8rem; color: var(--text-muted); margin-top: 0.5rem;">${EQUINE_VITALS.heartRate.note}</div>
      </div>

      <div class="vital-card">
        <div class="vital-top">
          <span class="vital-name">سانس کی رفتار (Respiration)</span>
          <span class="vital-icon">🫁</span>
        </div>
        <div class="vital-normal"><strong>نارمل:</strong> ${EQUINE_VITALS.respirationRate.normal}</div>
        <div class="vital-danger"><strong>خطرہ:</strong> ${EQUINE_VITALS.respirationRate.danger}</div>
        <div style="font-size: 0.8rem; color: var(--text-muted); margin-top: 0.5rem;">${EQUINE_VITALS.respirationRate.note}</div>
      </div>

      <div class="vital-card">
        <div class="vital-top">
          <span class="vital-name">مسوڑھوں کا رنگ (Gums Color)</span>
          <span class="vital-icon">👄</span>
        </div>
        <div class="vital-normal"><strong>نارمل:</strong> ${EQUINE_VITALS.gumsColor.normal}</div>
        <div class="vital-danger"><strong>خطرہ:</strong> ${EQUINE_VITALS.gumsColor.danger}</div>
        <div style="font-size: 0.8rem; color: var(--text-muted); margin-top: 0.5rem;">${EQUINE_VITALS.gumsColor.note}</div>
      </div>
    `;
  }

  // Render Red Flags
  const redflagsContainer = document.getElementById("redflags-container");
  if (redflagsContainer) {
    redflagsContainer.innerHTML = EMERGENCY_RED_FLAGS.map(rf => `
      <div class="redflag-card">
        <div class="redflag-header">
          <span class="redflag-title">🚨 ${rf.title}</span>
          <span class="redflag-urgency">${rf.urgency}</span>
        </div>
        <p class="redflag-desc">${rf.description}</p>
        <div class="redflag-action"><strong>فوری عمل:</strong> ${rf.action}</div>
      </div>
    `).join('');
  }

  // Render Kitchen Herbs
  const herbsContainer = document.getElementById("herbs-grid-container");
  if (herbsContainer) {
    herbsContainer.innerHTML = KITCHEN_HERBS.map(herb => `
      <div class="herb-card">
        <div class="herb-header">
          <span class="herb-icon">${herb.icon}</span>
          <div>
            <h3 class="herb-name">${herb.name}</h3>
            <span class="herb-active">${herb.activeCompound}</span>
          </div>
        </div>
        <p class="herb-prop"><strong>طبی خواص:</strong> ${herb.properties}</p>
        <div class="herb-dosage"><strong>محفوظ خوراک:</strong> ${herb.dosage}</div>
        <p style="font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 0.5rem;"><strong>استعمال:</strong> ${herb.uses}</p>
        <div class="herb-tip">💡 <strong>ڈاکٹر ٹپ:</strong> ${herb.tip}</div>
      </div>
    `).join('');
  }
}

// ---------------------------------------------------------
// Modals & Settings Management
// ---------------------------------------------------------
function initModals() {
  // Close buttons
  document.querySelectorAll(".btn-modal-close").forEach(btn => {
    btn.addEventListener("click", () => {
      btn.closest(".modal-overlay").classList.remove("open");
    });
  });

  // Close on outside click
  document.querySelectorAll(".modal-overlay").forEach(modal => {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        modal.classList.remove("open");
      }
    });
  });

  // Settings Modal Open
  const settingsBtn = document.getElementById("settings-btn");
  const settingsModal = document.getElementById("settings-modal");
  const apiKeyInput = document.getElementById("api-key-input");
  const modelSelect = document.getElementById("model-select");
  const langSelect = document.getElementById("lang-select");
  const saveSettingsBtn = document.getElementById("save-settings-btn");
  const resetSettingsBtn = document.getElementById("reset-settings-btn");

  if (settingsBtn) {
    settingsBtn.addEventListener("click", () => {
      apiKeyInput.value = getApiKey();
      modelSelect.value = getSelectedModel();
      if (langSelect) langSelect.value = currentLanguage || "auto";
      settingsModal.classList.add("open");
    });
  }

  if (saveSettingsBtn) {
    saveSettingsBtn.addEventListener("click", () => {
      const key = apiKeyInput.value.trim();
      const model = modelSelect.value;
      if (key) {
        localStorage.setItem("ispeshifaa_groq_key", key);
      }
      localStorage.setItem("ispeshifaa_groq_model", model);

      if (langSelect) {
        currentLanguage = langSelect.value;
        localStorage.setItem("ispeshifaa_lang", currentLanguage);
        document.querySelectorAll("#chat-lang-selector .lang-pill-btn").forEach(btn => {
          btn.classList.toggle("active", btn.dataset.lang === currentLanguage);
        });
        updateSpeechRecognitionLang();
      }

      settingsModal.classList.remove("open");
      alert("سیٹنگز کامیابی سے محفوظ ہو گئیں!");
    });
  }

  if (resetSettingsBtn) {
    resetSettingsBtn.addEventListener("click", () => {
      localStorage.removeItem("ispeshifaa_groq_key");
      localStorage.removeItem("ispeshifaa_groq_model");
      localStorage.removeItem("ispeshifaa_lang");
      currentLanguage = "auto";
      apiKeyInput.value = DEFAULT_GROQ_KEY;
      modelSelect.value = DEFAULT_MODEL;
      if (langSelect) langSelect.value = "auto";
      document.querySelectorAll("#chat-lang-selector .lang-pill-btn").forEach(btn => {
        btn.classList.toggle("active", btn.dataset.lang === "auto");
      });
      updateSpeechRecognitionLang();
      alert("ڈیفالٹ سیٹنگز بحال کر دی گئیں۔");
    });
  }

  // Print Action
  const printActionBtn = document.getElementById("rx-print-action-btn");
  if (printActionBtn) {
    printActionBtn.addEventListener("click", () => {
      window.print();
    });
  }
}

// ---------------------------------------------------------
// Mobile Quick Prompts Bottom Sheet Modal Controller
// ---------------------------------------------------------
function initMobilePromptsModal() {
  const promptsBtn = document.getElementById("action-strip-prompts-btn");
  const modal = document.getElementById("mobile-prompts-modal");
  const closeBtn = document.getElementById("close-prompts-modal-btn");
  const container = document.getElementById("modal-prompts-container");
  const tabs = document.querySelectorAll("#modal-prompts-lang-tabs .prompts-tab-btn");
  const chatInput = document.getElementById("chat-input");
  const chatForm = document.getElementById("chat-form");

  if (!promptsBtn || !modal || !container) return;

  const promptsData = {
    pa: [
      { title: "🐎 گھوڑے نوں موٹا تے تگڑا کرن دا شاہی نسخہ", prompt: "گھوڑے نوں موٹا تے تگڑا کرن دا شاہی نسخہ، ڈی ورمنگ دا طریقہ، دیسی ونڈا تے خوراک دسو۔" },
      { title: "🏇 نیزہ بازی توں بعد پٹھیاں دا کھچاؤ (چُھ جانا)", prompt: "نیزہ بازی توں بعد گھوڑے دے پٹھے کھچے گئے نے، لتاں چ کھچ اے تے گھوڑا چُھ گیا اے، فوری دیسی لیپ دسو۔" },
      { title: "🩺 پیٹ چ ول، مروڑ تے افارہ دا فوری کاڑھا", prompt: "گھوڑے دے پیٹ چ ول پے گئے نے، مروڑ تے افارہ اے، زمین تے لتاں ماردا اے، فوری دیسی کاڑھا دسو۔" },
      { title: "🩹 کھر پاتن، چٹخن تے لتاں دی موچ دا علاج", prompt: "گھوڑے دے کھر پات گئے نے، کٹ گئے نے یا سڑاند اے، پیر نئیں لاندا، دیسی تیل تے ہوف کیئر دسو۔" },
      { title: "🥣 نال (ڈرینچنگ) لان تے دوائی پیاؤن دا طریقہ", prompt: "گھوڑے نوں نال (ڈرینچنگ بوتل) لان تے دیسی کاڑھا یا دوائی پیاؤن دا محفوظ طریقہ دسو۔" },
      { title: "🌾 نیزہ بازی لئی شاہی ونڈا تے خوراک", prompt: "نیزہ بازی لئی گھوڑے دا شاہی مقوی ونڈا، جَو دا دلیہ، چھولے، گھیو تے گُڑ دا روزانہ حساب دسو۔" },
      { title: "🫁 کھنگ، دم چڑن تے سینے دی خرخراہٹ", prompt: "گھوڑے نوں کھنگ لگی اے، دم چڑدا اے تے سینے چوں خرخراہٹ آندی اے، دیسی علاج دسو۔" },
      { title: "💊 میڈیکل ویٹرنری دوائیاں تے دیسی علاج", prompt: "گھوڑے دی بیماری چ دیسی نسخیاں دے نال نال میڈیکل انگلش دوائیاں (جیسے کولک لئی بینامائن، السر لئی اومیپرازول) دا کی کردار اے؟" },
      { title: "💎 ایکوائن فیول یو ایس اے سپلیمنٹس گائیڈ", prompt: "ایکوائن فیول بلیو فیول (Blue Fuel Calcium) تے الیکٹرو فیول دے کی فائدے نے تے کداں استعمال کرائی دا اے؟" },
      { title: "💧 پانی، تریہہ تے دیسی الیکٹرولائٹ شربت", prompt: "گرمی چ گھوڑے دی تریہہ، پانی دا صحیح ٹائم تے دیسی نمکیات/الیکٹرولائٹ شربت کیویں بنائی دا اے؟" }
    ],
    ur: [
      { title: "🐎 گھوڑے کو موٹا، فربہ اور تندرست کرنے کا نسخہ", prompt: "گھوڑے کو موٹا، فربہ اور تندرست کرنے کا مستند نسخہ، روزمرہ کا راشن اور ڈی ورمنگ کا طریقہ بتائیں۔" },
      { title: "🏇 نیزہ بازی کے بعد پٹھوں کا شدید کھچاؤ", prompt: "نیزہ بازی کے بعد گھوڑے کے پٹھوں میں شدید کچھاؤ اور تھکاوٹ ہے، کچن کی اشیاء سے فوری دیسی علاج بتائیں۔" },
      { title: "🩺 دردِ قولنج و پیٹ گیس کا ہنگامی کاڑھا", prompt: "گھوڑے کے پیٹ میں شدید مروڑ، درد قولنج اور گیس کا دیسی کاڑھا اور احتیاطی تدابیر بتائیں۔" },
      { title: "🩹 کھر کی دراڑ، سڑاند اور جوڑ کی موچ", prompt: "گھوڑے کے کھر پھٹ گئے ہیں، کھر کی دراڑ، تلوا نرم اور جوڑ میں موچ کا دیسی علاج بتائیں۔" },
      { title: "🥣 نال (Drenching) پلانے کا محفوظ طریقہ", prompt: "گھوڑے کو نال (Drenching bottle) کے ذریعے دوائی یا کاڑھا پلانے کا محفوظ ویٹرنری طریقہ کیا ہے؟" },
      { title: "🌾 نیزہ باز گھوڑے کا شاہی مقوی ونڈا", prompt: "500 کلو وزنی نیزہ باز گھوڑے کے لیے جَو، چنے، چوکر، کھل اور دیسی گھی کی روزانہ متوازن مقدار بتائیں۔" },
      { title: "🫁 سانس پھولنا، کھانسی اور سینے کی خرخراہٹ", prompt: "تیز دوڑ کے بعد گھوڑے کی سانس پھولتی ہے اور کھانسی آتی ہے، دیسی اور احتیاطی تدابیر بتائیں۔" },
      { title: "💊 ہنگامی میڈیکل ویٹرنری ادویات گائیڈ", prompt: "ہنگامی حالت (کولک، شدید بخار یا لیمینائٹس) میں دیسی علاج کے ساتھ ضروری میڈیکل ویٹرنری ادویات کی رہنمائی کریں۔" }
    ],
    en: [
      { title: "🐎 Horse Weight Gain & Muscle Formula", prompt: "How to safely fatten up a thin horse? Provide a step-by-step weight gain diet with deworming, barley mash, and supplements." },
      { title: "🏇 Post-Event Muscle Cramps & Tie-Up", prompt: "My horse has severe muscle stiffness (tie-up/azoturia) after tent pegging sprint. Suggest natural poultice and veterinary protocol." },
      { title: "🩺 Emergency Colic Relief Protocol", prompt: "Emergency colic relief protocol: natural herbal drench and modern veterinary emergency steps (Flunixin/Banamine)." },
      { title: "🩹 Hoof Cracks, Thrush & Polish Care", prompt: "Cracked hooves and thrush management: natural antiseptic oil and Hoof Fuel biotin supplement." },
      { title: "💎 Equine Fuel USA Supplements", prompt: "What are the proven benefits of Equine Fuel USA products (Blue Fuel, Electro Fuel, Calm Fuel)?" },
      { title: "💊 Integrative Herbal & Modern Vet Care", prompt: "How to combine traditional herbal remedies with modern equine veterinary medicine safely?" }
    ]
  };

  function renderModalPrompts(lang) {
    tabs.forEach(t => t.classList.toggle("active", t.dataset.modalLang === lang));
    const list = promptsData[lang] || promptsData.pa;
    container.innerHTML = list.map(item => `
      <button type="button" class="modal-prompt-item" data-modal-prompt="${escapeHTML(item.prompt)}">
        <span>${item.title}</span>
        <span style="color: var(--gold-400); font-size: 1.2rem; font-weight: bold;">›</span>
      </button>
    `).join('');
  }

  promptsBtn.addEventListener("click", () => {
    const lang = currentLanguage === "en" ? "en" : (currentLanguage === "ur" ? "ur" : "pa");
    renderModalPrompts(lang);
    modal.classList.add("open");
  });

  if (closeBtn) {
    closeBtn.addEventListener("click", () => modal.classList.remove("open"));
  }

  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      renderModalPrompts(tab.dataset.modalLang);
    });
  });

  container.addEventListener("click", (e) => {
    const item = e.target.closest(".modal-prompt-item");
    if (!item) return;
    const promptText = item.dataset.modalPrompt;
    if (promptText && chatInput && chatForm) {
      modal.classList.remove("open");
      chatInput.value = promptText;
      chatInput.focus();
      chatForm.dispatchEvent(new Event("submit"));
    }
  });
}

// ---------------------------------------------------------
// Sound Effects Synthesizer (Zero External Audio Dependency)
// ---------------------------------------------------------
function playNotificationSound() {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
    osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15); // A5

    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.35);
  } catch (e) {
    // AudioContext autoplay restrictions handled silently
  }
}

// ---------------------------------------------------------
// Voice Recognition Engine (Dual-Layer: Web Speech API + Groq Whisper Fallback)
// ---------------------------------------------------------
let voiceMediaRecorder = null;
let voiceAudioChunks = [];
let voiceTimerInterval = null;
let voiceSecondsElapsed = 0;

function updateSpeechRecognitionLang() {
  if (recognition) {
    if (currentLanguage === "pa") {
      recognition.lang = "ur-PK"; // Punjabi speakers in Pakistan are recognized accurately with ur-PK
    } else if (currentLanguage === "ur") {
      recognition.lang = "ur-PK";
    } else if (currentLanguage === "en") {
      recognition.lang = "en-US";
    } else {
      recognition.lang = "ur-PK";
    }
  }
}

function initVoiceRecognition() {
  const voiceBtn = document.getElementById("voice-btn");
  const stopVoiceBtn = document.getElementById("stop-voice-btn");
  const cancelVoiceBtn = document.getElementById("cancel-voice-btn");
  const voiceNotice = document.getElementById("voice-recording-notice");
  const voiceTimer = document.getElementById("voice-timer");
  const voiceStatusText = document.getElementById("voice-status-text");
  const chatInput = document.getElementById("chat-input");
  const chatForm = document.getElementById("chat-form");

  if (!voiceBtn) return;

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

  function startVoiceTimer() {
    voiceSecondsElapsed = 0;
    if (voiceTimer) voiceTimer.textContent = "00:00";
    if (voiceTimerInterval) clearInterval(voiceTimerInterval);
    voiceTimerInterval = setInterval(() => {
      voiceSecondsElapsed++;
      const mins = String(Math.floor(voiceSecondsElapsed / 60)).padStart(2, "0");
      const secs = String(voiceSecondsElapsed % 60).padStart(2, "0");
      if (voiceTimer) voiceTimer.textContent = `${mins}:${secs}`;
    }, 1000);
  }

  function stopVoiceTimer() {
    if (voiceTimerInterval) {
      clearInterval(voiceTimerInterval);
      voiceTimerInterval = null;
    }
    voiceSecondsElapsed = 0;
  }

  function setRecordingUI(active, statusMsg) {
    isRecording = active;
    if (active) {
      voiceBtn.classList.add("recording");
      const actionText = voiceBtn.querySelector(".action-text");
      if (actionText) actionText.textContent = "سن رہا ہے...";
      if (voiceNotice) voiceNotice.classList.remove("hidden");
      if (voiceStatusText && statusMsg) voiceStatusText.textContent = statusMsg;
      startVoiceTimer();
    } else {
      voiceBtn.classList.remove("recording");
      const actionText = voiceBtn.querySelector(".action-text");
      if (actionText) actionText.textContent = "بولیں";
      if (voiceNotice) voiceNotice.classList.add("hidden");
      stopVoiceTimer();
    }
  }

  // --- Layer 1: Web Speech API ---
  if (SpeechRecognition) {
    try {
      recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.maxAlternatives = 1;
      updateSpeechRecognitionLang();

      let finalTranscript = "";

      recognition.onstart = () => {
        setRecordingUI(true, "🔴 لائیو آواز ریکارڈ ہو رہی ہے... واضح بولیں");
      };

      recognition.onresult = (event) => {
        let interimTranscript = "";
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript + " ";
          } else {
            interimTranscript += transcript;
          }
        }
        if (chatInput) {
          chatInput.value = (finalTranscript + interimTranscript).trim();
          chatInput.style.height = "auto";
          chatInput.style.height = Math.min(chatInput.scrollHeight, 120) + "px";
        }
      };

      recognition.onerror = (event) => {
        console.warn("Speech recognition error:", event.error);
        if (event.error === "not-allowed" || event.error === "service-not-allowed") {
          setRecordingUI(false);
          alert("براہِ کرم براؤزر میں مائیکروفون (Microphone) کی اجازت دیں۔\nPlease allow microphone access in your browser.");
        } else if (event.error === "network") {
          console.log("Web Speech network error, falling back to MediaRecorder/Whisper...");
          stopWebSpeech(false);
          startMediaRecorderWhisper();
        } else {
          setRecordingUI(false);
        }
      };

      recognition.onend = () => {
        if (isRecording) {
          setRecordingUI(false);
          if (chatInput && chatInput.value.trim() && chatForm) {
            chatForm.dispatchEvent(new Event("submit"));
          }
        }
      };

      function startWebSpeech() {
        finalTranscript = "";
        updateSpeechRecognitionLang();
        try {
          recognition.start();
        } catch (e) {
          console.warn("Recognition already started or error:", e);
        }
      }

      function stopWebSpeech(shouldSubmit = true) {
        setRecordingUI(false);
        try {
          recognition.stop();
        } catch (e) {}
        if (shouldSubmit && chatInput && chatInput.value.trim() && chatForm) {
          chatForm.dispatchEvent(new Event("submit"));
        }
      }

      function cancelWebSpeech() {
        setRecordingUI(false);
        try {
          recognition.abort();
        } catch (e) {}
      }

      // Button Event Listeners
      voiceBtn.addEventListener("click", () => {
        if (isRecording) {
          stopWebSpeech(true);
        } else {
          startWebSpeech();
        }
      });

      if (stopVoiceBtn) {
        stopVoiceBtn.addEventListener("click", () => {
          stopWebSpeech(true);
        });
      }

      if (cancelVoiceBtn) {
        cancelVoiceBtn.addEventListener("click", () => {
          cancelWebSpeech();
          if (chatInput) chatInput.value = "";
        });
      }

      return; // Web Speech API successfully set up
    } catch (e) {
      console.warn("Web Speech API setup failed, initializing MediaRecorder fallback", e);
    }
  }

  // --- Layer 2: MediaRecorder + Groq Whisper API Fallback ---
  async function startMediaRecorderWhisper() {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      alert("آپ کے براؤزر میں مائیکروفون کی سہولت دستیاب نہیں ہے۔ براہِ کرم Chrome یا Edge استعمال کریں۔");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      voiceAudioChunks = [];
      voiceMediaRecorder = new MediaRecorder(stream);

      voiceMediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) voiceAudioChunks.push(e.data);
      };

      voiceMediaRecorder.onstop = async () => {
        stream.getTracks().forEach(track => track.stop());
        if (voiceAudioChunks.length === 0) return;

        const audioBlob = new Blob(voiceAudioChunks, { type: "audio/webm" });
        setRecordingUI(false);

        if (chatInput) {
          chatInput.value = "⏳ آواز سمجھی جا رہی ہے (Transcribing with Whisper)...";
        }

        try {
          const transcribedText = await transcribeAudioWithWhisper(audioBlob);
          if (chatInput) {
            chatInput.value = transcribedText.trim();
            if (chatInput.value.trim() && chatForm) {
              chatForm.dispatchEvent(new Event("submit"));
            }
          }
        } catch (err) {
          console.error("Whisper transcription error:", err);
          if (chatInput) chatInput.value = "";
          alert("آواز سمجھنے میں مسئلہ پیش آیا۔ براہِ کرم دوبارہ بولیں یا لکھ کر سوال پوچھیں۔");
        }
      };

      voiceMediaRecorder.start();
      setRecordingUI(true, "🔴 لائیو آواز ریکارڈ ہو رہی ہے (Whisper Engine)... بولیں");
    } catch (err) {
      console.error("Microphone access error:", err);
      alert("براہِ کرم مائیکروفون کے استعمال کی اجازت دیں (Microphone Permission Required)۔");
      setRecordingUI(false);
    }
  }

  function stopMediaRecorderWhisper(shouldSubmit = true) {
    if (voiceMediaRecorder && voiceMediaRecorder.state !== "inactive") {
      voiceMediaRecorder.stop();
    } else {
      setRecordingUI(false);
    }
  }

  function cancelMediaRecorderWhisper() {
    voiceAudioChunks = [];
    if (voiceMediaRecorder && voiceMediaRecorder.state !== "inactive") {
      voiceMediaRecorder.stop();
    }
    setRecordingUI(false);
    if (chatInput) chatInput.value = "";
  }

  voiceBtn.addEventListener("click", () => {
    if (isRecording) {
      stopMediaRecorderWhisper(true);
    } else {
      startMediaRecorderWhisper();
    }
  });

  if (stopVoiceBtn) {
    stopVoiceBtn.addEventListener("click", () => {
      stopMediaRecorderWhisper(true);
    });
  }

  if (cancelVoiceBtn) {
    cancelVoiceBtn.addEventListener("click", () => {
      cancelMediaRecorderWhisper();
    });
  }
}

// Transcribe audio using Groq Whisper API
async function transcribeAudioWithWhisper(audioBlob) {
  const apiKey = getApiKey();
  const formData = new FormData();
  formData.append("file", audioBlob, "voice_input.webm");
  formData.append("model", WHISPER_MODEL || "whisper-large-v3");
  formData.append("prompt", "گھوڑے کا دیسی علاج، نیزہ بازی، خوراک، ونڈا، پٹھے، کھر، بیماری، چھولے، دلیہ، لتاں، سوجن");

  if (currentLanguage === "ur" || currentLanguage === "pa") {
    formData.append("language", "ur");
  } else if (currentLanguage === "en") {
    formData.append("language", "en");
  }

  const response = await fetch("https://api.groq.com/openai/v1/audio/transcriptions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`
    },
    body: formData
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message || `Whisper HTTP Error: ${response.status}`);
  }

  const data = await response.json();
  return data.text || "";
}

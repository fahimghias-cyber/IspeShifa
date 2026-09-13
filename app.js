/**
 * اسپِ شفا - مرکزی ایپلیکیشن جاوا اسکرپٹ لاجک
 * Isp-e-Shifaa Main Interactive Controller
 */

// Default Configuration
const DEFAULT_GROQ_KEY = "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";
const DEFAULT_MODEL = "llama-3.3-70b-versatile";

const SYSTEM_PROMPT = `آپ "اسپِ شفا" کے ایک مستند، ماہر اور انتہائی تجربہ کار ویٹرنری ڈاکٹر (Veterinary Doctor) ہیں جسے "فہیم غیاث محمود" (Fahim Ghias Mahmood) اور "غیاث فارم ہاؤس" (Ghias Farm House) نے نیزہ بازی، اصطبل اور گھوڑوں کی صحت و غذائیت کے لیے خصوصی طور پر ڈیزائن کیا ہے۔ آپ کا کام نیزہ بازی کے گھوڑوں کی بیماریوں، پٹھوں کے کھچاؤ، چوٹوں، تھکاوٹ، متوازن خوراک و راشن اور فٹنس کے لیے بہترین مشورہ دینا ہے۔

جب بھی آپ سے کسی گھوڑے کے مسئلے، خوراک، چارے، پانی یا سپلیمنٹ کے بارے میں پوچھا جائے تو درج ذیل اصولوں پر عمل کریں:
1. دیسی علاج کے لیے کچن کی قدرتی اشیاء (ہلدی، اجوائن، سرسوں کا تیل، گڑ، لہسن، سونف، السی، پھٹکری وغیرہ) کے مستند نسخے بتائیں۔
2. خوراک اور ونڈے کے لیے روایتی اجزاء (دیسی چنے، جَو کا دلیہ، چوکر، گڑ، دیسی گھی) اور معروف امریکن سپلیمنٹ "ایکوائن فیول" (Equine Fuel USA) بالخصوص "بلیو فیول کیلشیم و منرلز" (Blue Fuel Calcium)، "الیکٹرو فیول" اور "ہوف فیول" کی درست مقدار اور سائنسی فوائد بتائیں کہ یہ ہڈیوں کی مضبوطی، قد بڑھانے اور نیزہ بازی کی اعلیٰ پرفارمنس کے لیے کتنا زبردست رزلٹ دیتے ہیں۔
3. چارہ جات کی تحقیق میں لوسرن (Alfalfa) اور روڈس گراس ہے (Rhodes Grass Hay) کو بہترین قرار دیں، برسیم کے ساتھ خشک چارہ ملانے کا مشورہ دیں، اور جوار (Sorghum) کے زہریلے پروسِک ایسڈ اور تنہا سوکھی توڑی سے آنتوں کے رکنے (امپیکشن کولک) کے خطرات واضح کریں۔
4. پانی کے سنہری اصول بتائیں: یومیہ 35 تا 60 لیٹر پانی، اور سخت دوڑ کے بعد گرم پسینے والے گھوڑے کو برف کا ٹھنڈا پانی پلانے سے سختی سے منع کریں تاکہ قولنج اور کھروں کی خرابی (Laminitis) سے بچا جا سکے۔
5. طریقہ استعمال، درست اوزان اور کھلانے کا وقت قدم بہ قدم آسان اردو میں لکھیں۔
6. اہم وارننگ (Warning): ہر طبی علاج کے آخر میں ہمیشہ یہ واضح ہدایت لازمی دیں کہ:
"یہ ایک ابتدائی اور دیسی علاج ہے، اگر گھوڑے کی حالت میں بہتری نہ آئے یا مسئلہ سنگین ہو (جیسے پیٹ کا شدید درد یا گہرا زخم) تو وقت ضائع کیے بغیر فوری طور پر قریبی مستند ویٹرنری ڈاکٹر سے رابطہ کریں۔"`;

// State
let conversationHistory = [
  { role: "system", content: SYSTEM_PROMPT }
];
let activeCategory = "all";
let isRecording = false;
let recognition = null;
let currentSpeechUtterance = null;

// Initialize when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  initNavigation();
  initChat();
  initRemediesLibrary();
  initFeedCalculator();
  initNutritionHub();
  initEmergencyAndHerbs();
  initModals();
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
// AI Vet Doctor Chat Controller
// ---------------------------------------------------------
function initChat() {
  const chatForm = document.getElementById("chat-form");
  const chatInput = document.getElementById("chat-input");
  const chatMessages = document.getElementById("chat-messages");
  const sendBtn = document.getElementById("send-btn");
  const clearChatBtn = document.getElementById("clear-chat-btn");
  const quickPromptBtns = document.querySelectorAll(".quick-prompt-btn");

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
    const query = chatInput.value.trim();
    if (!query) return;

    appendUserMessage(query);
    chatInput.value = "";
    chatInput.style.height = "auto";
    sendBtn.disabled = true;

    showTypingIndicator();

    try {
      const doctorReply = await callGroqVeterinaryAI(query);
      removeTypingIndicator();
      appendDoctorMessage(doctorReply);
      playNotificationSound();
      saveChatHistory();
    } catch (err) {
      console.warn("Groq API error, using smart local fallback engine:", err);
      removeTypingIndicator();
      const fallbackReply = generateSmartLocalRemedy(query);
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
    chatInput.style.height = Math.min(chatInput.scrollHeight, 120) + "px";
  });

  // Shift+Enter vs Enter
  chatInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      chatForm.dispatchEvent(new Event("submit"));
    }
  });

  // Quick Prompts
  quickPromptBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      const promptText = btn.dataset.prompt;
      chatInput.value = promptText;
      chatInput.focus();
      chatForm.dispatchEvent(new Event("submit"));
    });
  });

  // Clear Chat
  clearChatBtn.addEventListener("click", () => {
    if (confirm("کیا آپ تمام گفتگو صاف کرنا چاہتے ہیں؟")) {
      conversationHistory = [{ role: "system", content: SYSTEM_PROMPT }];
      localStorage.removeItem("ispeshifaa_chat_history");
      chatMessages.innerHTML = `
        <div class="message-row bot">
          <img src="assets/logo.jpg" alt="ڈاکٹر" class="msg-avatar">
          <div class="msg-bubble">
            <p><strong>السلام علیکم و رحمتہ اللہ!</strong></p>
            <p>میں <strong>اسپِ شفا</strong> کا اے آئی ویٹرنری ڈاکٹر ہوں۔ نیزہ بازی اور گھوڑوں کی صحت، بیماریوں، پٹھوں کے کھچاؤ، چوٹ، سوجن یا کچن کے دیسی نسخوں کے متعلق اپنا سوال پوچھیں، میں فوری مکمل رہنمائی فراہم کروں گا۔</p>
          </div>
        </div>
      `;
    }
  });
}

function getApiKey() {
  return localStorage.getItem("ispeshifaa_groq_key") || DEFAULT_GROQ_KEY;
}

function getSelectedModel() {
  return localStorage.getItem("ispeshifaa_groq_model") || DEFAULT_MODEL;
}

async function callGroqVeterinaryAI(userQuery) {
  conversationHistory.push({ role: "user", content: userQuery });

  const apiKey = getApiKey();
  const model = getSelectedModel();

  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: model,
      messages: conversationHistory,
      temperature: 0.6,
      max_tokens: 1500
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
function generateSmartLocalRemedy(userQuery) {
  const queryLower = userQuery.toLowerCase();
  
  // Find matching remedy from data
  let match = REMEDIES_DATA.find(r => 
    queryLower.includes(r.title.toLowerCase()) ||
    queryLower.includes(r.categoryUrdu.toLowerCase()) ||
    r.ingredients.some(i => queryLower.includes(i.name.toLowerCase()))
  );

  if (!match) {
    if (queryLower.includes("موچ") || queryLower.includes("سوجن") || queryLower.includes("چوٹ") || queryLower.includes("پٹھے")) {
      match = REMEDIES_DATA[0]; // Turmeric poultice
    } else if (queryLower.includes("پیٹ") || queryLower.includes("درد") || queryLower.includes("گیس") || queryLower.includes("قولنج")) {
      match = REMEDIES_DATA[3]; // Colic decoction
    } else if (queryLower.includes("طاقت") || queryLower.includes("ونڈا") || queryLower.includes("خوراک") || queryLower.includes("نیزہ بازی")) {
      match = REMEDIES_DATA[6]; // Shahi Wanda
    } else if (queryLower.includes("کھر") || queryLower.includes("نعل") || queryLower.includes("سڑاند")) {
      match = REMEDIES_DATA[9]; // Hoof oil
    } else if (queryLower.includes("سانس") || queryLower.includes("دم") || queryLower.includes("کھانسی")) {
      match = REMEDIES_DATA[11]; // Garlic bolus
    } else {
      match = REMEDIES_DATA[0];
    }
  }

  const fallback = `**تشخیص و دیسی علاج: ${match.title}**

**1. ضروری اجزاء اور درست مقدار:**
${match.ingredients.map(ing => `• **${ing.name}**: ${ing.amount}`).join('\n')}

**2. طریقہ تیاری و استعمال (قدم بہ قدم):**
${match.steps.map((st, idx) => `${idx + 1}. ${st}`).join('\n')}

**3. سائنسی و روایتی افادیت:**
${match.mechanism}

**4. نیزہ بازی ٹریننگ و احتیاطی تدابیر:**
${match.precautions}

**اہم وارننگ:**
${match.warning}`;

  conversationHistory.push({ role: "assistant", content: fallback });
  return fallback;
}

function appendUserMessage(text) {
  const chatMessages = document.getElementById("chat-messages");
  const msgRow = document.createElement("div");
  msgRow.className = "message-row user";
  msgRow.innerHTML = `
    <div class="msg-bubble">
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
  chatMessages.scrollTop = chatMessages.scrollHeight;
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
// Speech Synthesis (Urdu Voice Output) & Recognition
// ---------------------------------------------------------
function initVoiceRecognition() {
  const voiceBtn = document.getElementById("voice-btn");
  const chatInput = document.getElementById("chat-input");

  if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
    voiceBtn.style.display = "none";
    return;
  }

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  recognition = new SpeechRecognition();
  recognition.continuous = false;
  recognition.interimResults = false;
  recognition.lang = 'ur-PK';

  recognition.onstart = () => {
    isRecording = true;
    voiceBtn.classList.add("recording");
    chatInput.placeholder = "بولیں، میں سن رہا ہوں...";
  };

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    chatInput.value = transcript;
    chatInput.dispatchEvent(new Event('input'));
  };

  recognition.onerror = (event) => {
    console.warn("Speech error:", event.error);
    isRecording = false;
    voiceBtn.classList.remove("recording");
    chatInput.placeholder = "اپنے گھوڑے کی علامت یا مسئلہ یہاں لکھیں...";
  };

  recognition.onend = () => {
    isRecording = false;
    voiceBtn.classList.remove("recording");
    chatInput.placeholder = "اپنے گھوڑے کی علامت یا مسئلہ یہاں لکھیں...";
  };

  voiceBtn.addEventListener("click", () => {
    if (isRecording) {
      recognition.stop();
    } else {
      try {
        recognition.start();
      } catch (e) {
        console.error(e);
      }
    }
  });
}

window.speakText = function(btn) {
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
  const textContent = bubble.innerText.replace(/🔊 سنیں|📋 کاپی|🖨️ پرنٹ کارڈ/g, '').trim();

  currentSpeechUtterance = new SpeechSynthesisUtterance(textContent);
  currentSpeechUtterance.lang = "ur";
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

window.copyPrescription = function(btn) {
  const bubble = btn.closest(".msg-bubble");
  const textContent = bubble.innerText.replace(/🔊 سنیں|📋 کاپی|🖨️ پرنٹ کارڈ/g, '').trim();
  navigator.clipboard.writeText(textContent).then(() => {
    const original = btn.innerHTML;
    btn.innerHTML = `<span>✅ کاپی ہو گیا!</span>`;
    setTimeout(() => btn.innerHTML = original, 2000);
  });
};

window.openPrintModalFromMsg = function(btn) {
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

window.openRemedyDetailModal = function(remedyId) {
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

window.askAiAboutRemedy = function(title) {
  document.getElementById("remedy-detail-modal").classList.remove("open");
  const tabBtn = document.querySelector('[data-tab="chat-tab"]');
  if (tabBtn) tabBtn.click();
  const chatInput = document.getElementById("chat-input");
  chatInput.value = `مجھے '${title}' کے بارے میں مزید تفصیل اور احتیاط بتائیں۔`;
  document.getElementById("chat-form").dispatchEvent(new Event("submit"));
};

window.printRemedyDirectly = function(remedyId) {
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

window.askAiAboutItem = function(itemName) {
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
  const saveSettingsBtn = document.getElementById("save-settings-btn");
  const resetSettingsBtn = document.getElementById("reset-settings-btn");

  if (settingsBtn) {
    settingsBtn.addEventListener("click", () => {
      apiKeyInput.value = getApiKey();
      modelSelect.value = getSelectedModel();
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
      settingsModal.classList.remove("open");
      alert("سیٹنگز کامیابی سے محفوظ ہو گئیں!");
    });
  }

  if (resetSettingsBtn) {
    resetSettingsBtn.addEventListener("click", () => {
      localStorage.removeItem("ispeshifaa_groq_key");
      localStorage.removeItem("ispeshifaa_groq_model");
      apiKeyInput.value = DEFAULT_GROQ_KEY;
      modelSelect.value = DEFAULT_MODEL;
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

// 1. Định nghĩa kiểu dữ liệu (Interface) bằng TypeScript
interface VocabItem {
  word: string;
  phonetic: string;
  meaning: string;
  example: string;
}

interface UserProgress {
  xp: number;
  streak: number;
  lastActive: string;
}

// 2. Danh sách từ vựng có gán kiểu dữ liệu
const deck: VocabItem[] = [
  { word: "Persevere", phonetic: "/ˌpɜː.sɪˈvɪər/", meaning: "Kiên trì, bền chí", example: "She persevered through all hardships to graduate." },
  { word: "Resilient", phonetic: "/rɪˈzɪl.jənt/", meaning: "Kiên cường, mau hồi phục", example: "He is resilient and never gives up easily." },
  { word: "Eloquent", phonetic: "/ˈel.ə.kwənt/", meaning: "Lưu loát, hùng biện", example: "Her presentation was both eloquent and convincing." },
  { word: "Diligent", phonetic: "/ˈdɪl.ɪ.dʒənt/", meaning: "Cần cù, chăm chỉ", example: "Diligent practice makes progress." },
  { word: "Innovative", phonetic: "/ˈɪn.ə.veɪ.tɪv/", meaning: "Sáng tạo, đổi mới", example: "They developed an innovative English learning tool." }
];

let activeIdx: number = 0;
let isFlipped: boolean = false;

// 3. Khởi tạo và kiểm tra tiến độ người dùng
let xp: number = parseInt(localStorage.getItem('user_xp') || '0', 10);
let streak: number = parseInt(localStorage.getItem('user_streak') || '1', 10);
const today: string = new Date().toISOString().slice(0, 10);
const lastActive: string | null = localStorage.getItem('last_active_date');

if (lastActive) {
  const diffTime: number = Math.abs(new Date(today).getTime() - new Date(lastActive).getTime());
  const diffDays: number = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 1) {
    streak += 1;
    localStorage.setItem('user_streak', streak.toString());
  } else if (diffDays > 1) {
    streak = 1;
    localStorage.setItem('user_streak', streak.toString());
  }
}
localStorage.setItem('last_active_date', today);

// 4. Các hàm thao tác DOM và giao diện
function renderCard(): void {
  const item: VocabItem = deck[activeIdx];
  
  (document.getElementById('cardWord') as HTMLElement).innerText = item.word;
  (document.getElementById('cardPhonetic') as HTMLElement).innerText = item.phonetic;
  (document.getElementById('cardMeaning') as HTMLElement).innerText = item.meaning;
  (document.getElementById('cardExample') as HTMLElement).innerText = `"${item.example}"`;
  (document.getElementById('counter') as HTMLElement).innerText = `${activeIdx + 1} / ${deck.length}`;
  
  (document.getElementById('dictationInput') as HTMLInputElement).value = '';
  (document.getElementById('dictationFeedback') as HTMLElement).className = 'hidden';
  (document.getElementById('xpDisplay') as HTMLElement).innerText = xp.toString();
  (document.getElementById('streakDisplay') as HTMLElement).innerText = streak.toString();

  if (isFlipped) toggleFlip();
}

function toggleFlip(): void {
  isFlipped = !isFlipped;
  const cardElement = document.getElementById('flashcard') as HTMLElement;
  cardElement.classList.toggle('rotate-y-180', isFlipped);
}

// 5. Phát âm chuẩn dùng Web Speech API
function playSpeech(): void {
  const text: string = deck[activeIdx].word;
  const utterance: SpeechSynthesisUtterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "en-US";
  utterance.rate = 0.85;
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utterance);
}

// 6. Kiểm tra gõ chính tả
function verifyInput(): void {
  const inputEl = document.getElementById('dictationInput') as HTMLInputElement;
  const val: string = inputEl.value.trim().toLowerCase();
  const target: string = deck[activeIdx].word.toLowerCase();
  const fb = document.getElementById('dictationFeedback') as HTMLElement;

  if (val === target) {
    fb.innerText = "✓ Hoàn toàn chính xác! +10 XP";
    fb.className = "text-xs mt-2 font-bold text-emerald-600 block";
    xp += 10;
    localStorage.setItem('user_xp', xp.toString());
    (document.getElementById('xpDisplay') as HTMLElement).innerText = xp.toString();
  } else {
    fb.innerText = `✕ Chưa đúng! Từ chuẩn là: "${deck[activeIdx].word}"`;
    fb.className = "text-xs mt-2 font-medium text-rose-500 block";
  }
}

function changeCard(direction: number): void {
  activeIdx = (activeIdx + direction + deck.length) % deck.length;
  renderCard();
}

// Khởi chạy khi load trang
renderCard();
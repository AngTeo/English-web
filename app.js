"use strict";
// 2. Danh sách từ vựng có gán kiểu dữ liệu
const deck = [
    { word: "Persevere", phonetic: "/ˌpɜː.sɪˈvɪər/", meaning: "Kiên trì, bền chí", example: "She persevered through all hardships to graduate." },
    { word: "Resilient", phonetic: "/rɪˈzɪl.jənt/", meaning: "Kiên cường, mau hồi phục", example: "He is resilient and never gives up easily." },
    { word: "Eloquent", phonetic: "/ˈel.ə.kwənt/", meaning: "Lưu loát, hùng biện", example: "Her presentation was both eloquent and convincing." },
    { word: "Diligent", phonetic: "/ˈdɪl.ɪ.dʒənt/", meaning: "Cần cù, chăm chỉ", example: "Diligent practice makes progress." },
    { word: "Innovative", phonetic: "/ˈɪn.ə.veɪ.tɪv/", meaning: "Sáng tạo, đổi mới", example: "They developed an innovative English learning tool." }
];
let activeIdx = 0;
let isFlipped = false;
// 3. Khởi tạo và kiểm tra tiến độ người dùng
let xp = parseInt(localStorage.getItem('user_xp') || '0', 10);
let streak = parseInt(localStorage.getItem('user_streak') || '1', 10);
const today = new Date().toISOString().slice(0, 10);
const lastActive = localStorage.getItem('last_active_date');
if (lastActive) {
    const diffTime = Math.abs(new Date(today).getTime() - new Date(lastActive).getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays === 1) {
        streak += 1;
        localStorage.setItem('user_streak', streak.toString());
    }
    else if (diffDays > 1) {
        streak = 1;
        localStorage.setItem('user_streak', streak.toString());
    }
}
localStorage.setItem('last_active_date', today);
// 4. Các hàm thao tác DOM và giao diện
function renderCard() {
    const item = deck[activeIdx];
    document.getElementById('cardWord').innerText = item.word;
    document.getElementById('cardPhonetic').innerText = item.phonetic;
    document.getElementById('cardMeaning').innerText = item.meaning;
    document.getElementById('cardExample').innerText = `"${item.example}"`;
    document.getElementById('counter').innerText = `${activeIdx + 1} / ${deck.length}`;
    document.getElementById('dictationInput').value = '';
    document.getElementById('dictationFeedback').className = 'hidden';
    document.getElementById('xpDisplay').innerText = xp.toString();
    document.getElementById('streakDisplay').innerText = streak.toString();
    if (isFlipped)
        toggleFlip();
}
function toggleFlip() {
    isFlipped = !isFlipped;
    const cardElement = document.getElementById('flashcard');
    cardElement.classList.toggle('rotate-y-180', isFlipped);
}
// 5. Phát âm chuẩn dùng Web Speech API
function playSpeech() {
    const text = deck[activeIdx].word;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = 0.85;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
}
// 6. Kiểm tra gõ chính tả
function verifyInput() {
    const inputEl = document.getElementById('dictationInput');
    const val = inputEl.value.trim().toLowerCase();
    const target = deck[activeIdx].word.toLowerCase();
    const fb = document.getElementById('dictationFeedback');
    if (val === target) {
        fb.innerText = "✓ Hoàn toàn chính xác! +10 XP";
        fb.className = "text-xs mt-2 font-bold text-emerald-600 block";
        xp += 10;
        localStorage.setItem('user_xp', xp.toString());
        document.getElementById('xpDisplay').innerText = xp.toString();
    }
    else {
        fb.innerText = `✕ Chưa đúng! Từ chuẩn là: "${deck[activeIdx].word}"`;
        fb.className = "text-xs mt-2 font-medium text-rose-500 block";
    }
}
function changeCard(direction) {
    activeIdx = (activeIdx + direction + deck.length) % deck.length;
    renderCard();
}
// Khởi chạy khi load trang
renderCard();

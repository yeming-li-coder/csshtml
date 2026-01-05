const STORAGE_KEY = 'chat_history_v1';
let chatHistory = [];

export function addMessageToHistory(text, role) {
  chatHistory.push({ text, role });
  saveHistory();
}

/**
 * 加载历史记录
 * 控制反转 (IoC)：该函数只负责获取数据，不负责 UI 展示
 * @returns {Array} 历史记录数组
 */
export function loadHistory() {
  const raw = localStorage.getItem(STORAGE_KEY);
  chatHistory = JSON.parse(raw ?? "[]");
  return chatHistory;
}

function saveHistory() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(chatHistory));
}

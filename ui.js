export const elements = {
  chatMessages: document.querySelector(".messages"),
  chatInput: document.querySelector(".chat-input"), // 假设你给 input 加了这个类名
  sendButton: document.querySelector(".send-btn"), // 假设你有发送按钮
  abortButton: document.querySelector(".abort-btn"), // 假设你有取消按钮
};


export function addMessage(text, role) {
  // 1. 创建容器 div
  const rowDiv = document.createElement("div");
  rowDiv.classList.add("message-row");
  rowDiv.classList.add(role === "user" ? "user-row" : "ai-row");

  // 2. 这里的 HTML 结构要和你昨日写的 CSS 匹配
  const avatarDiv = document.createElement("div");
  avatarDiv.className = `avatar ${role}-avatar`;
  avatarDiv.textContent = role === "user" ? "👨‍💻" : "🤖";

  const bubbleDiv = document.createElement("div");
  bubbleDiv.className = `bubble ${role}-bubble`;
  bubbleDiv.textContent = "";

  rowDiv.appendChild(avatarDiv);
  rowDiv.appendChild(bubbleDiv);

  // 3. 挂载到树上
  elements.chatMessages.appendChild(rowDiv);

  // 4. 打字机效果：每个单词间隔 100ms
  // 使用正则匹配单词（包括空格），这样能保持原有的空格结构
  const words = text.match(/\S+|\s+/g) || [];

  for (const word of words) {
    bubbleDiv.textContent += word;
    // 5. 自动滚动到底部 (每次添加单词都滚动，确保可见)
    elements.chatMessages.scrollTop = elements.chatMessages.scrollHeight;
  }
  return bubbleDiv
}



export function addLoadingBubble() {
  const rowDiv = document.createElement("div");
  rowDiv.classList.add("message-row");
  rowDiv.id = "current-loading-row";

  const loadingBubble = document.createElement("div");
  loadingBubble.className = "loading-bubble";

  for (let i = 0; i < 3; i++) {
    const dot = document.createElement("div");
    dot.className = "dot";
    loadingBubble.appendChild(dot);
  }

  rowDiv.appendChild(loadingBubble);
  elements.chatMessages.appendChild(rowDiv);
  elements.chatMessages.scrollTop = elements.chatMessages.scrollHeight;
}

export function removeLoadingBubble() {
  const loadingRow = document.getElementById("current-loading-row");
  if (loadingRow) {
    loadingRow.remove();
  }
}

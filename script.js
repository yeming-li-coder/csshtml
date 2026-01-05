import { addMessageToHistory, loadHistory } from "./storage.js";
import {
  addMessage,
  elements,
  addLoadingBubble,
  removeLoadingBubble,
} from "./ui.js";
const { chatMessages, chatInput, sendButton, abortButton } = elements;

// 选择器语法和 CSS 完全一样
let isGenerating = false;
let abortController = null;
const decoder = new TextDecoder("utf-8");

async function handleSend() {
  if (isGenerating) return;

  const text = chatInput.value.trim(); // 去除首尾空格
  if (!text) return; // 空消息不发

  // 1. 设置状态为生成中
  isGenerating = true;

  // 2. 清空输入框
  chatInput.disabled = true;
  sendButton.textContent = "Thinking...";
  sendButton.style.cursor = "not-allowed"; // 可选：鼠标变禁止手势
  sendButton.disabled = true;
  try {
    addMessage(text, "user");
    addMessageToHistory(text, "user");
    chatInput.value = "";
    addLoadingBubble();
    abortController = new AbortController();
    abortButton.disabled = false;

    await new Promise((resolve) => setTimeout(resolve, 1000));
    // await new Promise((resolve) => setTimeout(resolve, 1000));

    const response = await fetch(
      "https://jsonplaceholder.typicode.com/comments/1",
      { signal: abortController.signal }
    );
    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status} ${response.statusText}`);
    }
    const reader = await response.body.getReader();
    removeLoadingBubble();
    let currentBubble = await addMessage("", "ai");
    while (true) {
      const { done, value } = await reader.read();
      console.log(done, value);
      if (done) break;
      const chunk = decoder.decode(value, { stream: true });
      currentBubble.textContent += chunk;
      await new Promise((resolve) => setTimeout(resolve, 50));
    }
    addMessageToHistory(currentBubble.textContent, "ai");
  } catch (error) {
    if (error.name === "AbortError") {
      console.log("Request aborted:", error);
    } else {
      console.error("Error: ", error);
    }
  } finally {
    removeLoadingBubble();
    isGenerating = false;
    sendButton.textContent = "Send";
    sendButton.style.cursor = "pointer"; // 可选：鼠标变指针手势
    chatInput.disabled = false;
    sendButton.disabled = false;
    abortButton.disabled = true;
    abortController = null;
    chatInput.focus();
  }
}

// 绑定点击事件
sendButton.addEventListener("click", handleSend);
abortButton.addEventListener("click", () => {
  abortController?.abort();
  abortButton.disabled = true;
});
// 绑定回车键事件 (UX 优化)
chatInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") handleSend();
});

window.addEventListener("DOMContentLoaded", () => {
  const history = loadHistory();
  history.forEach((msg) => {
    addMessage(msg.text, msg.role);
  });
});

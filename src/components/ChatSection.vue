<script setup>
import { ref, onMounted } from "vue";

const props = defineProps({
  pictureId: {
    type: String,
    required: true,
  },
});

const messages = ref([]);
const newMessage = ref("");

const fetchMessages = async () => {
  try {
    const response = await fetch(
      `http://localhost:3000/api/messages/${props.pictureId}/messages`
    );
    if (!response.ok) throw new Error("Failed to fetch messages");
    const data = await response.json();
    messages.value = data;
    console.log("Raw fetched messages data:", JSON.parse(JSON.stringify(data)));
  } catch (error) {
    console.error("Error:", error);
  }
};

onMounted(() => {
  fetchMessages();
});

const sendMessage = async () => {
  if (!newMessage.value.trim()) return;

  try {
    const response = await fetch("http://localhost:3000/api/messages/picture", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        pictureId: parseInt(props.pictureId),
        userName: "Me",
        content: newMessage.value,
      }),
    });

    if (!response.ok) throw new Error("Failed to send message");
    const savedMessage = await response.json();
    messages.value.push(savedMessage);
    newMessage.value = "";
  } catch (error) {
    console.error("Error sending message:", error);
  }
};
</script>

<template>
  <div class="chat-section">
    <div class="chat-header">
      <h2>Chat</h2>
    </div>

    <div class="messages-container" ref="messagesContainer">
      <div v-if="messages.length === 0" class="no-messages">
        No messages yet
      </div>
      <div v-else v-for="message in messages" :key="message.id" class="message">
        <strong>{{ message.userName }}</strong>
        <p>{{ message.content }}</p>
      </div>
    </div>

    <div class="message-input">
      <input
        v-model="newMessage"
        type="text"
        placeholder="Type your message here"
        @keyup.enter="sendMessage"
      />
      <button @click="sendMessage">Send</button>
    </div>
  </div>
</template>

<style scoped>
.chat-section {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  height: 100%;
}

.chat-header {
  padding: 1rem;
  border-bottom: 1px solid #eee;
}

.chat-header h2 {
  margin: 0;
  color: #333;
}

.messages-container {
  flex-grow: 1;
  padding: 1rem;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.message {
  background: #f8f9fa;
  padding: 0.75rem;
  border-radius: 8px;
}

.message strong {
  color: #2c3e50;
  display: block;
  margin-bottom: 0.25rem;
}

.message p {
  margin: 0;
  color: #4a5568;
}

.message .timestamp {
  display: block;
  font-size: 0.75rem;
  color: #a0aec0;
  margin-top: 0.25rem;
}

.message-input {
  padding: 1rem;
  border-top: 1px solid #eee;
  display: flex;
  gap: 0.5rem;
}

.message-input input {
  flex-grow: 1;
  padding: 0.5rem 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 20px;
  outline: none;
}

.message-input button {
  padding: 0.5rem 1rem;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.message-input button:hover {
  background: #2563eb;
}

.no-messages {
  text-align: center;
  color: #666;
  padding: 2rem;
  font-style: italic;
}
</style>

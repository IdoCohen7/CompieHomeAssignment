<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const picture = ref(null);
const messages = ref([]);
const newMessage = ref("");

onMounted(async () => {
  try {
    const response = await fetch(
      `http://localhost:3000/api/pictures/${route.params.id}`
    );
    if (!response.ok) throw new Error("Failed to fetch picture");
    picture.value = await response.json();
  } catch (error) {
    console.error("Error:", error);
  }
});

const sendMessage = () => {
  if (!newMessage.value.trim()) return;

  messages.value.push({
    id: Date.now(),
    text: newMessage.value,
    user: "Me",
    timestamp: new Date().toLocaleTimeString(),
  });

  newMessage.value = "";
};
</script>

<template>
  <div class="discussion-page" v-if="picture">
    <div class="content-container">
      <div class="picture-section">
        <h1>{{ picture.title }}</h1>
        <h2>by {{ picture.artist }}</h2>
        <img :src="picture.imageUrl" :alt="picture.title" />
        <p class="description">{{ picture.description }}</p>
      </div>

      <div class="chat-section">
        <div class="chat-header">
          <h2>Chat</h2>
        </div>

        <div class="messages-container" ref="messagesContainer">
          <div v-for="message in messages" :key="message.id" class="message">
            <strong>{{ message.user }}</strong>
            <p>{{ message.text }}</p>
            <span class="timestamp">{{ message.timestamp }}</span>
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
    </div>
  </div>
</template>

<style scoped>
.discussion-page {
  padding: 2rem;
  max-width: 1440px;
  margin: 0 auto;
}

.content-container {
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: 2rem;
  min-height: calc(100vh - 150px);
}

.picture-section {
  padding: 1rem;
}

.picture-section img {
  width: 100%;
  max-height: 70vh;
  object-fit: contain;
  margin: 1rem 0;
}

.picture-section h1 {
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

.picture-section h2 {
  color: #666;
  font-size: 1.2rem;
  margin-bottom: 1rem;
}

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

@media (max-width: 1024px) {
  .content-container {
    grid-template-columns: 1fr;
  }

  .chat-section {
    height: 500px;
  }
}
</style>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";

const props = defineProps({
  pictureId: {
    type: String,
    required: true,
  },
});

const messages = ref([]);
const newMessage = ref("");
const username = ref(localStorage.getItem("chatUsername") || "");

const promptUsername = () => {
  const newUsername = prompt(
    "Please enter your username to participate in the chat:"
  );
  if (newUsername?.trim()) {
    username.value = newUsername.trim();
    localStorage.setItem("chatUsername", username.value);
    return true;
  }
  return false;
};
const ws = ref(null);

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

const connectWebSocket = () => {
  ws.value = new WebSocket(import.meta.env.VITE_WEBSOCKET_URL);

  ws.value.onopen = () => {
    console.log("WebSocket Connected");
    // picture id to join specific chat room
    ws.value.send(
      JSON.stringify({
        type: "join",
        pictureId: props.pictureId,
      })
    );
  };

  ws.value.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.type === "error") {
      console.error("Server error:", data.message);
      return;
    }

    // ignoring confirmation messages
    if (data.type === "confirmation") {
      return;
    }

    // add message if it belongs to this picture
    if (data.pictureId === parseInt(props.pictureId)) {
      messages.value.push(data);
    }
  };

  ws.value.onclose = () => {
    console.log("WebSocket Disconnected");
    // try to reconnect after a delay
    setTimeout(connectWebSocket, 3000);
  };

  ws.value.onerror = (error) => {
    console.error("WebSocket Error:", error);
  };
};

onMounted(() => {
  fetchMessages();
  connectWebSocket();
});

onUnmounted(() => {
  if (ws.value) {
    ws.value.close();
  }
});

const sendMessage = async () => {
  if (!newMessage.value.trim()) return;

  // Check for username
  if (!username.value && !promptUsername()) {
    alert("You must provide a username to participate in the chat.");
    return;
  }

  try {
    const messageData = {
      pictureId: parseInt(props.pictureId),
      userName: username.value,
      content: newMessage.value,
    };

    // send via WebSocket
    if (ws.value && ws.value.readyState === WebSocket.OPEN) {
      ws.value.send(
        JSON.stringify({
          type: "message",
          ...messageData,
        })
      );
      // clear input
      newMessage.value = "";
    } else {
      // if WebSocket is not connected fallback to HTTP
      const response = await fetch(
        "http://localhost:3000/api/messages/picture",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(messageData),
        }
      );

      if (!response.ok) throw new Error("Failed to send message");
      const savedMessage = await response.json();
      messages.value.push(savedMessage);
      newMessage.value = "";
    }
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

<script lang="ts" setup>
import { useState } from "@/store/socket";
import { reactive } from "vue";
import { ref } from "vue";
import { watch } from "vue";
import { computed } from "vue";

const store = useState();
const messages = computed(() =>
  store.messages.filter((msg) => {
    return (
      (filter.gameId.length === 0 || filter.gameId.includes(msg.gameId)) &&
      (filter.sender.length === 0 || filter.sender.includes(msg.sender)) &&
      (filter.receiver.length === 0 || filter.receiver.includes(msg.receiver))
    );
  })
);

const autoDownEnabled = ref(true);
const filter = reactive({
  gameId: [] as number[],
  sender: [] as number[],
  receiver: [] as number[],
});

watch(messages, () => {
  if (autoDownEnabled.value) {
    window.scrollTo(0, document.body.scrollHeight + 20);
  }
});

const scrollUp = () => {
  window.scrollTo(0, 0);
};

const scrollDown = () => {
  autoDownEnabled.value = !autoDownEnabled.value;
  window.scrollTo(0, document.body.scrollHeight + 20);
};

const deleteAll = () => {
  store.clearMessages();
};

const getSender = (id: number) => {
  if (id === -1) {
    return "Server";
  } else if (id === -2) {
    return "Broadcast";
  } else {
    return `${id}`;
  }
};

const toggleGame = (id: number) => {
  const index = filter.gameId.indexOf(id);
  if (index === -1) {
    filter.gameId.push(id);
  } else {
    filter.gameId.splice(index, 1);
  }
};

const toggleSender = (id: number) => {
  const index = filter.sender.indexOf(id);
  if (index === -1) {
    filter.sender.push(id);
  } else {
    filter.sender.splice(index, 1);
  }
};

const toggleReceiver = (id: number) => {
  const index = filter.receiver.indexOf(id);
  if (index === -1) {
    filter.receiver.push(id);
  } else {
    filter.receiver.splice(index, 1);
  }
};
</script>

<template>
  <div
    style="
      top: 64px;
      position: sticky;
      max-width: 1200px;
      margin: 0 auto;
      padding: 16px;
      z-index: 10;
    "
  >
    <v-card>
      <v-card-title>
        <div class="d-flex align-center justify-space-center" style="gap: 8px">
          <span> Messages ({{ messages.length }}) </span>
          <div>
            <span
              v-for="g in filter.gameId"
              :key="`g-${g}`"
              class="chip chip--game"
              @click.stop="toggleGame(g)"
              >Game {{ g }}</span
            >
            <span
              v-for="s in filter.sender"
              :key="`s-${s}`"
              class="chip chip--sender"
              @click.stop="toggleSender(s)"
              >Sender {{ getSender(s) }}</span
            >
            <span
              v-for="r in filter.receiver"
              :key="`r-${r}`"
              class="chip chip--receiver"
              @click.stop="toggleReceiver(r)"
              >Receiver {{ getSender(r) }}</span
            >
          </div>
          <span style="flex-grow: 1"></span>
          <v-btn
            @click="scrollDown"
            :color="autoDownEnabled ? 'primary' : 'default'"
            icon="mdi-chevron-down-circle-outline"
          ></v-btn>
          <v-btn @click="deleteAll" variant="flat" icon="mdi-delete" />
        </div>
      </v-card-title>
    </v-card>
  </div>
  <v-container style="max-width: 1200px">
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-text>
            <v-list class="messages">
              <v-list-item
                v-for="message in messages"
                :key="message.timestamp"
                :value="message"
                class="my-1"
                @click="message.open = !message.open"
              >
                <template v-slot:prepend>
                  <v-icon
                    v-if="message.sender > 0"
                    @click.stop="message.flagged = !message.flagged"
                    icon="mdi-upload"
                  ></v-icon>
                  <v-icon
                    v-else-if="message.receiver == -2"
                    @click.stop="message.flagged = !message.flagged"
                    icon="mdi-broadcast"
                  ></v-icon>
                  <v-icon
                    v-else-if="message.sender == -1"
                    @click.stop="message.flagged = !message.flagged"
                    icon="mdi-download"
                  ></v-icon>
                </template>
                <template v-slot:title>
                  <div class="mb-2">
                    <span
                      class="chip chip--game"
                      @click.stop="toggleGame(message.gameId)"
                    >
                      <strong>{{ message.gameId }}</strong></span
                    >
                    <span
                      class="chip chip--sender"
                      @click.stop="toggleSender(message.sender)"
                    >
                      <strong>{{ getSender(message.sender) }}</strong></span
                    >
                    <span
                      class="chip chip--receiver"
                      @click.stop="toggleReceiver(message.receiver)"
                    >
                      <strong>{{ getSender(message.receiver) }}</strong></span
                    >
                  </div>
                </template>
                <template v-slot:subtitle>
                  <p v-if="!message.open">
                    {{ new Date(message.timestamp).toLocaleTimeString() }}
                    {{ message.zrpMessage }}
                  </p>
                  <div v-else>
                    <p>
                      {{ new Date(message.timestamp).toLocaleTimeString() }} |
                      <strong>{{ message.zrpMessage.substring(0, 3) }}</strong>
                    </p>
                    <p style="white-space: pre">
                      {{
                        JSON.stringify(
                          JSON.parse(message.zrpMessage.substring(4)),
                          null,
                          "    "
                        )
                      }}
                    </p>
                  </div>
                </template>
                <template v-slot:append>
                  <v-icon
                    v-if="message.flagged"
                    style="color: #d72121"
                    icon="mdi-flag"
                  ></v-icon>
                </template>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
  <v-btn
    @click="scrollUp"
    color="primary"
    icon="mdi-chevron-up-circle-outline"
    style="position: fixed; bottom: 2rem; right: 2rem"
  ></v-btn>
</template>

<style>
.v-list.messages {
  -webkit-line-clamp: unset !important;
}
.chip {
  border-radius: 4px;
  padding: 4px 8px;
  font-size: 0.8rem;
  margin-right: 8px;
}

.chip--game {
  background-color: #a807ae;
}

.chip--game:hover {
  background-color: #7f0883;
}

.chip--sender {
  background-color: #0ba4d2;
}

.chip--sender:hover {
  background-color: #0787ae;
}

.chip--receiver {
  background-color: #21a11b;
}

.chip--receiver:hover {
  background-color: #1c7e17;
}
</style>

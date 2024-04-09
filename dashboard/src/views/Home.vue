<script lang="ts" setup>
import { useState } from "@/store/socket";
import { watch } from "vue";
import { computed } from "vue";

const store = useState();
const messages = computed(() => store.messages);

watch(messages, () => {
  window.scrollTo(0, document.body.scrollHeight + 20);
});

const scrollUp = () => {
  window.scrollTo(0, 0);
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
</script>

<template>
  <v-container style="max-width: 1200px">
    <v-row>
      <v-col cols="12">
        <div style="top: 64px; position: sticky">
          <v-card-title>
            <div class="d-flex align-center justify-space-between">
              <span> Messages </span>
              <v-btn @click="deleteAll" variant="flat" icon="mdi-delete" />
            </div>
          </v-card-title>
        </div>
        <v-card>
          <v-card-text>
            <v-list>
              <v-list-item
                v-for="message in messages"
                :key="message.timestamp"
                :value="message"
                :title="`Game:  ${message.gameId} | From: ${getSender(
                  message.sender
                )} | To: ${getSender(message.receiver)}`"
                :subtitle="message.zrpMessage"
                color="primary"
                class="my-1"
              >
                <template v-slot:prepend>
                  <v-icon v-if="message.sender > 0" icon="mdi-upload"></v-icon>
                  <v-icon
                    v-else-if="message.receiver == -2"
                    icon="mdi-broadcast"
                  ></v-icon>
                  <v-icon
                    v-else-if="message.sender == -1"
                    icon="mdi-download"
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

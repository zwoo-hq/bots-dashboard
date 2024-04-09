<script lang="ts" setup>
import { onMounted, computed } from "vue";
import { useTheme } from "vuetify";

import { useState } from "../store/socket";
import { ListeningTarget } from "@zwoo/dashboard-client";
import { ref } from "vue";

const theme = useTheme();
const store = useState();
const targets = computed(() => store.targets);
const connected = computed(() => store.connected);
const activeTarget = ref<ListeningTarget | undefined>(undefined);

onMounted(async () => {
  theme.global.name.value = "dark";
  store.init();
});

const toggleTheme = () => {
  theme.global.name.value = theme.global.current.value.dark ? "light" : "dark";
};

const selectItemProps = (item: ListeningTarget) => {
  return {
    title: item.id,
    subtitle: item.instance,
  };
};

const selectedTarget = async (target: ListeningTarget) => {
  if (activeTarget.value) {
    await store.unlisten(activeTarget.value.id);
  }
  activeTarget.value = target;
  await store.listen(target.id);
};

const connect = async () => {
  await store.connect();
};
</script>

<template>
  <v-app>
    <v-layout>
      <v-app-bar>
        <v-app-bar-title>
          <span> Zwoo Bots Dashboard </span>
        </v-app-bar-title>

        <template v-slot:append>
          <div class="d-flex align-stretch justify-end h-auto w-100 mr-2">
            <v-btn
              v-if="!connected"
              @click="connect"
              variant="outlined"
              color="primary"
              >Connect</v-btn
            >
            <v-select
              v-else
              style="min-width: 200px"
              :model-value="activeTarget"
              @update:model-value="selectedTarget"
              :items="targets"
              variant="outlined"
              placeholder="Select a target"
              density="compact"
              :item-props="selectItemProps"
              return-object
            ></v-select>
          </div>

          <v-menu>
            <template v-slot:activator="{ props }">
              <v-btn icon="mdi-dots-vertical" v-bind="props" />
            </template>

            <v-list>
              <v-list-item style="cursor: pointer" @click="toggleTheme">
                <v-list-item-title>Toggle Theme</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </template>
      </v-app-bar>

      <v-main>
        <div class="px-4">
          <router-view />
        </div>
      </v-main>
    </v-layout>
  </v-app>
</template>

<style lang="css">
.v-toolbar {
  position: fixed !important;
}

.v-navigation-drawer {
  position: fixed !important;
}

.v-toolbar .v-input__details {
  display: none;
}
</style>

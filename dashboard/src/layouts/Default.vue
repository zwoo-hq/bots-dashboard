<script lang="ts" setup>
import { onMounted } from "vue";
import { useTheme } from "vuetify";

const theme = useTheme();

onMounted(async () => {
  theme.global.name.value = "dark";
});

const toggleTheme = () => {
  theme.global.name.value = theme.global.current.value.dark ? "light" : "dark";
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
</style>

import { defineStore } from "pinia";

import {
  Configuration,
  ListeningTarget,
  ProxyClient,
  ZRPeMessage,
} from "@zwoo/dashboard-client";

const _instance = new ProxyClient(Configuration.withUrl("ws://localhost:9072"));

export const useSocket = () => _instance;

export const useState = defineStore("socket", {
  state: () => ({
    connected: false,
    error: null as string | null,
    targets: [] as ListeningTarget[],
    listens: [] as string[],
    messages: [] as (ZRPeMessage & {
      timestamp: number;
      flagged?: boolean;
      open?: boolean;
    })[],
  }),
  actions: {
    init() {
      _instance.on("close", () => {
        this.connected = false;
      });
      _instance.on("open", () => {
        this.connected = true;
        this.targets = [];
      });
      _instance.on("error", (err) => {
        this.error = err.toString();
      });
      _instance.on("targetsUpdated", (targets) => {
        this.targets = targets;
        this.listens = this.listens.filter((l) =>
          targets.some((t) => t.id === l)
        );
      });
      _instance.on("message", (msg) => {
        this.messages = [
          ...this.messages,
          {
            ...msg,
            timestamp: Date.now(),
          },
        ];
      });
    },
    async connect() {
      await _instance.connect();
    },
    async listen(id: string) {
      await _instance.listen(id);
    },
    async unlisten(id: string) {
      await _instance.unlisten(id);
    },
    clearMessages() {
      this.messages = [];
    },
  },
});

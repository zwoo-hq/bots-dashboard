declare global {
  namespace NodeJS {
    interface ProcessEnv {
      ZRP_DEBUG_PROXY_URL: string;
    }
  }
}

export {};

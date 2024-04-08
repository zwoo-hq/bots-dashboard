/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly ZRP_DEBUG_PROXY_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

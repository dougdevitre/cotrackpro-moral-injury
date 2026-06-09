/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_CRISIS_LABEL?: string;
  readonly VITE_CRISIS_BODY?: string;
  readonly VITE_PROVIDER_NAME?: string;
  readonly VITE_PROVIDER_NUMBER?: string;
  readonly VITE_COURSE_AUTHOR?: string;
  readonly VITE_COURSE_AUTHOR_QUALS?: string;
  readonly VITE_PROVIDER_CONTACT?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare module '*.vjson' {
  const value: any;
  export default value;
}
declare module '*.vjson?raw' {
  const content: string;
  export default content;
}

interface ImportMetaEnv {
  readonly VITE_SHAPEDIVER_TICKET: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
} 
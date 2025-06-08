// filepath: c:\Projetos\Projetos-code\Meu PC\cubari-proxy\src\types\buffer.d.ts

declare global {
  interface Window {
    Buffer: typeof Buffer;
  }
}

// Isso garante que o arquivo seja tratado como um módulo.
export {};

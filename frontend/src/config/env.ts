/**
 * Typed, validated access to environment variables.
 * All runtime configuration flows through this module so the rest of the
 * codebase never touches `import.meta.env` directly.
 */

interface AppEnv {
  apiBaseUrl: string
  appName: string
  isDev: boolean
  isProd: boolean
}

function readString(key: string, fallback: string): string {
  const value = import.meta.env[key as keyof ImportMetaEnv]
  return typeof value === 'string' && value.length > 0 ? value : fallback
}

export const env: AppEnv = {
  // Relative by default so requests stay same-origin and use the Vite proxy
  // (defined in vite.config.ts) — this keeps CORS out of the picture, including
  // when the frontend is served through an ngrok tunnel.
  apiBaseUrl: readString('VITE_API_BASE_URL', '/api'),
  appName: readString('VITE_APP_NAME', 'TransitOps'),
  isDev: import.meta.env.DEV,
  isProd: import.meta.env.PROD,
}

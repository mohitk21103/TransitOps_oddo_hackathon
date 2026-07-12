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
  apiBaseUrl: readString('VITE_API_BASE_URL', 'http://localhost:8080/api'),
  appName: readString('VITE_APP_NAME', 'TransitOps'),
  isDev: import.meta.env.DEV,
  isProd: import.meta.env.PROD,
}

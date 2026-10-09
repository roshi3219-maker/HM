export type UsageSnapshot = {
  limits: { label: string; percentUsed: number }[]
  contextPercentUsed: number | null
  costUsd: number | null
}

declare module 'claude-code' {
  interface PluginState {
    'usage-footer': { snapshot: UsageSnapshot | null; text: string | null }
  }
}

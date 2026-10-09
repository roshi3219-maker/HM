export type UsageLine = string

declare module 'claude-code' {
  interface PluginState {
    'usage-footer': { text: UsageLine | null }
  }
}

import { atom, read, update } from 'claude-code'
import type { Register, SessionMeasureInput, SessionRateLimit } from 'claude-code'

import type { UsageSnapshot } from '../types'

const PANE = 'usage-footer'
const snapshot = atom({ plugin: 'usage-footer', key: 'snapshot' } as const, null)
const line = atom({ plugin: 'usage-footer', key: 'text' } as const, null)

const labels: Record<string, string> = {
  five_hour: '5h',
  seven_day: '7d',
  spend_limit: 'spend'
}

const left = (percentUsed: number) => Math.max(0, Math.round(100 - percentUsed))

export const bar = (percentUsed: number, width = 12): string => {
  const used = Math.min(width, Math.max(0, Math.round((percentUsed / 100) * width)))

  return '█'.repeat(used) + '░'.repeat(width - used)
}

export const shade = (percentUsed: number): 'success' | 'warning' | 'error' =>
  percentUsed >= 90 ? 'error' : percentUsed >= 70 ? 'warning' : 'success'

export const split = (percentUsed: number, width = 12): [number, number] => {
  const used = Math.min(width, Math.max(0, Math.round((percentUsed / 100) * width)))

  return [used, width - used]
}

export const format = (
  rateLimits: SessionRateLimit[],
  contextPercent?: number
): string | undefined => {
  const parts = rateLimits.map(
    r => `${labels[r.kind] ?? r.kind} ${left(r.percentUsed)}% left`
  )

  if (contextPercent !== undefined) {
    parts.push(`context ${left(contextPercent)}% left`)
  }

  return parts.length > 0 ? parts.join(' · ') : undefined
}

const take = (e: Pick<SessionMeasureInput, 'rateLimits' | 'context' | 'cost'>): UsageSnapshot => ({
  limits: e.rateLimits.map(r => ({
    label: labels[r.kind] ?? r.kind,
    percentUsed: r.percentUsed
  })),
  contextPercentUsed: e.context.percent ?? null,
  costUsd: e.cost?.usd ?? null
})

const rows = (s: UsageSnapshot) => {
  const out = s.limits.map(l => ({ label: l.label, used: l.percentUsed }))

  if (s.contextPercentUsed !== null) {
    out.push({ label: 'context', used: s.contextPercentUsed })
  }

  return out
}

export const register: Register = on => {
  on('session.start', async ($, e, next) => {
    await $.command.register({
      name: 'remaining',
      description: 'Show remaining usage'
    })
    await $.command.register({
      name: 'pane',
      description: 'Open the usage pane'
    })
    void $.ui.open({ id: PANE, title: 'Usage' })

    return next(e)
  })

  on('command.run', { command: 'pane' }, async $ => {
    const { isPlaced } = await $.ui.open({ id: PANE, title: 'Usage' })

    return { text: isPlaced ? 'Usage pane opened.' : 'Usage pane is not drawn here.' }
  })

  on('command.run', { command: 'remaining' }, async $ => {
    const u = await $.session.usage()
    const text = format(u.rateLimits, u.context.percent)
    const cost = u.cost ? ` · $${u.cost.usd.toFixed(2)} spent` : ''

    return { text: `${text ?? 'usage: no rate-limit data'}${cost}` }
  })

  on('session.measure', async ($, e, next) => {
    const text = format(e.rateLimits, e.context.percent)
    const cost = e.cost ? ` · $${e.cost.usd.toFixed(2)} spent` : ''

    await update($, snapshot, () => take(e))
    await update($, line, () => `${text ?? 'usage: no rate-limit data'}${cost}`)

    return next(e)
  })

  on('ui.render', { component: 'Pane', requestId: PANE }, async ($, e) => {
    const snap = await read($, snapshot)
    const { Box, Text } = $.ui.resolve(e)

    if (snap === null) {
      return (
        <Box>
          <Text dimColor>waiting for the first measurement…</Text>
        </Box>
      )
    }

    const list = rows(snap)

    return (
      <Box flexDirection="column">
        {list.map(r => {
          const [filled, empty] = split(r.used)

          return (
            <Box key={r.label}>
              <Text>{r.label.padEnd(8)}</Text>
              <Text color={shade(r.used)}>{'█'.repeat(filled)}</Text>
              <Text dimColor>{'░'.repeat(empty)}</Text>
              <Text> {left(r.used)}% left</Text>
            </Box>
          )
        })}
        <Text dimColor>
          {snap.costUsd === null
            ? 'cost: n/a'
            : `used $${snap.costUsd.toFixed(2)} this session`}
          {list.length === 0 ? ' · no rate-limit data' : ''}
        </Text>
      </Box>
    )
  })

  on('ui.render', { component: 'AbovePrompt' }, async ($, e, next) => {
    const snap = await read($, snapshot)

    if (e.props.hasSurvey || snap === null) {
      return next(e)
    }

    const { Box, Text } = $.ui.resolve(e)
    const list = rows(snap)

    return (
      <Box flexDirection="column">
        {list.map(r => {
          const [filled, empty] = split(r.used)

          return (
            <Box key={r.label}>
              <Text dimColor>{r.label.padEnd(8)}</Text>
              <Text color={shade(r.used)}>{'█'.repeat(filled)}</Text>
              <Text dimColor>{'░'.repeat(empty)}</Text>
              <Text dimColor> {left(r.used)}% left</Text>
            </Box>
          )
        })}
        <Text dimColor>
          {snap.costUsd === null
            ? 'cost: n/a'
            : `used $${snap.costUsd.toFixed(2)} this session`}
          {list.length === 0 ? ' · no rate-limit data' : ''}
        </Text>
      </Box>
    )
  })
}

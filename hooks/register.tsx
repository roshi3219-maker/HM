import { atom, read, update } from 'claude-code'
import type { Register, SessionRateLimit } from 'claude-code'

const PANE = 'usage-footer'
const line = atom({ plugin: 'usage-footer', key: 'text' } as const, null)

const labels: Record<string, string> = {
  five_hour: '5h',
  seven_day: '7d',
  spend_limit: 'spend'
}

const left = (percentUsed: number) => Math.max(0, Math.round(100 - percentUsed))

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
    const full = `${text ?? 'usage: no rate-limit data'}${cost}`

    await update($, line, () => full)

    return next(e)
  })

  on('ui.render', { component: 'Pane', requestId: PANE }, async ($, e) => {
    const text = await read($, line)
    const { Box, Text } = $.ui.resolve(e)

    return (
      <Box>
        <Text>{text ?? 'waiting for the first measurement…'}</Text>
      </Box>
    )
  })
}

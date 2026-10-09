import { expect, test } from 'claude-code/testing'

const props = {
  hasSurvey: false,
  isWorking: false,
  maxRows: 10,
  bodyColumns: 80,
  scroll: { offset: 0, bodyRows: 10 },
  view: {}
}

test('the usage bars draw on terminal and desktop', async ($, on) => {
  on('session.measure', (_$, e) => ({ changed: e.changed }) as never)
  await $.session.measure({
    context: { percent: 15 },
    rateLimits: [
      { kind: 'five_hour', percentUsed: 33 },
      { kind: 'seven_day', percentUsed: 95 }
    ],
    cost: { usd: 0.1 },
    changed: ['five_hour']
  } as never)

  for (const surface of ['terminal', 'desktop'] as const) {
    const ui = await $.ui.mount({
      plugin: 'usage-footer',
      surface,
      component: 'AbovePrompt',
      props
    })
    expect(await ui.find({ type: 'Text', text: /left/ })).toBeDefined()
    await ui.unmount()
  }
})

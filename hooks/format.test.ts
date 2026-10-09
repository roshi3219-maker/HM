import { expect, test } from 'claude-code/testing'
import { bar, format } from './register'

test('formats remaining usage', () => {
  expect(
    format([{ kind: 'five_hour', percentUsed: 23.5 }, { kind: 'seven_day', percentUsed: 7 }], 40)
  ).toBe('5h 77% left · 7d 93% left · context 60% left')
  expect(format([], undefined)).toBeUndefined()
})

test('draws a bar of used usage', () => {
  expect(bar(0, 10)).toBe('░░░░░░░░░░')
  expect(bar(50, 10)).toBe('█████░░░░░')
  expect(bar(150, 10)).toBe('██████████')
})

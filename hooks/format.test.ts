import { expect, test } from 'claude-code/testing'
import { bar, format, shade, split } from './register'

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

test('colours by how much is used', () => {
  expect(shade(10)).toBe('success')
  expect(shade(70)).toBe('warning')
  expect(shade(95)).toBe('error')
  expect(split(25, 12)).toEqual([3, 9])
})

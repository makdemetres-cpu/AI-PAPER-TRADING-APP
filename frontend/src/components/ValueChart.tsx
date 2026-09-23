import { AreaSeries, ColorType, createChart, type Time, type UTCTimestamp } from 'lightweight-charts'
import { useEffect, useRef } from 'react'
import type { Currency } from '../api'
import { money } from '../format'
import { usePrefs } from '../prefs'

function cssVar(name: string): string {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim()
}

function withAlpha(hex: string, alpha: number): string {
  const n = parseInt(hex.replace('#', ''), 16)
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${alpha})`
}

export function ValueChart({
  points,
  currency,
  height = 240,
}: {
  points: { time: number; value: number }[]
  currency: Currency
  height?: number
}) {
  const box = useRef<HTMLDivElement>(null)
  const { theme } = usePrefs()

  useEffect(() => {
    if (!box.current) return
    const accent = cssVar('--accent')
    const chart = createChart(box.current, {
      autoSize: true,
      layout: {
        background: { type: ColorType.Solid, color: 'transparent' },
        textColor: cssVar('--text-2'),
        fontFamily: cssVar('--font'),
        fontSize: 12,
      },
      grid: { vertLines: { visible: false }, horzLines: { color: cssVar('--border') } },
      rightPriceScale: { borderVisible: false },
      timeScale: {
        borderVisible: false,
        timeVisible: false,
        tickMarkFormatter: (t: Time) =>
          new Date((t as number) * 1000).toLocaleDateString(undefined, { day: 'numeric', month: 'short' }),
      },
      localization: {
        priceFormatter: (p: number) => money(p, currency),
        timeFormatter: (t: Time) =>
          new Date((t as number) * 1000).toLocaleString(undefined, {
            day: 'numeric',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit',
          }),
      },
      handleScroll: false,
      handleScale: false,
    })
    const series = chart.addSeries(AreaSeries, {
      lineColor: accent,
      lineWidth: 2,
      topColor: withAlpha(accent, 0.12),
      bottomColor: withAlpha(accent, 0.12),
      priceLineVisible: false,
    })
    const seen = new Set<number>()
    series.setData(
      points
        .filter((p) => (seen.has(p.time) ? false : (seen.add(p.time), true)))
        .map((p) => ({ time: p.time as UTCTimestamp, value: p.value })),
    )
    chart.timeScale().fitContent()
    return () => chart.remove()
  }, [points, currency, theme])

  return <div ref={box} style={{ height, position: 'relative' }} />
}

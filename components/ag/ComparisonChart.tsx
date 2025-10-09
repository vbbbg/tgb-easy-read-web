"use client"
import { useMemo } from "react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Brush,
} from "recharts"

type Props = {
  title: string
  data: any[]
  series: {
    dataKey: string
    name: string
    color: string
  }[]
  xAxisKey?: string
  yAxisUnit?: string
  withBrush?: boolean
}

export default function ComparisonChart({
  title,
  data,
  series,
  xAxisKey = "trade_date",
  yAxisUnit,
  withBrush = false,
}: Props) {
  const formattedData = useMemo(() => {
    // Conditionally format data only if the axis is 'trade_date'
    return xAxisKey === "trade_date" && data.length > 0 && data[0].trade_date
      ? data.map((item) => ({
          ...item,
          trade_date: new Date(item.trade_date).toLocaleDateString("zh-CN", {
            year: "2-digit",
            month: "2-digit",
            day: "2-digit",
          }),
        }))
      : data
  }, [data, xAxisKey])

  return (
    <div className="w-full rounded-lg border bg-card text-card-foreground shadow-sm p-4 md:p-6">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      <div style={{ width: "100%", height: 300 }}>
        <ResponsiveContainer>
          <LineChart
            data={formattedData}
            margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={xAxisKey} fontSize={12} />
            <YAxis
              fontSize={12}
              tickFormatter={(value) =>
                typeof value === "number" ? value.toLocaleString() : value
              }
              label={{
                value: yAxisUnit,
                angle: -90,
                position: "insideLeft",
                offset: 0,
                fontSize: 12,
              }}
            />
            <Tooltip
              formatter={(value, name) => [
                typeof value === "number" ? value.toLocaleString() : value,
                name,
              ]}
            />
            <Legend />
            {series.map((s) => (
              <Line
                key={s.dataKey}
                type="monotone"
                dataKey={s.dataKey}
                name={s.name}
                stroke={s.color}
                dot={false}
                connectNulls={true}
                strokeWidth={2}
              />
            ))}
            {withBrush && (
              <Brush dataKey={xAxisKey} height={30} stroke="#8884d8" />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

"use client"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"

type Props = {
  title: string
  data: any[]
  dataKey: string
  name: string
  color: string
  xAxisKey?: string
}

export default function TrendChart({
  title,
  data,
  dataKey,
  name,
  color,
  xAxisKey = "trade_date",
}: Props) {
  // Conditionally format data only if the axis is 'trade_date'
  const formattedData =
    xAxisKey === "trade_date" && data.length > 0 && data[0].trade_date
      ? data.map((item) => ({
          ...item,
          trade_date: new Date(item.trade_date).toLocaleDateString("zh-CN", {
            year: "2-digit",
            month: "2-digit",
            day: "2-digit",
          }),
        }))
      : data

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
            />
            <Tooltip
              formatter={(value, name) => [
                typeof value === "number" ? value.toLocaleString() : value,
                name,
              ]}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey={dataKey}
              name={name}
              stroke={color}
              dot={false}
              connectNulls={true}
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

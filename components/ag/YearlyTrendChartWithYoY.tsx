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

import { TooltipProps } from "recharts"

// Specific type for the data items passed to the chart
type ChartDataItem = {
  year: string
  totalTradeAmt: number
  yoyGrowth: number | null
}

type Props = {
  title: string
  data: ChartDataItem[]
  dataKey: string
  name: string
  color: string
  xAxisKey?: string
}

const CustomTooltip = (props: TooltipProps<number, string>) => {
  const { active, payload, label } = props;
  if (active && payload && payload.length) {
    const data = payload[0].payload as ChartDataItem
    const value = data.totalTradeAmt
    const yoyGrowth = data.yoyGrowth

    return (
      <div className="rounded-lg border bg-background p-2 shadow-sm">
        <div className="grid grid-cols-2 gap-2">
          <div className="flex flex-col space-y-1.5">
            <p className="text-sm text-muted-foreground">年份</p>
            <p className="font-bold">{label}</p>
          </div>
          <div className="flex flex-col space-y-1.5">
            <p className="text-sm text-muted-foreground">总成交额</p>
            <p className="font-bold">{`${(value / 10000).toFixed(2)} 万亿`}</p>
          </div>
          {yoyGrowth !== null && yoyGrowth !== undefined && (
            <div className="flex flex-col space-y-1.5">
              <p className="text-sm text-muted-foreground">同比增长</p>
              <p
                className={`font-bold ${yoyGrowth >= 0 ? "text-green-500" : "text-red-500"}`}
              >
                {`${(yoyGrowth * 100).toFixed(2)}%`}
              </p>
            </div>
          )}
        </div>
      </div>
    )
  }
  return null
}

export default function YearlyTrendChartWithYoY({
  title,
  data,
  dataKey,
  name,
  color,
  xAxisKey = "year",
}: Props) {
  return (
    <div className="w-full rounded-lg border bg-card text-card-foreground shadow-sm p-4 md:p-6">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      <div style={{ width: "100%", height: 300 }}>
        <ResponsiveContainer>
          <LineChart
            data={data}
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
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Line
              type="monotone"
              dataKey={dataKey}
              name={name}
              stroke={color}
              dot={{ r: 4 }}
              connectNulls={true}
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

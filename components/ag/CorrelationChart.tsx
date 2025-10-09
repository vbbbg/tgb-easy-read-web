"use client"
import {
  ScatterChart,
  Scatter,
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
  xAxis: { dataKey: string; name: string }
  yAxis: { dataKey: string; name: string }
  color: string
}

export default function CorrelationChart({
  title,
  data,
  xAxis,
  yAxis,
  color,
}: Props) {
  // xAxis is {dataKey, name}, yAxis is {dataKey, name}
  return (
    <div className="w-full rounded-lg border bg-card text-card-foreground shadow-sm p-4 md:p-6">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      <div style={{ width: "100%", height: 300 }}>
        <ResponsiveContainer>
          <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
            <CartesianGrid />
            <XAxis
              type="number"
              dataKey={xAxis.dataKey}
              name={xAxis.name}
              domain={["dataMin", "dataMax"]}
              tickFormatter={(val) =>
                new Intl.NumberFormat("en", {
                  notation: "compact",
                  compactDisplay: "short",
                }).format(val)
              }
              fontSize={12}
            />
            <YAxis
              type="number"
              dataKey={yAxis.dataKey}
              name={yAxis.name}
              domain={["dataMin", "dataMax"]}
              tickFormatter={(val) => val.toLocaleString()}
              fontSize={12}
            />
            <Tooltip
              cursor={{ strokeDasharray: "3 3" }}
              formatter={(value, name) => [
                typeof value === "number" ? value.toLocaleString() : value,
                name,
              ]}
            />
            <Legend />
            <Scatter name={title} data={data} fill={color} />
          </ScatterChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

import { createClient } from "@/lib/supabase/server"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import TrendChart from "@/components/ag/TrendChart"
import ComparisonChart from "@/components/ag/ComparisonChart"
import YearlyTrendChartWithYoY from "@/components/ag/YearlyTrendChartWithYoY"
import { cache } from "react"

export const revalidate = 3600 // Revalidate data every hour

const fetchCummaryData = cache(async () => {
  const supabase = await createClient()
  const years = [2021, 2022, 2023, 2024, 2025]

  const queries = years.map((year) => {
    return supabase
      .from("sse_market_summary")
      .select("*")
      .gte("trade_date", `${year}-01-01`)
      .lt("trade_date", `${year + 1}-01-01`)
  })

  const results = await Promise.all(queries)

  const allData = []
  for (const { data, error } of results) {
    if (error) {
      console.error("Error fetching market summary for a year:", error)
      // Return the first error encountered
      return { data: null, error }
    }
    if (data) {
      allData.push(...data)
    }
  }

  // The original query had an order, so we should sort the combined results
  allData.sort(
    (a, b) =>
      new Date(a.trade_date).getTime() - new Date(b.trade_date).getTime(),
  )

  return { data: allData, error: null }
})

export default async function AgPage() {
  const { data: summaryData, error } = await fetchCummaryData()

  if (error) {
    console.error("Error fetching market summary:", error)
    return (
      <main className="container mx-auto p-4">
        <Alert variant="destructive">
          <AlertTitle>错误</AlertTitle>
          <AlertDescription>无法加载市场数据，请稍后再试。</AlertDescription>
        </Alert>
      </main>
    )
  }

  if (!summaryData || summaryData.length === 0) {
    return (
      <main className="container mx-auto p-4">
        <Alert>
          <AlertTitle>无数据</AlertTitle>
          <AlertDescription>当前没有可用的市场摘要数据。</AlertDescription>
        </Alert>
      </main>
    )
  }

  // --- Data Aggregation ---

  // 1. For Yearly Total Bar Chart with YoY
  const yearlyTradeData = summaryData.reduce((acc, item) => {
    const year = new Date(item.trade_date).getFullYear()
    const tradeAmt = item.stock_trade_amt || 0
    if (!acc[year]) acc[year] = 0
    acc[year] += tradeAmt
    return acc
  }, {})

  const chartableYearlyData = Object.keys(yearlyTradeData).map((year) => ({
    year: year,
    totalTradeAmt: yearlyTradeData[year],
  }))

  chartableYearlyData.sort((a, b) => a.year.localeCompare(b.year))

  const chartableYearlyDataWithYoY = chartableYearlyData.map(
    (item, index, arr) => {
      if (index === 0) {
        return { ...item, yoyGrowth: null } // No previous year for the first item
      }
      const previousYearData = arr[index - 1]
      if (previousYearData.totalTradeAmt === 0) {
        return { ...item, yoyGrowth: null } // Avoid division by zero
      }
      const yoyGrowth =
        (item.totalTradeAmt - previousYearData.totalTradeAmt) /
        previousYearData.totalTradeAmt
      return { ...item, yoyGrowth: yoyGrowth }
    },
  )

  // 2. For Daily Year-over-Year Line Chart
  const dailyDataByYear = summaryData.reduce((acc, item) => {
    const date = new Date(item.trade_date)
    const year = date.getFullYear()
    const monthDay =
      (date.getMonth() + 1).toString().padStart(2, "0") +
      "-" +
      date.getDate().toString().padStart(2, "0")
    const tradeAmt = item.stock_trade_amt || 0

    if (!acc[monthDay]) acc[monthDay] = {}
    acc[monthDay][year] = tradeAmt
    return acc
  }, {})

  const allYears = [
    ...new Set(
      summaryData.map((item) => new Date(item.trade_date).getFullYear()),
    ),
  ].sort((a, b) => b - a)
  const allMonthDays = Object.keys(dailyDataByYear).sort()

  const dailyComparisonData = allMonthDays.map((monthDay) => {
    const dayData: any = { day: monthDay }
    allYears.forEach((year) => {
      dayData[year] = dailyDataByYear[monthDay]?.[year] || null
    })
    return dayData
  })

  const colors = [
    "#8884d8",
    "#82ca9d",
    "#ffc658",
    "#ff8042",
    "#0088FE",
    "#00C49F",
  ]
  const dailySeries = allYears.map((year, index) => ({
    dataKey: year.toString(),
    name: `${year}年`,
    color: colors[index % colors.length],
  }))

  return (
    <main className="container mx-auto p-4">
      <div className="grid grid-cols-1 gap-6">
        <ComparisonChart
          title="每日成交额年度对比 (多条折线)"
          data={dailyComparisonData}
          xAxisKey="day"
          series={dailySeries}
          yAxisUnit="(亿)"
          withBrush={true}
        />

        <TrendChart
          title="市场活跃度 (总成交金额)"
          data={summaryData}
          dataKey="stock_trade_amt"
          name="总成交金额 (亿元)"
          color="#8884d8"
        />

        <YearlyTrendChartWithYoY
          title="每年成交额"
          data={chartableYearlyDataWithYoY}
          dataKey="totalTradeAmt"
          xAxisKey="year"
          name="总成交金额 (亿)"
          color="#8884d8"
        />

        <TrendChart
          title="市场规模 (总市值)"
          data={summaryData}
          dataKey="stock_total_value"
          name="总市值 (亿元)"
          color="#ffc658"
        />
      </div>
    </main>
  )
}

"use client"

import { useState, useEffect } from "react"

export function ClientTime({ dateString }: { dateString: string }) {
  const [time, setTime] = useState("")

  useEffect(() => {
    setTime(new Date(dateString).toLocaleString())
  }, [dateString])

  return <>{time}</>
}

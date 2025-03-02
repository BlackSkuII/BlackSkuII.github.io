"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Coordinates, CalculationMethod, PrayerTimes } from "adhan"
import { format } from "date-fns"

interface CountdownTimerProps {
  location: {
    lat: number
    lng: number
  }
}

export function CountdownTimer({ location }: CountdownTimerProps) {
  const [nextPrayer, setNextPrayer] = useState<{ name: string; time: Date; arabicName: string } | null>(null)
  const [timeRemaining, setTimeRemaining] = useState<{ hours: number; minutes: number; seconds: number }>({
    hours: 0,
    minutes: 0,
    seconds: 0,
  })

  useEffect(() => {
    const calculateNextPrayer = () => {
      const now = new Date()
      const coordinates = new Coordinates(location.lat, location.lng)
      const params = CalculationMethod.MoonsightingCommittee()
      const prayerTimes = new PrayerTimes(coordinates, now, params)

      const prayers = [
        { name: "Fajr", time: prayerTimes.fajr, arabicName: "الفجر" },
        { name: "Dhuhr", time: prayerTimes.dhuhr, arabicName: "الظهر" },
        { name: "Asr", time: prayerTimes.asr, arabicName: "العصر" },
        { name: "Maghrib", time: prayerTimes.maghrib, arabicName: "المغرب" },
        { name: "Isha", time: prayerTimes.isha, arabicName: "العشاء" },
      ]

      // Find the next prayer
      let next = null
      for (const prayer of prayers) {
        if (prayer.time > now) {
          next = prayer
          break
        }
      }

      // If no prayer is found for today, get tomorrow's Fajr
      if (!next) {
        const tomorrow = new Date(now)
        tomorrow.setDate(tomorrow.getDate() + 1)
        const tomorrowPrayerTimes = new PrayerTimes(coordinates, tomorrow, params)
        next = { name: "Fajr", time: tomorrowPrayerTimes.fajr, arabicName: "الفجر" }
      }

      setNextPrayer(next)
    }

    calculateNextPrayer()
    const intervalId = setInterval(calculateNextPrayer, 60000) // Update every minute

    return () => clearInterval(intervalId)
  }, [location])

  useEffect(() => {
    if (!nextPrayer) return

    const updateCountdown = () => {
      const now = new Date()
      const difference = nextPrayer.time.getTime() - now.getTime()

      if (difference <= 0) {
        // Time has passed, recalculate next prayer
        return
      }

      // Calculate hours, minutes, seconds
      const hours = Math.floor(difference / (1000 * 60 * 60))
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((difference % (1000 * 60)) / 1000)

      setTimeRemaining({ hours, minutes, seconds })
    }

    updateCountdown()
    const countdownInterval = setInterval(updateCountdown, 1000)

    return () => clearInterval(countdownInterval)
  }, [nextPrayer])

  if (!nextPrayer) {
    return <div>Loading...</div>
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-center">Next Prayer</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center">
        <div className="mb-6 text-center">
          <h3 className="text-2xl font-bold">{nextPrayer.name}</h3>
          <p className="text-xl text-muted-foreground">{nextPrayer.arabicName}</p>
          <p className="text-lg font-mono mt-2">{format(nextPrayer.time, "h:mm a")}</p>
        </div>

        <div className="grid grid-cols-3 gap-4 w-full max-w-md">
          <div className="flex flex-col items-center">
            <div className="text-4xl font-bold font-mono">{String(timeRemaining.hours).padStart(2, "0")}</div>
            <div className="text-sm text-muted-foreground">Hours</div>
          </div>
          <div className="flex flex-col items-center">
            <div className="text-4xl font-bold font-mono">{String(timeRemaining.minutes).padStart(2, "0")}</div>
            <div className="text-sm text-muted-foreground">Minutes</div>
          </div>
          <div className="flex flex-col items-center">
            <div className="text-4xl font-bold font-mono">{String(timeRemaining.seconds).padStart(2, "0")}</div>
            <div className="text-sm text-muted-foreground">Seconds</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}


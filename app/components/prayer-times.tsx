"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Coordinates, CalculationMethod, PrayerTimes as AdhanPrayerTimes } from "adhan"
import { format } from "date-fns"

interface PrayerTimesProps {
  location: {
    lat: number
    lng: number
  }
}

interface Prayer {
  name: string
  time: Date
  arabicName: string
}

export function PrayerTimes({ location }: PrayerTimesProps) {
  const [prayerTimes, setPrayerTimes] = useState<Prayer[]>([])
  const [date, setDate] = useState(new Date())

  useEffect(() => {
    const calculatePrayerTimes = () => {
      const coordinates = new Coordinates(location.lat, location.lng)
      const params = CalculationMethod.MoonsightingCommittee()
      const prayerTimes = new AdhanPrayerTimes(coordinates, date, params)

      const prayers: Prayer[] = [
        { name: "Fajr", time: prayerTimes.fajr, arabicName: "الفجر" },
        { name: "Dhuhr", time: prayerTimes.dhuhr, arabicName: "الظهر" },
        { name: "Asr", time: prayerTimes.asr, arabicName: "العصر" },
        { name: "Maghrib", time: prayerTimes.maghrib, arabicName: "المغرب" },
        { name: "Isha", time: prayerTimes.isha, arabicName: "العشاء" },
      ]

      setPrayerTimes(prayers)
    }

    calculatePrayerTimes()

    // Update prayer times at midnight
    const timer = setInterval(() => {
      const now = new Date()
      if (now.getHours() === 0 && now.getMinutes() === 0) {
        setDate(now)
      }
    }, 60000)

    return () => clearInterval(timer)
  }, [location, date])

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-center">Prayer Times</CardTitle>
        <p className="text-center text-muted-foreground">{format(date, "EEEE, MMMM d, yyyy")}</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {prayerTimes.map((prayer) => (
            <div key={prayer.name} className="flex justify-between items-center p-3 rounded-lg bg-muted/50">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-primary font-medium">{prayer.name[0]}</span>
                </div>
                <div>
                  <p className="font-medium">{prayer.name}</p>
                  <p className="text-sm text-muted-foreground">{prayer.arabicName}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-mono font-medium">{format(prayer.time, "h:mm a")}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}


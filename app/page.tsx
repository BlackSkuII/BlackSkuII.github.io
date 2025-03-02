"use client"

import { useEffect, useState } from "react"
import { PrayerTimes } from "./components/prayer-times"
import { CountdownTimer } from "./components/countdown-timer"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

export default function Home() {
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Get user's location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          })
          setLoading(false)
        },
        (error) => {
          console.error("Error getting location:", error)
          setError("Unable to get your location. Please allow location access for accurate prayer times.")
          setLoading(false)
          // Default to Mecca coordinates if location access is denied
          setLocation({ lat: 21.3891, lng: 39.8579 })
        },
      )
    } else {
      setError("Geolocation is not supported by your browser")
      setLoading(false)
      // Default to Mecca coordinates
      setLocation({ lat: 21.3891, lng: 39.8579 })
    }
  }, [])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading prayer times...</span>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 p-4 md:p-8">
      <div className="container mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-8 text-primary">Islamic Prayer Times</h1>

        {error && (
          <Card className="mb-6 border-yellow-500 bg-yellow-50 dark:bg-yellow-950/20">
            <CardContent className="pt-6">
              <p className="text-yellow-800 dark:text-yellow-400">{error}</p>
              <Button className="mt-2" variant="outline" onClick={() => window.location.reload()}>
                Retry
              </Button>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {location && (
            <>
              <PrayerTimes location={location} />
              <CountdownTimer location={location} />
            </>
          )}
        </div>
      </div>
    </main>
  )
}


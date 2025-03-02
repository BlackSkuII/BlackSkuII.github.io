import { useState, useEffect } from 'react';
import { Coordinates, CalculationMethod, PrayerTimes } from 'adhan';

export default function Home() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [nextPrayer, setNextPrayer] = useState<string>('');
  const [timeUntilNextPrayer, setTimeUntilNextPrayer] = useState<string>('');
  const [prayerTimes, setPrayerTimes] = useState<any>(null);

  // Initialize prayer times calculation
  useEffect(() => {
    // Default coordinates (example: London)
    const coordinates = new Coordinates(51.5074, -0.1278);
    const params = CalculationMethod.MoonsightingCommittee();
    const prayerTimes = new PrayerTimes(coordinates, new Date(), params);
    setPrayerTimes(prayerTimes);
  }, []);

  // Update current time and countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
      updateNextPrayer();
    }, 1000);

    return () => clearInterval(timer);
  }, [prayerTimes]);

  const updateNextPrayer = () => {
    if (!prayerTimes) return;

    const prayers = {
      fajr: prayerTimes.fajr,
      dhuhr: prayerTimes.dhuhr,
      asr: prayerTimes.asr,
      maghrib: prayerTimes.maghrib,
      isha: prayerTimes.isha,
    };

    let nextPrayerName = '';
    let nextPrayerTime = null;

    for (const [name, time] of Object.entries(prayers)) {
      if (time > currentTime) {
        nextPrayerName = name;
        nextPrayerTime = time;
        break;
      }
    }

    if (!nextPrayerTime) {
      // If no next prayer found today, get tomorrow's Fajr
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const tomorrowPrayers = new PrayerTimes(
        new Coordinates(51.5074, -0.1278),
        tomorrow,
        CalculationMethod.MoonsightingCommittee()
      );
      nextPrayerName = 'fajr';
      nextPrayerTime = tomorrowPrayers.fajr;
    }

    setNextPrayer(nextPrayerName.charAt(0).toUpperCase() + nextPrayerName.slice(1));
    
    // Calculate time until next prayer
    const diff = nextPrayerTime.getTime() - currentTime.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    
    setTimeUntilNextPrayer(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  return (
    <div className="min-h-screen bg-black py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-gold mb-12">
          Prayer Times
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Countdown Timer Box */}
          <div className="bg-black rounded-3xl shadow-lg p-8 border-2 border-[#FFD700]">
            <h2 className="text-2xl font-semibold mb-6 text-[#FFD700]">Next Prayer</h2>
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-4">
                {nextPrayer}
              </div>
              <div className="text-6xl font-mono text-[#FFD700]">
                {timeUntilNextPrayer}
              </div>
              <div className="mt-4 text-gray-300">
                Until next prayer
              </div>
            </div>
          </div>

          {/* Prayer Times Box */}
          <div className="bg-black rounded-3xl shadow-lg p-8 border-2 border-[#FFD700]">
            <h2 className="text-2xl font-semibold mb-6 text-[#FFD700]">Daily Prayers</h2>
            {prayerTimes && (
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-gray-900 rounded-xl border border-[#FFD700]/20">
                  <span className="font-medium text-white">Fajr</span>
                  <span className="text-[#FFD700]">{formatTime(prayerTimes.fajr)}</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-gray-900 rounded-xl border border-[#FFD700]/20">
                  <span className="font-medium text-white">Dhuhr</span>
                  <span className="text-[#FFD700]">{formatTime(prayerTimes.dhuhr)}</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-gray-900 rounded-xl border border-[#FFD700]/20">
                  <span className="font-medium text-white">Asr</span>
                  <span className="text-[#FFD700]">{formatTime(prayerTimes.asr)}</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-gray-900 rounded-xl border border-[#FFD700]/20">
                  <span className="font-medium text-white">Maghrib</span>
                  <span className="text-[#FFD700]">{formatTime(prayerTimes.maghrib)}</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-gray-900 rounded-xl border border-[#FFD700]/20">
                  <span className="font-medium text-white">Isha</span>
                  <span className="text-[#FFD700]">{formatTime(prayerTimes.isha)}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
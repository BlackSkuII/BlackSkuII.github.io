document.addEventListener("DOMContentLoaded", function () {
    const prayerTimes = {
        fajr: "05:00",
        dhuhr: "12:30",
        asr: "16:00",
        maghrib: "18:45",
        isha: "20:00"
    };

    function updatePrayerTimes() {
        document.getElementById("fajr-time").textContent = prayerTimes.fajr;
        document.getElementById("dhuhr-time").textContent = prayerTimes.dhuhr;
        document.getElementById("asr-time").textContent = prayerTimes.asr;
        document.getElementById("maghrib-time").textContent = prayerTimes.maghrib;
        document.getElementById("isha-time").textContent = prayerTimes.isha;
    }

    function getNextPrayer() {
        const now = new Date();
        const currentTime = now.getHours() * 60 + now.getMinutes();
        
        for (const [prayer, time] of Object.entries(prayerTimes)) {
            const [hour, minute] = time.split(":").map(Number);
            const prayerTimeInMinutes = hour * 60 + minute;

            if (prayerTimeInMinutes > currentTime) {
                return { prayer, time: prayerTimeInMinutes };
            }
        }
        return { prayer: "Fajr", time: parseTime(prayerTimes.fajr) + 1440 };
    }

    function parseTime(timeStr) {
        const [hour, minute] = timeStr.split(":").map(Number);
        return hour * 60 + minute;
    }

    function updateCountdown() {
        const now = new Date();
        const currentTimeInMinutes = now.getHours() * 60 + now.getMinutes();
        const nextPrayer = getNextPrayer();

        const minutesLeft = nextPrayer.time - currentTimeInMinutes;
        const hours = Math.floor(minutesLeft / 60);
        const minutes = minutesLeft % 60;

        document.getElementById("countdown").textContent = `${hours}h ${minutes}m`;
    }

    updatePrayerTimes();
    updateCountdown();
    setInterval(updateCountdown, 60000);
});

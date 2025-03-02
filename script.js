// Prayer times data
const prayerTimes = {
    fajr: '05:30',
    dhuhr: '12:30',
    asr: '15:45',
    maghrib: '18:15',
    isha: '19:45'
};

// Update prayer times on the page
function updatePrayerTimes() {
    document.getElementById('fajr-time').textContent = prayerTimes.fajr;
    document.getElementById('dhuhr-time').textContent = prayerTimes.dhuhr;
    document.getElementById('asr-time').textContent = prayerTimes.asr;
    document.getElementById('maghrib-time').textContent = prayerTimes.maghrib;
    document.getElementById('isha-time').textContent = prayerTimes.isha;
}

// Convert time string to Date object
function timeStringToDate(timeStr) {
    const [hours, minutes] = timeStr.split(':').map(Number);
    const date = new Date();
    date.setHours(hours, minutes, 0, 0);
    return date;
}

// Find next prayer
function getNextPrayer() {
    const now = new Date();
    const prayers = Object.entries(prayerTimes);
    
    for (const [prayer, time] of prayers) {
        const prayerTime = timeStringToDate(time);
        if (prayerTime > now) {
            return { name: prayer, time: prayerTime };
        }
    }
    
    // If no prayer is found today, return tomorrow's Fajr
    const tomorrowFajr = timeStringToDate(prayerTimes.fajr);
    tomorrowFajr.setDate(tomorrowFajr.getDate() + 1);
    return { name: 'fajr', time: tomorrowFajr };
}

// Update countdown
function updateCountdown() {
    const now = new Date();
    const nextPrayer = getNextPrayer();
    const timeDiff = nextPrayer.time - now;
    
    const hours = Math.floor(timeDiff / (1000 * 60 * 60));
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);
    
    document.getElementById('hours').textContent = String(hours).padStart(2, '0');
    document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
    document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');
    document.getElementById('nextPrayer').textContent = `Next: ${nextPrayer.name.charAt(0).toUpperCase() + nextPrayer.name.slice(1)}`;
}

// Initialize
updatePrayerTimes();
setInterval(updateCountdown, 1000);

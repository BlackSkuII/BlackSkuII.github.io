// Prayer times data
const prayerTimes = {
    fajr: { time: '5:30 AM', date: 'Sunday, March 2' },
    dhuhr: { time: '12:30 PM', date: 'Sunday, March 2' },
    asr: { time: '3:45 PM', date: 'Sunday, March 2' },
    maghrib: { time: '6:15 PM', date: 'Sunday, March 2' },
    isha: { time: '7:45 PM', date: 'Sunday, March 2' }
};

const arabicNames = {
    fajr: 'الفجر',
    dhuhr: 'الظهر',
    asr: 'العصر',
    maghrib: 'المغرب',
    isha: 'العشاء'
};

// Update current date and time
function updateDateTime() {
    const now = new Date();
    const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const timeOptions = { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false };
    
    document.getElementById('current-date').textContent = now.toLocaleDateString('en-US', dateOptions);
    document.getElementById('current-time').textContent = now.toLocaleTimeString('en-US', timeOptions);
}

// Convert time string to Date object
function timeStringToDate(timeStr, dateStr) {
    const [time, period] = timeStr.split(' ');
    let [hours, minutes] = time.split(':').map(Number);
    
    // Convert to 24-hour format
    if (period === 'PM' && hours !== 12) {
        hours += 12;
    } else if (period === 'AM' && hours === 12) {
        hours = 0;
    }
    
    const date = new Date(dateStr + ', 2025');
    date.setHours(hours, minutes, 0, 0);
    return date;
}

// Find next prayer
function getNextPrayer() {
    const now = new Date();
    const prayers = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'];
    
    for (const prayer of prayers) {
        const data = prayerTimes[prayer];
        const prayerDateTime = timeStringToDate(data.time, data.date);
        if (prayerDateTime > now) {
            return { name: prayer, time: prayerDateTime, date: data.date };
        }
    }
    
    // If no prayer is found today, return tomorrow's Fajr
    return { 
        name: 'fajr',
        time: timeStringToDate(prayerTimes.fajr.time, 'Tomorrow'),
        date: 'Tomorrow'
    };
}

// Update prayer times display
function updatePrayerTimes() {
    const prayerDate = document.getElementById('prayer-date');
    prayerDate.textContent = new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric'
    });

    for (const [prayer, data] of Object.entries(prayerTimes)) {
        const prayerElement = document.getElementById(prayer);
        prayerElement.querySelector('.prayer-time-value').textContent = data.time;
        prayerElement.querySelector('.prayer-date').textContent = data.date;
    }
}

// Update next prayer and countdown
function updateNextPrayer() {
    const nextPrayer = getNextPrayer();
    const now = new Date();
    
    // Update next prayer display
    document.getElementById('next-prayer-english').textContent = 
        nextPrayer.name.charAt(0).toUpperCase() + nextPrayer.name.slice(1);
    document.getElementById('next-prayer-arabic').textContent = arabicNames[nextPrayer.name];
    document.getElementById('next-prayer-time').textContent = prayerTimes[nextPrayer.name].time;
    document.getElementById('next-prayer-date').textContent = nextPrayer.date;
    
    // Update countdown
    const timeDiff = nextPrayer.time - now;
    const hours = Math.floor(timeDiff / (1000 * 60 * 60));
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);
    
    document.getElementById('hours').textContent = String(hours).padStart(2, '0');
    document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
    document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');
}

// Initialize and set up intervals
updateDateTime();
updatePrayerTimes();
updateNextPrayer();

// Update time every second
setInterval(() => {
    updateDateTime();
    updateNextPrayer();
}, 1000);

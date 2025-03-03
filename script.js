// Prayer times data
const prayerTimes = {
    fajr: { time: '5:00 AM', date: 'Sunday, March 2' },
    dhuhr: { time: '11:57 AM', date: 'Sunday, March 2' },
    asr: { time: '3:52 PM', date: 'Sunday, March 2' },
    maghrib: { time: '5:36 PM', date: 'Sunday, March 2' },
    isha: { time: '6:54 PM', date: 'Sunday, March 2' },

    fajr: { time: '4:59 AM', date: 'Monday, March 3' },
    dhuhr: { time: '11:57 AM', date: 'Monday, March 3' },
    asr: { time: '3:53 PM', date: 'Monday, March 3' },
    maghrib: { time: '5:38 PM', date: 'Monday, March 3' },
    isha: { time: '6:55 PM', date: 'Monday, March 3' },

    fajr: { time: '4:57 AM', date: 'Tuesday, March 4' },
    dhuhr: { time: '11:56 AM', date: 'Tuesday, March 4' },
    asr: { time: '3:54 PM', date: 'Tuesday, March 4' },
    maghrib: { time: '5:39 PM', date: 'Tuesday, March 4' },
    isha: { time: '6:56 PM', date: 'Tuesday, March 4' },

    fajr: { time: '4:55 AM', date: 'Wednesday, March 5' },
    dhuhr: { time: '11:56 AM', date: 'Wednesday, March 5' },
    asr: { time: '3:55 PM', date: 'Wednesday, March 5' },
    maghrib: { time: '5:40 PM', date: 'Wednesday, March 5' },
    isha: { time: '6:57 PM', date: 'Wednesday, March 5' },

    fajr: { time: '4:54 AM', date: 'Thursday, March 6' },
    dhuhr: { time: '11:56 AM', date: 'Thursday, March 6' },
    asr: { time: '3:56 PM', date: 'Thursday, March 6' },
    maghrib: { time: '5:41 PM', date: 'Thursday, March 6' },
    isha: { time: '6:58 PM', date: 'Thursday, March 6' },

    fajr: { time: '4:42 AM', date: 'Friday, March 7' },
    dhuhr: { time: '11:56 AM', date: 'Friday, March 7' },
    asr: { time: '3:57 PM', date: 'Friday, March 7' },
    maghrib: { time: '5:42 PM', date: 'Friday, March 7' },
    isha: { time: '7:00 PM', date: 'Friday, March 7' },

    fajr: { time: '4:50 AM', date: 'Saturday, March 8' },
    dhuhr: { time: '11:55 AM', date: 'Saturday, March 8' },
    asr: { time: '3:58 PM', date: 'Saturday, March 8' },
    maghrib: { time: '5:44 PM', date: 'Saturday, March 8' },
    isha: { time: '7:01 PM', date: 'Saturday, March 8' }
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

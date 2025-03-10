// Prayer times data
const prayerTimes = {
    fajr: { time: '5:38 AM', date: 'Sunday, March 16' },
    dhuhr: { time: '12:54 PM', date: 'Sunday, March 16' },
    asr: { time: '5:04 PM', date: 'Sunday, March 16' },
    maghrib: { time: '5:36 PM', date: 'Sunday, March 16' },
    isha: { time: '6:54 PM', date: 'Sunday, March 16' },

    fajr: { time: '5:49 AM', date: 'Monday, March 10' },
    dhuhr: { time: '12:55 PM', date: 'Monday, March 10' },
    asr: { time: '4:59 PM', date: 'Monday, March 10' },
    maghrib: { time: '5:38 PM', date: 'Monday, March 10' },
    isha: { time: '6:55 PM', date: 'Monday, March 10' } 

    fajr: { time: '5:47 AM', date: 'Tuesday, March 11' },
    dhuhr: { time: '12:55 PM', date: 'Tuesday, March 11' },
    asr: { time: '5:00 PM', date: 'Tuesday, March 11' },
    maghrib: { time: '5:39 PM', date: 'Tuesday, March 11' },
    isha: { time: '6:56 PM', date: 'Tuesday, March 11' }

    fajr: { time: '5:45 AM', date: 'Wednesday, March 12' },
    dhuhr: { time: '12:54 AM', date: 'Wednesday, March 12' },
    asr: { time: '5:01 PM', date: 'Wednesday, March 12' },
    maghrib: { time: '5:40 PM', date: 'Wednesday, March 12' },
    isha: { time: '6:57 PM', date: 'Wednesday, March 12' }

    fajr: { time: '5:43 AM', date: 'Thursday, March 13' },
    dhuhr: { time: '12:54 PM', date: 'Thursday, March 13' },
    asr: { time: '5:02 PM', date: 'Thursday, March 13' },
    maghrib: { time: '5:41 PM', date: 'Thursday, March 13' },
    isha: { time: '6:58 PM', date: 'Thursday, March 13' }

    fajr: { time: '5:42 AM', date: 'Friday, March 14' },
    dhuhr: { time: '12:54 PM', date: 'Friday, March 14' },
    asr: { time: '5:03 PM', date: 'Friday, March 14' },
    maghrib: { time: '5:42 PM', date: 'Friday, March 14' },
    isha: { time: '7:00 PM', date: 'Friday, March 14' }

    fajr: { time: '5:40 AM', date: 'Saturday, March 15' },
    dhuhr: { time: '12:54 PM', date: 'Saturday, March 15' },
    asr: { time: '5:03 PM', date: 'Saturday, March 15' },
    maghrib: { time: '5:44 PM', date: 'Saturday, March 15' },
    isha: { time: '7:01 PM', date: 'Saturday, March 15' }
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

document.addEventListener("DOMContentLoaded", () => {
    fetch('prayerTimes.json')
        .then(response => response.json())
        .then(data => {
            const today = new Date();
            const dateString = `${today.getMonth() + 1}/${today.getDate()}`;
            const prayerTimes = data.find(day => day.date === dateString)?.prayerTimes;

            if (prayerTimes) {
                displayPrayerTimes(prayerTimes);
                startCountdown(prayerTimes);
            }
        });
});

function displayPrayerTimes(times) {
    const prayerTimesContainer = document.getElementById('prayer-times');
    prayerTimesContainer.innerHTML = Object.entries(times)
        .map(([prayer, time]) => `<div class="prayer-box"><strong>${prayer}</strong>: ${time}</div>`)
        .join('');
}

function startCountdown(times) {
    const now = new Date();
    const nextPrayer = Object.entries(times)
        .map(([prayer, time]) => ({ prayer, time: parseTime(time) }))
        .find(({ time }) => time > now);

    if (nextPrayer) {
        updateCountdown(nextPrayer);
    }
}

function updateCountdown(nextPrayer) {
    const countdownElement = document.getElementById('countdown');
    
    const interval = setInterval(() => {
        const now = new Date();
        const distance = nextPrayer.time - now;

        if (distance <= 0) {
            clearInterval(interval);
            countdownElement.innerHTML = `${nextPrayer.prayer} is starting now!`;
        } else {
            const hours = Math.floor(distance / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);
            
            countdownElement.innerHTML = `Time until ${nextPrayer.prayer}: ${hours}h ${minutes}m ${seconds}s`;
        }
    }, 1000);
}

function parseTime(timeStr) {
    const [hourMinute, period] = timeStr.split(' ');
    const [hours, minutes] = hourMinute.split(':').map(Number);
    let date = new Date();
    
    date.setHours(period === 'PM' && hours !== 12 ? hours + 12 : hours);
    date.setMinutes(minutes);
    date.setSeconds(0);
    
    return date;
}

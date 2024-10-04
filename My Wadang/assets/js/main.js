document.addEventListener("DOMContentLoaded", function() {
    const distanceBtn = document.getElementById('distance-btn');
    const ratingBtn = document.getElementById('rating-btn');
    const promoBtn = document.getElementById('promo-btn');
    const infoBox = document.getElementById('info-box');

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(successLocation, errorLocation);
    } else {
        alert("Geolokasi tidak didukung oleh browser Anda.");
    }

    function successLocation(position) {
        const userLat = position.coords.latitude;
        const userLng = position.coords.longitude;
        const map = L.map('map').setView([userLat, userLng], 14);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; OpenStreetMap contributors'
        }).addTo(map);

        L.marker([userLat, userLng]).addTo(map).bindPopup('Anda di sini').openPopup();

        // Muat data restoran dari file JSON
        fetch('data/restaurants.json')
            .then(response => response.json())
            .then(data => {
                data.restaurants.forEach(restaurant => {
                    const distance = calculateDistance(userLat, userLng, restaurant.lat, restaurant.lng);
                    if (distance <= 5) {
                        L.marker([restaurant.lat, restaurant.lng]).addTo(map)
                            .bindPopup(`<b>${restaurant.name}</b><br>Rating: ${restaurant.rating}`);
                    }
                });
            });
    }

    function errorLocation() {
        alert("Tidak dapat mengambil lokasi Anda");
    }

    function calculateDistance(lat1, lng1, lat2, lng2) {
        const R = 6371; // Radius Bumi dalam kilometer
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLng = (lng2 - lng1) * Math.PI / 180;
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                  Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                  Math.sin(dLng / 2) * Math.sin(dLng / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c; // Kembali ke jarak dalam kilometer
    }

    // Event handlers untuk menampilkan data di info-box
    distanceBtn.addEventListener('click', () => {
        infoBox.style.display = 'block';
        infoBox.innerHTML = '<h3>Restoran Terdekat:</h3><p>Menampilkan jarak terdekat...</p>';
    });

    ratingBtn.addEventListener('click', () => {
        infoBox.style.display = 'block';
        infoBox.innerHTML = '<h3>Rating Restoran:</h3><p>Menampilkan rating...</p>';
    });

    promoBtn.addEventListener('click', () => {
        infoBox.style.display = 'block';
        infoBox.innerHTML = '<h3>Promo Restoran:</h3><p>Menampilkan promo...</p>';
    });
});

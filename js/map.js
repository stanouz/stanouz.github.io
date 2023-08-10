// Your CSV file URL
const csvUrl = '../output.csv';

const latitude = 54;
const longitude = 8;
const zoomLevel = 5;
const animationInterval = 100; // Milliseconds

// Initialize Leaflet map
const map = L.map('map').setView([latitude, longitude], zoomLevel);

// Add a base map layer (e.g., OpenStreetMap)
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

fetch(csvUrl)
  .then(response => response.text())
  .then(csvText => {
     const data = Papa.parse(csvText, { header: true }).data.slice(0, -1);
    console.log(data);
     // Create a polyline and add it to the map
     const pathCoordinates = data.map(entry => [entry.Latitude, entry.Longitude]);
     
     //const polyline = L.polyline(pathCoordinates, { color: 'blue' }).addTo(map);
     const polyline = L.polyline([], { color: 'blue' }).addTo(map);

     // Iterate through data and animate marker
     let currentIndex = 0;

     function animatePath() {
        document.getElementById('datetime').innerText = `${data[currentIndex].Date} ${data[currentIndex].Time}`;
        polyline.addLatLng([data[currentIndex].Latitude, data[currentIndex].Longitude]);
        map.setView([data[currentIndex].Latitude, data[currentIndex].Longitude], 7);
        currentIndex = (currentIndex + 1) % data.length;
     }

     const animationInterval = 20; // Adjust animation speed (milliseconds)
     const animation = setInterval(() => {
        animatePath();
        if (currentIndex === 0) {
           clearInterval(animation); // Stop animation when finished
           map.setView([latitude, longitude], zoomLevel);
        }
     }, animationInterval);

  });

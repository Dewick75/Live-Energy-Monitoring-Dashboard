const admin = require('firebase-admin');

// This line looks for the key file you downloaded and renamed.
const serviceAccount = require('./serviceAccountKey.json');

// Initialize the Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  // IMPORTANT: Replace this URL with the URL of YOUR Realtime Database
  databaseURL: "https://esp-project-8ec5c-default-rtdb.firebaseio.com/"
});

// Get a reference to the database
const db = admin.database();
const ref = db.ref('livedata'); // We will be writing to the 'livedata' path

// This function generates fake but realistic-looking data
function generateRandomData() {
    const voltage = 220 + (Math.random() * 10 - 5);       // e.g., 215.00 to 225.00
    const current = 1.5 + (Math.random() * 2 - 1);         // e.g., 0.50 to 2.50
    const powerFactor = 0.9 + (Math.random() * 0.1);     // e.g., 0.90 to 1.00
    const power = voltage * current * powerFactor;
    const energy = Math.random() * 100; // Fake cumulative energy

    return {
        voltage: voltage,
        current: current,
        power: power,
        powerFactor: powerFactor,
        energy: energy
    };
}

// This function sends data to Firebase every 3 seconds
function sendData() {
  const data = generateRandomData();
  ref.set(data, (error) => {
    if (error) {
      console.log('Data could not be saved.' + error);
    } else {
      console.log('Data sent successfully! Voltage:', data.voltage.toFixed(2));
    }
  });
}

console.log("Starting ESP32 Simulator... Sending data to Firebase every 3 seconds.");
// Run the sendData function every 3000 milliseconds (3 seconds)
setInterval(sendData, 3000);
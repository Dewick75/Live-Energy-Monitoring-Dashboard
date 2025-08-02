import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.0/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/9.6.0/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyAZNOCiVeCksPP-kvFUybAKLAcgidslkFM",
    authDomain: "esp-project-8ec5c.firebaseapp.com",
    databaseURL: "https://esp-project-8ec5c-default-rtdb.firebaseio.com",
    projectId: "esp-project-8ec5c",
    storageBucket: "esp-project-8ec5c.firebasestorage.app",
    messagingSenderId: "627704772061",
    appId: "1:627704772061:web:afd27db860cffd07efb234",
    measurementId: "G-CY4P1W7XPY"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// Chart variables
let realtimeChart;
const maxDataPoints = 20;
const timestampData = [];
const voltageData = [];
const powerData = [];
  
  // Function to initialize the chart
  function initChart() {
      const ctx = document.getElementById('realtimeChart').getContext('2d');
      realtimeChart = new Chart(ctx, {
          type: 'line',
          data: {
              labels: timestampData,
              datasets: [
                  {
                      label: 'Voltage (V)',
                      data: voltageData,
                      borderColor: 'rgba(54, 162, 235, 1)',
                      yAxisID: 'y'
                  },
                  {
                      label: 'Power (W)',
                      data: powerData,
                      borderColor: 'rgba(255, 206, 86, 1)',
                      yAxisID: 'y1'
                  }
              ]
          },
          options: {
              responsive: true,
              scales: {
                  y: { type: 'linear', display: true, position: 'left', title: { display: true, text: 'Voltage (V)' } },
                  y1: { type: 'linear', display: true, position: 'right', grid: { drawOnChartArea: false }, title: { display: true, text: 'Power (W)' } }
              }
          }
      });
  }
  
  // Update the text display cards
  function updateDisplay(data) {
      document.getElementById('voltage').textContent = data.voltage.toFixed(2);
      document.getElementById('current').textContent = data.current.toFixed(2);
      document.getElementById('power').textContent = data.power.toFixed(2);
      document.getElementById('powerFactor').textContent = data.powerFactor.toFixed(2);
  }
  
  // Update the real-time chart
  function updateChart(data) {
      const timeString = new Date().toLocaleTimeString();
      
      timestampData.push(timeString);
      voltageData.push(data.voltage);
      powerData.push(data.power);
      
      if (timestampData.length > maxDataPoints) {
          timestampData.shift();
          voltageData.shift();
          powerData.shift();
      }
      
      realtimeChart.update();
  }
  
  // The main function to listen for data from Firebase
  function startListening() {
      const livedataRef = ref(database, 'livedata');
      
      onValue(livedataRef, (snapshot) => {
          const data = snapshot.val();
          if (data) {
              console.log("Received data:", data);
              updateDisplay(data);
              updateChart(data);
          } else {
              console.log("No data available yet.");
          }
      });
  }
  
  // Start the application when the page loads
  window.addEventListener('load', () => {
      initChart();
      startListening();
  });
let links = document.querySelectorAll(".header ul li a");
function scrollSection(elements) {
  elements.forEach((element) => {
    element.addEventListener("click", (e) => {
      document.querySelector(e.target.dataset.section).scrollIntoView({
        behavior: "smooth",
      });
    });
  });
}
scrollSection(links);


const chartConfig = {
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: { enabled: true }
  },
  scales: {
    x: { display: false },
    y: {
      min: 0,
      max: 100,
      ticks: { stepSize: 20 }
    }
  }
};

const charts = {
  moisture: createChart('moistureChart', 'Soil Moisture (%)', '#2196F3'),
  temp: createChart('tempChart', 'Temperature (°C)', '#ff6384'),
  humidity: createChart('humidityChart', 'Humidity (%)', '#4CAF50')
};

function createChart(id, label, color) {
  return new Chart(document.getElementById(id).getContext('2d'), {
    type: 'line',
    data: {
      labels: [],
      datasets: [{
        label,
        data: [],
        borderColor: color,
        tension: 0.4,
        borderWidth: 2,
        pointRadius: 2
      }]
    },
    options: chartConfig
  });
}

function updateChart(chart, value) {
  const time = new Date().toLocaleTimeString();
  if (chart.data.labels.length > 15) {
    chart.data.labels.shift();
    chart.data.datasets[0].data.shift();
  }
  chart.data.labels.push(time);
  chart.data.datasets[0].data.push(value);
  chart.update();
}

async function fetchData() {
  try {
    const response = await fetch('/api/data');
    const data = await response.json();

    document.getElementById('moisture').textContent = `${data.soil_moisture}%`;
    document.getElementById('temperature').textContent = `${data.temperature}°C`;
    document.getElementById('humidity').textContent = `${data.humidity}%`;
    document.getElementById('irrigation').textContent =
      data.irrigation === 'ON' ? '🟢 ACTIVE' : '🔴 INACTIVE';

    updateChart(charts.moisture, data.soil_moisture);
    updateChart(charts.temp, data.temperature);
    updateChart(charts.humidity, data.humidity);
  } catch (error) {
    console.error('Fetch error:', error);
  }
}

async function controlPump(action) {
  const buttons = document.querySelectorAll('button');
  buttons.forEach(btn => btn.disabled = true);

  try {
    const response = await fetch('/api/control_pump', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action })
    });
    const result = await response.json();
    alert(result.message);
    await fetchData();
  } catch (error) {
    alert(`Error: ${error.message}`);
  } finally {
    buttons.forEach(btn => btn.disabled = false);
  }
}

// Initialize
setInterval(fetchData, 5000);
fetchData();






























// document.addEventListener("DOMContentLoaded", function () {
//   const toggleCheckbox = document.getElementById("pumpToggle");
//   const sensorData = document.querySelector(".data");

//   function updatePumpState(humidity) {
//     if (!sensorData || !toggleCheckbox) return; // التأكد من وجود العناصر

//     let maxThreshold = parseInt(sensorData.getAttribute("data-max")) || 80; // افتراض 80 إذا لم يتم تحديدها

//     // تحديث النص داخل العنصر ليعرض قيمة الرطوبة
//     sensorData.textContent = `Humidity: ${humidity}%`;

//     if (humidity <= 20) {
//       toggleCheckbox.checked = true; // تشغيل المضخة
//     } else if (humidity >= maxThreshold) {
//       toggleCheckbox.checked = false; // إيقاف المضخة
//     }
//   }

//   function fetchSensorData() {
//     fetch("/api/humidity") // استبدل هذا برابط API الفعلي
//       .then((response) => {
//         if (!response.ok) throw new Error("Failed to fetch data");
//         return response.json();
//       })
//       .then((data) => {
//         if (data && data.humidity !== undefined) {
//           let humidity = parseInt(data.humidity);
//           sensorData.setAttribute("data-main", humidity); // تحديث البيانات في HTML
//           updatePumpState(humidity);
//         } else {
//           console.error("Invalid data format:", data);
//         }
//       })
//       .catch((error) => console.error("Error fetching humidity data:", error));
//   }

//   // تحديث البيانات كل 5 ثوانٍ
//   setInterval(fetchSensorData, 5000);

//   // تشغيل أول تحديث عند تحميل الصفحة
//   fetchSensorData();
// });

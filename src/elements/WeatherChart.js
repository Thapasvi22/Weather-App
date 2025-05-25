import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
);

const WeatherChart = ({ data = [], unit }) => {
  if (!data || data.length === 0) return null;

  const chartData = {
    labels: data.map((item) =>
      new Date(item.dt * 1000).toLocaleDateString(undefined, {
        weekday: "short",
        month: "short",
        day: "numeric",
      })
    ),
    datasets: [
      {
        label: `Temperature (${unit === "imperial" ? "°F" : "°C"})`,
        data: data.map((item) => item.temp),
        fill: false,
        borderColor: "rgba(75,192,192,1)",
        tension: 0.3,
        pointBackgroundColor: "#fff",
        pointBorderWidth: 1,
        pointRadius: 5,
      },
    ],
  };

  const options = {
    plugins: {
      legend: { display: true },
    },
    scales: {
      y: {
        beginAtZero: false,
      },
    },
  };

  return (
    <div style={{ maxWidth: "600px", margin: "20px auto" }}>
      <Line data={chartData} options={options} />
    </div>
  );
};

export default WeatherChart;

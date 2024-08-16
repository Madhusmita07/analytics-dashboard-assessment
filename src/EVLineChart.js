import React from 'react';
import { Line } from 'react-chartjs-2';

function EVLineChart({ data }) {
    const years = [...new Set(data.map(item => item.ModelYear))].sort(); // Unique and sorted years
    const evCounts = years.map(year => 
        data.filter(item => item.ModelYear === year).length
    );

    const chartData = {
        labels: years,
        datasets: [
            {
                label: 'Number of EVs per Year',
                data: evCounts,
                fill: false,
                backgroundColor: 'rgba(54, 162, 235, 0.6)',
                borderColor: 'rgba(54, 162, 235, 1)',
            },
        ],
    };

    return <Line data={chartData} />;
}

export default EVLineChart;

import React from 'react';
import { Pie } from 'react-chartjs-2';

function EVPieChart({ data }) {
    const locations = [...new Set(data.map(item => item.Location))];
    const evCounts = locations.map(location =>
        data.filter(item => item.Location === location).length
    );

    const chartData = {
        labels: locations,
        datasets: [
            {
                label: 'EV Distribution by Location',
                data: evCounts,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.6)',
                    'rgba(54, 162, 235, 0.6)',
                    'rgba(255, 206, 86, 0.6)',
                    'rgba(75, 192, 192, 0.6)',
                    'rgba(153, 102, 255, 0.6)',
                    'rgba(255, 159, 64, 0.6)',
                ],
            },
        ],
    };

    return <Pie data={chartData} />;
}

export default EVPieChart;

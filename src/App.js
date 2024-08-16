import React, { useState, useEffect } from 'react';
import { Bar, Line, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { Container, Paper, Typography, Grid, TextField } from '@mui/material';
import Papa from 'papaparse';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, ArcElement);

const App = () => {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    Papa.parse('/Electric_Vehicle_Population_Data.csv.csv', {
      download: true,
      header: true,
      complete: function (results) {
        setData(results.data);
        setFilteredData(results.data);
      },
    });
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = data.filter(
        (item) =>
          item['Make']?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item['Model']?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item['VIN (1-10)']?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredData(filtered);
    } else {
      setFilteredData(data);
    }
  }, [searchTerm, data]);

  const getCount = (field) => {
    const count = filteredData.reduce((acc, curr) => {
      const key = curr[field];
      acc[key] = acc[key] ? acc[key] + 1 : 1;
      return acc;
    }, {});
    return Object.values(count);
  };

  const barChartData = {
    labels: [...new Set(filteredData.map((item) => item.Make || 'Unknown'))],
    datasets: [
      {
        label: 'Number of EVs by Manufacturer',
        data: getCount('Make'),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
    ],
  };

  const lineChartData = {
    labels: [...new Set(filteredData.map((item) => item['Model Year'] || 'Unknown'))].sort((a, b) => a - b),
    datasets: [
      {
        label: 'EVs by Model Year',
        data: getCount('Model Year'),
        backgroundColor: 'rgba(153, 102, 255, 0.6)',
        borderColor: 'rgba(153, 102, 255, 1)',
        fill: false,
      },
    ],
  };

  const pieChartData = {
    labels: [...new Set(filteredData.map((item) => item['Electric Vehicle Type'] || 'Unknown'))],
    datasets: [
      {
        label: 'Number of EVs by Type',
        data: getCount('Electric Vehicle Type'),
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

  const cityChartData = {
    labels: [...new Set(filteredData.map((item) => item.City || 'Unknown'))],
    datasets: [
      {
        label: 'Number of EVs by City',
        data: getCount('City'),
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
      },
    ],
  };

  const cafvChartData = {
    labels: [...new Set(filteredData.map((item) => item['Clean Alternative Fuel Vehicle (CAFV) Eligibility'] || 'Unknown'))],
    datasets: [
      {
        label: 'CAFV Eligibility',
        data: getCount('Clean Alternative Fuel Vehicle (CAFV) Eligibility'),
        backgroundColor: [
          'rgba(75, 192, 192, 0.6)',
          'rgba(153, 102, 255, 0.6)',
        ],
      },
    ],
  };

  return (
    <Container>
      <Paper elevation={3} style={{ padding: '20px', marginTop: '20px' }}>
        <Typography variant="h4" align="center" gutterBottom>
          EV Population Dashboard
        </Typography>
        <TextField
          label="Search by Make, Model or VIN"
          variant="outlined"
          fullWidth
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ marginBottom: '20px' }}
        />
        {filteredData.length > 0 && searchTerm && (
          <div style={{ marginBottom: '20px' }}>
            <Typography variant="h6">Vehicle Details</Typography>
            <Typography>County: {filteredData[0].County}</Typography>
            <Typography>City: {filteredData[0].City}</Typography>
            <Typography>State: {filteredData[0].State}</Typography>
            <Typography>Postal Code: {filteredData[0]['Postal Code']}</Typography>
            <Typography>Model: {filteredData[0].Model}</Typography>
            <Typography>CAFV Eligibility: {filteredData[0]['Clean Alternative Fuel Vehicle (CAFV) Eligibility']}</Typography>
            <Typography>Electric Range: {filteredData[0]['Electric Range']}</Typography>
            <Typography>Legislative District: {filteredData[0]['Legislative District']}</Typography>
            <Typography>DOL Vehicle ID: {filteredData[0]['DOL Vehicle ID']}</Typography>
            <Typography>Electric Utility: {filteredData[0]['Electric Utility']}</Typography>
            <Typography>2020 Census Tract: {filteredData[0]['2020 Census Tract']}</Typography>
          </div>
        )}
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Bar data={barChartData} options={{ plugins: { tooltip: { enabled: true } } }} />
          </Grid>
          <Grid item xs={12} md={6}>
            <Line data={lineChartData} options={{ plugins: { tooltip: { enabled: true } } }} />
          </Grid>
          <Grid item xs={12} md={6}>
            <Pie data={pieChartData} options={{ plugins: { tooltip: { enabled: true } } }} />
          </Grid>
          <Grid item xs={12} md={6}>
            <Bar data={cityChartData} options={{ plugins: { tooltip: { enabled: true } } }} />
          </Grid>
          <Grid item xs={12} md={6}>
            <Pie data={cafvChartData} options={{ plugins: { tooltip: { enabled: true } } }} />
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default App;

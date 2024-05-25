import '~~/pages/Statis.scss';
import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS } from 'chart.js/auto';

function BarChart({ chartData, onBarClick }) {
    const options = {
        onClick: (event, elements) => {
            if (elements.length > 0) {
                const index = elements[0].index;
                onBarClick(index);
            }
        }
    };

    return <Bar data={chartData} options={options} />;
}

export default BarChart;

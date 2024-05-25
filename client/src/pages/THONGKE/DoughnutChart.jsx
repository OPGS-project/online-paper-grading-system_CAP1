import '~~/pages/Statis.scss';
import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS } from 'chart.js/auto';

function DoughnutChart({ chartData, onDoughnutClick }) {
    const options = {
        onClick: (event, elements) => {
            if (elements.length > 0) {
                const index = elements[0].index;
                onDoughnutClick(index);
            }
        },
    };

    return <Doughnut data={chartData} options={options} />;
}

export default DoughnutChart;

import React from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

export const options = {
    responsive: true,
};

const   MergePerWeek = (props: { dataset: number[] }) => {

    const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    const data = {
        labels,
        datasets: [
          {
            label: 'Your total of merge request',
            data: props.dataset,
            backgroundColor: 'lightblue',
          },
        ],
      };

    return (
        <React.Fragment>
            <Bar options={options} data={data} />
        </React.Fragment>
    )
}

export default MergePerWeek;
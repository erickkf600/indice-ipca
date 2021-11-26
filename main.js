import { dataMock } from './data.mock.js';

const ctx = document.getElementById('myChart');
const labels = [
  'Jan',
  'Fev',
  'Mar',
  'Abr',
  'Mai',
  'Jun',
  'Jul',
  'Ago',
  'Set',
  'Out',
  'Nov',
  'Dez',
];
const labelsTooltip = (tooltipItems) => {
  return `${tooltipItems.raw.valor}%`;
};
dataMock.map((el) => {
  const month = el.data.split('/')[1] - 1;
  return Object.assign(el, {
    NovoValor: el.valor == 0 ? 0.02 : Math.abs(el.valor),
    label: labels[month],
    ano: el.data.split('/').at(-1),
  });
});
const result = dataMock.reduce(function (rv, x) {
  (rv[x['ano']] = rv[x['ano']] || []).push(x);
  return rv;
}, {});

const myChart = new Chart(ctx, {
  type: 'bar',
  data: {
    datasets: [
      {
        data: null,
        borderWidth: 1,
        backgroundColor: dataMock.map((el) => {
          return el.valor < 0 ? '#d93b3b' : '#539dcf';
        }),
        datalabels: {
          anchor: 'end',
          align: 'start',
          opacity: 0.7,
          color: '#fff',
          padding: {
            top: 8,
          },
          font: {
            weight: 'bold',
          },
          formatter: (val) => {
            return Math.abs(val.NovoValor) < 0.1 ? null : `${val.valor}%`;
          },
        },
      },
    ],
  },
  plugins: [ChartDataLabels],
  options: {
    maintainAspectRatio: false,
    parsing: {
      xAxisKey: 'label',
      yAxisKey: 'NovoValor',
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        displayColors: false,
        callbacks: {
          title: (tooltipItems) => 'Índice',
          label: labelsTooltip,
        },
      },
    },
    scales: {
      y: {
        grid: {
          borderWidth: 2,
          borderColor: '#000',
          borderDash: [5],
        },
        ticks: {
          display: false,
          beginAtZero: true,
        },
      },
      x: {
        grid: {
          borderWidth: 2,
          borderColor: '#000',
          display: false,
        },
      },
    },
  },
});

const select = document.getElementById('select-year');
const error_msg = document.querySelector('.msg');
const selecione = document.querySelector('.selecione');
select.addEventListener('change', (event) => {
  myChart.data.datasets[0].data = result[event.target.value];
  myChart.update();
  selecione.style.display = 'none';
  if (!result[event.target.value]) {
    error_msg.style.display = 'flex';
  } else {
    error_msg.style.display = 'none';
  }
});

const dataMock = [{
    data: '01/01/2019',
    valor: '0.1',
},
{
    data: '01/02/2019',
    valor: '0.65',
},
{
    data: '01/03/2019',
    valor: '-0.45',
},
{
    data: '01/04/2019',
    valor: '0.52',
},
{
    data: '01/05/2019',
    valor: '-0.30',
},
{
    data: '01/06/2019',
    valor: '0.15',
},
{
    data: '01/07/2019',
    valor: '-0.8',
},
{
    data: '01/08/2019',
    valor: '-1',
},
{
    data: '01/09/2019',
    valor: '0.9',
},
{
    data: '01/10/2019',
    valor: '0.33',
},
{
    data: '01/11/2019',
    valor: '0.50',
},
{
    data: '01/12/2019',
    valor: '0.48',
},
{
    data: '01/01/2020',
    valor: '0.21',
},
{
    data: '01/02/2020',
    valor: '0.01',
},
{
    data: '01/03/2020',
    valor: '-0.15',
},
{
    data: '01/04/2020',
    valor: '0.25',
},
{
    data: '01/05/2020',
    valor: '-0.45',
},
{
    data: '01/06/2020',
    valor: '-0.26',
},
{
    data: '01/07/2020',
    valor: '-0.10',
},
{
    data: '01/08/2020',
    valor: '-0.47',
},
{
    data: '01/09/2020',
    valor: '0.17',
},
{
    data: '01/10/2020',
    valor: '0.55',
},
{
    data: '01/11/2020',
    valor: '0.39',
},
{
    data: '01/12/2020',
    valor: '0.83',
},
{
    data: '01/01/2021',
    valor: '0.50',
},
{
    data: '01/02/2021',
    valor: '0.2',
},
{
    data: '01/03/2021',
    valor: '0.15',
},
{
    data: '01/04/2021',
    valor: '-0.25',
},
{
    data: '01/05/2021',
    valor: '0.45',
},
{
    data: '01/06/2021',
    valor: '0.26',
},
{
    data: '01/07/2021',
    valor: '-0.20',
},
{
    data: '01/08/2021',
    valor: '-1',
},
{
    data: '01/09/2021',
    valor: '0.17',
},
{
    data: '01/10/2021',
    valor: '0.55',
},
{
    data: '01/11/2021',
    valor: '0.39',
},
{
    data: '01/12/2021',
    valor: '0.83',
},
];

const ctx = document.getElementById('myChart');
const ctx2 = document.getElementById('doughnut');
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
const result = dataMock.reduce(function(rv, x) {
(rv[x['ano']] = rv[x['ano']] || []).push(x);
return rv;
}, {});

const myChart = new Chart(ctx, {
type: 'bar',
data: {
    datasets: [{
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
    }, ],
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

const doughnut = new Chart(ctx2, {
    type: 'doughnut',
    data: {
        datasets: [{
            data: null,
            backgroundColor: [
                '#eb4034',
                "#ebcd34",
                "#348feb",
                "#4BC0C0"
            ],
        }],

    },
    options: {
      aspectRatio: 1,
      plugins: {
        legend: {
          position: 'top',
        },
        title: {
          display: false,
        }
      }
    },
  });

const select = document.getElementById('select-year');
const error_msg = document.querySelector('.msg');
const selecione = document.querySelector('.selecione');
const grid = document.querySelector('.grid');
let doughnutValues
let trimestralValuesIntact
let selectedYear
select.addEventListener('change', (event) => {
    selectedYear = event.target.value
    myChart.data.datasets[0].data = result[event.target.value];
    myChart.update();
    selecione.style.display = 'none';
    grid.style.height = '180px';
    if (!result[event.target.value]) {
        error_msg.style.display = 'flex';
    } else {
        error_msg.style.display = 'none';
    }
    trimestralValuesIntact = result[event.target.value]
    let trimestralValues =  result[event.target.value]?.reduce((acc, _, i) =>{
        return i % 3 === 0  ? [...acc, result[event.target.value].slice(i, i + 3)] : acc
    }, [])

    doughnutValues = trimestralValues.map(el =>{
        return el.reduce((ac, el) => +parseFloat(ac + el.NovoValor).toFixed(2), 0)
    })

    doughnut.data.datasets[0].data = doughnutValues;
    doughnut.update();
});


function downloadSheet(){
    let csv
    for(let row = 0; row < trimestralValuesIntact.length; row++){
        let keysAmount = Object.keys(trimestralValuesIntact[row]).length
        let keysCounter = 0

        if(row === 0){
        for(let key in trimestralValuesIntact[row]){
            csv += key + (keysCounter+1 < keysAmount ? '|' : '\r\n' )
            keysCounter++
        }
        }else{
        for(let key in trimestralValuesIntact[row]){
            csv += trimestralValuesIntact[row][key] + (keysCounter+1 < keysAmount ? '|' : '\r\n' )
            keysCounter++
        }
        }

        keysCounter = 0
    }

    let link = document.createElement('a')
    link.id = 'download-csv'
    link.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(csv));
    link.setAttribute('download', 'planilha'+selectedYear+'.csv');
    document.body.appendChild(link)
    document.querySelector('#download-csv').click()
}

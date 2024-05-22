const options = {
  colors: ['#1A56DB', '#FDBA8C'],
  series: [
    {
      name: 'Organic',
      color: '#1A56DB',
      data: [
        { x: 'Mon', y: 231 },
        { x: 'Tue', y: 122 },
        { x: 'Wed', y: 63 },
        { x: 'Thu', y: 421 },
        { x: 'Fri', y: 122 },
        { x: 'Sat', y: 323 },
        { x: 'Sun', y: 111 },
      ],
    },
    {
      name: 'Social media',
      color: '#FDBA8C',
      data: [
        { x: 'Mon', y: 232 },
        { x: 'Tue', y: 113 },
        { x: 'Wed', y: 341 },
        { x: 'Thu', y: 224 },
        { x: 'Fri', y: 522 },
        { x: 'Sat', y: 411 },
        { x: 'Sun', y: 243 },
      ],
    },
  ],
  chart: {
    type: 'bar',
    height: '320px',
    fontFamily: 'Inter, sans-serif',
    toolbar: { show: false },
  },
  plotOptions: {
    bar: {
      horizontal: false,
      columnWidth: '70%',
      borderRadiusApplication: 'end',
      borderRadius: 8,
    },
  },
  tooltip: {
    shared: true,
    intersect: false,
    style: { fontFamily: 'Inter, sans-serif' },
  },
  states: {
    hover: {
      filter: { type: 'darken', value: 1 },
    },
  },
  stroke: {
    show: true,
    width: 0,
    colors: ['transparent'],
  },
  grid: {
    show: true,
    strokeDashArray: 4,
    padding: { left: 2, right: 2, top: -14 },
  },
  dataLabels: { enabled: false },
  legend: { show: true },
  xaxis: {
    floating: false,
    labels: {
      show: true,
      style: {
        fontFamily: 'Inter, sans-serif',
        cssClass: 'text-xs font-normal fill-gray-500 dark:fill-gray-400',
      },
    },
    axisBorder: { show: false },
    axisTicks: { show: false },
  },
  yaxis: {
    floating: false,
    labels: {
      show: true,
      style: {
        fontFamily: 'Inter, sans-serif',
        cssClass: 'text-xs font-normal fill-gray-500 dark:fill-gray-400',
      },
    },
  },
  fill: { opacity: 1 },
};

if (
  document.getElementById('revenue-chart') &&
  typeof ApexCharts !== 'undefined'
) {
  const chart = new ApexCharts(
    document.getElementById('revenue-chart'),
    options,
  );
  chart.render();
}

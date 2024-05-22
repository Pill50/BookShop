fetch('http://localhost:8080/admin/dashboard/getRevenueChartData', {
  method: 'GET',
})
  .then((res) => res.json())
  .then((resData) => {
    renderChart(resData.revenueChartData);
  })
  .catch((error) => {
    console.error('Error fetching data:', error);
  });

function renderChart(chartData) {
  const seriesData = [
    {
      name: 'Revenue',
      data: chartData.map((item) => ({
        x: item.time,
        y: item.revenue,
      })),
    },
  ];

  const options = {
    colors: ['#1A56DB', '#FDBA8C'],
    series: seriesData,
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
}

fetch('http://localhost:8080/admin/dashboard/getFeedbackPieData', {
  method: 'GET',
})
  .then((res) => res.json())
  .then((resData) => {
    renderPieChart(resData.feedbackPieData);
  })
  .catch((error) => {
    console.error('Error fetching data:', error);
  });

const renderPieChart = (feedbackData) => {
  const options = {
    series: [
      feedbackData.positiveFeedback,
      feedbackData.goodFeedback,
      feedbackData.negativeFeedback,
    ],
    colors: ['#16BDCA', '#9061F9', '#DB4437'],
    chart: {
      height: 420,
      width: '100%',
      type: 'pie',
    },
    stroke: {
      colors: ['white'],
      lineCap: '',
    },
    plotOptions: {
      pie: {
        labels: {
          show: true,
        },
        size: '100%',
        dataLabels: {
          offset: -25,
        },
      },
    },
    labels: ['Positive', 'Good', 'Negative'],
    dataLabels: {
      enabled: true,
      style: {
        fontFamily: 'Inter, sans-serif',
      },
    },
    legend: {
      position: 'bottom',
      fontFamily: 'Inter, sans-serif',
    },
    yaxis: {
      labels: {
        formatter: function (value) {
          return value + '%';
        },
      },
    },
    xaxis: {
      labels: {
        formatter: function (value) {
          return value + '%';
        },
      },
      axisTicks: {
        show: false,
      },
      axisBorder: {
        show: false,
      },
    },
  };

  if (
    document.getElementById('feedback-chart') &&
    typeof ApexCharts !== 'undefined'
  ) {
    const chart = new ApexCharts(
      document.getElementById('feedback-chart'),
      options,
    );
    chart.render();
  }
};

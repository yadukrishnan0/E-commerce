$('#menu-btn').click(function() {
    $('#menu').toggleClass('active')
  })

const ctx = document.getElementById('myChart');
const ctx2 = document.getElementById('myChart2');




document.addEventListener('DOMContentLoaded', async (e) => {
    e.preventDefault();
    const response = await axios.post('/admin/chart');
    const result = response.data;
    const data = result.data;
const users =result.users
    if (result.success === true) {
        const months = data.map(entry => `${entry.month}-${entry.year}`);
        const salesData = data.map(entry => entry.total);

        new Chart(ctx, {
            type: 'line',
            data: {
                labels: months,
                datasets: [{
                    label: 'Total Sales',
                    data: salesData,
                    borderWidth: 1,
                    
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });






const monthCounts = {};
users.forEach(user => {
  const createdAt = new Date(user.createdAt);
  const monthYearKey = `${createdAt.getMonth() + 1}-${createdAt.getFullYear()}`;

  if (monthCounts[monthYearKey]) {
    monthCounts[monthYearKey]++;
  } else {
    monthCounts[monthYearKey] = 1;
  }
});


const labels = Object.keys(monthCounts);
const userData = Object.values(monthCounts);


const ctx2 = document.getElementById('myChart2').getContext('2d');

new Chart(ctx2, {
  type: 'bar',
  data: {
    labels: labels,
    datasets: [{
      label: 'Users',
      data: userData,
      borderWidth: 1,
      backgroundColor: 'rgba(75, 192, 192, 0.2)',
      borderColor: 'rgba(75, 192, 192, 1)',
      hoverBackgroundColor: 'rgba(75, 192, 192, 0.4)',
      hoverBorderColor: 'rgba(75, 192, 192, 1)',
    }],
  },
  options: {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  },
});












    }
});



















// new Chart(ctx2, {
// type: 'bar',
// data: {
// labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
// datasets: [{
// label: 'users',
// data: [12, 19, 3, 5, 2, 3],
// borderWidth: 1
// }]
// },
// options: {
// scales: {
// y: {
//   beginAtZero: true
// }
// }
// }
// });



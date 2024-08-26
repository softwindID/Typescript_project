export class Main {
    constructor() {

        this.createChart();
        this.createChart2();

    };
    createChart() {
        const ctx = document.getElementById('myChart').getContext('2d');
        const data = {
            labels: [
                'Red',
                "Orange",
                'Yellow',
                "Green",
                'Blue',
            ],
            datasets: [{
                label: 'My First Dataset',
                data: [300, 50, 100, 200, 150],
                backgroundColor: [
                    '#DC3545',
                    '#FD7E14',
                    '#FFC107',
                    '#20C997',
                    '#0D6EFD'

    ],
                hoverOffset: 4
            }]
        };

        new Chart(ctx, {
            type: 'pie',
            data: data,
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    tooltip: {
                        callbacks: {
                            label: function(tooltipItem) {
                                return tooltipItem.label + ': ' + tooltipItem.raw;
                            }
                        }
                    }
                }
            }
        });
    }
    createChart2() {
        const ctx = document.getElementById('myChart2').getContext('2d');
        const data = {
            labels: [
                'Red',
                "Orange",
                'Yellow',
                "Green",
                'Blue',
            ],
            datasets: [{
                label: 'My First Dataset',
                data: [300, 50, 100, 200, 150],
                backgroundColor: [
                    '#DC3545',
                    '#FD7E14',
                    '#FFC107',
                    '#20C997',
                    '#0D6EFD'
                ],
                hoverOffset: 4
            }]
        };

        new Chart(ctx, {
            type: 'pie',
            data: data,
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    tooltip: {
                        callbacks: {
                            label: function(tooltipItem) {
                                return tooltipItem.label + ': ' + tooltipItem.raw;
                            }
                        }
                    }
                }
            }
        });
    }
}
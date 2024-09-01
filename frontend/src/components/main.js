import {HttpUtils} from "../utils/http-utils";

export class Main {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;
        this.createChart();
        this.createChart2();
        this.getBalance().then();

    };
    async getBalance() {
        const result = await HttpUtils.request('/balance');
        if (result.balance) {
            this.showBalance(result.response.balance);
        } else if (result.redirect) {
            this.openNewRoute(result.redirect);
        } else if (result.error || !result.response || (result.response && (result.response.error || !result.response.balance))) {
            return alert('Возникла ошибка при запросе баланса. Обратитесь в поддержку.');
        } else {
            this.showBalance(result.response.balance);
        }

    }
    showBalance(balance) {
        const balanceElement = document.getElementById('balance');
        if (balanceElement) {
            balanceElement.innerText = balance;
        } else {
            console.error('Не удалось найти элемент с ID "balance".');
        }
    }



    createChart() {
        const ctx = document.getElementById('myChart').getContext('2d');
        if (!ctx) {
            console.error('Element with id "myChart" not found');
            return;
        }
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
        if (!ctx) {
            console.error('Element with id "myChart2" not found');
            return;
        }
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
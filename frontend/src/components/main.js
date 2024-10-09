import {HttpUtils} from "../utils/http-utils";

export class Main {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;
        this.createChart();
        this.createChart2();

        this.getOperations('Сегодня').then();

        this.setupFilters();

        this.initDateSelection();
    };
    setupFilters() {
        const filterButtons = document.querySelectorAll('.incomes-costs-buttons button');
        filterButtons.forEach(button => {
            button.addEventListener('click', (e) => this.handleFilterButtonClick(e));

        });
    }
    initDateSelection() {
        const dateFromInput = document.getElementById('date-from');
        const dateToInput = document.getElementById('date-to');
        const intervalButton = document.getElementById('interval-button');

        intervalButton.disabled = true;

        [dateFromInput, dateToInput].forEach(input => {
            input.addEventListener('change', () => {
                const dateFromValid = dateFromInput.value !== '';
                const dateToValid = dateToInput.value !== '';
                intervalButton.disabled = !(dateFromValid && dateToValid);
            });
        });

        intervalButton.addEventListener('click', async () => {
            await this.getOperations(dateFromInput.value, dateToInput.value);
        });
    }


    handleFilterButtonClick(event) {
        const button = event.target;

        const filterButtons = document.querySelectorAll('.incomes-costs-buttons button');
        filterButtons.forEach(btn => {
            btn.classList.remove('active');
        });
        button.classList.add('active');

        const filterType = button.textContent.trim();
        this.getOperations(filterType).then();
    }


    async getOperations(filterType) {
        let result;
        switch (filterType) {
            case 'Сегодня':
                result = await HttpUtils.request('/operations?period=today&dateFrom=&dateTo=');
                break;
            case 'Неделя':
                result = await HttpUtils.request('/operations?period=week&dateFrom=&dateTo=');
                break;
            case 'Месяц':
                result = await HttpUtils.request('/operations?period=month&dateFrom=&dateTo=');
                break;
            case 'Год':
                result = await HttpUtils.request('/operations?period=year&dateFrom=&dateTo=');
                break;
            case 'Все':
                result = await HttpUtils.request('/operations?period=all&dateFrom=&dateTo=');
                break;
            case 'Интервал':
                result = await HttpUtils.request('/operations?period=&dateFrom=&dateTo=');
                break;
            default:
                console.log('Неизвестный фильтр');
                return;
        }

        // if (!result.error && Array.isArray(result.response)) {
        //     this.showOperations(result.response);
        // } else {
        //     console.log('Операции не найдены. Создайте операции.');
        // }
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
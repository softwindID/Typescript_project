import {HttpUtils} from "../utils/http-utils";

export class Main {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;

        this.expensesChart = null;
        this.incomesChart = null;
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
        if (filterType !== 'Интервал') {
            this.getOperations(filterType).then();
        }
    }


    async getOperations(filterType, dateFrom, dateTo) {
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
                console.log('Полученные данные:', result.response);
                break;
            case 'Интервал':
                result = await HttpUtils.request(`/operations?period=interval&dateFrom=${dateFrom}&dateTo=${dateTo}`);
                break;
            default:
                console.log('Неизвестный фильтр');
                return;
        }

        if (!result.error && Array.isArray(result.response)) {
            const expenses = this.filterByType(result.response, 'expense');
            const incomes = this.filterByType(result.response, 'income');

            const groupedExpenses = this.groupByCategory(expenses);
            const groupedIncomes = this.groupByCategory(incomes);

            const expensesChartData = this.prepareChartData(groupedExpenses);
            const incomesChartData = this.prepareChartData(groupedIncomes);

            this.createChart(expensesChartData); // Для расходов
            this.createChart2(incomesChartData); // Для доходов
        } else {
            console.log('Операции не найдены. Создайте операции.');
        }
    }

    filterByType(data, type) {
        return data.filter(item => item.type === type);
    }

    groupByCategory(data) {
        return data.reduce((sum, item) => {
            if (!sum[item.category]) {
                sum[item.category] = 0;
            }
            sum[item.category] += item.amount;
            return sum;
        }, {});
    }

    prepareChartData(groupedData) {
        const labels = Object.keys(groupedData);
        const amounts = Object.values(groupedData);

        return {
            labels,
            datasets: [{
                label: 'Суммы по категориям',
                data: amounts,
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
    }
    destroyChart(chart) {
        if (chart) {
            chart.destroy();
        }
    }
    createChart(data) {
        const ctx = document.getElementById('myChart').getContext('2d');
        if (!ctx) {
            console.error('Element with id "myChart" not found');
            return;
        }
        this.destroyChart(this.expensesChart);
        this.expensesChart = new Chart(ctx, {
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
                            label: function (tooltipItem) {
                                return tooltipItem.label + ': ' + tooltipItem.raw;
                            }
                        }
                    }
                }
            }
        });
    }



        createChart2(data)
        {
            const ctx = document.getElementById('myChart2').getContext('2d');
            if (!ctx) {
                console.error('Element with id "myChart2" not found');
                return;
            }
            this.destroyChart(this.incomesChart);
            this.incomesChart = new Chart(ctx, {
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
                                label: function (tooltipItem) {
                                    return tooltipItem.label + ': ' + tooltipItem.raw;
                                }
                            }
                        }
                    }
                }
            });
        }
}
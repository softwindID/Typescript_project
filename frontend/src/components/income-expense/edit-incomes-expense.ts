import {HttpUtils} from "../../utils/http-utils";

export class EditIncomesExpense {
    constructor() {
        this.form = document.getElementById('edit-expense-form');

        this.createButton = document.getElementById('create-button');
        this.cancelButton = document.getElementById('cancel-button');
        this.urlParams = new URLSearchParams(window.location.search);
        this.operationId = this.urlParams.get('id');
        //this.type = this.urlParams.get('type');
        this.response = null;

        if (!this.operationId) {
            console.error('ID категории не предоставлен.');
            return;
        }
        this.loadOperation().then(() => {
            this.addEventListeners();
        });
    }
    async loadOperation() {
        try {
            console.log('Requesting operation with ID:', this.operationId);
            const result = await HttpUtils.request(`/operations/${this.operationId}`);
            console.log('API Response:', result);
           if  (result && result.response) {
               this.response = result.response;
                this.fillForm(this.response);
                this.type = this.response.type;
                await this.getCategories();
            } else {
                console.error('Не удалось загрузить информацию о категории.');
            }

        } catch (error) {
            console.error('Ошибка при выполнении запроса:', error);
        }
    }

    fillForm(operationId) {
        console.log('Operation data:', operationId);

        if (operationId) {
            const typeSelect = document.getElementById('typeSelect');
            const categoryInput = document.getElementById('typeSelectCategory');
            const amountInput = document.getElementById('amountInput');
            const dateInput = document.getElementById('dateInputDate');
            const commentInput = document.getElementById('commentInput');

            this.type = operationId.type;
            console.log(operationId.type);
            if (typeSelect) typeSelect.value = this.type || '';
            if (categoryInput) categoryInput.value = operationId.category || '';
            if (amountInput) amountInput.value = operationId.amount || '';
            if (dateInput) dateInput.value = operationId.date || '';
            if (commentInput) commentInput.value = operationId.comment || '';
        } else {
            console.error('Операция не найдена.');
        }
    }

    async getCategories() {
        const typeSelect = document.getElementById('typeSelect');
        const incomeOption = document.createElement('option');
        incomeOption.value = 'income';
        incomeOption.textContent = 'Доход';

        const expenseOption = document.createElement('option');
        expenseOption.value = 'expense';
        expenseOption.textContent = 'Расход';

        const typeCategory = this.type === 'income' ? '/categories/income' : '/categories/expense';

        try {
            const result = await HttpUtils.request(typeCategory);
            await this.showCategories(result.response);
        } catch (error) {
            console.error('Ошибка при получении категорий:', error);
        }
        if(this.type === expenseOption.value) {
            expenseOption.selected = true;
        } else {
            incomeOption.selected = true;
        }

        typeSelect.appendChild(incomeOption);
        typeSelect.appendChild(expenseOption);


        try {
            const result = await HttpUtils.request(typeCategory);

            await this.showCategories(result.response);
        } catch (error) {
            console.error('Ошибка при получении категорий:', error);
        }
    }

    async showCategories(categories) {

        const categorySelect = document.getElementById('typeSelectCategory');
        categorySelect.innerHTML = "";

        const optionElement = document.createElement('option');
        optionElement.disabled = true;
        optionElement.selected = true;
        optionElement.textContent = 'Категория...';
        categorySelect.appendChild(optionElement);

        if (Array.isArray(categories)) {
            categories.forEach(category => {
                const option = document.createElement('option');
                option.value = category.id;
                option.textContent = category.title;
                if(category.title.toLowerCase() === this.response.category.toLowerCase()) {
                    option.selected = true;

                }
                categorySelect.appendChild(option);
            });

        }

    }

    async saveOperation(event) {
        event.preventDefault();

        const type = document.getElementById('typeSelect').value;
        const category = document.getElementById('typeSelectCategory').value;
        const amount = document.getElementById('amountInput').value;
        const date = document.getElementById('dateInputDate').value;
        const comment = document.getElementById('commentInput').value;

        if (!type || !category || !amount || !date) {
            alert("Пожалуйста, заполните все поля.");
            return;
        }

        const updatedData = {
            id: this.operationId,
            type,
            amount: parseFloat(amount),
            date,
            comment,
            category_id: +category
        };

        try {
            const result = await HttpUtils.request(`/operations/${this.operationId}`, 'PUT', true, updatedData);
            if (result.response) {
                window.location.href = `/income-expense`;
            } else {
                alert('Ошибка при сохранении изменений. Попробуйте снова.');
            }
        } catch (error) {
            console.error('Ошибка при выполнении запроса:', error);
        }
    }
    cancelEdit() {
            window.location.href = '/income-expense';
        }
        addEventListeners() {
            const typeSelect = document.getElementById('typeSelect');
            if (typeSelect) {
                typeSelect.addEventListener('change', () => {
                    this.type = typeSelect.value;
                    this.getCategories().then();
                });
            }

            if (this.createButton) {
                this.createButton.addEventListener('click', (event) => this.saveOperation(event));

            }
            if (this.cancelButton) {
                this.cancelButton.addEventListener('click', () => this.cancelEdit());
            }
        }

}
import {HttpUtils} from "../../utils/http-utils";

export class EditIncomesExpense {
    constructor() {
        this.form = document.getElementById('edit-expense-form');

        this.createButton = document.getElementById('create-button');
        this.cancelButton = document.getElementById('cancel-button');
        this.urlParams = new URLSearchParams(window.location.search);
        this.operationId = this.urlParams.get('id');
        console.log('Operation ID:', this.operationId);
        if (!this.operationId) {
            console.error('ID категории не предоставлен.');
            return;
        }

        this.loadOperation().then(() => {
            this.addEventListeners();
           // this.setupEventListeners()
        });
    }
    async loadOperation() {
        try {
            console.log('Requesting operation with ID:', this.operationId);
            const result = await HttpUtils.request(`/operations?id=${this.operationId}`);
            console.log('API Response:', result);
           if  (result && result.response) {
                const operationId = result.response;

                this.fillForm(operationId);
                this.type = operationId.type;
                await this.getCategories();
            } else {
                console.error('Не удалось загрузить информацию о категории.');
            }

        } catch (error) {
            console.error('Ошибка при выполнении запроса:', error);
        }
    }
    // setupEventListeners() {
    //     const typeSelect = document.getElementById('typeSelect');
    //     if (typeSelect) {
    //         typeSelect.addEventListener('change', () => {
    //             this.type = typeSelect.value;
    //             this.getCategories().then();
    //         });
    //
    //     }
    //
    // }

    fillForm(operationId) {
        console.log('Operation data:', operationId);

        if (operationId) {
            const typeInput = document.getElementById('typeSelect');
            const categoryInput = document.getElementById('typeSelectCategory');
            const amountInput = document.getElementById('amountInput');
            const dateInput = document.getElementById('dateInputDate');
            const commentInput = document.getElementById('commentInput');

            if (typeInput) typeInput.value = operationId.type || '';
            if (categoryInput) categoryInput.value = operationId.category || '';
            if (amountInput) amountInput.value = operationId.amount || '';
            if (dateInput) dateInput.value = operationId.date || '';
            if (commentInput) commentInput.value = operationId.comment || '';
        } else {
            console.error('Операция не найдена.');
        }
    }


    async getCategories() {
        const typeCategory = this.type === 'income' ? '/categories/income' : '/categories/expense';

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
            category
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

            if (this.createButton) {
                this.createButton.addEventListener('click', (event) => this.saveOperation(event));

            }
            if (this.cancelButton) {
                this.cancelButton.addEventListener('click', () => this.cancelEdit());
            }
        }

}
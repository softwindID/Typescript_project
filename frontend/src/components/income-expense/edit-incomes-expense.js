import {HttpUtils} from "../../utils/http-utils";

export class EditIncomesExpense {
            constructor(openNewRoute) {
            this.openNewRoute = openNewRoute;
            this.form = document.getElementById('edit-expense-form');
            this.typeInput = document.getElementById('edit-type');
            this.categoryInput = document.getElementById('edit-category');
            this.amountInput = document.getElementById('edit-amount');
            this.dateInput = document.getElementById('edit-date');
            this.commentInput = document.getElementById('edit-comment');
            this.createButton = document.getElementById('create-button');
            this.cancelButton = document.getElementById('cancel-button');

            this.urlParams = new URLSearchParams(window.location.search);
            this.operationId = this.urlParams.get('id');
            if (!this.operationId) {
                console.error('ID операции не предоставлен.');
                return;
            }
            this.loadOperation().then(() => {
                this.addEventListeners();
            });
        }
        async loadOperation(operationId) {
            try {
                const result = await HttpUtils.request(`/operations?id=${operationId}`);
                if (result && result.response) {
                    this.typeInput.value = result.response.type || '';
                    this.categoryInput.value = result.response.category_id || '';
                    this.amountInput.value = result.response.amount || '';
                    this.dateInput.value = result.response.date || '';
                    this.commentInput.value = result.response.comment || '';

                } else {
                    console.error('Не удалось загрузить информацию об операции.');
                }

            } catch (error) {
                console.error('Ошибка при выполнении запроса:', error);
            }
        }

        async saveOperation(event) {
            event.preventDefault();
            const updatedData = {
                type: this.typeInput.value.trim(),
                category_id : this.categoryInput.value.trim(),
                amount: this.amountInput.value.trim(),
                date: this.dateInput.value.trim(),
                comment: this.commentInput.value.trim()
            };

            try {
                const result = await HttpUtils.request(`/operations/${this.operationId}`, 'PUT', true, updatedData);
                if (result && result.response) {
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
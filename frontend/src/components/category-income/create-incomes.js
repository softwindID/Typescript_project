import {HttpUtils} from "../../utils/http-utils";

export class CreateIncomes {
    constructor() {
        this.form = document.getElementById('create-incomes-form');
        this.categoryTitleInput = document.getElementById('create-incomes-title');
        this.saveButton = document.getElementById('create-button');
        this.cancelButton = document.getElementById('cancel-button');


        this.addEventListeners();
    }


    async CreateCategory(event) {
        if (event) event.preventDefault();

        const newTitle = this.categoryTitleInput.value.trim();

        if (!newTitle) {
            alert('Название категории не может быть пустым.');
            return;
        }

        try {
            const result = await HttpUtils.request('/categories/income', 'POST', true, { title: newTitle });

            if (result && result.response) {
                window.location.href = '/income';
            } else {
                alert('Ошибка при сохранении изменений. Попробуйте снова.');
            }
        } catch (error) {
            console.error('Ошибка при выполнении запроса:', error);
            alert('Произошла ошибка при создании категории. Попробуйте еще раз.');
        }
    }

    cancelEdit() {
        window.location.href = '/income';
    }

    addEventListeners() {
        if (this.saveButton) {
            this.saveButton.addEventListener('click', (event) => this.CreateCategory(event));
        }
        if (this.cancelButton) {
            this.cancelButton.addEventListener('click', () => this.cancelEdit());
        }
    }


}
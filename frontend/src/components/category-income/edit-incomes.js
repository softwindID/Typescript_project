import {HttpUtils} from "../../utils/http-utils";

export class EditIncomes {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;
        this.form = document.getElementById('edit-incomes-form');
        this.categoryTitleInput = document.getElementById('edit-incomes-title');
        this.saveButton = document.getElementById('save-button');
        this.cancelButton = document.getElementById('cancel-button');

        this.urlParams = new URLSearchParams(window.location.search);
        this.categoryId = this.urlParams.get('id');
        if (!this.categoryId) {
            console.error('ID категории не предоставлен.');
            return;
        }
        if (!this.categoryId) {
            console.error('ID категории не предоставлен.');
            return;
        }
        this.loadCategory().then(() => {
            this.addEventListeners();
        });
    }
    async loadCategory() {
        try {
                const result = await HttpUtils.request(`/categories/income/${this.categoryId}`);
                if (result && result.response.title) {
                    this.categoryTitleInput.value = result.response.title;

                } else {
                    console.error('Не удалось загрузить информацию о категории.');
                }

        } catch (error) {
            console.error('Ошибка при выполнении запроса:', error);
        }
    }

    async saveCategory(event) {
        event.preventDefault();
        const newTitle = this.categoryTitleInput.value.trim();

        try {
            const result = await HttpUtils.request(`/categories/income/${this.categoryId}`, 'PUT', true,
                {
                    title: newTitle
                }
                );

                if (newTitle &&  result.response) {
                    window.location.href = `/income`;
                } else {
                    alert('Ошибка при сохранении изменений. Попробуйте снова.');
                }
        } catch (error) {
            console.error('Ошибка при выполнении запроса:', error);
        }
    }

    cancelEdit() {
        window.location.href = '/income';
    }
    addEventListeners() {

        if (this.saveButton) {
            this.saveButton.addEventListener('click', (event) => this.saveCategory(event));

        }
        if (this.cancelButton) {
            this.cancelButton.addEventListener('click', () => this.cancelEdit());
        }
    }
}
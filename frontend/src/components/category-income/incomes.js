import {HttpUtils} from "../../utils/http-utils";
import {EditIncomes} from "./edit-incomes";
export class Incomes {

    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;

        this.getCategories().then();


    }

    async getCategories() {
        const result = await HttpUtils.request('/categories/income');
        if (Array.isArray(result)) {
            this.showCategories(result);
        } else if (result.redirect) {
            this.openNewRoute(result.redirect);
        } else if (result.error || !result.response || !result.response) {
            alert('Возникла ошибка при запросе категорий. Обратитесь в поддержку.');
        } else {
            this.showCategories(result.response);
        }

    }

    showCategories(categories) {
        const container = document.getElementById('categories-container');

        categories.forEach((category, index) => {

            const categoryIncomeContainerElement = document.createElement('div');
            categoryIncomeContainerElement.className = 'category-incomes';


            const categoryTitleElement = document.createElement('div');
            categoryTitleElement.className = 'category-incomes-title';
            categoryTitleElement.innerText = category.title;

            const categoryButtonElement = document.createElement('div');
            categoryButtonElement.className = 'incomes-button';

            const editButtonElement = document.createElement('button');
            editButtonElement.type = 'button';
            editButtonElement.className = 'btn btn-primary edit-button';
            editButtonElement.innerText = 'Редактировать';

            const deleteButtonElement = document.createElement('button');
            deleteButtonElement.type = 'button';
            deleteButtonElement.className = 'btn btn-danger delete-button';
            deleteButtonElement.innerText = 'Удалить';


            categoryButtonElement.appendChild(editButtonElement);
            categoryButtonElement.appendChild(deleteButtonElement);

            categoryIncomeContainerElement.appendChild(categoryTitleElement);
            categoryIncomeContainerElement.appendChild(categoryButtonElement);


            container.appendChild(categoryIncomeContainerElement);

        });
        //this.addEventListeners();
    }


    // addEventListeners() {
    //     const editButtonElement = document.getElementById('edit-button');
    //     const popupContainerElement = document.getElementById('popup-container');
    //     const deleteButtonElement = document.getElementById('delete-button');
    //     const yesButtonElement = document.getElementById('yes-button');
    //     const noButtonElement = document.getElementById('no-button');
    //
    //     editButtonElement.addEventListener('click', async () => {
    //         console.log('edit button clicked');
    //         const result = await HttpUtils.request('/categories/income/id');
    //     });
    //     deleteButtonElement.addEventListener('click', async () => {
    //         console.log('delete button clicked');
    //         popupContainerElement.style.display = 'block';
    //     });
    //
    // }

}
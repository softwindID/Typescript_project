import {HttpUtils} from "../../utils/http-utils";
import {AuthUtils} from "../../utils/auth-utils";
export class Incomes {

    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;

        this.getCategories().then();
    }

    async getCategories() {
        const tokenUpdated = await AuthUtils.updateRefreshToken();
        if (tokenUpdated) {
            const result = await HttpUtils.request('/categories/income');
            if (Array.isArray(result)) {
                this.categories = result;
                this.showCategories(result);
            } else if (result.redirect) {
                this.openNewRoute(result.redirect);
            } else if (result.error || !result.response || !result.response) {
                alert('Возникла ошибка при запросе категорий. Обратитесь в поддержку.');
            } else {
                this.showCategories(result.response);
            }
        }


    }

    showCategories(categories) {
        const container = document.getElementById('categories-container');

        categories.forEach((category) => {

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
            editButtonElement.setAttribute('data-category-id', category.id);

            const deleteButtonElement = document.createElement('button');
            deleteButtonElement.type = 'button';
            deleteButtonElement.className = 'btn btn-danger delete-button';
            deleteButtonElement.innerText = 'Удалить';
            deleteButtonElement.setAttribute('data-category-id', category.id);


            categoryButtonElement.appendChild(editButtonElement);
            categoryButtonElement.appendChild(deleteButtonElement);

            categoryIncomeContainerElement.appendChild(categoryTitleElement);
            categoryIncomeContainerElement.appendChild(categoryButtonElement);


            container.appendChild(categoryIncomeContainerElement);

        });
        this.addEventListeners();
    }


     addEventListeners() {
         const editButtonElements = document.querySelectorAll('.btn-primary');
         const deleteButtonElements = document.querySelectorAll('.btn-danger');
         const addCategoryButton = document.getElementById('add-category-button');

         editButtonElements.forEach(button => {
             button.addEventListener('click', async (event) => {
                 const categoryId = event.target.getAttribute('data-category-id');

                 if (categoryId) {
                     try {
                         const tokenUpdated = await AuthUtils.updateRefreshToken();
                         if (tokenUpdated) {
                             window.location.href = `/edit-incomes?id=${categoryId}`;
                         } else {
                             console.error('Не удалось обновить токен');
                         }
                     } catch (error) {
                         console.error('Ошибка при выполнении запроса:', error);
                     }
                 } else {
                     console.error('ID категории не найден.');
                 }
             });
         });
         deleteButtonElements.forEach(button => {

             button.addEventListener('click', (event) => {
                 const categoryId = event.target.getAttribute('data-category-id');
                 if (categoryId) {
                     this.openDeleteConfirmationPopup(categoryId);
                 } else {
                     console.error('ID категории не найден.');
                 }
             });
         });
         if (addCategoryButton) {
             addCategoryButton.addEventListener('click', () => {
                 window.location.href = '/create-incomes';
             });
         }
     }
    openDeleteConfirmationPopup(categoryId) {

        const popupContainerElement = document.getElementById('popup-container');
        const yesButtonElement = document.getElementById('yes-button');
        const noButtonElement = document.getElementById('no-button');

        popupContainerElement.style.display = 'block';

        yesButtonElement.onclick = async () => {
            try {
                const tokenUpdated = await AuthUtils.updateRefreshToken();
                if (tokenUpdated) {
                    const result = await HttpUtils.request(`/categories/income/${categoryId}`, { method: 'DELETE' });
                    if (result.success) {
                        await this.getCategories();
                    } else {
                        alert('Возникла ошибка при удалении категории. Обратитесь в поддержку.');
                    }
                } else {
                    console.error('Не удалось обновить токен');
                }
            } catch (error) {
                console.error('Ошибка при выполнении запроса:', error);
            } finally {
                popupContainerElement.style.display = 'none';
            }
        };

        noButtonElement.onclick = () => {
            popupContainerElement.style.display = 'none';
        };
     }

}
import {HttpUtils} from "../../utils/http-utils";
import {AuthUtils} from "../../utils/auth-utils";
import {Incomes} from "../category-income/incomes";

export class IncomesExpense {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;
        this.urlParams = new URLSearchParams(window.location.search);
        this.operationId = this.urlParams.get('id');

        console.log('Operation ID:', this.operationId);

        this.getOperations().then();
        this.clickCreateIncomeButton();
        this.clickCreateExpenseButton();
    }

    async getOperations(operationId) {
        const tokenUpdated = await AuthUtils.updateRefreshToken();
        if (tokenUpdated) {
           // let result = await HttpUtils.request('/operations?id=${operationId}');
           let result = await HttpUtils.request('/operations?period=all&dateFrom=&dateTo=');
            if (!result.error && Array.isArray(result.response) && result.response.length > 0) {
                this.showOperations(result.response);
            } else {

                if (!result.error && Array.isArray(result.response) && result.response.length > 0) {
                    this.showOperations(result.response);
                } else {
                    console.log('Операции не найдены. Создайте операции.');
                }
            }
        }
    }

    clickCreateIncomeButton() {
        const createButton = document.getElementById('create-income');
        if (createButton) {
            createButton.addEventListener('click', () => this.createOperation('income'));
        }
    }

    clickCreateExpenseButton() {
        const createButton = document.getElementById('create-expense');
        if (createButton) {
            createButton.addEventListener('click', () => this.createOperation('expense'));
        }
    }

    async createOperation(type) {
        window.location.href = `/create-incomes-expense?type=${type}`;

    }


    showOperations(data) {
        const tbody = document.getElementById('operations-tbody');

        data.forEach(response => {
            const row = document.createElement('tr');

            const idCell = document.createElement('td');
            idCell.textContent = response.id;

            const typeCell = document.createElement('td');
            typeCell.textContent = response.type;

            const categoryCell = document.createElement('td');
            categoryCell.textContent = response.category;

            const amountCell = document.createElement('td');
            amountCell.textContent = response.amount;

            const dateCell = document.createElement('td');
            dateCell.textContent = response.date;

            const commentCell = document.createElement('td');
            commentCell.textContent = response.comment;

            const iconCell = document.createElement('td');
            iconCell.className = 'icon-container';

            const deleteIcon = document.createElement('i');
            deleteIcon.className = 'fas fa-trash-alt mr-2';
            deleteIcon.onclick = () => this.openDeleteConfirmationPopup(response.id);

            const editIcon = document.createElement('i');
            editIcon.className = 'fas fa-pencil-alt';
            editIcon.onclick = () => this.editOperation(response.id);

            iconCell.appendChild(deleteIcon);
            iconCell.appendChild(editIcon);

            row.appendChild(idCell);
            row.appendChild(typeCell);
            row.appendChild(categoryCell);
            row.appendChild(amountCell);
            row.appendChild(dateCell);
            row.appendChild(commentCell);
            row.appendChild(iconCell);

            tbody.appendChild(row);
        });

    }

    openDeleteConfirmationPopup(operationId) {
        const overlayElement = document.getElementById('overlay');
        const popupContainerElement = document.getElementById('popup-container');
        const yesButtonElement = document.getElementById('yes-button');
        const noButtonElement = document.getElementById('no-button');
        overlayElement.appendChild(popupContainerElement);

        overlayElement.style.display = 'flex';
        popupContainerElement.style.display = 'block';

        yesButtonElement.onclick = async () => {
            try {

                const result = await HttpUtils.request(`/operations/${operationId}`, 'DELETE', true, null);
                if (result) {
                    window.location.href = '/income-expense';
                } else {
                    alert('Возникла ошибка при удалении операции. Обратитесь в поддержку.');
                }

            } catch (error) {
                console.error('Ошибка при выполнении запроса:', error);
            } finally {
                popupContainerElement.style.display = 'none';
            }
        };

        noButtonElement.onclick = () => {
            popupContainerElement.style.display = 'none';
            overlayElement.style.display = 'none';
        };
    }

    editOperation(operationId) {
        window.location.href = `/edit-incomes-expense?id=${operationId}`;
    }
}
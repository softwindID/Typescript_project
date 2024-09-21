import {HttpUtils} from "../../utils/http-utils";
import {AuthUtils} from "../../utils/auth-utils";

export class IncomesExpense {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;
        this.urlParams = new URLSearchParams(window.location.search);
        this.operationId = this.urlParams.get('id');

        console.log('Operation ID:', this.operationId);

        this.getOperations().then();
    }

    async getOperations() {
        const tokenUpdated = await AuthUtils.updateRefreshToken();
        if (tokenUpdated) {
            const result = await HttpUtils.request('/operations');
            if (Array.isArray(result) && result.length > 0) {
                this.showOperations(result);

            } else {
                alert('Операции не найдены. Попробуем загрузить по отдельности.');
               // await this.getOperation();
            }
        }
    }
    // async getOperation() {
    //
    //
    //     if (!this.operationId) {
    //         console.error('Operation ID is not defined.');
    //         return;
    //     }
    //     const result = await HttpUtils.request(`/operations/${this.operationId}`);
    //
    //     if (result) {
    //         this.showOperations([result]);
    //     } else {
    //         alert('Операция не найдена.');
    //     }
    //     }

    showOperations(data) {
        const tbody = document.getElementById('operations-tbody');

            data.forEach(operation => {
                const row = document.createElement('tr');

                const idCell = document.createElement('td');
                idCell.textContent = operation.id;

                const typeCell = document.createElement('td');
                typeCell.textContent = operation.type;

                const categoryCell = document.createElement('td');
                categoryCell.textContent = operation.category;

                const amountCell = document.createElement('td');
                amountCell.textContent = operation.amount;

                const dateCell = document.createElement('td');
                dateCell.textContent = operation.date;

                const commentCell = document.createElement('td');
                commentCell.textContent = operation.comment;

                const iconCell = document.createElement('td');
                iconCell.className = 'icon-container';

                const deleteIcon = document.createElement('i');
                deleteIcon.className = 'fas fa-trash-alt mr-2';
                deleteIcon.onclick = () => deleteOperation(operation.id);

                const editIcon = document.createElement('i');
                editIcon.className = 'fas fa-pencil-alt';
                editIcon.onclick = () => editOperation(operation.id);

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
}
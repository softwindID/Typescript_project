import {AuthUtils} from "../../utils/auth-utils";
import {HttpUtils} from "../../utils/http-utils";

export class CreateIncomesExpense {
    constructor() {
       // const idCell = document.createElement('td');

        this.setupEventListeners();
    }
    setupEventListeners() {
                const createButton = document.getElementById('create-button');
        if (createButton) {
            createButton.addEventListener('click', () => this.createOperation());
        }


        const cancelButton = document.getElementById('cancel-button');
        if (cancelButton) {
            cancelButton.addEventListener('click', () => this.cancel());
        }
    }

    async createOperation() {

        const categoryId= document.getElementById('typeSelectCategory').value;
        const type = document.getElementById('typeSelect').value;
        const amount = document.getElementById('amountInput').value;
        const date = document.getElementById('dateInputDate').value;
        const comment = document.getElementById('commentInput').value;
        const category = document.getElementById('typeSelectCategory').value;



        if (!type || !category || !amount || !date) {
            alert("Пожалуйста, заполните все поля.");
            return;
        }

        const createData = {
            id: categoryId,
            type,
            amount: parseFloat(amount),
            date: toString(),
            comment,
            category

        };

        console.log(createData);

        try {
            const tokenUpdated = await AuthUtils.updateRefreshToken();
            if (tokenUpdated) {
                const response = await HttpUtils.request('/operations', 'POST',  true, createData);


                if (response.success) {
                    window.location.href = '/income-expense';
                } else {
                    console.log('Ошибка при создании: ' + response.message);
                }
            }
        } catch (error) {
            console.error('Ошибка:', error);
            console.log('Произошла ошибка при создании операции.');
        }
    }
    keepData() {

    }
    cancel() {

        window.location.href = '/income-expense';
    }

}
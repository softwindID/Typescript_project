
import {HttpUtils} from "../../utils/http-utils";
import {Incomes} from "../category-income/incomes";
import {Expense} from "../category-expense/expense";

export class CreateIncomesExpense {
    constructor() {
        this.urlParams = new URLSearchParams(window.location.search);
        this.type = this.urlParams.get('type');
        this.setupEventListeners();
        this.getCategories().then();
    }
    setupEventListeners() {
        const typeSelect = document.getElementById('typeSelect');
        const createButton = document.getElementById('create-button');
        if (typeSelect) {
            typeSelect.addEventListener('change', () => {
                this.type = typeSelect.value;
                this.getCategories().then();
            });
        }
        if (createButton) {
            createButton.addEventListener('click', () => this.createOperation());
        }


        const cancelButton = document.getElementById('cancel-button');
        if (cancelButton) {
            cancelButton.addEventListener('click', () => this.cancel());
        }
    }

    async getCategories() {

               const typeCategory = this.type === 'income' ? '/categories/income' : '/categories/expense';
        try {
            const result = await HttpUtils.request(typeCategory);

            this.showCategories(result);
        } catch (error) {
            console.error('Ошибка при получении категорий:', error);

        }

            this.showCategories();

    }
    showCategories(categories) {
        const categorySelect = document.getElementById('typeSelectCategory');


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
    async createOperation() {

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
            type,
            amount: parseFloat(amount),
            date: date,
            comment,
            category_id: category

        };

        console.log(createData);

        try {
                const response = await HttpUtils.request('/operations', 'POST',  true, createData);
               // window.location.href = '/income-expense';
                if (response) {
                    window.location.href = '/income-expense';
                } else {
                    console.log('Ошибка при создании: ' + response.message);
                }

        } catch (error) {
            console.error('Ошибка:', error);
            console.log('Произошла ошибка при создании операции.');
        }
    }

    cancel() {

        window.location.href = '/income-expense';
    }

}
import {Main} from "./components/main.js";
import {Login} from "./components/login.js";
import {SignUp} from "./components/sign-up.js";
import {Incomes} from "./components/incomes";
import {CreateIncomes} from "./components/create-incomes";
import {EditIncomes} from "./components/edit-incomes";
import {Costs} from "./components/costs";
import {CreateCosts} from "./components/create-costs";
import {EditCosts} from "./components/edit-costs";
import {CreateIncomesCosts} from "./components/create-incomes-costs";
import {EditIncomesCosts} from "./components/edit-incomes-costs";
import {IncomesCosts} from "./components/incomes-costs";

export class Router {
    constructor() {
        this.titlePageElement =  document.getElementById('title');
        this.contentPageElement = document.getElementById('content');

    this.initEvents();
        this.routes = [
            {
                route: '/',
                title: 'Главная',
                filePathTemplate: '/templates/main.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new Main();
                }
            },
            {
                route: '/login',
                title: 'Авторизация',
                filePathTemplate: '/templates/login.html',
                load: () => {
                    new Login();
                }
            },
            {
                route: '/sign-up',
                title: 'Регистрация',
                filePathTemplate: '/templates/sign-up.html',
                load: () => {
                    new SignUp();
                }
            },
            {
                route: '/incomes',
                title: 'Доходы',
                filePathTemplate: '/templates/incomes.html',
                load: () => {
                    new Incomes();
                }
            },
            {
                route: '/create-incomes',
                title: 'Создание категории доходов',
                filePathTemplate: '/templates/create-incomes.html',
                load: () => {
                    new CreateIncomes();
                }
            },
            {
                route: '/edit-incomes',
                title: 'Редактирование категории доходов',
                filePathTemplate: '/templates/edit-incomes.html',
                load: () => {
                    new EditIncomes();
                }
            },
            {
                route: '/costs',
                title: 'Расходы',
                filePathTemplate: '/templates/costs.html',
                load: () => {
                    new Costs();
                }
            },
            {
                route: '/create-costs',
                title: 'Создание категории расходов',
                filePathTemplate: '/templates/create-costs.html',
                load: () => {
                    new CreateCosts();
                }
            },
            {
                route: '/edit-costs',
                title: 'Редактирование категории расходов',
                filePathTemplate: '/templates/edit-costs.html',
                load: () => {
                    new EditCosts();
                }
            },
            {
                route: '/incomes-costs',
                title: 'Расходы',
                filePathTemplate: '/templates/incomes-costs.html',
                load: () => {
                    new IncomesCosts();
                }
            },
            {
                route: '/create-incomes-costs',
                title: 'Создание дохода/расхода',
                filePathTemplate: '/templates/create-incomes-costs.html',
                load: () => {
                    new CreateIncomesCosts();
                }
            },
            {
                route: '/edit-incomes-costs',
                title: 'Создание дохода/расхода',
                filePathTemplate: '/templates/edit-incomes-costs.html',
                load: () => {
                    new EditIncomesCosts();
                }
            },
    ];
    }

    initEvents() {
        window.addEventListener('DOMContentLoaded', this.activateRoute.bind(this));
        window.addEventListener('popstate', this.activateRoute.bind(this));
    }

    async activateRoute() {
       const urlRoute =  window.location.pathname;
       const newRoute = this.routes.find(item => item.route === urlRoute);

       if (newRoute) {
            if (newRoute.title) {
                this.titlePageElement .innerText = newRoute.title + ' | Lumincoin Finance';
            }
            if (newRoute.filePathTemplate) {
                this.contentPageElement.innerHTML = await fetch(newRoute.filePathTemplate).then(response => response.text());
            }
            if (newRoute.load && typeof newRoute.load === 'function') {
                newRoute.load();
            }
       } else {
           console.log('No route found');
           return
       }
    }
}
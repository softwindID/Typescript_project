import {Main} from "./components/main.js";
import {Login} from "./components/auth/login.js";
import {SignUp} from "./components/auth/sign-up.js";
import {Incomes} from "./components/category-income/incomes";
import {CreateIncomes} from "./components/category-income/create-incomes";
import {EditIncomes} from "./components/category-income/edit-incomes";
import {Expense} from "./components/category-expense/expense";
import {CreateExpense} from "./components/category-expense/create-expense";
import {EditExpense} from "./components/category-expense/edit-expense";
import {CreateIncomesExpense} from "./components/income-expense/create-incomes-expense";
import {EditIncomesExpense} from "./components/income-expense/edit-incomes-expense";
import {IncomesExpense} from "./components/income-expense/incomes-expense";

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
                filePathTemplate: '/templates/auth/login.html',
                useLayout: false,
                load: () => {
                    new Login(this.openNewRoute.bind(this));
                }
            },
            {
                route: '/signup',
                title: 'Регистрация',
                filePathTemplate: '/templates/auth/sign-up.html',
                useLayout: false,
                load: () => {
                    new SignUp(this.openNewRoute.bind(this));
                }
            },
            {
                route: '/incomes',
                title: 'Доходы',
                filePathTemplate: '/templates/category-income/incomes.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new Incomes();
                }
            },
            {
                route: '/create-incomes',
                title: 'Создание категории доходов',
                filePathTemplate: '/templates/category-income/create-incomes.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new CreateIncomes();
                }
            },
            {
                route: '/edit-incomes',
                title: 'Редактирование категории доходов',
                filePathTemplate: '/templates/category-income/edit-incomes.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new EditIncomes();
                }
            },
            {
                route: '/expense',
                title: 'Расходы',
                filePathTemplate: '/templates/category-expense/expense.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new Expense();
                }
            },
            {
                route: '/create-expense',
                title: 'Создание категории расходов',
                filePathTemplate: '/templates/category-expense/create-expense.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new CreateExpense();
                }
            },
            {
                route: '/edit-expense',
                title: 'Редактирование категории расходов',
                filePathTemplate: '/templates/category-expense/edit-expense.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new EditExpense();
                }
            },
            {
                route: '/incomes-expense',
                title: 'Расходы',
                filePathTemplate: '/templates/income-expense/incomes-expense.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new IncomesExpense();
                }
            },
            {
                route: '/create-incomes-expense',
                title: 'Создание дохода/расхода',
                filePathTemplate: '/templates/income-expense/create-incomes-expense.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new CreateIncomesExpense();
                }
            },
            {
                route: '/edit-incomes-expense',
                title: 'Создание дохода/расхода',
                filePathTemplate: '/templates/income-expense/edit-incomes-expense.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new EditIncomesExpense();
                }
            },
    ];
    }

    initEvents() {
        window.addEventListener('DOMContentLoaded', this.activateRoute.bind(this));
        window.addEventListener('popstate', this.activateRoute.bind(this));
        document.addEventListener('click', this.clickHandler.bind(this));
    }

    async openNewRoute(url) {
        const currentRoute = window.location.pathname;
        history.pushState({}, '', url);
        await this.activateRoute(null, currentRoute);
    }

    async clickHandler(e) {
        let element = null;
        if (e.target.nodeName === 'A') {
            element = e.target;
        } else if (e.target.parentNode.nodeName === 'A') {
            element = e.target.parentNode;
        }
        if (element) {
            e.preventDefault();
            if (element.href.includes('#')) {
                return;
            }
            const currentRoute = window.location.pathname;
            const url = element.href.replace(window.location.origin, '');
            if (!url || (currentRoute === url.replace('/#', '')) || url.startsWith('javascript:void(0)')) {
                return;
            }
            await this.openNewRoute(url);
        }
    }

    async activateRoute(e, oldRoute = null) {
        if (oldRoute) {

            const currentRoute = this.routes.find(item => item.route === oldRoute);
            if (currentRoute.styles && currentRoute.styles.length > 0) {
                currentRoute.styles.forEach(style => {
                    document.querySelector(`link[href='/css/${style}']`).remove();
                });
            }
            if (currentRoute.scripts && currentRoute.scripts.length > 0) {
                currentRoute.scripts.forEach(script => {
                    document.querySelector(`script[src='/js/${script}']`).remove();
                });
            }

            if (currentRoute.unload && typeof currentRoute.load === 'function') {
                currentRoute.unload();
            }
        }
        const urlRoute = window.location.pathname;
        const newRoute  = this.routes.find(item => item.route === urlRoute);


       if (newRoute) {
            if (newRoute.title) {
                this.titlePageElement .innerText = newRoute.title + ' | Lumincoin Finance';
            }
           if (newRoute.filePathTemplate) {
               let contentBlock = this.contentPageElement;
               if (newRoute.useLayout) {
                   this.contentPageElement.innerHTML = await fetch(newRoute.useLayout).then(response => response.text());
                   contentBlock = document.getElementById('content-layout');
               }
               contentBlock.innerHTML = await fetch(newRoute.filePathTemplate).then(response => response.text());
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
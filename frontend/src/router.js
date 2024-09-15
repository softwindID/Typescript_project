import {Main} from "./components/main.js";
import {Login} from "./components/auth/login.js";
import {SignUp} from "./components/auth/sign-up.js";
import {Logout} from "./components/auth/logout";
import {Incomes} from "./components/category-income/incomes";
import {CreateIncomes} from "./components/category-income/create-incomes";
import {EditIncomes} from "./components/category-income/edit-incomes";
import {Expense} from "./components/category-expense/expense";
import {CreateExpense} from "./components/category-expense/create-expense";
import {EditExpense} from "./components/category-expense/edit-expense";
import {CreateIncomesExpense} from "./components/income-expense/create-incomes-expense";
import {EditIncomesExpense} from "./components/income-expense/edit-incomes-expense";
import {IncomesExpense} from "./components/income-expense/incomes-expense";
import {AuthUtils} from "./utils/auth-utils";
import {HttpUtils} from "./utils/http-utils";


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
                    new Main(this.openNewRoute.bind(this));
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
                route: '/logout',
                filePathTemplate: '/templates/layout.html',
                load: () => {
                    new Logout(this.openNewRoute.bind(this));
                }
            },
            {
                route: '/income',
                title: 'Доходы',
                filePathTemplate: '/templates/category-income/incomes.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new Incomes(this.openNewRoute.bind(this));
                }
            },
            {
                route: '/create-incomes',
                title: 'Создание категории доходов',
                filePathTemplate: '/templates/category-income/create-incomes.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new CreateIncomes(this.openNewRoute.bind(this));
                }
            },
            {
                route: '/edit-incomes',
                title: 'Редактирование категории доходов',
                filePathTemplate: '/templates/category-income/edit-incomes.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new EditIncomes(this.openNewRoute.bind(this));
                }
            },
            {
                route: '/expense',
                title: 'Расходы',
                filePathTemplate: '/templates/category-expense/expense.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new Expense(this.openNewRoute.bind(this));
                }
            },
            {
                route: '/create-expense',
                title: 'Создание категории расходов',
                filePathTemplate: '/templates/category-expense/create-expense.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new CreateExpense(this.openNewRoute.bind(this));
                }
            },
            {
                route: '/edit-expense',
                title: 'Редактирование категории расходов',
                filePathTemplate: '/templates/category-expense/edit-expense.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new EditExpense(this.openNewRoute.bind(this));
                }
            },
            {
                route: '/income-expense',
                title: 'Расходы',
                filePathTemplate: '/templates/income-expense/incomes-expense.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new IncomesExpense(this.openNewRoute.bind(this));
                }
            },
            {
                route: '/create-incomes-expense',
                title: 'Создание дохода/расхода',
                filePathTemplate: '/templates/income-expense/create-incomes-expense.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new CreateIncomesExpense(this.openNewRoute.bind(this));
                }
            },
            {
                route: '/edit-incomes-expense',
                title: 'Создание дохода/расхода',
                filePathTemplate: '/templates/income-expense/edit-incomes-expense.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new EditIncomesExpense(this.openNewRoute.bind(this));
                }
            },
    ];

    }
    async getBalance() {
        const result = await HttpUtils.request('/balance');
        if (result.response.balance || result.response.balance === 0) {
            this.showBalance(result.response.balance);
        } else if (result.redirect) {
            await this.openNewRoute(result.redirect);
        } else if (result.error || !result.response || (result.response && (result.response.error || !result.response.balance))) {
            return alert('Возникла ошибка при запросе баланса. Обратитесь в поддержку.');
        } else {
            this.showBalance(result.response.balance);
        }

    }
    showBalance(balance) {
        const balanceElement = document.getElementById('balance');
        if (balanceElement) {
            balanceElement.innerText = balance;
        } else {
            console.error('Не удалось найти элемент с ID "balance".');
        }
    }

    updateUserName() {
        const userInfo = AuthUtils.getAuthInfo();
         const userNameElement = document.getElementById('user-name');
        if (userInfo && userNameElement) {
            userNameElement.innerText = userInfo.user.name + ' ' + userInfo.user.lastName;
        }
    }

    initEvents() {
        window.addEventListener('DOMContentLoaded', () => this.handleInitialLoad());
        window.addEventListener('popstate', this.activateRoute.bind(this));
        document.addEventListener('click', this.clickHandler.bind(this));
    }

    async handleInitialLoad() {
        await this.handleRouteChange();
    }

    async handleRouteChange() {
        const urlRoute = window.location.pathname;
        const isAuthenticated = await this.isAuthenticated();

        if (!isAuthenticated && urlRoute !== '/login' && urlRoute !== '/signup') {
            history.pushState({}, '', '/login');
            await this.activateRoute();
        } else {

            await this.activateRoute(null, urlRoute);
        }
    }

    async isAuthenticated() {
        return !!AuthUtils.getAuthInfo(AuthUtils.accessTokenKey);
    }


    async openNewRoute(url) {
        const currentRoute = window.location.pathname;

        if (!await this.isAuthenticated() && url !== '/login' && url !== '/signup') {
            url = '/login';
        }

        if (currentRoute !== url) {
            history.pushState({}, '', url);
            await this.activateRoute(null, currentRoute);
        }
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

            if (currentRoute !== url) {
                await this.openNewRoute(url);
            }
        }
    }

    async activateRoute(e, oldRoute = null) {
        if (oldRoute) {

            const currentRoute = this.routes.find(item => item.route === oldRoute);

            if (currentRoute.scripts && currentRoute.scripts.length > 0) {
                currentRoute.scripts.forEach(script => {
                    const scriptElement = document.querySelector(`script[src='/js/${script}']`);
                    if (scriptElement) {
                        scriptElement.remove();
                    }
                });
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
                if (newRoute.route !== "/login" && newRoute.route !== "/signup") {
                    await this.getBalance();
                    this.updateUserName();
                }

            }
           this.updateNavLinks();
       } else {
           console.log('No route found');
           return;
       }

       this.setupEventListeners().then();
    }
    updateNavLinks() {
        const navLinks = document.querySelectorAll('#menu .nav-link');
        navLinks.forEach(link => {
            if (link.href === window.location.href) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }
    async setupEventListeners() {

        const userIcon = document.getElementById('userIcon');
        const popupMenu = document.getElementById('popupMenu');
        const logoutButton = document.getElementById('logoutButton');

        if (!userIcon || !popupMenu || !logoutButton) {
            return;
        }

        userIcon.addEventListener('click', async() => {
            console.log('User icon clicked');
            popupMenu.style.display = 'block';
        });

        logoutButton.addEventListener('click', async() => {
            console.log('Logout button clicked');
            popupMenu.style.display = 'none';
            await this.handleLogout();
        });

    }
    async handleLogout() {
        const logout = new Logout((url) => {
            this.openNewRoute(url);
        });
        await logout.logout();
    }

}
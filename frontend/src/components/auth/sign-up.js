import {AuthUtils} from "../../utils/auth-utils";
import {HttpUtils} from "../../utils/http-utils";

export class SignUp {
    constructor(openNewRoute){
        this.openNewRoute = openNewRoute;
        if (AuthUtils.getAuthInfo('accessToken')) {
            return this.openNewRoute('/');
        }


        this.nameElement = document.getElementById('name');
       // this.errorNameElement = document.getElementById('invalid-feedback')
        this.emailElement = document.getElementById('email');
        this.errorMailElement = document.getElementById('invalid-feedback2')
        this.passwordElement = document.getElementById('password');
        this.errorPasswordElement = document.getElementById('invalid-feedback3')
        this.passwordRepeatElement = document.getElementById('password-repeat');
        this.errorPasswordRepeatElement = document.getElementById('invalid-feedback4')


        document.getElementById('process-button').addEventListener('click', this.signUp.bind(this));

    }

    validateForm() {
        let isValid = true;
        if (this.nameElement.value && this.nameElement.value.match(/^[А-ЯЁ][а-яё]+( [А-ЯЁ][а-яё]+)*$/)) {
            this.nameElement.classList.remove('is-invalid');
           // this.errorNameElement.style.display = 'none';
        } else {
            this.nameElement.classList.add('is-invalid');
           // this.errorNameElement.style.display = 'block';
            isValid = false;
        }

        if (this.emailElement.value && this.emailElement.value.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
            this.emailElement.classList.remove('is-invalid');
            this.errorMailElement.style.display = 'none';
        } else {
            this.emailElement.classList.add('is-invalid');
            this.errorMailElement.style.display = 'block';
            isValid = false;
        }

        if (this.passwordElement.value && this.passwordElement.value.match(/^(?=.*[A-Z]).{8,}$/)) {
            this.passwordElement.classList.remove('is-invalid');
            this.errorPasswordElement.style.display = 'none';

        } else {
            this.passwordElement.classList.add('is-invalid');
            this.errorPasswordElement.style.display = 'block';
            isValid = false;
        }
        if (this.passwordRepeatElement.value && this.passwordRepeatElement.value === this.passwordElement.value) {
            this.passwordRepeatElement.classList.remove('is-invalid');
            this.errorPasswordRepeatElement.style.display = 'none'
        } else {
            this.passwordRepeatElement.classList.add('is-invalid');
            this.errorPasswordRepeatElement.style.display = 'block'
            isValid = false;
        }

        return isValid;
    }
    async signUp() {

        if (this.validateForm()) {
            const fullName = this.nameElement.value.trim();
            const [lastName, firstName] = fullName.split(' ');

            if (!firstName || !lastName) {

                return;
            }

            const result = await HttpUtils.request('/signup', 'POST', false,{

                name: firstName,
                lastName: lastName,
                email: this.emailElement.value,
                password: this.passwordElement.value,
                passwordRepeat: this.passwordRepeatElement.value
            });

            if (result.error || !result.response || (result.response &&  !result.response.user.id || !result.response.user.email || !result.response.user.name || !result.response.user.lastName) ) {

                return;
            }

            AuthUtils.setAuthInfo(null, null, {
                id: result.response.user.id,
                name: result.response.user.name,
                lastName: result.response.user.lastName
            });


            this.openNewRoute('/');

        }
    }

}
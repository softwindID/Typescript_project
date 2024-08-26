import {AuthUtils} from "../../utils/auth-utils";
import {HttpUtils} from "../../utils/http-utils";

export class Logout {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;

        if (!AuthUtils.getAuthInfo(AuthUtils.accessTokenKey) || !AuthUtils.getAuthInfo(AuthUtils.refreshTokenKey)) {

            return this.openNewRoute('/login');
        }

            this.setupEventListeners().then();
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
                   this.logout().then();
               });
    }


    async logout() {
        await HttpUtils.request('/logout', 'POST', false, {
            refreshToken: AuthUtils.getAuthInfo(AuthUtils.refreshTokenKey),
        });

        AuthUtils.removeAuthInfo();
        this.openNewRoute('/login');
    }

 }












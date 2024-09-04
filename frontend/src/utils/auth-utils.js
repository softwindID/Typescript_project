import config from "../config/config.js";

export class AuthUtils {

    static accessTokenKey = 'accessToken';
    static refreshTokenKey = 'refreshToken';
    static userInfoTokenKey = 'user';


    static setAuthInfo(accessToken, refreshToken, user = null) {

        localStorage.setItem(this.accessTokenKey, accessToken);
        localStorage.setItem(this.refreshTokenKey, refreshToken);
        if (user) {
            localStorage.setItem(this.userInfoTokenKey, JSON.stringify(user));
        }
    }

    static removeAuthInfo() {

        localStorage.removeItem(this.accessTokenKey);
        localStorage.removeItem(this.refreshTokenKey);
        localStorage.removeItem(this.userInfoTokenKey);
    }

    static getAuthInfo(key = null) {
        if (key && [this.accessTokenKey, this.refreshTokenKey, this.userInfoTokenKey].includes(key)) {

            return localStorage.getItem(key);

        } else {
            return {
                [this.accessTokenKey]: localStorage.getItem(this.accessTokenKey),
                [this.refreshTokenKey]: localStorage.getItem(this.refreshTokenKey),
                [this.userInfoTokenKey]:JSON.parse(localStorage.getItem(this.userInfoTokenKey)),
            }
        }
    }

    static async updateRefreshToken() {
        let result = false;
        const refreshToken = this.getAuthInfo(this.refreshTokenKey);
        if (!refreshToken) {
            console.error('Refresh token not found');
            return result;
        }
        if (refreshToken) {
            const response = await fetch(config.api + '/refresh', {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                    'Accept': 'application/json',

                },
                body: JSON.stringify({refreshToken: refreshToken})
            });

            const data = await response.json();
            if (data && response && response.status === 200 && data.tokens.refreshToken) {

                    this.setAuthInfo(data.tokens.accessToken, data.tokens.refreshToken);
                    result = true;
                }
            if (!result) {
                this.removeAuthInfo();
            }
            return result;
        }

    }

}
import {HttpUtils} from "../../utils/http-utils";
export class Incomes {

    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;

        this.getCategories().then();

    }

    async getCategories() {
        const result = await HttpUtils.request('/categories/income');
        if (Array.isArray(result)) {
            this.showCategories(result);
        } else if (result.redirect) {
            this.openNewRoute(result.redirect);
        } else if (result.error || !result.response || !result.response) {
            alert('Возникла ошибка при запросе категорий. Обратитесь в поддержку.');
        } else {
            this.showCategories(result.response);
        }

}

    showCategories(categories) {


    }
}

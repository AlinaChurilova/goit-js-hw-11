const axios = require('axios');
const BASE_URL = 'https://pixabay.com/api/';
export default class ApiService{

    constructor() {
        this.searchQuery = '';
        this.page = 1;
    }


    async fetchArticles() {

        const searchParams = new URLSearchParams({

            key: '27497975-84468f1463ec6d1d31c83a02b',
            q: this.searchQuery,
            image_type: 'photo',
            orientation: 'horizontal',
            safesearch: true,
            page: this.page,
            per_page: 40,
        });
        const url = `${BASE_URL}?${searchParams}`;


        return await axios.get(url)
            .then(({ data }) => {
                this.incrementPage()
                return data;
            });
    }
    
    incrementPage() {
        this.page += 1;
    }

    resetPage() {
        this.page = 1;
    }

    get query() {
        return this.searchQuery;
    }

    set query(newQuery) {
        this.searchQuery = newQuery;
    }

}
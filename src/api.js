const BASE_URI = 'https://data.kingcounty.gov/resource/gkhn-e8mn.json?';

const api = {
    getRestaurantListData: (params) => fetch(`${BASE_URI}${params}`),
    getRestaurantData: (params) => fetch(`${BASE_URI}${params}`),
};

export default api;
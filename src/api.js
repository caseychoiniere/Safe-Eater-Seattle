import { getFetchParams } from './util/fetchUtil';
import MainStore from './stores/MainStore'

// const DDS_BASE_URI = process.env.NODE_ENV === 'production' ? DDS_CLIENT_CONFIG.baseUrl : 'https://apidev.dataservice.duke.edu';
const DDS_BASE_URI = 'https://apidev.dataservice.duke.edu/api/v1/';

const path = Object.freeze({
    AUTH_PROVIDERS: `auth_providers/`,
    ACCESS_TOKEN: `/user/api_token?access_token=`
});

const api = {
    getApiToken: (accessToken, appConfig) => {
        return fetch(`${DDS_BASE_URI+path.ACCESS_TOKEN+accessToken}&authentication_service_id=${appConfig.serviceId}`, getFetchParams('get'))
    },
};

export default api;
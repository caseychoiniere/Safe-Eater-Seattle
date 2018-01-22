import { observable, action } from 'mobx';
import cookie from 'react-cookies';
import moment from 'moment';
import api from '../api';
import appConfig from '../appConfig';
import { checkStatus } from '../util/fetchUtil';

export class MainStore {
    @observable appConfig;
    @observable dateRange;
    @observable loading;
    @observable openNav;
    @observable pageNumber;
    @observable paginationLoading;
    @observable projects;
    @observable restaurants;
    @observable restaurantsSearchResults;
    @observable searchLoading;
    @observable sessionTimeoutWarning;
    @observable showPagination;
    @observable showSearch;
    @observable user;

    constructor() {
        this.appConfig = appConfig;
        this.dateRange = null;
        this.loading = false;
        this.openNav = false;
        this.pageNumber = 1;
        this.paginationLoading = false;
        this.projects = [];
        this.restaurants = [];
        this.restaurantsSearchResults = null;
        this.searchLoading = false;
        this.sessionTimeoutWarning = false;
        this.showPagination = true;
        this.showSearch = false;
        this.user = null;

        this.api = api;
    }

    @action showPaginationButton() {
        this.showPagination = !this.showPagination;
    }

    @action setPaginationPageNumber(page) {
        this.paginationLoading = true;
        this.pageNumber = page+1;
        setTimeout(() => this.paginationLoading = false, 2000)
    }

    @action search(query) {
        this.searchLoading = true;
        if(!query.length) {
            this.restaurantsSearchResults = this.restaurants
        } else {
            this.restaurantsSearchResults = this.restaurants.filter((r) => {
                return r.name.toLowerCase().includes(query.toLowerCase())
            });
        }
        setTimeout(() => this.searchLoading = false, 1000)
    }

    @action setDateRange(range) {
        range = range || 12;
        this.dateRange = moment().subtract(range, 'months').format();
    }

    @action toggleSearch() {
        this.showSearch = !this.showSearch;
    }

    @action chunk(a, l) {
        if (a.length === 0) return [];
        else return [a.slice(0, l)].concat(this.chunk(a.slice(l), l));
    }

    @action getPublicHealthInspectionData() {
        this.loading = true;
        if(!this.dateRange) this.dateRange = moment().subtract(12, 'months').format();
        // fetch(`https://data.kingcounty.gov/resource/gkhn-e8mn.json?$where=inspection_date between ${this.dateRange} and ${now}`) Todo: get date range working
        fetch('https://data.kingcounty.gov/resource/gkhn-e8mn.json?$limit=50000&city=SEATTLE')
            .then(checkStatus).then(response => response.json())
            .then((json) => {
                let data = json.filter((j) => {
                    return j.inspection_date > this.dateRange && j.violation_points > 0
                }).map((j) => {
                       return {
                           id: j.business_id,
                           name: j.name,
                           address: `${j.address}, ${j.city}, WA, ${j.zip_code}`,
                           description: j.description,
                           phone: j.phone,
                           latitude: j.latitude,
                           longitude: j.longitude,
                           inspection_date: j.inspection_date,
                           inspection_serial_num: j.inspection_serial_num,
                           violation_type: j.violation_type,
                           violation_description: j.violation_description,
                           violation_points: j.violation_points,
                           violations: []
                       }
                });

                this.restaurants = data.reduce((res, j) => {
                    if (!res.some(res => res.id === j.id)) {
                        res.push(j);
                    }
                    return res;
                }, []).map((j) => {
                    return {
                        id: j.id,
                        name: j.name,
                        address: `${j.address}, ${j.city}, WA, ${j.zip_code}`,
                        phone: j.phone,
                        latitude: j.latitude,
                        longitude: j.longitude,
                        inspection_date: j.inspection_date,
                        inspection_serial_num: j.inspection_serial_num,
                        violation_type: j.violation_type,
                        violation_description: j.violation_description,
                        violation_points: j.violation_points,
                        violations: data.filter((el) => {
                            return el.id === j.id;
                        }).map((el) => {
                            let desc = el.violation_description;
                            while (desc[desc.length-1] === "." || desc[desc.length-1] === ",") {
                                desc = desc.slice(0,-1);
                            }
                            return {
                                violation_date: el.inspection_date,
                                violation_type: el.violation_type,
                                violation_description: desc,
                                violation_points: Number(el.violation_points),
                            }
                        })
                    }
                });

                // this.restaurants = this.chunk(this.restaurants, 100); //Todo: include pagination

                this.loading = false;
            }).catch(ex => this.handleErrors(ex))
    }

    @action checkSessionTimeout() {
        let session = cookie.load('sessionTime');
        if(!session) this.sessionTimeoutWarning = true;
    }

    @action toggleLoading() {
        this.loading = !this.loading;
    }

    @action toggleNav() {
        this.openNav = !this.openNav;
    }

    @action handleErrors(error) {
        this.loading = false;
        if (error && error.response && error.response.status) {
            if (error.response.status === 401) {
                window.location.href = window.location.protocol + '//' + window.location.host + '/#/login';
            }
            // else if (error.response.status === 404 && error.response.statusText !== '' && this.appConfig.apiToken) {
            //     window.location.href = window.location.protocol + '//' + window.location.host + '/#/404';
            //     console.log(error.response);
            // } else {
                // this.displayErrorModals(error);
            // }
        }
    }

    @action getAuthProviders() {
        this.api.getAuthProviders()
            .then(checkStatus)
            .then(response => response.json())
            .then((json) => {
                if (json.results) {
                    const url = json.results.reduce((prev, curr) => {
                        return (curr.is_default) ? curr : prev;
                    }, null);
                    const expiresAt = new Date(Date.now() + (60 * 60 * 2 * 1000));
                    this.appConfig.authServiceId = url.id;
                    cookie.save('authServiceId', this.appConfig.authServiceId, {expires: expiresAt});
                    this.appConfig.authServiceUri = url.login_initiation_url;
                    this.appConfig.authServiceName = url.name;
                    this.appConfig.serviceId = url.service_id;
                }
            }).catch(ex => this.handleErrors(ex));
    }

    @action getApiToken(accessToken) {
        this.api.getApiToken(accessToken, this.appConfig)
            .then(checkStatus)
            .then(response => response.json())
            .then((json) => {
                if (json.api_token) {
                    const expiresAt = new Date(Date.now() + (60 * 60 * 2 * 1000));
                    this.appConfig.apiToken = json.api_token;
                    cookie.save('apiToken', this.appConfig.apiToken, {expires: expiresAt});
                    cookie.save('sessionTime', new Date(Date.now() + ((60 * 60 * 2 * 1000) - 120000)));
                    const redirectUrl = window.sessionStorage.getItem('redirectUrl') ? window.sessionStorage.getItem('redirectUrl') : '/';
                    window.sessionStorage.removeItem('redirectUrl');
                    this.sessionTimeoutWarning = false;
                    document.location.replace(redirectUrl);
                }
            }).catch(ex => mainStore.handleErrors(ex));
    }

    @action handleLogout(status) {
        this.loading = false;
        this.sessionTimeoutWarning = false;
        this.appConfig.apiToken = null;
        cookie.remove('apiToken');
        if(status !== 401) {
            this.appConfig.redirectUrl = null;
            cookie.remove('redirectUrl');
        }
        window.location.assign('/login');
    }

}

const mainStore = new MainStore();

export default mainStore;
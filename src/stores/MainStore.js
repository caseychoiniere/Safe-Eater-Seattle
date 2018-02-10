import { observable, action } from 'mobx';
import moment from 'moment';
import api from '../api';
import { checkStatus } from '../util/fetchUtil';
const google = window.google;

export class MainStore {
    @observable dateRange;
    @observable graphData;
    @observable hours;
    @observable loading;
    @observable openNav;
    @observable openNestedListItems;
    @observable mapObj;
    @observable pageNumber;
    @observable paginationLoading;
    @observable restaurants;
    @observable restaurantDetails;
    @observable restaurantsSearchResults;
    @observable searchLoading;
    @observable selectedRestaurant;
    @observable selectedRestaurantViolations;
    @observable showInfoWindow;
    @observable showSearch;

    constructor() {
        this.dateRange = null;
        this.graphData = [];
        this.hours = [];
        this.loading = false;
        this.openNav = false;
        this.openNestedListItems = observable.map();
        this.mapObj = null;
        this.pageNumber = 1;
        this.paginationLoading = false;
        this.restaurants = [];
        this.restaurantDetails = null;
        this.restaurantsSearchResults = null;
        this.searchLoading = false;
        this.selectedRestaurant = null;
        this.selectedRestaurantViolations = observable.map();
        this.showInfoWindow = false;
        this.showSearch = false;

        this.api = api;
    }

    @action getMapObject(map) {
        const restaurant = this.selectedRestaurant;

        if(map) {
            this.mapObj = map.context.__SECRET_MAP_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;
            const loc = {lat: restaurant.lat, lng: restaurant.lng};
            const _map = this.mapObj;
            const service = new google.maps.places.PlacesService(_map);

            const nearbySearch = () => {
                const request = {
                    location: loc,
                    radius: 1000,
                    keyword: restaurant.name
                };
                return new Promise((resolve, reject) => {
                    service.nearbySearch(request, (results, status) => {
                        status === google.maps.places.PlacesServiceStatus.OK ? resolve(results) : reject(status);
                    });
                });
            };

            const findDetail = (place) => {
                return new Promise((resolve, reject) => {
                    service.getDetails({placeId: place.place_id}, (place, status) => {
                        status === google.maps.places.PlacesServiceStatus.OK ? resolve(place) : reject(status);
                    });
                });
            };

            nearbySearch()
                .then(results => findDetail(results[0]))
                .then(details => {
                    if (details.opening_hours) this.hours = details.opening_hours.weekday_text;
                }).catch(e => this.hours = [])
        }
    }

    @action toggleNestedList(id) {
        if(!this.openNestedListItems.has(id)) {
            this.openNestedListItems.set(id, true)
        } else {
            this.openNestedListItems.delete(id)
        }
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

    @action getRestaurantInfo(restaurant) {
        this.graphData = [];
        this.selectedRestaurantViolations = observable.map();
        this.restaurantDetails = null;
        this.selectedRestaurant = restaurant;

        this.selectedRestaurant.violations.forEach((v) => {
            if(!this.selectedRestaurantViolations.has(v.violation_date)) {
                this.selectedRestaurantViolations.set(v.violation_date, v.violation_points)
            } else {
                this.selectedRestaurantViolations.set(v.violation_date, this.selectedRestaurantViolations.get(v.violation_date) + v.violation_points);
            }
        });

        const setGraphData = (value, key) => {
            this.graphData.push({date: key, violation_points: value});
        };

        this.selectedRestaurantViolations.forEach(setGraphData);

        this.averagePointsPerInspection = this.graphData.map((d) => {
            return d.violation_points;
        }).reduce(( p, c ) => p + c, 0 ) / this.graphData.length;

        this.graphData = this.graphData.map(d => {
            return {date: d.date, violation_points: d.violation_points, average_points_per_visit: this.averagePointsPerInspection}
        });
    }

    @action toggleInfowindow() {
        this.showInfoWindow = !this.showInfoWindow;
    }

    @action toggleSearch() {
        this.showSearch = !this.showSearch;
    }

    @action resetSearchResults() {
        this.restaurantsSearchResults = null;
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
                           address: j.address,
                           description: j.description,
                           phone: j.phone,
                           latitude: j.latitude,
                           longitude: j.longitude,
                           inspection_date: j.inspection_date,
                           inspection_closed_business: j.inspection_closed_business,
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
                        address: j.address,
                        phone: j.phone,
                        lat: parseFloat(j.latitude),
                        lng: parseFloat(j.longitude),
                        inspection_date: j.inspection_date,
                        inspection_closed_business: j.inspection_closed_business,
                        inspection_serial_num: j.inspection_serial_num,
                        violations: data.filter((el) => {
                            return el.id === j.id;
                        }).map((el) => {
                            let desc = el.violation_description;
                            while (desc[desc.length-1] === "." || desc[desc.length-1] === ",") {
                                desc = desc.slice(0,-1);
                            }
                            return {
                                violation_date: moment(el.inspection_date).format('MM/DD/YYYY'),
                                violation_type: el.violation_type,
                                violation_description: desc.slice(7),
                                violation_points: Number(el.violation_points),
                            }
                        })
                    }
                }).sort((a, b) => b.violations.length - a.violations.length);
                this.loading = false;
                const closedByInspection = this.restaurants.filter(r => r.inspection_closed_business);
                console.log(closedByInspection)
            }).catch(ex => this.handleErrors(ex))
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

}

const mainStore = new MainStore();

export default mainStore;
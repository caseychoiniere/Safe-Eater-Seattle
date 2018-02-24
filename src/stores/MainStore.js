import { observable, action } from 'mobx';
import moment from 'moment';
import api from '../api';
import { checkStatus } from '../util/fetchUtil';
const google = window.google;

export class MainStore {
    @observable averagePointsPerInspectionAllTime;
    @observable averagePointsPerInspection;
    @observable dateRange;
    @observable graphData;
    @observable graphDataAllTime;
    @observable hours;
    @observable loading;
    @observable openNav;
    @observable openNestedListItems;
    @observable mapObj;
    @observable pageNumber;
    @observable paginationLoading;
    @observable restaurants;
    @observable restaurantsSearchResults;
    @observable searchLoading;
    @observable selectedRestaurant;
    @observable selectedRestaurantAllTime;
    @observable selectedRestaurantViolations;
    @observable selectedRestaurantViolationsAllTime;
    @observable selectedRestaurantViolationTypesAllTime;
    @observable showAllData;
    @observable showInfoWindow;
    @observable showSearch;
    @observable violationTypeGraphData;
    @observable violationTypeGraphDataAllTime;

    constructor() {
        this.averagePointsPerInspection = 0;
        this.averagePointsPerInspectionAllTime = 0;
        this.dateRange = null;
        this.graphData = [];
        this.graphDataAllTime = [];
        this.hours = [];
        this.loading = false;
        this.openNav = false;
        this.openNestedListItems = observable.map();
        this.mapObj = null;
        this.pageNumber = 1;
        this.paginationLoading = false;
        this.restaurants = [];
        this.restaurantsSearchResults = null;
        this.searchLoading = false;
        this.selectedRestaurant = null;
        this.selectedRestaurantViolations = observable.map();
        this.selectedRestaurantViolationsAllTime = observable.map();
        this.selectedRestaurantViolationTypesAllTime = observable.map();
        this.showAllData = false;
        this.showInfoWindow = false;
        this.showSearch = false;
        this.violationTypeGraphData = [];
        this.violationTypeGraphDataAllTime = [];

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

    @action showAllTimeData() {
        this.showAllData = !this.showAllData;
    }

    @action setPaginationPageNumber(page) {
        this.paginationLoading = true;
        this.pageNumber = page+1;
        setTimeout(() => this.paginationLoading = false, 2000)
    }

    @action search(query) {
        this.searchLoading = true;
        if(window.innerWidth <= 680 && this.showInfoWindow) this.toggleInfowindow();
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

    @action formatData(data) {
        return data.reduce((res, j) => {
            if (!res.some(res => res.business_id === j.business_id)) {
                res.push(j);
            }
            return res;
        }, []).map((j) => {
            return {
                id: j.business_id,
                name: j.name,
                address: j.address,
                phone: j.phone,
                lat: parseFloat(j.latitude),
                lng: parseFloat(j.longitude),
                inspection_date: j.inspection_date,
                inspection_closed_business: j.inspection_closed_business,
                inspection_serial_num: j.inspection_serial_num,
                violations: data.filter((el) => {
                    return el.business_id === j.business_id;
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
                }).sort((a,b) => new Date(a.violation_date) - new Date(b.violation_date))
            }
        }).sort((a, b) => b.violations.length - a.violations.length);
    }

    @action getRestaurantData(restaurant) {
        if(!restaurant) restaurant = this.selectedRestaurant;
        this.graphData = [];
        this.graphDataAllTime = [];
        this.violationTypeGraphData = [];
        this.violationTypeGraphDataAllTime = [];
        this.selectedRestaurant = restaurant;
        this.selectedRestaurantViolations = observable.map();
        this.selectedRestaurantViolationTypes = observable.map();
        this.selectedRestaurantViolationsAllTime = observable.map();
        this.selectedRestaurantViolationTypesAllTime = observable.map();

        const name = restaurant.name.replace(/["\\]/g, " ").replace(/[%&\/#]/g, (m) => {
            return "%" + m.charCodeAt(0).toString(16);
        });

        this.selectedRestaurant.violations.forEach((v) => {
            if(!this.selectedRestaurantViolations.has(v.violation_date)) {
                this.selectedRestaurantViolations.set(v.violation_date, v.violation_points);
                this.selectedRestaurantViolationTypes.set(v.violation_date, [v.violation_type]);
            } else {
                this.selectedRestaurantViolations.set(v.violation_date, this.selectedRestaurantViolations.get(v.violation_date) + v.violation_points);
                this.selectedRestaurantViolationTypes.set(v.violation_date, [...this.selectedRestaurantViolationTypes.get(v.violation_date), v.violation_type]);
            }
        });

        this.selectedRestaurantViolations.forEach((value, key) => {
            this.graphData.push({date: key, violation_points: value});
        });

        this.selectedRestaurantViolationTypes.forEach((value, key) => {
            let red = value.filter(v => v === 'red').length;
            let blue = value.filter(v => v === 'blue').length;
            this.violationTypeGraphData.push({date: key, red_violations: red, blue_violations: blue})
        });

        this.violationTypeGraphData = this.violationTypeGraphData.sort((a,b) => new Date(a.date) - new Date(b.date));

        this.averagePointsPerInspection = this.graphData.map((d) => {
                return d.violation_points;
        }).reduce(( p, c ) => p + c, 0 ) / this.graphData.length;

        this.graphData = this.graphData.map(d => {
            return {date: d.date, violation_points: d.violation_points, average_points_per_visit: this.averagePointsPerInspection}
        });

        fetch(`https://data.kingcounty.gov/resource/gkhn-e8mn.json?$limit=50000&city=SEATTLE&name=${name}`)
            .then(checkStatus).then(response => response.json())
            .then((json) => {
                if(json.length) {
                    let data = json.filter((j) => {
                        return j.violation_points > 0
                    }).map((j) => j);

                    data = this.formatData(data);
                    this.selectedRestaurantAllTime = data[0];

                    this.selectedRestaurantAllTime.violations.forEach((v) => {
                        if (!this.selectedRestaurantViolationsAllTime.has(v.violation_date)) {
                            this.selectedRestaurantViolationsAllTime.set(v.violation_date, v.violation_points);
                            this.selectedRestaurantViolationTypesAllTime.set(v.violation_date, [v.violation_type]);

                        } else {
                            this.selectedRestaurantViolationsAllTime.set(v.violation_date, this.selectedRestaurantViolationsAllTime.get(v.violation_date) + v.violation_points);
                            this.selectedRestaurantViolationTypesAllTime.set(v.violation_date, [...this.selectedRestaurantViolationTypesAllTime.get(v.violation_date), v.violation_type]);
                        }
                    });

                    this.selectedRestaurantViolationsAllTime.forEach((value, key) => {
                        this.graphDataAllTime.push({date: key, violation_points: value});
                    });

                    this.selectedRestaurantViolationTypesAllTime.forEach((value, key) => {
                        let red = value.filter(v => v === 'red').length;
                        let blue = value.filter(v => v === 'blue').length;
                        this.violationTypeGraphDataAllTime.push({date: key, red_violations: red, blue_violations: blue});
                    });

                    this.violationTypeGraphDataAllTime = this.violationTypeGraphDataAllTime.sort((a,b) => new Date(a.date) - new Date(b.date));

                    this.averagePointsPerInspectionAllTime = this.graphDataAllTime.map((d) => {
                        return d.violation_points;
                    }).reduce((p, c) => p + c, 0) / this.graphDataAllTime.length;

                    this.graphDataAllTime = this.graphDataAllTime.map(d => {
                        return {date: d.date, violation_points: d.violation_points, average_points_per_visit: this.averagePointsPerInspectionAllTime}
                    });
                }
            }).catch(ex => this.handleErrors(ex))
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
        if(!this.dateRange) this.dateRange = this.setDateRange(12);
        fetch('https://data.kingcounty.gov/resource/gkhn-e8mn.json?$limit=50000&city=SEATTLE')
            .then(checkStatus).then(response => response.json())
            .then((json) => {
                let data = json.filter((j) => {
                    return j.violation_points > 0 && new Date(j.inspection_date) > new Date(this.dateRange)
                }).map((j) => j);
                this.restaurants = this.formatData(data);
                this.loading = false;
                const closedByInspection = this.restaurants.filter(r => r.inspection_closed_business);
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
        }
    }

}

const mainStore = new MainStore();

export default mainStore;
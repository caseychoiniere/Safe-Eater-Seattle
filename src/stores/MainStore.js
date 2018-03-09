import { observable, action } from 'mobx';
import moment from 'moment';
import api from '../api';
import { checkStatus } from '../util/fetchUtil';
const google = window.google;

export class MainStore {
    @observable averagePointsPerInspection;
    @observable averagePointsPerInspectionAllTime;
    @observable dateRange;
    @observable graphData;
    @observable graphDataAllTime;
    @observable hours;
    @observable loading;
    @observable mapObj;
    @observable openModal;
    @observable openNestedListItems;
    @observable pageNumber;
    @observable paginationLoading;
    @observable rating;
    @observable restaurants;
    @observable restaurantsSearchResults;
    @observable reviews;
    @observable searchLoading;
    @observable selectedRestaurant;
    @observable selectedRestaurantAllTime;
    @observable selectedRestaurantViolations;
    @observable selectedRestaurantViolationsAllTime;
    @observable selectedRestaurantViolationTypesAllTime;
    @observable showAllData;
    @observable showInfoWindow;
    @observable showReviews;
    @observable showSearch;
    @observable violationTypeGraphData;
    @observable violationTypeGraphDataAllTime;

    constructor() {
        this.api = api;
        this.averagePointsPerInspection = 0;
        this.averagePointsPerInspectionAllTime = 0;
        this.dateRange = null;
        this.graphData = [];
        this.graphDataAllTime = [];
        this.hours = [];
        this.loading = false;
        this.mapObj = null;
        this.openModal = observable.map();
        this.openNestedListItems = observable.map();
        this.pageNumber = 1;
        this.paginationLoading = false;
        this.rating = null;
        this.restaurants = [];
        this.restaurantsSearchResults = null;
        this.reviews = [];
        this.searchLoading = false;
        this.selectedRestaurant = null;
        this.selectedRestaurantViolations = observable.map();
        this.selectedRestaurantViolationsAllTime = observable.map();
        this.selectedRestaurantViolationTypesAllTime = observable.map();
        this.showAllData = false;
        this.showInfoWindow = false;
        this.showReviews = true;
        this.showSearch = false;
        this.violationTypeGraphData = [];
        this.violationTypeGraphDataAllTime = [];
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
                    if(details.opening_hours) this.hours = details.opening_hours.weekday_text;
                    if(details.reviews) this.reviews = details.reviews;
                    if(details.rating) this.rating = details.rating;
                }).catch(() => {
                this.hours = [];
                this.reviews = [];
                this.rating = null;
            })
        }
    }

    @action toggleNestedList(id) {
        if(!this.openNestedListItems.has(id)) {
            this.openNestedListItems.set(id, true)
        } else {
            this.openNestedListItems.delete(id)
        }
    }

    @action toggleReviewList() {
        this.showReviews = !this.showReviews;
    }

    @action resetSelectedRestaurant() {
        this.selectedRestaurant = null;
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
        return this.dateRange = moment().subtract(range, 'months').toISOString().slice(0,-1);
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
                    if(Number(el.violation_points > 0)) {
                        let desc = el.violation_description;
                        while (desc[desc.length - 1] === "." || desc[desc.length - 1] === ",") {
                            desc = desc.slice(0, -1);
                        }
                        return {
                            violation_date: moment(el.inspection_date).format('MM/DD/YYYY'),
                            violation_type: el.violation_type,
                            violation_description: desc.slice(7),
                            violation_points: Number(el.violation_points),
                        }
                    } else {
                        return {
                            violation_date: moment(el.inspection_date).format('MM/DD/YYYY'),
                            violation_type: 'no violations',
                            violation_description: '',
                            violation_points: Number(el.violation_points),
                        }
                    }
                }).sort((a,b) => new Date(a.violation_date) - new Date(b.violation_date))
            }
        }).sort((a, b) => b.violations.length - a.violations.length);
    }

    @action formatViolations(restaurant, violations, violationTypes) {
        restaurant.violations.forEach((v) => {
            if(!violations.has(v.violation_date)) {
                violations.set(v.violation_date, v.violation_points);
                violationTypes.set(v.violation_date, [v.violation_type]);
            } else {
                violations.set(v.violation_date, violations.get(v.violation_date) + v.violation_points);
                violationTypes.set(v.violation_date, [...violationTypes.get(v.violation_date), v.violation_type]);
            }
        });
    }

    @action formatGraphData(pointsGraph, typeGraph, violations, violationTypes) {
        violations.forEach((value, key) => {
            pointsGraph.push({date: key, violation_points: value});
        });

        violationTypes.forEach((value, key) => {
            let red = value.filter(v => v === 'red').length;
            let blue = value.filter(v => v === 'blue').length;
            typeGraph.push({date: key, red_violations: red, blue_violations: blue})
        });

        typeGraph = typeGraph.sort((a,b) => new Date(a.date) - new Date(b.date));
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

        this.formatViolations(this.selectedRestaurant, this.selectedRestaurantViolations, this.selectedRestaurantViolationTypes);

        this.formatGraphData(this.graphData, this.violationTypeGraphData, this.selectedRestaurantViolations, this.selectedRestaurantViolationTypes);

        this.averagePointsPerInspection = this.graphData.map((d) => { // Todo: figure out why this isn't working in a separate function
                return d.violation_points;
        }).reduce(( p, c ) => p + c, 0 ) / this.graphData.length;

        this.api.getRestaurantData(`$limit=50000&city=SEATTLE&name=${name}`)
            .then(checkStatus).then(response => response.json())
            .then((json) => {
                if(json.length) {
                    let data = this.filterData(json);
                    data = this.formatData(data);
                    this.selectedRestaurantAllTime = data[0];

                    this.formatViolations(this.selectedRestaurantAllTime, this.selectedRestaurantViolationsAllTime, this.selectedRestaurantViolationTypesAllTime);

                    this.formatGraphData(this.graphDataAllTime, this.violationTypeGraphDataAllTime, this.selectedRestaurantViolationsAllTime, this.selectedRestaurantViolationTypesAllTime);

                    this.averagePointsPerInspectionAllTime = this.graphDataAllTime.map((d) => { // Todo: figure out why this isn't working in a separate function
                        return d.violation_points;
                    }).reduce((p, c) => p + c, 0) / this.graphDataAllTime.length;
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

    @action filterData(arr) {
        let r = observable.map();
        while(arr.length) {
            arr.forEach((i, index) => {
                if(!r.has(i.business_id)) {
                    r.set(i.business_id, [i])
                } else {
                    r.set(i.business_id, [...r.get(i.business_id), i])
                }
                arr.splice(index, 1);
            });
        }
        let newArr = [];
        r.values().forEach((v) => {
            if(v.some(p => Number(p.violation_points) > 0)) {
                v.forEach((i) => {
                    newArr.push(i)
                })
            }
        });
        return newArr;
    }

    @action getPublicHealthInspectionData() {
        this.loading = true;
        if(!this.dateRange) this.dateRange = this.setDateRange(12);
        const now = moment().toISOString().slice(0,-1);
        this.api.getPublicHealthInspectionData(`$limit=50000&$where=inspection_date between '${this.dateRange}' and '${now}'&city=SEATTLE`)
            .then(checkStatus).then(response => response.json())
            .then((json) => {
                const data = this.filterData(json);
                this.restaurants = this.formatData(data);
                this.loading = false;
                const closedByInspection = this.restaurants.filter(r => r.inspection_closed_business); // Todo: remove this if not used
            }).catch(ex => this.handleErrors(ex))
    }

    @action toggleLoading() {
        this.loading = !this.loading;
    }

    @action toggleModal(content) {
        if(this.openModal.has(content)) {
            this.openModal.delete(content)
        } else {
            this.openModal.set(content, true)
        }
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
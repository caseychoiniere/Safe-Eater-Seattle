import {observable} from 'mobx-react';
import * as fake from "../util/testData";
import { sleep, respondOK, respond }  from "../util/testUtil";

describe('Main Store', () => {

    let api = null;
    let MainStore = null;

    beforeEach(() => {
        MainStore = require('../stores/mainStore').default;
        api = {};
        MainStore.api = api;
    });

    it('@action toggleLoading - should toggle loading', () => {
        expect(MainStore.loading).toBe(false);
        MainStore.toggleLoading();
        expect(MainStore.loading).toBe(true);
    });

    it('@action toggleLoading - should toggle loading', () => {
        expect(MainStore.openNav).toBe(false);
        MainStore.toggleNav();
        expect(MainStore.openNav).toBe(true);
    });

    // it('@action getProjects - should return an empty array', () => {
    //     expect(MainStore.projects.length).toBe(0);
    //     api.getProjects = jest.fn((page) => respondOK([]));
    //     MainStore.getProjects();
    //     sleep(1).then(() => {
    //         expect(api.getProjects).toHaveBeenCalledTimes(1);
    //         expect(MainStore.projects.length).toBe(0);
    //     });
    // });

});
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

});
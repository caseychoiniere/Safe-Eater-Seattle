import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { Col, Row } from 'react-grid-system';
import MainStore from '../stores/MainStore';
import Map from '../components/Map.jsx';
import RestaurantList from '../components/RestaurantList.jsx'
import { generateUniqueKey } from '../util/utils';

@observer
class Home extends Component {

    componentDidMount() {
        MainStore.getPublicHealthInspectionData();
    }

    render() {

        const slideContent = () => {
            let padding;
            if(!!document.getElementById('mc1') ) padding = document.getElementById('mc1').offsetLeft;
            return {paddingLeft: window.innerWidth <= 720 ? 0 : padding > 410 ? 410 : 410 - padding};
        };

        const style = {
            loader: {position: 'fixed', top: 0, left: 0, bottom: 0, right: 0, margin: 'auto'},
            nestedListItems: {padding: 0},
            mainCol: slideContent()
        };

        let { showInfoWindow } = MainStore;

        return (
                <Row>
                    <Col key={generateUniqueKey()} md={12} style={showInfoWindow ? style.mainCol : {}}>
                        <Map />
                        <RestaurantList />
                    </Col>
                </Row>
        );
    }
}

export default Home;
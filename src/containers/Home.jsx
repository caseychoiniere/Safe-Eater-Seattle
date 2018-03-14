import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { Col, Row } from 'react-grid-system';
import MainStore from '../stores/MainStore';
import Modal from '../components/Modal.jsx';
import LeftDrawer from '../components/LeftDrawer.jsx';
import RestaurantList from '../components/RestaurantList.jsx'
import { generateUniqueKey } from '../util/utils';

@observer
class Home extends Component {

    componentDidMount() {
        MainStore.getRestaurantListData(false, null); //params: isSearch (bool), searchQuery (text)
    }

    render() {
        const slideContent = () => {
            let padding;
            if(!!document.getElementById('mc1') ) padding = document.getElementById('mc1').offsetLeft;
            return {paddingLeft: window.innerWidth <= 720 ? 0 : padding > 410 ? 410 : 410 - padding};
        };

        const style = {
            mainCol: slideContent()
        };

        let { showInfoWindow } = MainStore;

        return (
                <Row>
                    <Col key={generateUniqueKey()} md={12} style={showInfoWindow ? style.mainCol : {}}>
                        <LeftDrawer />
                        <RestaurantList />
                        <Modal />
                    </Col>
                </Row>
        );
    }
}

export default Home;
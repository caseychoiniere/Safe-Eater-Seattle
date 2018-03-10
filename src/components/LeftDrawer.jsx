import React, {Component} from "react";
import { observer } from 'mobx-react';
import MainStore from '../stores/MainStore';
import BusinessDetails from './BusinessDetails.jsx';
import Graph from './Graph.jsx';
import Map from './Map.jsx';
import { grey400 } from 'material-ui/styles/colors'
import ArrowBack from 'material-ui/svg-icons/navigation/arrow-back';
import Drawer from 'material-ui/Drawer';
import Help from 'material-ui/svg-icons/action/help';
import IconButton from 'material-ui/IconButton';

import {FacebookShareButton, FacebookIcon} from 'react-share';

@observer
class LeftDrawer extends Component {

    toggleInfoWindow = () => {
        if(MainStore.showInfoWindow) MainStore.resetSelectedRestaurant();
        MainStore.toggleInfowindow();
    };

    render() {
        const style = {
            closeBtn: { float: 'left', margin: '0px 0px 0px 6px' },
            h4: {margin: '10px 14px'},
            mapTitle: { textAlign: 'center', margin: '14px 12%' },
            helpIcon: {position: 'fixed', top: 0, right: '3%'}
        };

        let { showInfoWindow, selectedRestaurant } = MainStore;

        return (
            selectedRestaurant !== null && <Drawer width={window.innerWidth <= 480 ? '100%' : 400}
                                                   openSecondary={false}
                                                   open={showInfoWindow}
                                                   containerStyle={{marginTop: 64, paddingBottom: 60}}>
                <IconButton style={style.closeBtn}
                            onClick={this.toggleInfoWindow}>
                    <ArrowBack />
                </IconButton>
                <IconButton style={style.helpIcon}
                            touch={true}
                            tooltip={<p>The lower the violation points the better!<br/> Red violations are worse than blue violations.</p>}
                            tooltipPosition="bottom-left"
                >
                    <Help color={grey400} />
                </IconButton>
                <h3 style={style.mapTitle}>{selectedRestaurant.name}</h3>
                <Graph />
                <FacebookShareButton
                    url={'http://eatsafeseattle.com'}
                    quote={'Eat Safe Seattle'}
                >
                    <FacebookIcon size={32} round />
                </FacebookShareButton>
                <Map />
                <BusinessDetails />
            </Drawer>
        )
    }
}

export default LeftDrawer;
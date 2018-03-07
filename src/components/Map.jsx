import React, {Component} from "react";
import { observer } from 'mobx-react';
import { Col } from 'react-grid-system';
import { GoogleMap, Marker, withGoogleMap } from 'react-google-maps';
import { grey400 } from 'material-ui/styles/colors'
import Drawer from 'material-ui/Drawer';
import IconButton from 'material-ui/IconButton';
import ArrowBack from 'material-ui/svg-icons/navigation/arrow-back';
import Help from 'material-ui/svg-icons/action/help';
import MainStore from '../stores/MainStore';
import Graph from './Graph.jsx';
import BusinessDetails from './BusinessDetails.jsx';

const GoogleMapsWrapper = withGoogleMap(props => {
    const {onMapMounted, ...otherProps} = props;
    return <GoogleMap {...otherProps} ref={map => {
        onMapMounted && onMapMounted(map);
        MainStore.getMapObject(map);
    }}>{props.children}</GoogleMap>
});

@observer
class Map extends Component {

    toggleInfoWindow = () => {
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
           selectedRestaurant !== null && <Drawer width={window.innerWidth <= 720 ? 400 : 400}
                                                  openSecondary={false}
                                                  open={showInfoWindow}
                                                  containerStyle={{marginTop: 64}}>
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
                       <Col md={12}>
                           <GoogleMapsWrapper
                               googleMapURL='https://maps.googleapis.com/maps/api/js?key=AIzaSyAzluYW2z_7GUyngCj_UyUJHROLYPfcsWc&v=3.exp&libraries=geometry,drawing,places'
                               loadingElement={<div style={{height: '60%'}}/>}
                               containerElement={<div style={{height: 280, margin: '20px 10px'}}/>}
                               mapElement={<div style={{height: '100%'}}/>}
                               defaultZoom={14}
                               center={{lat: selectedRestaurant.lat, lng: selectedRestaurant.lng}}
                               options={{disableDoubleClickZoom: true}}>
                               { selectedRestaurant && selectedRestaurant.lat ?
                                   <Marker
                                       key={selectedRestaurant.id}
                                       id={selectedRestaurant.id}
                                       position={{lat: selectedRestaurant.lat, lng: selectedRestaurant.lng}}
                                   /> : null
                               }
                           </GoogleMapsWrapper>
                       </Col>
                       <BusinessDetails />
           </Drawer>
        )
    }
}

export default Map;
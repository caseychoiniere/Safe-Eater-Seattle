import React, {Component} from "react";
import { observer } from 'mobx-react';
import { GoogleMap, Marker, withGoogleMap } from 'react-google-maps';
import Drawer from 'material-ui/Drawer';
import IconButton from 'material-ui/IconButton';
import ArrowBack from 'material-ui/svg-icons/navigation/arrow-back';
import MainStore from '../stores/MainStore';
import Graph from './Graph.jsx';
import BusinessDetails from './BusinessDetails.jsx';

// const GoogleMapsWrapper = withScriptjs(withGoogleMap(props => {
//     const {onMapMounted, ...otherProps} = props;
//     return <GoogleMap {...otherProps} ref={map => {
//         onMapMounted && onMapMounted(map)
//         console.log(map)
//         MainStore.getMapObject(map);
//     }}>{props.children}</GoogleMap>
// }));


const GoogleMapsWrapper = withGoogleMap(props => {
    const {onMapMounted, ...otherProps} = props;
    return <GoogleMap {...otherProps} ref={map => {
        onMapMounted && onMapMounted(map)
        console.log(map)
        MainStore.getMapObject(map);
    }}>{props.children}</GoogleMap>
});

@observer
class Map extends Component {

    getMarkerId = (marker) => {
        console.log(marker)
    };

    toggleInfoWindow = () => {
      MainStore.toggleInfowindow();
    };

    render() {
        const style = {
            closeBtn: { float: 'left', margin: '0px 0px 0px 6px' },
            h4: {margin: '10px 14px'},
            mapTitle: { textAlign: 'center', margin: '14px 12%' },
            icon: { verticalAlign: 'bottom' }
        };

        let { showInfoWindow, selectedRestaurant } = MainStore;

       return (
           selectedRestaurant !== null && <Drawer width={window.innerWidth <= 720 ? '100%' : 400}
                                                  openSecondary={false}
                                                  open={showInfoWindow}
                                                  containerStyle={{marginTop: 64}}>
                       <IconButton style={style.closeBtn}
                                   onClick={this.toggleInfoWindow}>
                           <ArrowBack />
                       </IconButton>
                       <h3 style={style.mapTitle}>{selectedRestaurant.name}</h3>
                       <Graph />
                       <GoogleMapsWrapper
                           googleMapURL='https://maps.googleapis.com/maps/api/js?key=AIzaSyAzluYW2z_7GUyngCj_UyUJHROLYPfcsWc&v=3.exp&libraries=geometry,drawing,places'
                           loadingElement={<div style={{height: '60%'}}/>}
                           containerElement={<div style={{height: 280, padding: '20px 10px 0px 20px'}}/>}
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
                       <BusinessDetails />
           </Drawer>
        )
    }
}

export default Map;
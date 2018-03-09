import React, {Component} from "react";
import { observer } from 'mobx-react';
import { Col } from 'react-grid-system';
import { GoogleMap, Marker, withGoogleMap } from 'react-google-maps';
import MainStore from '../stores/MainStore';

const GoogleMapsWrapper = withGoogleMap(props => {
    const {onMapMounted, ...otherProps} = props;
    return <GoogleMap {...otherProps} ref={map => {
        onMapMounted && onMapMounted(map);
        MainStore.getMapObject(map);
    }}>{props.children}</GoogleMap>
});

@observer
class Map extends Component {

    render() {

       let { selectedRestaurant } = MainStore;

       const style= {
           containerElement: { height: 280, margin: '20px 10px' },
           loadingElement: { height: '60%' },
           mapElement: { height: '100%' },
       };


       return (
           selectedRestaurant !== null &&
                <Col md={12}>
                   <GoogleMapsWrapper
                       googleMapURL='https://maps.googleapis.com/maps/api/js?key=AIzaSyAzluYW2z_7GUyngCj_UyUJHROLYPfcsWc&v=3.exp&libraries=geometry,drawing,places'
                       loadingElement={<div style={style.loadingElement}/>}
                       containerElement={<div style={style.containerElement}/>}
                       mapElement={<div style={style.mapElement}/>}
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
       )
    }
}

export default Map;
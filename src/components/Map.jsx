import React, {Component} from 'react';
import {observer} from 'mobx-react';
import {Col} from 'react-grid-system';
import {
  GoogleMap,
  Marker,
  withGoogleMap
} from 'react-google-maps';
import MainStore from '../stores/MainStore';

const SEATTLE_CENTER = {
  lat: 47.6062,
  lng: -122.3321
};

const GoogleMapsWrapper = withGoogleMap(props => {
  const {
    onMapMounted,
    children,
    ...otherProps
  } = props;


  return (
      <GoogleMap
          {...otherProps}
          ref={map => {
            if (map && onMapMounted) {
              onMapMounted(map);
            }
          }}
      >
        {children}
      </GoogleMap>
  );


});

@observer
class Map extends Component {
  handleMapMounted = map => {
    if (!map) return;


    MainStore.getMapObject(map);
  };

  render() {
    const {selectedRestaurant} = MainStore;

    if (!selectedRestaurant) {
      return null;
    }

    const lat = Number(selectedRestaurant.lat);
    const lng = Number(selectedRestaurant.lng);

    const hasValidLocation =
        Number.isFinite(lat) &&
        Number.isFinite(lng);

    const center = hasValidLocation
        ? {lat, lng}
        : SEATTLE_CENTER;

    const style = {
      containerElement: {
        height: 280,
        margin: '20px 10px'
      },
      loadingElement: {
        height: '60%'
      },
      mapElement: {
        height: '100%'
      }
    };

    return (
        <Col md={12}>
          <GoogleMapsWrapper
              loadingElement={
                <div style={style.loadingElement}/>
              }
              containerElement={
                <div style={style.containerElement}/>
              }
              mapElement={
                <div style={style.mapElement}/>
              }
              defaultZoom={11}
              zoom={hasValidLocation ? 14 : 11}
              center={center}
              options={{
                disableDoubleClickZoom: true
              }}
              onMapMounted={this.handleMapMounted}
          >
            {hasValidLocation && (
                <Marker
                    key={selectedRestaurant.id}
                    id={selectedRestaurant.id}
                    position={{lat, lng}}
                />
            )}
          </GoogleMapsWrapper>
        </Col>
    );
  }

}

export default Map;

import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Map, Marker, GoogleApiWrapper } from 'google-maps-react';
import randomstring from 'randomstring';
import * as setting from '../config';

import googleMapStyles from "../GoogleMapStyle";
function MapContainer(props) {
  const {
    size, _mapStyle, setMapLoading, setGoogleService,
    setGoogle,
    _mapCenterChanged,
    // _mapConfig,
    markerType,
    mapRef,
    clickable, markers, setMarkers
  } = props;

  const [mapData, setMapData] = useState(null);
  const [containerStyle, setContainerStyle] = useState({
    width: props.size.wid + 'px' || '400px',
    height: props.size.hei + 'px' || '566px',
  })
  // const [mapCenter, setMapCenter] = useState(_mapConfig.center);

  const mapClicked = useCallback((mapProps, map, clickEvent) => {
    if (clickable) {
      setMarkers([
        ...markers,
        {
          lat: clickEvent.latLng.lat(),
          lng: clickEvent.latLng.lng(),
          name: "Position " + randomstring.generate(7),
          markerType: markerType
        }
      ])
      _mapCenterChanged(mapProps, map);
    }
    // ...
  }, [markers, _mapCenterChanged, markerType, clickable, setMarkers])

  const onClickMarker = useCallback((props, marker, e) => {
    const index = markers.findIndex(marker => marker.name === props.name);
    let newMarkers = markers;
    newMarkers.splice(index, 1)
    setMarkers([...newMarkers]);
  }, [markers, setMarkers])


  useEffect(() => {
    if (mapData !== null) {
      mapData.setOptions({
        styles: _mapStyle,
      });
    }
  }, [mapData, _mapStyle])

  // useEffect(() => {
  //   setMapCenter({
  //     lat: _mapConfig.center.lat,
  //     lng: _mapConfig.center.lng,
  //   })
  // }, [_mapConfig.center])

  useEffect(() => {
    setMapLoading(true);
  }, [size, _mapStyle, setMapLoading])

  useEffect(() => {
    setContainerStyle({
      width: size.wid + 'px',
      height: size.hei + 'px'
    })
  }, [size])

  const mapLoaded = useCallback((mapProps, map) => {
    const { google } = mapProps;
    setGoogle(google);
    const service = new google.maps.places.PlacesService(map);
    setGoogleService(service);
    setMapData(map);
    _mapCenterChanged(mapProps, map);
    console.log(map.center.lat())
  }, [setGoogleService, setGoogle, _mapCenterChanged])

  const Markers = useMemo(() => {
    return markers.map((marker, index) => {
      return (
        <Marker
          key={index}
          onClick={onClickMarker}
          name={marker.name}
          position={marker}
          icon={{
            url: marker.markerType.icon,
            anchor: new props.google.maps.Point(marker.markerType.anchor[0], marker.markerType.anchor[1]),
            scaledSize: new props.google.maps.Size(marker.markerType.scaledSize[0], marker.markerType.scaledSize[1]),
            origin: new props.google.maps.Point(marker.markerType.origin[0], marker.markerType.origin[1]),
          }}
        >
        </Marker>
      )
    })
  }, [markers, props, onClickMarker])

  const MainMap = useMemo(() =>
    <Map
      ref={mapRef}
      id="mapDom"
      keyboardShortcuts={false}
      google={props.google}
      zoomControl={false}
      scaleControl={false}
      streetViewControl={false}
      fullscreenControl={false}
      mapTypeControl={false}
      zoom={props._mapConfig.zoom}
      // style={MapContainer.mapStyle}
      containerStyle={containerStyle}
      // initialCenter={props._mapConfig.center}
      onReady={mapLoaded}
      onZoomChanged={props._mapZoomChanged}
      // onCenterChanged={props._mapCenterChanged}
      onTilesloaded={setMapLoading(false)}
      onClick={mapClicked}
      centerAroundCurrentLocation={true}
    // center={mapCenter}
    >
      {
        Markers
      }
    </Map >
    , [mapRef, containerStyle, setMapLoading, mapLoaded, mapClicked, props, Markers])

  return (
    <>
      {MainMap}
    </>
  )
  // return mapRender;
}

MapContainer.defaultProps = googleMapStyles;


const LoadingContainer = (props) => (
  <div>Fancy loading container!</div>
)

export default GoogleApiWrapper(
  (props) => {
    return ({
      apiKey: setting.mapApiKey,
      LoadingContainer: LoadingContainer,
      // language: props.language,
      version: '3.14'
    })
  }
)(MapContainer)

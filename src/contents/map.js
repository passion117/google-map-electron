import React from "react";

import cs from "classnames";

import MapComponent from "../components/googl_map";
import MapZoom from "../components/map_zoom";

function MapPart(props) {
  const {
    size, 
    maskType, 
    mapPartRef,mainMapRef,
    setMapLoading,
    mapStyle,mapConfig,
    MapZoomChanged,MapCenterChanged,
    // mapTitle,mapSubtitle,mapTagline,
    // darkMode,fadeMode,
    setGoogleService,
    setGoogle,
    markerType,
    mapRef,
    clickable,markers,setMarkers,
    zoomChanged
  } = props;

  return (
    <div className="position-relative w-100 map">
      <div className="map-part" ref={mapPartRef}>
        <div className={cs("position-relative bg-transparent", { "circleMode": maskType === 'circle' })}
          style={{
            width: size.maxwid + "px",
            height: size.maxhei + "px",
          }}
          ref={mainMapRef}>
          <div className="position-absolute" style={{
            top: (size.maxhei - size.hei) / 2 + "px",
            left: (size.maxwid - size.wid) / 2 + "px",
          }}>
            <MapComponent
              setMapLoading={setMapLoading}
              size={size}
              _mapStyle={mapStyle}
              _mapConfig={mapConfig}
              _mapZoomChanged={MapZoomChanged}
              _mapCenterChanged={MapCenterChanged}
              setGoogleService = {setGoogleService}
              setGoogle={setGoogle}
              markerType={markerType}
              mapRef={mapRef}
              clickable={clickable}
              markers={markers}
              setMarkers={setMarkers}
            />
          </div>
          {/* <div className={cs("position-absolute w-100 bottom-0 text-center map-label-part", { dark: darkMode }, { fade_mode: fadeMode })}>
            <div className="p-5">
              <p className="map-title"><span className="text-decoration-underline">{mapTitle}</span></p>
              <p className="map-subtitle">{mapSubtitle}</p>
              <p className="map-tagline">{mapTagline}</p>
            </div>
          </div> */}
        </div>
      </div>
      
      <MapZoom className = "position-absolute start-50 translate-middle w-50 zoom-position p-3 rounded-3 zoom-range" zoom = {mapConfig.zoom} zoomChanged={zoomChanged}/>
      
      <div className="position-absolute top-50 map-height translate-middle">
        <span>{size.hei} / {size.maxhei}Pixel</span>
      </div>
      <div className="position-absolute map-width start-50 translate-middle">
        <span>{size.wid} / {size.maxwid}Pixel</span>
      </div>
    </div>
  )
}

export default MapPart;
import React from 'react';
import cs from 'classnames';
import RangeSlider from 'react-bootstrap-range-slider';
import 'react-bootstrap-range-slider/dist/react-bootstrap-range-slider.css';

function MapZoom(props) {
  const { zoomChanged } = props;
  return (
    <div className={props.className + cs(" ")}>
      <RangeSlider value={props.zoom} max={22} min={0} step={1} onChange={zoomChanged}/>
    </div>
  )
}

export default MapZoom;
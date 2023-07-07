import React, { useRef, useState } from "react";
import {
  Row, Col, FormSelect, FormGroup, FormLabel, Button, Container, Modal, ModalBody, ModalHeader, ModalTitle, Accordion, FormCheck, InputGroup, FormControl
} from "react-bootstrap";
import FormCheckLabel from "react-bootstrap/esm/FormCheckLabel";
import FormCheckInput from "react-bootstrap/esm/FormCheckInput";
import cs from "classnames";
import download from "downloadjs";
import html2canvas from "html2canvas";
// import "html2canvas-dpi/build/html2canvas";
import randomstring from 'randomstring';

import googleMapStyles from "./GoogleMapStyle";
import hideLabelMapStyles from "./GoogleMapHideLabelStyle";
// import MapImage from "./components/googlemapimage";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import FormRange from "react-bootstrap/esm/FormRange";
import MapPart from "./contents/map";
import MarkerImage1 from './assets/icons/marker1.png';
import MarkerImage2 from './assets/icons/marker2.png';
import MarkerImage3 from './assets/icons/marker3.png';
import MarkerImage4 from './assets/icons/marker4.png';
import MarkerImage5 from './assets/icons/marker5.png';
import MarkerImage6 from './assets/icons/marker6.png';
import MarkerImage7 from './assets/icons/marker7.png';
import MarkerImage8 from './assets/icons/marker8.png';
import MarkerImage9 from './assets/icons/marker9.png';
import ScaleModel from "./contents/scalemodel";
import { useEffect } from "react";

const pageSize = [
  {
    name: "A1",
    maxhei: 9933,
    maxwid: 7016,
    zoom: 6,
  },
  {
    name: 'A2',
    maxhei: 7016,
    maxwid: 4961,
    zoom: 5,
  },
  {
    name: 'A3',
    maxhei: 4961,
    maxwid: 3508,
    zoom: 4,
  },
  {
    name: 'A4',
    maxhei: 3508,
    maxwid: 2480,
    zoom: 3,
  },
  {
    name: 'A5',
    maxhei: 2480,
    maxwid: 1748,
    zoom: 2,
  },
];

const MarkerType = [
  {
    name: 'marker1',
    icon: MarkerImage1,
    anchor: [19, 37],
    scaledSize: [38, 40],
    origin: [0, 0],
  },
  {
    name: 'marker2',
    icon: MarkerImage2,
    anchor: [19, 37],
    scaledSize: [38, 40],
    origin: [0, 0],
  },
  {
    name: 'marker3',
    icon: MarkerImage3,
    anchor: [19, 37],
    scaledSize: [38, 40],
    origin: [0, 0],
  },
  {
    name: 'marker4',
    icon: MarkerImage4,
    anchor: [19, 37],
    scaledSize: [38, 40],
    origin: [0, 0],
  },
  {
    name: 'marker5',
    icon: MarkerImage5,
    anchor: [14, 37],
    scaledSize: [28, 40],
    origin: [0, 0],
  },
  {
    name: 'marker6',
    icon: MarkerImage6,
    anchor: [19, 37],
    scaledSize: [38, 40],
    origin: [0, 0],
  },
  {
    name: 'marker7',
    icon: MarkerImage7,
    anchor: [19, 37],
    scaledSize: [38, 40],
    origin: [0, 0],
  },
  {
    name: 'marker8',
    icon: MarkerImage8,
    anchor: [19, 37],
    scaledSize: [38, 40],
    origin: [0, 0],
  },
  {
    name: 'marker9',
    icon: MarkerImage9,
    anchor: [19, 37],
    scaledSize: [38, 40],
    origin: [0, 0],
  },
]

function App(props) {
  const [size, setSize] = useState({
    ...pageSize[4],
    wid: pageSize[4].maxwid,
    hei: pageSize[4].maxhei,
  })
  const [markerType, setMarkerType] = useState(MarkerType[0]);
  const [mapStyle, setMapStyle] = useState(googleMapStyles.mapStyle[0]);
  const [downloadBtnDisable, setDownloadBtnDisable] = useState(false);
  const [mapConfig, setMapConfig] = useState({
    // center: {},
    center: { lat: 37.7, lng: -122.40 },
    zoom: 8,
  });
  const [showScaleModal, setShowScaleModal] = useState(false);
  const [mapLoading, setMapLoading] = useState(true);
  const [locationName, setLocationName] = useState('');
  // const [mapTitle, setMapTitle] = useState('Title');
  // const [mapSubtitle, setMapSubtitle] = useState('Subtitle');
  // const [mapTagline, setMapTagline] = useState('');
  // const [darkMode, setDarkMode] = useState(false);
  // const [fadeMode, setFadeMode] = useState(false);
  const [maskType, setMaskType] = useState('full');
  const [googleService, setGoogleService] = useState(null);
  const [google, setGoogle] = useState(null);
  const [scaleModelImage, setScaleModelImage] = useState('');
  const [modalLoading, setModalLoading] = useState(false);
  //////////////
  const [showLabel, setShowLabel] = useState(true);
  const [style, setStyle] = useState(0);
  /////////////////
  const [clickable, setClickable] = useState(true);
  const [markers, setMarkers] = useState([]);

  const mapPartRef = useRef(null);
  const mainMapRef = useRef(null);
  const scaleModeRef = useRef(null);
  const mapRef = useRef(null);

  useEffect(() => {
    mapPartRef.current.scrollTo({
      top: (size.maxhei - mapPartRef.current.offsetHeight) / 2,
      left: (size.maxwid - mapPartRef.current.offsetWidth) / 2,
      behavior: 'smooth',
    })
  }, [size])

  // window.onresize
  const ChangePaper = (e) => {
    setMapLoading(true);
    const item = pageSize.find(item => item.name === e.target.value);
    setSize({
      ...item,
      wid: item.maxwid,
      hei: item.maxhei,
    });
  };

  const ChangeMarker = (e) => {
    const item = MarkerType.find(item => item.name === e.target.value);
    setMarkerType(item);
  }

  const ChangeStyle = (e) => {
    setStyle(e.target.value);
    setMapLoading(true);
    if (showLabel === true)
      setMapStyle(googleMapStyles.mapStyle[e.target.value]);
    else
      setMapStyle(hideLabelMapStyles.mapStyle[e.target.value]);
  }

  const ChangeShowLabel = (e) => {
    setShowLabel(!showLabel);
    if (!showLabel === true)
      setMapStyle(googleMapStyles.mapStyle[style]);
    else
      setMapStyle(hideLabelMapStyles.mapStyle[style]);
  }

  const MapZoomChanged = (mapProps, map) => {
    setMapConfig({
      ...mapConfig,
      zoom: map.zoom,
      // center: map.center,
      center: { lat: map.center.lat(), lng: map.center.lng() },
    })
  }

  const zoomChanged = (e) => {
    setMapConfig({
      ...mapConfig,
      zoom: Number(e.target.value)
    })
  }

  const MapCenterChanged = (mapProps, map) => {
    setMapConfig({
      ...mapConfig,
      // center: map.center,
      center: { lat: map.center.lat(), lng: map.center.lng() },
    })
    // console.log(map.center.lat(), map.center.lng());
  }

  const downloadImage = async () => {
    setDownloadBtnDisable(true);
    try {
      setTimeout(async () => {
        const canvas = await html2canvas(mainMapRef.current, {
          windowHeight: size.maxhei,
          windowWidth: size.maxwid,
          height: size.maxhei,
          width: size.maxwid,
          useCORS: true,
          backgroundColor: 'transparent'
        });
        const image = canvas.toDataURL("image/png", 1.0);
        download(image, "map_" + Date.now() + ".png");
        setDownloadBtnDisable(false);
      }, 100);
    } catch (error) {
      console.log(error);
      setDownloadBtnDisable(false);
    }
    // window.html2canvas(mapPartRef.current, {
    //   dpi:96,
    //   windowHeight: size.hei,
    //   windowWidth: size.wid,
    //   height: size.hei,
    //   width: size.wid,
    //   useCORS: true,
    //   onrendered: function(canvas){
    //     const image = canvas.toDataURL("image/png", 2.0);
    //     download(image, "map_" + Date.now() + ".png");
    //     setDownloadBtnDisable(false);
    //   }
    // });
  }

  const ShowMapScaleModalShow = async () => {
    setModalLoading(true);
    try {
      const canvas = await html2canvas(mainMapRef.current, {
        height: size.maxhei,
        width: size.maxwid,
        useCORS: true,
        backgroundColor: 'transparent'
      });
      const image = canvas.toDataURL("image/png", 1.0);
      setScaleModelImage(image);
      setShowScaleModal(true);
    }
    catch (error) {
      console.log(error);
    }
    finally {
      setModalLoading(false);
    }
  }

  const ShowModalFuncHide = () => {
    setShowScaleModal(false);
  }

  const widthChange = (e) => {
    if (maskType === 'rectangle') {
      setSize({
        ...size,
        wid: e.target.value,
      })
    } else {
      setSize({
        ...size,
        wid: e.target.value,
        hei: e.target.value,
      })
    }
  }

  const HeightChange = (e) => {
    setSize({
      ...size,
      hei: e.target.value,
    })
  }

  const MaskChange = (e) => {
    setMaskType(e.target.value);
    switch (e.target.value) {
      case 'full':
      case 'rectangle': {
        setSize({
          ...size,
          hei: size.maxhei,
          wid: size.maxwid,
        })
        break;
      }
      case 'square':
      case 'circle': {
        setSize({
          ...size,
          hei: size.maxwid,
          wid: size.maxwid,
        })
        break;
      }
      default:
        break;
    }
  }

  const SearchLocaiton = () => {
    // console.log(locationName);
    const request = {
      // location: mapConfig.center,
      // radius: '500',
      // type: ['food']
      query: locationName,
      fields: ['name', 'geometry'],
    }
    setMapLoading(true);
    googleService.findPlaceFromQuery(request, function (results, status) {
      if (status === google.maps.places.PlacesServiceStatus.OK) {
        // for (var i = 0; i < results.length; i++) {
        //   createMarker(results[i]);
        // }
        // console.log(results[0].geometry.location.lat());
        setMapConfig({
          ...mapConfig,
          center: {
            lat: results[0].geometry.location.lat(),
            lng: results[0].geometry.location.lng(),
          }
        });
        setTimeout(() => {
          setMarkers([
            // ...markers,
            {
              lat: results[0].geometry.location.lat(),
              lng: results[0].geometry.location.lng(),
              name: "Position " + randomstring.generate(7),
              markerType: markerType
            }
          ])
        }, 150);
        mapRef.current.map.setCenter({
          lat: results[0].geometry.location.lat(),
          lng: results[0].geometry.location.lng(),
        })

        mapPartRef.current.scrollTo({
          top: (size.maxhei - mapPartRef.current.offsetHeight) / 2,
          left: (size.maxwid - mapPartRef.current.offsetWidth) / 2,
          behavior: 'smooth',
        })
      } else {
        setMapLoading(false);
      }
    });
  }

  const ChangeClickable = () => {
    setClickable(!clickable);
  }
  return (
    <div className="App">
      <Container>
        <Row>
          <Col md={4} sm={12}>
            <div className={cs("p-5")}>
              <Accordion defaultActiveKey="0">
                <Accordion.Item eventKey="0">
                  <Accordion.Header>Size Control</Accordion.Header>
                  <Accordion.Body>
                    <FormGroup>
                      <FormLabel>Size:</FormLabel>
                      <FormSelect
                        onChange={ChangePaper}
                        defaultValue={size.name}
                      >
                        {
                          pageSize.map((item) => {
                            return (
                              <option value={item.name} key={item.name}>{item.name}</option>
                            )
                          })
                        }
                      </FormSelect>
                    </FormGroup>

                    <FormGroup className="mt-3">
                      <FormLabel>Type:</FormLabel><br />
                      <FormCheck
                        inline
                        label="Full"
                        name="MaskType"
                        type="radio"
                        id="full-mode"
                        value="full"
                        checked={maskType === 'full'}
                        onChange={MaskChange}
                      />
                      <FormCheck
                        inline
                        label="Square"
                        name="MaskType"
                        type="radio"
                        id="square-mode"
                        value="square"
                        checked={maskType === 'square'}
                        onChange={MaskChange}
                      />
                      <FormCheck
                        inline
                        label="Rectangle"
                        name="MaskType"
                        type="radio"
                        id="rectangle-mode"
                        value="rectangle"
                        checked={maskType === 'rectangle'}
                        onChange={MaskChange}
                      />
                      <FormCheck
                        inline
                        label="Circle"
                        name="MaskType"
                        type="radio"
                        id="circle-mode"
                        value="circle"
                        checked={maskType === 'circle'}
                        onChange={MaskChange}
                      />
                    </FormGroup>

                    <FormGroup className="mt-3 position-relative py-4">
                      <FormLabel htmlFor="widthRange">Width: {size.wid}px</FormLabel>
                      <FormRange
                        disabled={maskType === 'full'}
                        max={size.maxwid} min={0} step={1}
                        value={size.wid} onChange={widthChange}
                        id="widthRange" />
                      <div className="position-absolute bottom-0 start-0 translate-middle">0</div>
                      <div className="position-absolute bottom-0 start-100 translate-middle">{size.maxwid}</div>
                    </FormGroup>

                    <FormGroup className="mt-3 position-relative py-4">
                      <FormLabel htmlFor="widthRange">Height: {size.hei}px</FormLabel>
                      <FormRange
                        disabled={maskType === 'square' || maskType === 'circle' || maskType === 'full'}
                        max={size.maxhei} min={0} step={1}
                        value={size.hei} onChange={HeightChange}
                        id="widthRange" />
                      <div className="position-absolute bottom-0 start-0 translate-middle">0</div>
                      <div className="position-absolute bottom-0 start-100 translate-middle">{size.maxhei}</div>
                    </FormGroup>
                  </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="1">
                  <Accordion.Header>Style Control</Accordion.Header>
                  <Accordion.Body>

                    <FormGroup className="mt-3">
                      <FormLabel>Search Locaiton:</FormLabel>
                      <InputGroup className="">
                        <FormControl
                          value={locationName}
                          onChange={(e) => setLocationName(e.target.value)}
                          onKeyDown={e => {
                            if (e.keyCode === 13){
                              SearchLocaiton()
                            }
                          }
                          }
                        >
                        </FormControl>
                        <Button onClick={SearchLocaiton}>Search</Button>
                      </InputGroup>
                    </FormGroup>

                    <FormGroup className="mt-3">
                      <FormLabel>Style:</FormLabel>
                      <FormSelect
                        onChange={ChangeStyle}
                        value={style}
                      >
                        {
                          googleMapStyles.mapStyle.map((item, index) => {
                            return (
                              <option value={index} key={index}>Style-{index + 1}</option>
                            )
                          })
                        }
                      </FormSelect>
                    </FormGroup>

                    <FormGroup className="mt-3">
                      <FormCheckLabel className="me-3">Show Label:</FormCheckLabel>
                      <FormCheckInput type="checkbox" checked={showLabel} onChange={ChangeShowLabel}></FormCheckInput>
                    </FormGroup>

                    <FormGroup className="mt-3">
                      <FormCheckLabel className="me-3">Clickable: </FormCheckLabel>
                      <FormCheckInput type="checkbox" checked={clickable} onChange={ChangeClickable}></FormCheckInput>
                    </FormGroup>

                    <FormGroup className="mt-3">
                      <FormLabel>Icon Type:</FormLabel>
                      <FormSelect
                        onChange={ChangeMarker}
                        defaultValue={size.name}
                      >
                        {
                          MarkerType.map((item) => {
                            return (
                              <option value={item.name} key={item.name}>{item.name}</option>
                            )
                          })
                        }
                      </FormSelect>
                    </FormGroup>

                    {/* <FormGroup className="mt-3">
                      <FormLabel>Title:</FormLabel>
                      <FormControl value={mapTitle} onChange={(e) => setMapTitle(e.target.value)}></FormControl>
                    </FormGroup>
                    <FormGroup className="mt-3">
                      <FormLabel>Subtitle:</FormLabel>
                      <FormControl value={mapSubtitle} onChange={(e) => setMapSubtitle(e.target.value)}></FormControl>
                    </FormGroup>
                    <FormGroup className="mt-3">
                      <FormLabel>MapTagline:</FormLabel>
                      <FormControl value={mapTagline} onChange={(e) => setMapTagline(e.target.value)}></FormControl>
                    </FormGroup>
                    <FormGroup className="mt-3">
                      <FormCheckLabel className="me-3">Dark:</FormCheckLabel>
                      <FormCheckInput type="checkbox" value={darkMode} onChange={() => setDarkMode(!darkMode)}></FormCheckInput>

                      <FormCheckLabel className="mx-3">Fade:</FormCheckLabel>
                      <FormCheckInput type="checkbox" value={fadeMode} onChange={() => setFadeMode(!fadeMode)}></FormCheckInput>
                    </FormGroup> */}



                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>

              <div className="mt-3">
                <Button disabled={downloadBtnDisable || mapLoading} onClick={downloadImage} className="w-100">
                  {
                    downloadBtnDisable ?
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Downloading...
                      </> : null
                  }
                  {
                    mapLoading ?
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Map Loading...
                      </> : null
                  }
                  {
                    downloadBtnDisable || mapLoading ? null : <>Download</>
                  }
                </Button>
              </div>

              <div className="mt-5">
                <Button className="w-100" onClick={ShowMapScaleModalShow} disabled={modalLoading}>
                  {
                    modalLoading ?
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      : null
                  }
                  Show Map Scale Model
                </Button>
              </div>
              <Modal show={showScaleModal} onHide={ShowModalFuncHide}>
                <ModalHeader closeButton>
                  <ModalTitle>Map Scale Model</ModalTitle>
                </ModalHeader>
                <ModalBody className="d-flex justify-content-center" ref={scaleModeRef}>
                  {/* <MapImage mapStyle={mapStyle} _mapConfig={mapConfig} size={size} /> */}
                  <ScaleModel image={scaleModelImage} />
                </ModalBody>
              </Modal>
            </div>
          </Col>
          <Col md={8} sm={12} className="d-flex justify-content-center p-5">
            <MapPart
              size={size}
              maskType={maskType}
              mapPartRef={mapPartRef}
              mainMapRef={mainMapRef}
              setMapLoading={setMapLoading}
              mapStyle={mapStyle}
              mapConfig={mapConfig}
              MapZoomChanged={MapZoomChanged}
              MapCenterChanged={MapCenterChanged}
              setGoogleService={setGoogleService}
              setGoogle={setGoogle}
              markerType={markerType}
              mapRef={mapRef}
              zoomChanged={zoomChanged}
              // mapTitle={mapTitle}
              // mapSubtitle={mapSubtitle}
              // mapTagline={mapTagline}
              // darkMode={darkMode}
              // fadeMode={fadeMode}
              clickable={clickable}
              markers={markers}
              setMarkers={setMarkers}
            />
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default App;

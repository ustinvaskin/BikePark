import React from 'react'
import ReactMapGL, { Marker, Popup, GeolocateControl } from 'react-map-gl'
import axios from 'axios'

import Pin from './Pin'
import ParkInfo from './ParkInfo'
import Directions from './Directions'


const geolocateStyle = {
  position: 'absolute',
  top: 0,
  left: 0,
  margin: 10
}

// This is the main page.

class Map1 extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      viewport: {
        latitude: null,
        longitude: null,
        zoom: 15,
        mapboxApiAccessToken: process.env.MAPBOX_KEY
      },
      showPopup: null,
      bikedata: null
    }
  }

  // This hook fetches the bike park data from a specific Long and Lat within a 250m radius

  hook = () => {
    const lat = this.state.viewport.latitude
    const long = this.state.viewport.longitude

    axios.get(`https://api.tfl.gov.uk/Place?radius=250&type=CyclePark&placeGeo.lat=${lat}&placeGeo.lon=${long}`)
      .then(resp => this.setState({ bikedata: resp.data }))
      .catch(err => this.setState({ err: err }))
  }

  // Cross-Origin Request Blocked: The Same Origin Policy disallows reading the remote resource at https://api.tfl.gov.uk/Place?radius=250&type=CyclePark&placeGeo.lat=51.582143&placeGeo.lon=-0.036753. (Reason: CORS header 'Access-Control-Allow-Origin' missing).

  // On mount, it updates the map with the logitudate and latitues from the postcode.

  componentDidMount() {
    this.setState({
      viewport: {
        latitude: parseFloat(this.props.match.params.latitude),
        longitude: parseFloat(this.props.match.params.longitude),
        zoom: 15,
        mapboxApiAccessToken: process.env.MAPBOX_KEY
      }
    })
    setTimeout(() => {
      this.hook()
    }, 300)
  }

  // This gives the markets and pins.  Passing an onclick function to pass the data of the
  // specific park location to showPopup on Click

  loadBikeParks = () => {
    return this.state.bikedata.places.map((ele, i) => {
      return (
        <Marker
          key={i}
          latitude={ele.lat}
          longitude={ele.lon}
        >
          <Pin size={20} onClick={() => this.setState({ showPopup: ele })} />
        </Marker>
      )
    })
  }
  // This is for the pop up.  When showPopup is a value, it adds it at the specific location,
  // the information given is in the ParkInfo folder

  loadBikePopup = () => {
    const { showPopup } = this.state

    return (
      showPopup && (
        <Popup
          tipSize={5}
          anchor="top"
          longitude={showPopup.lon}
          latitude={showPopup.lat}
          closeOnClick={false}
          onClose={() => this.setState({ showPopup: null })}
        >
          <ParkInfo info={showPopup} />
        </Popup>
      )
    )
  }

  // Assuming the bike data has been passed in, we return the map in 2
  // bulma columns which are ontop of eachother in mobile.
  // Used Flexbox to center the map and had to give it a specific value
  // as mabox doesnt allow it to fill a div
  // On click of the button, it refreshes locations at the specific location
  // this was to avoid too many api calls.

  render() {
    if (this.state.bikedata === null) return <div>Loading...</div>
    return (
      <section className="section">
        <div className="container">
          <div className="title">Pick Your Park</div>
          <div className="columns">
            <div className="column">
              <div id="center2">
                <div id="center">

                  <ReactMapGL
                    {...this.state.viewport}
                    width="310px" // It always override the view(viewport) width state.
                    height="310px"
                    id="center2"
                    mapStyle="mapbox://styles/mapbox/streets-v11"
                    onViewportChange={(viewport) => this.setState({ viewport })}>
                    {this.loadBikeParks()}
                    {this.loadBikePopup()}
                    <GeolocateControl
                      positionOptions={{ enableHighAccuracy: true }}
                      trackUserLocation={true}
                      style={geolocateStyle}
                    />
                  </ReactMapGL>

                </div>
              </div>
              <div className="button-center">
                <button className="button" id="button1" onClick={() => this.hook()}>Find more locations</button>
              </div>
            </div>
            <div className="column">
              <Directions showPopup={this.state.showPopup} />
            </div>
          </div>
        </div>
      </section>
    )
  }
}
export default Map1


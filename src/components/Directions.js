import React, { PureComponent } from 'react'
import axios from 'axios'
import PlainPin from './PlainPin'
// import Loader from './Loader'

// Page which gives the directions info.
// given the starting postcode, it gets the postcode of the current bike park,
// from the log / lat using another API, and pushes this into another TFL
// directions API.



export default class Directions extends PureComponent {

  constructor(props) {
    super(props)
    this.state = {
      postcodeStart: null,
      postcodeFinish: null,
      errors: null,
      directions: null,
      savedPostcodeStart: null
    }
  }
  // Gets bike park poscode from Long /  Lat
  hook = () => {
    const long = this.props.showPopup.lon
    const lat = this.props.showPopup.lat
    axios.get(`https://api.postcodes.io/postcodes?lon=${long}&lat=${lat}`)
      .then(resp => this.setState({ postcodeFinish: resp.data.result[0].postcode }))
      .catch(() => this.setState({ err: 'Invalid Postcode' }))
  }
  // logs postcode from input (starting postcode)
  handleChange(e) {
    const postcode = (e.target.value).replace(/\s/g, '')
    this.setState({
      postcodeStart: postcode,
      errors: ''
    })

  }
  // hook which gives directions between the 2 postcodes
  hooktfl = () => {
    axios.get(`https://api.tfl.gov.uk/Journey/JourneyResults/${this.state.savedPostcodeStart}/to/${this.state.postcodeFinish}?cyclePreference=AllTheWay&bikeProficiency=Easy`)
      .then(resp => {
        this.setState({
          directions: resp.data.journeys[0]

        })
      })
      .catch(() => this.setState({
        errors: 'Invalid Postcode',
        savedPostcodeStart: null
      }))
  }
  // on submit of starting postcode, it also stores it in savedPostcode start.  This 
  // means you dont have to keep re submitting your postcode.
  // If its invalid, it removes it via the errors.
  handleSubmit(e) {
    e.preventDefault()
    this.setState({
      savedPostcodeStart: this.state.postcodeStart
    })
    if (this.state.savedPostcodeStart === null) {
      setTimeout(() => {
        this.hooktfl()
      }, 300)
      return
    }
    this.hooktfl()

  }
  // resest location, so you can reinput your starting location.
  resetLocation() {
    this.setState({
      postcodeStart: null,
      errors: '',
      directions: null,
      savedPostcodeStart: null
    })
  }

  // If no savedpostcode, it displays enter postcode information
  // if its got a saved postcode, but no directions, it runs the tfl hook
  // if it has all that information, shows the directions in a mapped Bulma Table.
  directions = () => {
    if (this.state.savedPostcodeStart === null) {
      return (

        <div className="container">
          <div className="subtitle">Starting Postcode</div>
          <form className="form" onSubmit={(e) => this.handleSubmit(e)}>
            <div className="field">
              <div className="control">
                <input
                  onChange={(e) => this.handleChange(e)}
                  type="text"
                  name="postcode"
                  className="postcode"
                />
              </div>
            </div>
            {this.state.errors && <small className="help is-danger">
              {this.state.errors}
            </small>}
            <button className="button">Search</button>
          </form>
        </div>

      )
    } else if (this.state.directions === null) {
      this.hooktfl()
      return
    } else {
      const data = this.state.directions.legs[0].instruction.steps
      return (
        <div className="container">
          <div className="button-center">
            <button className="button" onClick={() => this.resetLocation()}>Change starting location<PlainPin size={12}/></button>
          </div>
          <table className="table table is-hoverable table">
            <thead>
              <tr>
                <th id="start-green">Start</th>
                <th></th>
              </tr>
            </thead>
            <tfoot>
              <tr>
                <th id="finish-red">Finish</th>
                <th></th>
              </tr>
            </tfoot>
            <tbody>
              {data.map((ele, i) => {
                return (
                  <tr key={i}>
                    <td>{ele.descriptionHeading}</td>
                    <td>{ele.description}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )
    }
  }


  render() {
    if (this.props.showPopup === null) {
      this.setState({
        errors: '',
        directions: null,
        postcodeStart: null
      })
      return <div className="button-center">Click on a Pin <PlainPin size = {12}/> for Directions</div>
    } else {
      this.hook()
      return (
        <div>
          {this.directions()}
        </div>

      )
    }
  }
}
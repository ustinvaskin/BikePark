import React from 'react'
import axios from 'axios'
import PlainPin from './PlainPin'

// First Page.

class Input extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      postcode: null,
      errors: '',
      export: {
        longitude: null,
        latitude: null
      }
    }
  }

  // on handle change (input into the input) if passes value to postcode without any spaces


  handleChange(e) {
    const postcode = (e.target.value).replace(/\s/g, '')
    this.setState({
      postcode: postcode,
      errors: ''
    })
    console.log(this.state.postcode)
  }

  // on submit.  We get the logitude and latitude from the postcode from an api.
  // This is then passed into the map via url

  handleSubmit(e) {
    e.preventDefault()
    axios.get(`https://api.postcodes.io/postcodes/${this.state.postcode}`)
      .then(resp => {
        console.log(resp)
        this.setState({
          export: {
            longitude: resp.data.result.longitude,
            latitude: resp.data.result.latitude
          }
        })
        this.props.history.push(`/map/${this.state.export.latitude}/${this.state.export.longitude}`)
      })
      .catch(() => this.setState({ errors: 'Invalid Postcode' }))

  }


  render() {
    console.log(this.state.export)
    return (

      <section className="hero is-fullheight">
        <div className="hero-body">
          <div className="container">
            <div className="title"><h1>Park My Bike <PlainPin size={36} /></h1></div>
            <div className="subtitle">Submit destination postcode</div>
            <form className="form" onSubmit={(e) => this.handleSubmit(e)}>
              <div className="field">
                {/* <label htmlFor="" className="label">Postcode</label> */}
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
        </div>
      </section>

    )
  }
}
export default Input




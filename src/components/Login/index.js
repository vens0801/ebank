import {Component} from 'react'
import {Redirect} from 'react-router-dom'
import Cookies from 'js-cookie'

import './index.css'

class Login extends Component {
  state = {
    userId: '',
    pin: '',
    errorMsg: '',
  }

  onChangeUserId = event => {
    this.setState({
      userId: event.target.value,
    })
  }

  onChangePin = event => {
    this.setState({
      pin: event.target.value,
    })
  }

  onSubmitForm = event => {
    event.preventDefault()
    this.postCredentials()
  }

  postCredentials = async () => {
    const {userId, pin} = this.state

    const userDetails = {
      user_id: userId,
      pin,
    }

    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }

    const response = await fetch('https://apis.ccbp.in/ebank/login', options)
    const data = await response.json()
    console.log(data)

    if (response.ok === true) {
      this.onSuccessLogin(data.jwt_token)
    }
    if (response.status === 401) {
      this.onFailureLogin(data.error_msg)
    }
  }

  onSuccessLogin = jwtToken => {
    const {history} = this.props
    Cookies.set('jwt_token', jwtToken, {expires: 1})
    history.replace('/')
  }

  onFailureLogin = msg => {
    const errorMsg = `*${msg}`

    this.setState({
      errorMsg,
    })
  }

  render() {
    const {userId, pin, errorMsg} = this.state
    const jwtToken = Cookies.get('jwt_token')

    if (jwtToken !== undefined) {
      return <Redirect to="/" />
    }

    return (
      <div className="bg-container">
        <div className="login-container">
          <img
            src="https://assets.ccbp.in/frontend/react-js/ebank-login-img.png"
            className="login-img"
            alt="website login"
          />
          <form className="form" onSubmit={this.onSubmitForm}>
            <h1 className="heading">Welcome Back!</h1>
            <div className="input-container">
              <label htmlFor="userId">User ID</label>
              <input
                type="text"
                value={userId}
                className="inputEl"
                onChange={this.onChangeUserId}
                placeholder="Enter User ID"
                id="userId"
              />
            </div>
            <div className="input-container">
              <label htmlFor="pin">PIN</label>
              <input
                type="password"
                value={pin}
                className="inputEl"
                onChange={this.onChangePin}
                placeholder="Enter PIN"
                id="pin"
              />
            </div>
            <button type="submit" className="submit-btn">
              Login
            </button>
            <p className="error-msg">{errorMsg}</p>
          </form>
        </div>
      </div>
    )
  }
}

export default Login

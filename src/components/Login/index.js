import {Redirect} from 'react-router-dom'
import Cookies from 'js-cookie'
import {Component} from 'react'

import './index.css'

class Login extends Component {
  state = {username: '', password: '', showErr: false, errMsg: ''}

  onChangeUserName = event => {
    this.setState({username: event.target.value})
  }

  onChangePassword = event => {
    this.setState({password: event.target.value})
  }

  submitLoginForm = async event => {
    event.preventDefault()
    const {password, username} = this.state
    const userDetails = {username, password}
    const options = {
      method: 'POST',
      header: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userDetails),
    }

    const response = await fetch('https://apis.ccbp.in/login', options)
    const data = await response.json()
    console.log(data)

    if (response.ok === true) {
      const {history} = this.props
      Cookies.set('jwt_token', data.jwt_token, {expires: 30})
      this.setState({showErr: false, username: '', password: ''})
      history.replace('/')
    } else {
      this.setState({showErr: true, errMsg: data.error_msg})
    }
  }

  loginForm = () => {
    const {username, password, showErr, errMsg} = this.state
    const token = Cookies.get('jwt_token')
    if (token !== undefined) {
      return <Redirect to="/" />
    }

    return (
      <div className="login-form-logo-con">
        <img
          className="login-site-logo"
          src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
          alt=" website logo"
        />
        <form className="login-form" onSubmit={this.submitLoginForm}>
          <label htmlFor="name" className="labels">
            USERNAME
          </label>
          <br />
          <input
            type="text"
            placeholder="Username"
            className="inputs"
            value={username}
            id="name"
            onChange={this.onChangeUserName}
          />

          <label htmlFor="password" className="labels">
            PASSWORD
          </label>
          <br />
          <input
            type="password"
            placeholder="Password"
            className="inputs"
            value={password}
            id="password"
            onChange={this.onChangePassword}
          />
          <button type="submit" className="login-btn">
            Login
          </button>
          {showErr && <p className="err-msg">{`*${errMsg}`}</p>}
        </form>
      </div>
    )
  }

  render() {
    return <div className="login-container">{this.loginForm()}</div>
  }
}
export default Login

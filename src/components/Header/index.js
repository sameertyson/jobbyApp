import {Link, withRouter} from 'react-router-dom'
import Cookies from 'js-cookie'
import {Component} from 'react'

import './index.css'

class Header extends Component {
  onClickLogout = () => {
    const {history} = this.props
    console.log(history)
    Cookies.remove('jwt_token')
    history.replace('/login')
  }

  render() {
    return (
      <nav className="nav-container">
        <Link to="/" className="link">
          <img
            className="nav-logo"
            src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
            alt="website logo"
          />
        </Link>
        <ul className="menu-items-con">
          <li>
            <Link to="/" className="link">
              Home
            </Link>
          </li>
          <li>
            <Link to="/jobs" className="link">
              Jobs
            </Link>
          </li>
        </ul>
        <li>
          <button
            type="button"
            className="log-out-btn"
            onClick={this.onClickLogout}
          >
            Logout
          </button>
        </li>
      </nav>
    )
  }
}
export default withRouter(Header)

import React from 'react';
import { NavLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import '../css/navblock.css';
import ChangePassword from './ChangePassword';


class NavBlock extends React.Component {
  // eslint-disable-next-line class-methods-use-this
  signOut() {
    localStorage.removeItem('sessionUserToken');
    localStorage.removeItem('sessionUserId');
  }

  render() {
    const { sessionUser } = this.props;
    let createUser = '';
    let reports = '';
    if (sessionUser.isAdmin) {
      createUser = (
        <NavLink className="link" to="/create-user">
          <span className="icon fa fa-user-plus" />
          create user
        </NavLink>
      );

      reports = (
        <NavLink className="link" to="/reports">
          <span className="icon fa fa-bug" />
          reports
        </NavLink>
      );
    }
    return (
      <div id="navBlock">
        <span id="siteLogo">ignite</span>
        <div className="links">
          {createUser}
          {reports}
          <NavLink
            className="link"
            to="/feeds"
            isActive={(match, location) => {
              if (!match) {
                if (['', '/'].indexOf(location.pathname.toLowerCase()) !== -1) {
                  return true;
                }
                return false;
              }
              return true;
            }}
          >
            <span className="icon fas fa-layer-group" />
            feeds
          </NavLink>
          <NavLink className="link" to="/profile">
            <span className="icon fa fa-user-circle" />
            profile
          </NavLink>
          <NavLink className="link" to="/signin" exact onClick={this.signOut}>
            <span className="icon fa fa-sign-out-alt" />
            sign out
          </NavLink>
        </div>
        <hr />
        <div id="accountPreference">
          <span className="label"> change password</span>
          <ChangePassword {...this.props} />
        </div>
      </div>
    );
  }
}

NavBlock.propTypes = {
  sessionUser: PropTypes.object.isRequired,
};

export default NavBlock;

/* eslint-disable react/no-unused-state */
import PropTypes from 'prop-types';
import React from 'react';
import { NavLink, Route, Switch } from 'react-router-dom';
import '../css/feed.css';
import '../css/userprofile.css';
import sample from '../images/coverimage.jpg';
import lib from '../js/lib';
import UserArticles from './UserArticles';
import UserGifs from './UserGifs';
import UserDetails from './UserDetails';

class UserProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      profileLoading: true,
      profileView: 'articles',
    };

    this._isMounted = false;
    this.parallaxScroll = this.parallaxScroll.bind(this);
    this.mountProfileView = this.mountProfileView.bind(this);
    this.fetchRequest = this.props.fetchRequest;
  }

  componentDidMount() {
    this._isMounted = true;
    this.props.pageSwitch('profile');
    this.setState(() => ({
      profileLoading: false,
    }));
    window.addEventListener('scroll', this.parallaxScroll);
  }

  componentWillUnmount() {
    this._isMounted = false;
    window.removeEventListener('scroll', this.parallaxScroll);
  }

  // eslint-disable-next-line class-methods-use-this
  parallaxScroll() {
    const $ = (q) => (document.querySelector(q));
    const image = $('#coverImage img');
    const container = $('#coverImage');
    const containerHeight = container.offsetHeight;
    const containerTop = lib.getCordinates(container).top;
    let containerPtop = container.offsetTop;
    const containerBottom = containerTop + containerHeight;
    if (containerTop <= window.innerHeight && containerBottom >= 0) {
      containerPtop = containerPtop > window.innerHeight ? window.innerHeight : containerPtop;
      // v the amount of distance the parallax bk have moved (in percentage)
      // eslint-disable-next-line max-len
      const displacement = ((containerTop - containerPtop) / (containerPtop + containerHeight)) * 100;
      const relativeDisplacement = (displacement / 100) * (image.offsetHeight - containerHeight);
      image.style.transform = `translate3d(0px, ${relativeDisplacement}px, 0px)`;
    }
  }

  mountProfileView(profileView) {
    this.setState(() => ({ profileView }));
  }

  render() {
    if (this.state.profileLoading) {
      return (<div><span className="fa fa-spinner fa-spin loader" /></div>);
    }

    const user = this.props.sessionUser;
    const deptStruc = this.props.companyDeptStruc;
    const departmentText = deptStruc[user.department].name;
    let jobRoleText = '';
    const userDept = deptStruc[user.department].jobRoles;
    for (let i = 0; i < userDept.length; i += 1) {
      if (userDept[i].id === user.jobRole) {
        jobRoleText = userDept[i].title;
        break;
      }
    }

    return (
      <div>
        <div className="top">
          <div id="coverImage">
            <img src={sample} alt="cover" />
          </div>
          <div id="passport">
            <img src={user.passportUrl} alt="m" />
          </div>
          <div id="userPreviewInfo">
            <h2 className="user-name">{user.firstName} {user.lastName}</h2>
            <p className="info">#{user.id}</p>
            <p className="info">{jobRoleText} in {departmentText}</p>
            <p className="info" title={lib.getRelativeTime(user.hiredOn, false)}>hired {lib.getRelativeTime(user.hiredOn)}</p>
          </div>
          <div id="profileHeader">
            <NavLink to="/profile/details" className="link">
              <span>Details</span>
              <div />
            </NavLink>
            <NavLink
              className="link"
              to="/profile/articles"
              isActive={(match, location) => {
                if (!match) {
                  if (['/profile', '/profile/'].indexOf(location.pathname.toLowerCase()) !== -1) {
                    return true;
                  }
                  return false;
                }
                return true;
              }}
            >
              <span>articles</span>
              <div />
            </NavLink>
            <NavLink to="/profile/gifs" className="link">
              <span>gifs</span>
              <div />
            </NavLink>
            <div className="link ">
              <span>team</span>
              <div />
            </div>
          </div>
        </div>
        <div>
          <Switch>
            <Route
              path="/profile/details"
              render={() => (
                <UserDetails
                  {...this.props}
                  sessionUser={{ ...this.props.sessionUser, departmentText, jobRoleText }}

                />
              )}
            />

            <Route
              path="/profile/gifs"
              render={(props) => (
                <UserGifs
                  {...this.props}
                  {...props}
                  mountProfileView={this.mountProfileView}
                />
              )}
            />
            <Route
              path="/profile/articles"
              render={(props) => (
                <UserArticles
                  {...this.props}
                  {...props}
                  mountProfileView={this.mountProfileView}
                />
              )}
            />
            <Route
              path="/profile"
              exact
              render={(props) => (
                <UserArticles
                  {...this.props}
                  {...props}
                  mountProfileView={this.mountProfileView}
                />
              )}
            />
          </Switch>
        </div>
      </div>
    );
  }
}
UserProfile.propTypes = {
  pageSwitch: PropTypes.func.isRequired,
  getUser: PropTypes.func.isRequired,
  fetchRequest: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  sessionUser: PropTypes.object.isRequired,
  companyDeptStruc: PropTypes.object.isRequired,
};

export default UserProfile;

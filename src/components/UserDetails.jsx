/* eslint-disable react/no-unused-state */
import React from 'react';
import PropTypes from 'prop-types';
import '../css/userdetails.css';
import lib from '../js/lib';

class UserDetails extends React.Component {
  render() {
    const user = this.props.sessionUser;
    return (
      <div id="userDetails">
        <table>
          <tbody>
            <tr>
              <td>id</td>
              <td>{user.id}</td>
            </tr>
            <tr>
              <td>department</td>
              <td>{user.departmentText}</td>
            </tr>
            <tr>
              <td>job</td>
              <td>{user.jobRoleText}</td>
            </tr>
            <tr>
              <td>first name</td>
              <td>{user.firstName}</td>
            </tr>
            <tr>
              <td>last name</td>
              <td>{user.lastName}</td>
            </tr>
            <tr>
              <td>email</td>
              <td>{user.email}</td>
            </tr>
            <tr>
              <td>gender</td>
              <td>{user.gender}</td>
            </tr>
            <tr>
              <td>address</td>
              <td>{user.address}</td>
            </tr>
            <tr>
              <td>hired on</td>
              <td>{lib.getRelativeTime(user.hiredOn, false)}</td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
}
UserDetails.propTypes = {
  sessionUser: PropTypes.object.isRequired,
};

export default UserDetails;

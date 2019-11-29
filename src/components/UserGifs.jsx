/* eslint-disable react/no-unused-state */
import React from 'react';
import PropTypes from 'prop-types';
import '../css/feed.css';
import Post from './Post';
import lib from '../js/lib';

class UserGifs extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      gifs: [],
      loading: true,
    };

    this._isMounted = false;
    this.fetchRequest = this.props.fetchRequest;
    this.onDelete = this.onDelete.bind(this);
  }

  componentDidMount() {
    this._isMounted = true;
    this.props.mountProfileView('gifs');
    this.fetchRequest({
      url: `https://akintomiwa-capstone-backend.herokuapp.com/api/v1/users/${this.props.sessionUser.id}/gifs`,
    }).then((gifs) => {
      if (this._isMounted) {
        this.setState(() => ({ gifs, loading: false }));
      }
    });
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  onDelete(gif) {
    // find gif and update(prep for delete)
    const Gifs = this.state.gifs;
    const gifs = [];

    for (let i = 0; i < Gifs.length; i += 1) {
      if (Gifs[i].id !== gif.id) {
        gifs.push(Gifs[i]);
      }
    }

    this.setState(() => ({
      gifs,
    }));

    lib.popMessage('gif deleted successfully');
  }

  render() {
    if (this.state.loading) {
      return (<div><span className="loader fa fa-spinner fa-spin" /></div>);
    }

    const gifs = [];
    const gifsArr = this.state.gifs;
    if (gifsArr.length === 0) {
      return (
        <div className="empty-profile-tab">
          <span> there are no gifs to show </span>
        </div>
      );
    }
    for (let i = 0; i < gifsArr.length; i += 1) {
      gifs.push(<Post
        {...this.props}
        post={{ ...gifsArr[i], type: 'gif' }}
        key={gifsArr[i].id}
        onDelete={this.onDelete}
      />);
    }

    return (
      <div>{gifs}</div>
    );
  }
}
UserGifs.propTypes = {
  pageSwitch: PropTypes.func.isRequired,
  getUser: PropTypes.func.isRequired,
  fetchRequest: PropTypes.func.isRequired,
  mountProfileView: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  sessionUser: PropTypes.object.isRequired,
};

export default UserGifs;

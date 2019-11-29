import React from 'react';
import { Route, Switch } from 'react-router-dom';
import PropTypes from 'prop-types';
import Reports from './Reports';
import CreateUser from './CreateUser';
import Feed from './Feeds';
import ViewPost from './ViewPost';
import Error from './Error';
import lib from '../js/lib';
import '../css/maincontentblock.css';
import UserProfile from './UserProfile';

class MainContentBlock extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pageComp: '',
      backBtn: false,
    };
    this.pageSwitch = this.pageSwitch.bind(this);
    this.getPost = this.getPost.bind(this);
    this.getCurrentPage = this.getCurrentPage.bind(this);
  }

  getPost(pst) {
    // Get a specific post
    const { fetchRequest } = this.props;

    return new Promise((resolve, reject) => {
      const post = {
        id: pst.type === 'gif' ? pst.gifId : pst.articleId,
        endpoint: pst.type === 'gif' ? 'gifs' : 'articles',
      };
      fetchRequest({
        url: `https://akintomiwa-capstone-backend.herokuapp.com/api/v1/${post.endpoint}/${post.id}`,
      }).then((Post) => {
        resolve(Post);
      }).catch((error) => {
        reject(error);
      });
    });
  }

  getCurrentPage() {
    return this.state.pageComp;
  }

  pageSwitch(page, backBtn = false) {
    this.setState(() => ({
      pageComp: page,
      backBtn: !!backBtn,
    }));
  }

  render() {
    const { pageComp } = this.state;
    const backBtn = this.state.backBtn ? (
      <div className="go-back" onClick={() => { this.props.history.goBack(); }}>
        <div className="fas fa-arrow-left" />
      </div>
    ) : '';
    const userName = `${this.props.sessionUser.firstName} ${this.props.sessionUser.lastName}`;
    return (
      <main id="mainContentBlock" data-comp={pageComp}>
        <div id="contentHeader">
          <h1 className="page">
            {backBtn}
            {lib.sepCamelWord(this.state.pageComp)}
          </h1>
          <div className="user-info">
            <h3 className="name">{userName}</h3>
            <div className="passport">
              <img src={this.props.sessionUser.passportUrl} alt={userName} />
            </div>
          </div>
        </div>
        <div className="container">
          <Switch>
            <Route
              path="/create-user"
              render={(props) => (
                <CreateUser
                  {...this.props}
                  {...props}
                  pageSwitch={this.pageSwitch}
                  getPost={this.getPost}
                  getCurrentPage={this.getCurrentPage}
                />
              )}
            />
            <Route
              path="/reports"
              render={(props) => (
                <Reports
                  {...this.props}
                  {...props}
                  pageSwitch={this.pageSwitch}
                  getPost={this.getPost}
                  getCurrentPage={this.getCurrentPage}
                />
              )}
            />
            <Route
              path="/feeds"
              render={(props) => (
                <Feed
                  {...this.props}
                  {...props}
                  pageSwitch={this.pageSwitch}
                  getPost={this.getPost}
                  getCurrentPage={this.getCurrentPage}
                />
              )}
            />
            <Route
              path="/post/:type/:id"
              render={(props) => (
                <ViewPost
                  {...this.props}
                  {...props}
                  pageSwitch={this.pageSwitch}
                  getPost={this.getPost}
                  getCurrentPage={this.getCurrentPage}
                />
              )}
            />
            <Route
              path="/profile"
              render={(props) => (
                <UserProfile
                  {...this.props}
                  {...props}
                  pageSwitch={this.pageSwitch}
                  getPost={this.getPost}
                  getCurrentPage={this.getCurrentPage}
                />
              )}
            />
            <Route
              path="/"
              exact
              render={(props) => (
                <Feed
                  {...this.props}
                  {...props}
                  pageSwitch={this.pageSwitch}
                  getPost={this.getPost}
                  getCurrentPage={this.getCurrentPage}
                />
              )}
            />
            <Route
              render={(props) => (
                <Error
                  {...this.props}
                  {...props}
                  pageSwitch={this.pageSwitch}
                  getPost={this.getPost}
                  getCurrentPage={this.getCurrentPage}
                />
              )}
            />
          </Switch>
        </div>
      </main>
    );
  }
}

MainContentBlock.propTypes = {
  history: PropTypes.object.isRequired,
  sessionUser: PropTypes.object.isRequired,
  getUser: PropTypes.func.isRequired,
  fetchRequest: PropTypes.func.isRequired,
};
export default MainContentBlock;

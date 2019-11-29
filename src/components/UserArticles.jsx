/* eslint-disable react/no-unused-state */
import React from 'react';
import PropTypes from 'prop-types';
import '../css/feed.css';
import Post from './Post';
import lib from '../js/lib';

class UserArticles extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      articles: [],
      loading: true,
    };

    this._isMounted = false;
    this.fetchRequest = this.props.fetchRequest;
    this.onDelete = this.onDelete.bind(this);
  }

  componentDidMount() {
    this._isMounted = true;
    this.props.mountProfileView('articles');
    this.fetchRequest({
      url: `https://akintomiwa-capstone-backend.herokuapp.com/api/v1/users/${this.props.sessionUser.id}/articles`,
    }).then((articles) => {
      if (this._isMounted) {
        this.setState(() => ({ articles, loading: false }));
      }
    });
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  onDelete(article) {
    // find Article and update(prep for delete)
    const Articles = this.state.articles;
    const articles = [];

    for (let i = 0; i < Articles.length; i += 1) {
      if (Articles[i].id !== article.id) {
        articles.push(Articles[i]);
      }
    }

    this.setState(() => ({
      articles,
    }));

    lib.popMessage('article deleted successfully');
  }

  render() {
    if (this.state.loading) {
      return (<div><span className="loader fa fa-spinner fa-spin" /></div>);
    }

    const articles = [];
    const articlesArr = this.state.articles;
    if (articlesArr.length === 0) {
      return (
        <div className="empty-profile-tab">
          <span> there are no articles to show </span>
        </div>
      );
    }

    for (let i = 0; i < articlesArr.length; i += 1) {
      articles.push(<Post
        {...this.props}
        post={{ ...articlesArr[i], type: 'article' }}
        key={articlesArr[i].id}
        onDelete={this.onDelete}
      />);
    }

    return (
      <div>{articles}</div>
    );
  }
}
UserArticles.propTypes = {
  pageSwitch: PropTypes.func.isRequired,
  getUser: PropTypes.func.isRequired,
  fetchRequest: PropTypes.func.isRequired,
  mountProfileView: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  sessionUser: PropTypes.object.isRequired,
};

export default UserArticles;

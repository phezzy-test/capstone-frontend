import React from 'react';
import PropTypes from 'prop-types';
import Post from './Post';
import '../css/posts.css';


class Posts extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
    };

    this._isMounted = false;
    this.onDelete = this.onDelete.bind(this);
  }

  componentDidMount() {
    this._isMounted = true;
    const registerPosts = (posts) => {
      if (this._isMounted === true) {
        // save posts
        this.props.setPosts(posts);
        this.setState(() => ({ loading: false }));
      }
    };

    // Get all posts
    const { fetchRequest } = this.props;
    fetchRequest({
      url: 'https://akintomiwa-capstone-backend.herokuapp.com/api/v1/feeds',
    }).then((posts) => {
      registerPosts(posts);
    }).catch(() => {
      registerPosts([]);
    });
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  onDelete(post) {
    this.props.deletePost(post);
  }

  render() {
    const posts = [];
    const postsArr = this.props.getPosts();
    for (let i = 0; i < postsArr.length; i += 1) {
      posts.push(<Post
        {...this.props}
        post={postsArr[i]}
        key={postsArr[i].id}
        onDelete={this.onDelete}
      />);
    }

    if (!this.state.loading && posts.length === 0) {
      return (
        <div className="empty-posts-tab">
          <span> there are no posts to show </span>
        </div>
      );
    }

    return (
      <div id="posts" className={this.state.loading ? 'loading' : ''}>
        {posts}
      </div>
    );
  }
}

Posts.propTypes = {
  history: PropTypes.object.isRequired,
  getUser: PropTypes.func.isRequired,
  setPosts: PropTypes.func.isRequired,
  getPosts: PropTypes.func.isRequired,
  deletePost: PropTypes.func.isRequired,
  fetchRequest: PropTypes.func.isRequired,
};


export default Posts;

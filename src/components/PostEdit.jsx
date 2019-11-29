import React from 'react';
import PropTypes from 'prop-types';
import lib from '../js/lib';
import '../css/postedit.css';
import Error from './Error';

class PostEdit extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      submitting: false,
      author: null,
      dateTimeRef: '',
      title: this.props.post.title,
      titleError: false,
      articleError: false,
      article: '',
      isOwner: false,
    };

    this._isMounted = false;
    this.updatePostDateTimeRef = null;
    this.getAuthor = this.getAuthor.bind(this);
    this.regInputsState = this.regInputsState.bind(this);
    this.updatePost = this.updatePost.bind(this);
  }

  componentDidMount() {
    this._isMounted = true;
    this.props.pageSwitch('edit post', true);
    // Update post's reference time
    const { post } = this.props;
    if (post.authorId === this.props.sessionUser.id) {
      this.setState(() => ({
        isOwner: true,
      }));
      this.getAuthor().then(() => {
        this.updatePostDateTimeRef = setInterval(() => {
          if (this._isMounted) {
            this.setState(() => ({
              dateTimeRef: lib.getRelativeTime(post.createdOn),
            }));
          }
        }, 60000); // 60 seconds (1 min)
      });

      // set form article
      if (post.type === 'article') {
        this.setState(() => ({
          article: post.article,
        }));
      }
    }
  }

  componentWillUnmount() {
    this._isMounted = false;
    clearInterval(this.updatePostDateTimeRef);
  }

  getAuthor() {
    return new Promise((resolve) => {
      const { post } = this.props;
      this.props.getUser(`${post.authorId}`).then((user) => {
        if (this._isMounted) {
          this.setState(() => ({
            author: user,
            dateTimeRef: lib.getRelativeTime(post.createdOn),
          }));
          resolve();
        }
      });
    });
  }

  regInputsState(event) {
    // eslint-disable-next-line dot-notation
    const input = event.target.name;
    const { value } = event.target;
    this.setState(() => {
      const n = {};
      n[input] = value;
      return n;
    });
  }

  updatePost() {
    const { state } = this;
    if (!state.submitting) {
      let filled = true;
      if (lib.isEmpty(state.title)) {
        this.setState(() => ({
          titleError: true,
        }));
        filled = false;
      } else {
        this.setState(() => ({
          titleError: false,
        }));
      }

      const { type } = this.props.post;
      const { id } = this.props.post;
      if (type === 'article') {
        if (lib.isEmpty(state.article)) {
          this.setState(() => ({
            articleError: true,
          }));
          filled = false;
        } else {
          this.setState(() => ({
            articleError: false,
          }));
        }
      }

      if (filled) {
        this.setState(() => ({
          submitting: true,
        }));

        // Update
        const body = { title: state.title };
        if (type === 'article') body.article = state.article;

        this.props.fetchRequest({
          url: `https://akintomiwa-capstone-backend.herokuapp.com/api/v1/${type}s/${id}`,
          method: 'patch',
          body: JSON.stringify(body),
          headers: {
            'Content-Type': 'application/json',
          },
        }).then(() => {
          if (this._isMounted) {
            lib.popMessage('post updated successfully');
            const { history } = this.props;
            if (history.length > 2) {
              history.goBack();
            } else {
              history.push('/feed');
            }
          }
        }).catch(() => {
          lib.popMessage('there was an error proccessing your request, please try again');
        });
      } else {
        lib.popMessage('please complete the form before submitting');
      }
    }
  }

  render() {
    if (!this.state.isOwner) {
      return (<Error {...this.props} />);
    }

    const { post } = this.props;
    const { author } = this.state;
    if (author !== null) {
      const content = post.type === 'gif'
        ? <img className="item" src={post.url} alt="" />
        : (
          <textarea
            className={`form-element  ${this.state.articleError ? 'Error' : ''}`}
            name="article"
            value={this.state.article}
            onChange={this.regInputsState}
          />
        );

      return (
        <div id="postEdit">
          <div className="post" id={post.id}>
            <div onClick={this.viewPost}>
              <div className="head">
                <div className="user-image">
                  <a href="/">
                    <img
                      src={author.passportUrl}
                      alt={`${author.firstName} ${author.lastName}`}
                    />
                  </a>
                </div>
                <div>
                  <a
                    href="/"
                    className="user-name"
                    title=""
                  >{`${author.firstName} ${author.lastName}`}
                  </a>
                  <p
                    className="date-time"
                    data-timestamp={post.createdOn}
                    title={lib.getRelativeTime(post.createdOn, false)}
                  >{this.state.dateTimeRef}
                  </p>
                </div>
              </div>
              <div className="body">
                <input
                  className={`title form-element ${this.state.titleError ? 'Error' : ''}`}
                  name="title"
                  value={this.state.title}
                  placeholder="title"
                  onChange={this.regInputsState}
                />
                <div className="content">
                  {content}
                </div>
              </div>
            </div>
          </div>
          <button type="submit" className={`btn btn-default ${this.state.submitting ? 'disabled' : ''}`} onClick={this.updatePost}>
            <span className={`icon ${this.state.submitting ? 'fa fa-spinner fa-spin' : 'fas fa-save'}`} />
            save
          </button>
        </div>
      );
    }
    return (<div><span className="fa fa-spinner fa-spin loader" /></div>);
  }
}

PostEdit.propTypes = {
  post: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  sessionUser: PropTypes.object.isRequired,
  getUser: PropTypes.func.isRequired,
  pageSwitch: PropTypes.func.isRequired,
  fetchRequest: PropTypes.func.isRequired,
};

export default PostEdit;

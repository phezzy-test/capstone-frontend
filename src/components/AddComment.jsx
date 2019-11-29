import React from 'react';
import PropTypes from 'prop-types';
import lib from '../js/lib';
import '../css/addcomment.css';


const defaultState = {
  comment: '',
  isfocused: false,
  submitting: false,
};

class AddComment extends React.Component {
  constructor(props) {
    super(props);
    this.state = defaultState;

    this.onCommentInput = this.onCommentInput.bind(this);
    this.onFocus = this.onFocus.bind(this);
    this.onFocus = this.onFocus.bind(this);
    this.onBlur = this.onBlur.bind(this);
    this.submitComment = this.submitComment.bind(this);
  }

  onCommentInput(event) {
    const { value } = event.target;
    this.setState(() => ({ comment: value }));
  }

  onFocus() {
    this.setState(() => ({
      isfocused: true,
    }));
  }

  onBlur() {
    this.setState(() => ({
      isfocused: false,
    }));
  }

  submitComment() {
    if (!lib.isEmpty(this.state.comment)) {
      this.setState(() => ({ submitting: true }));
      const { post } = this.props;
      const { fetchRequest } = this.props;
      const path = post.type === 'gif' ? 'gifs' : 'articles';

      fetchRequest({
        url: `https://akintomiwa-capstone-backend.herokuapp.com/api/v1/${path}/${post.id}/comment`,
        method: 'POST',
        body: `{
          "comment":"${this.state.comment}"
        }`,
        headers: {
          'Content-Type': 'application/json',
        },
      }).then((response) => {
        this.setState(() => (defaultState));

        if (this.props.post.comments) {
          this.props.registerComment({
            authorId: this.props.sessionUser.id,
            comment: response.comment,
            commentId: response.commentId,
            createdOn: response.createdOn,
          });
        }
        lib.popMessage('Comment created successfully');
      }).catch((error) => {
        if (error.status === 404) {
          this.props.history.push('/');
          lib.popMessage('Post not found!');
        } else {
          lib.popMessage('we were unable create your comment please try again');
        }
      })
        .finally(() => {
          this.setState(() => ({ submitting: false }));
        });
    }
  }


  render() {
    return (
      <div className={`add-comment ${this.state.submitting ? 'disabled' : ''}`}>
        <div className="user-image">
          <a href="/">
            <img
              src={this.props.sessionUser.passportUrl}
              alt={`${this.props.sessionUser.firstName} ${this.props.sessionUser.lastName}`}
            />
          </a>
        </div>
        <div className={`comment-input ${this.state.isfocused ? 'focused' : ''}`}>
          <input
            type="text"
            className="comment form-element"
            placeholder="input comment here"
            value={this.state.comment}
            onChange={this.onCommentInput}
            onFocus={this.onFocus}
            onBlur={this.onBlur}
          />
          <span className={`fas ${this.state.submitting ? 'fa-spinner fa-spin' : 'fa-paper-plane'} icon submit-comment`} onClick={this.submitComment} />
        </div>
      </div>
    );
  }
}

AddComment.propTypes = {
  post: PropTypes.object.isRequired,
  sessionUser: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  fetchRequest: PropTypes.func.isRequired,
  registerComment: PropTypes.func.isRequired,
};

export default AddComment;

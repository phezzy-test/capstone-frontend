import PropTypes from 'prop-types';
import React from 'react';
import '../css/post.css';
import lib from '../js/lib';
import AddComment from './AddComment';
import Comment from './Comment';
import MoreActions from './PostMoreAction';
import ReportContent from './ReportContent';

class Post extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      post: {
        ...this.props.post,
        author: null,
      },
      dateTimeRef: '',
      showMoreActions: false,
      promptDelete: false,
      deleting: false,
      showReportDialog: false,
      reportFocused: false,
    };

    this._isMounted = false;
    this.updatePostDateTimeRef = null;
    this.getAuthor = this.getAuthor.bind(this);
    this.viewPost = this.viewPost.bind(this);
    this.registerComment = this.registerComment.bind(this);
    this.showMoreActions = this.showMoreActions.bind(this);
    this.hideMoreActions = this.hideMoreActions.bind(this);
    this.promptDelete = this.promptDelete.bind(this);
    this.removeDeleteDialog = this.removeDeleteDialog.bind(this);
    this.deletePost = this.deletePost.bind(this);
    this.showReportDialog = this.showReportDialog.bind(this);
    this.hideReportDialog = this.hideReportDialog.bind(this);
    this.focusForReport = this.focusForReport.bind(this);
  }

  componentDidMount() {
    this._isMounted = true;
    // Update post's reference time
    if (this.props.preview === true) {
      this.props.pageSwitch('post', true);
    }

    this.getAuthor().then(() => {
      this.updatePostDateTimeRef = setInterval(() => {
        if (this._isMounted) {
          this.setState((prevState) => ({
            dateTimeRef: lib.getRelativeTime(prevState.post.createdOn),
          }));
        }
      }, 60000); // 60 seconds (1 min)

      // unfocus new post
      if (this.state.post.isNew && this.state.post.isNew === true) {
        setTimeout(() => {
          if (this._isMounted) {
            this.setState((prevState) => ({
              post: {
                ...prevState.post,
                isNew: false,
              },
            }));
          }
        }, 5000);
      }
    });
  }

  componentWillUnmount() {
    this._isMounted = false;
    clearInterval(this.updatePostDateTimeRef);
  }

  getAuthor() {
    return new Promise((resolve) => {
      this.props.getUser(`${this.state.post.authorId}`).then((user) => {
        if (this._isMounted) {
          this.setState((prevState) => ({
            post: {
              ...prevState.post,
              author: user,
            },
            dateTimeRef: lib.getRelativeTime(prevState.post.createdOn),
          }));
          resolve();
        }
      });
    });
  }

  registerComment(comment) {
    this.setState((prevState) => ({
      post: {
        ...prevState.post,
        comments: [
          ...prevState.post.comments,
          comment,
        ],
      },
    }));
  }

  viewPost() {
    const { getCurrentPage } = this.props;
    const { post } = this.state;
    if (getCurrentPage() !== 'post') this.props.history.push(`/post/${post.type}/${post.id}`);
  }

  showMoreActions(event) {
    event.stopPropagation();
    this.setState(() => ({
      showMoreActions: true,
    }));
  }

  hideMoreActions() {
    this.setState(() => ({
      showMoreActions: false,
    }));
  }

  promptDelete() {
    this.setState(() => ({
      promptDelete: true,
    }));
  }

  removeDeleteDialog() {
    this.setState(() => ({
      promptDelete: false,
    }));
  }

  deletePost() {
    const { post } = this.state;
    if (!this.state.deleting) {
      this.setState(() => ({
        deleting: true,
      }));
      const { fetchRequest } = this.props;

      const deletePost = (delay) => {
        setTimeout(() => {
          if (this._isMounted) {
            this.props.onDelete(post);
          }
        }, delay);
      };

      const prepDelete = () => {
        this.setState((prevState) => ({
          post: {
            ...prevState.post,
            willDelete: true,
          },
        }));
      };

      fetchRequest({
        url: `https://akintomiwa-capstone-backend.herokuapp.com/api/v1/${post.type}s/${post.id}`,
        method: 'delete',
      }).then(() => {
        let delay = 0;
        if (!this.props.preview) {
          delay = 500; // <== css animation time
          prepDelete();
        }
        deletePost(delay);
      }).catch(() => {
        lib.popMessage("sorry, we couldn't comploete your request pleas try again");
      });
    }
  }

  showReportDialog() {
    this.setState(() => ({
      showReportDialog: true,
    }));
  }

  hideReportDialog() {
    this.setState(() => ({
      showReportDialog: false,
      reportFocused: false,
    }));
  }

  focusForReport() {
    this.setState(() => ({
      reportFocused: true,
    }));
  }

  render() {
    const currentPage = this.props.getCurrentPage();

    let comments = null;
    if (currentPage === 'post') {
      const commentsArr = this.state.post.comments;
      comments = [];

      for (let i = 0; i < commentsArr.length; i += 1) {
        comments.push(<Comment
          {...this.props}
          comment={commentsArr[i]}
          key={commentsArr[i].commentId}
        />);
      }
    } else {
      comments = (
        <button type="button" className="view-comment" title="view comments">
          <span className="far fa-comment-dots icon" />
          comments
        </button>
      );
    }
    const { post } = this.state;
    if (post.author !== null) {
      const { state } = this;
      const content = post.type === 'gif'
        ? <img className="item" src={post.url} alt={post.title} />
        : <div className="item">{post.article}</div>;

      const deleteDialog = state.promptDelete ? (
        <div className="prompt">
          <div className="prompt-bk" />
          <div className="prompt-fk">
            <p>are you sure you want to delete this post?</p>
            <div className="actions">
              <button type="submit" className="btn btn-danger" onClick={this.deletePost}>yes</button>
              <button type="submit" className="btn btn-negative" onClick={this.removeDeleteDialog}>no</button>
            </div>
          </div>
        </div>
      ) : '';

      const reportDialog = state.showReportDialog
        ? (
          <ReportContent
            {...this.props}
            content={this.props.post}
            hideReportDialog={this.hideReportDialog}
          />
        ) : '';

      const isNew = post.isNew && post.isNew === true ? ' new' : '';
      const view = this.props.preview ? ' view' : '';
      const remove = post.willDelete ? ' remove' : '';
      const deleting = this.state.deleting ? ' deleting' : '';
      const reportFocused = this.state.reportFocused ? ' report-focused' : '';
      return (
        <div className={`post${isNew}${view}${remove}${deleting}${reportFocused}`}>
          <div onClick={this.viewPost}>
            <div className="head">
              <div className="user-image">
                <a href="/">
                  <img
                    src={post.author.passportUrl}
                    alt={`${post.author.firstName} ${post.author.lastName}`}
                  />
                </a>
              </div>
              <div>
                <a
                  href="/"
                  className="user-name"
                  title=""
                >{`${post.author.firstName} ${post.author.lastName}`}
                </a>
                <p
                  className="date-time"
                  data-timestamp={post.createdOn}
                  title={lib.getRelativeTime(post.createdOn, false)}
                >{this.state.dateTimeRef}
                </p>
              </div>
              <button type="button" className="more-action" onClick={this.showMoreActions}>
                <span>•</span>
                <span>•</span>
                <span>•</span>
              </button>
              <MoreActions
                {...this.props}
                showMoreActions={this.state.showMoreActions}
                hideMoreActions={this.hideMoreActions}
                promptDelete={this.promptDelete}
                showReportDialog={this.showReportDialog}
                focusForReport={this.focusForReport}
              />
            </div>
            <div className="body">
              <div className="title">{post.title}</div>
              <div className="content">
                {content}
              </div>
            </div>
            {comments}
          </div>
          <AddComment {...this.props} registerComment={this.registerComment} />
          {deleteDialog}
          {reportDialog}
        </div>
      );
    }
    return (<div />);
  }
}

Post.propTypes = {
  preview: PropTypes.bool,
  post: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  getUser: PropTypes.func.isRequired,
  getCurrentPage: PropTypes.func.isRequired,
  pageSwitch: PropTypes.func.isRequired,
  fetchRequest: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};
Post.defaultProps = {
  preview: false,
};

export default Post;

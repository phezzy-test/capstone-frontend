import React from 'react';
import PropTypes from 'prop-types';
import lib from '../js/lib';
import MoreAction from './CommentMoreAction';
import '../css/comment.css';
import ReportContent from './ReportContent';

class Comment extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      comment: {
        ...props.comment,
        author: false,
      },
      dateTimeRef: lib.getRelativeTime(props.comment.createdOn),
      showMoreActions: false,
      reportFocused: false,
      showReportDialog: false,

    };
    this._isMounted = false;
    this.moreActionEl = null;
    this.updateCommentDatetimeRef = null;
    this.showMoreActions = this.showMoreActions.bind(this);
    this.hideMoreActions = this.hideMoreActions.bind(this);
    this.focusForReport = this.focusForReport.bind(this);
    this.showReportDialog = this.showReportDialog.bind(this);
    this.showReportDialog = this.showReportDialog.bind(this);
    this.hideReportDialog = this.hideReportDialog.bind(this);
  }

  componentDidMount() {
    this._isMounted = true;

    // Get comment author
    this.props.getUser(`${this.state.comment.authorId}`).then((user) => {
      if (this._isMounted) {
        this.setState((prevState) => ({
          comment: {
            ...prevState.comment,
            author: user,
          },
        }));
        // Update comments's reference time
        this.updateCommentDatetimeRef = setInterval(() => {
          if (this._isMounted) {
            this.setState((prevState) => ({
              dateTimeRef: lib.getRelativeTime(prevState.comment.createdOn),
            }));
          }
        }, 60000); // 60 seconds (1 min)
      }
    });
  }

  componentWillUnmount() {
    this._isMounted = false;
    clearInterval(this.updateCommentDatetimeRef);
  }

  showMoreActions() {
    this.setState(() => ({
      showMoreActions: true,
    }));
  }

  hideMoreActions() {
    this.setState(() => ({
      showMoreActions: false,
    }));
  }

  focusForReport() {
    this.setState(() => ({
      reportFocused: true,
    }));
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

  render() {
    const { comment } = this.state;
    const reportFocused = this.state.reportFocused ? ' report-focused' : '';
    const reportDialog = this.state.showReportDialog
      ? (
        <ReportContent
          {...this.props}
          content={{ ...comment, type: 'comment' }}
          hideReportDialog={this.hideReportDialog}
        />
      ) : '';
    if (comment.author !== false) {
      return (
        <div className={`post-comment${reportFocused}`} id={comment.commentId}>
          <div>
            <div className="user-image">
              <a href="/">
                <img
                  src={comment.author.passportUrl}
                  alt={`${comment.author.firstName} ${comment.author.lastName}`}
                />
              </a>
            </div>
            <div className="comment-details-container">
              <div className="comment-details">
                <div>
                  <span className="author-name">{`${comment.author.firstName} ${comment.author.lastName}`}</span>
                  <span className="content">{comment.comment}</span>
                </div>
                <span className="more-action" onClick={this.showMoreActions} ref={(el) => { this.moreActionEl = el; }}>
                  <span>•</span>
                  <span>•</span>
                  <span>•</span>
                </span>
                <MoreAction
                  {...this.props}
                  comment={comment}
                  showMoreActions={this.state.showMoreActions}
                  hideMoreActions={this.hideMoreActions}
                  focusForReport={this.focusForReport}
                  showReportDialog={this.showReportDialog}
                  moreActionEl={this.moreActionEl}
                />
              </div>
            </div>
          </div>
          <div>
            <div>
              <span title={lib.getRelativeTime(comment.createdOn, false)}>
                {this.state.dateTimeRef}
              </span>
            </div>
          </div>
          {reportDialog}
        </div>
      );
    }
    return (
      <div />
    );
  }
}

Comment.propTypes = {
  comment: PropTypes.object.isRequired,
  getUser: PropTypes.func.isRequired,
};
export default Comment;

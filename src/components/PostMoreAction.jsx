import React from 'react';
import PropTypes from 'prop-types';

class MoreActions extends React.Component {
  constructor(props) {
    super(props);
    this.moreActions = null;
    this.editPost = this.editPost.bind(this);
    this.focusMoreActions = this.focusMoreActions.bind(this);
    this.blurMoreActions = this.blurMoreActions.bind(this);
    this.promptDelete = this.promptDelete.bind(this);
    this.revealReportDialog = this.revealReportDialog.bind(this);
  }

  componentDidMount() {
    if (this.props.showMoreActions) {
      this.moreActions.focus();
    }
  }

  editPost(event) {
    event.stopPropagation();
    const { post } = this.props;
    this.props.history.push(`/post/${post.type}/${post.id}/edit`);
  }

  // eslint-disable-next-line class-methods-use-this
  focusMoreActions(moreActions) {
    this.moreActions = moreActions;
    if (moreActions) moreActions.focus();
  }

  blurMoreActions(event) {
    event.target.blur();
    this.props.hideMoreActions();
  }

  promptDelete(event) {
    event.stopPropagation();
    this.props.promptDelete();
    this.moreActions.blur();
    this.props.hideMoreActions();
  }

  revealReportDialog(event) {
    event.stopPropagation();
    this.moreActions.blur();
    this.props.focusForReport();
    this.props.showReportDialog();
  }

  render() {
    const { showMoreActions } = this.props;
    if (!showMoreActions) {
      return (<div />);
    }

    let editPost = '';
    let deletePost = '';
    if (this.props.post.authorId === this.props.sessionUser.id) {
      editPost = (
        <span className="action" onClick={this.editPost}>
          <span className="fas fa-pencil-alt icon" />
          edit
        </span>
      );

      deletePost = (
        <span className="action" onClick={this.promptDelete}>
          <span className="fa fa-trash icon" />
          delete
        </span>
      );
    }

    return (
      <button
        type="button"
        className="more-actions-dialog"
        ref={this.focusMoreActions}
        onBlur={this.blurMoreActions}
      >
        {editPost}
        <span className="action" onClick={this.revealReportDialog}>
          <span className="fas fa-flag-checkered icon" />
          report
        </span>
        {deletePost}
      </button>
    );
  }
}


MoreActions.propTypes = {
  post: PropTypes.object.isRequired,
  sessionUser: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  showMoreActions: PropTypes.bool.isRequired,
  hideMoreActions: PropTypes.func.isRequired,
  promptDelete: PropTypes.func.isRequired,
  showReportDialog: PropTypes.func.isRequired,
  focusForReport: PropTypes.func.isRequired,
};

export default MoreActions;

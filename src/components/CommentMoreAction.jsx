import React from 'react';
import PropTypes from 'prop-types';
import lib from '../js/lib';

class CommentMoreActions extends React.Component {
  constructor(props) {
    super(props);
    this.moreActions = null;
    this.focusMoreActions = this.focusMoreActions.bind(this);
    this.blurMoreActions = this.blurMoreActions.bind(this);
    this.revealReportDialog = this.revealReportDialog.bind(this);
  }

  componentDidMount() {
    if (this.props.showMoreActions) {
      this.moreActions.focus();
    }
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

  revealReportDialog(event) {
    event.stopPropagation();
    this.moreActions.blur();
    this.props.focusForReport();
    this.props.showReportDialog();
  }

  render() {
    const { showMoreActions } = this.props;
    const { moreActionEl } = this.props;
    if (!showMoreActions || !moreActionEl) {
      return (<div />);
    }

    const cord = lib.getCordinates(moreActionEl);
    const width = moreActionEl.offsetWidth;

    return (
      <button
        type="button"
        className="more-actions-dialog"
        ref={this.focusMoreActions}
        onBlur={this.blurMoreActions}
        style={{ top: `${cord.top}px`, left: `${cord.left + width}px` }}
      >
        <span className="action" onClick={this.revealReportDialog}>
          <span className="fas fa-flag-checkered icon" />
          report
        </span>
      </button>
    );
  }
}


CommentMoreActions.propTypes = {
  moreActionEl: PropTypes.object,
  showMoreActions: PropTypes.bool.isRequired,
  hideMoreActions: PropTypes.func.isRequired,
  showReportDialog: PropTypes.func.isRequired,
  focusForReport: PropTypes.func.isRequired,
};

CommentMoreActions.defaultProps = {
  moreActionEl: false,
};
export default CommentMoreActions;

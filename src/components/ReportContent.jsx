import React from 'react';
import PropTypes from 'prop-types';
import lib from '../js/lib';

const flags = [
  'inappropriate',
  'abusive',
  'bullying',
  'scam',
  'misleading',
];

class ReportContent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      reporting: false,
      flag: 'inappropriate',
      flagError: false,
      reason: '',
      reasonError: false,
    };

    this._isMounted = false;
    this.hideReportDialog = this.hideReportDialog.bind(this);
    this.preventHide = this.preventHide.bind(this);
    this.regInputsState = this.regInputsState.bind(this);
    this.submitReport = this.submitReport.bind(this);
  }

  componentDidMount() {
    this._isMounted = true;
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  // eslint-disable-next-line class-methods-use-this
  preventHide(event) {
    event.stopPropagation();
  }

  hideReportDialog(event) {
    if (event) event.stopPropagation();
    this.props.hideReportDialog();
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

  submitReport() {
    const { state } = this;
    let isValid = true;
    if (flags.indexOf(state.flag) === -1) {
      this.setState(() => ({
        flagError: true,
      }));
      isValid = false;
    } else {
      this.setState(() => ({
        flagError: false,
      }));
    }

    if (lib.isEmpty(state.reason)) {
      this.setState(() => ({
        reasonError: true,
      }));
      isValid = false;
    } else {
      this.setState(() => ({
        reasonError: false,
      }));
    }

    if (isValid && !this.state.reporting) {
      this.setState(() => ({
        reporting: true,
      }));

      const { content } = this.props;
      let url = '';
      if (['gif', 'article'].indexOf(content.type) !== -1) {
        url = `https://akintomiwa-capstone-backend.herokuapp.com/api/v1/${content.type}s/${content.id}/flag`;
      } else {
        // Content is definitely comment
        const { post } = this.props;
        url = `https://akintomiwa-capstone-backend.herokuapp.com/api/v1/${post.type}s/${post.id}/comment/${content.commentId}/flag`;
      }

      this.props.fetchRequest({
        url,
        method: 'post',
        body: `{
          "flag": "${state.flag}",
          "reason": "${state.reason}"
        }`,
        headers: {
          'Content-Type': 'application/json',
        },
      }).then(() => {
        lib.popMessage('report created successfully');
        if (this._isMounted) {
          this.hideReportDialog();
        }
      }).catch(() => {
        if (this._isMounted) {
          this.setState(() => ({
            reporting: false,
          }));
          lib.popMessage('sorry, we were unable to complete your request please try again');
        }
      });
    }
  }

  render() {
    const { content } = this.props;
    const flagError = this.state.flagError ? <p className="error">pick a flag</p> : '';
    const reasonError = this.state.reasonError ? <p className="error">please state why you are flagging this {content.type}</p> : '';
    const reportflags = [];
    flags.forEach((flag) => {
      reportflags.push(<option value={flag} key={flag}>{flag}</option>);
    });

    return (
      <div id="contentReportDialog" onClick={this.hideReportDialog}>
        <div className="container">
          <div className="form content" onClick={this.preventHide}>
            <span className="cancel fas fa-times" onClick={this.hideReportDialog} />
            <h1 className="header">create a report on this {content.type}</h1>

            <div className="field">
              <span className="form-label">flag as</span>
              <select className="form-element" name="flag" value={this.state.flag} onChange={this.regInputsState}>
                {reportflags}
              </select>
              {flagError}
            </div>

            <div className="field">
              <span className="form-label">reason</span>
              <textarea className="form-element" name="reason" value={this.state.reason} onChange={this.regInputsState} />
              {reasonError}
            </div>
            <button type="submit" className={`btn btn-danger${this.state.reporting ? ' disabled' : ''}`} onClick={this.submitReport}>
              <span className="fas fa-flag-checkered icon" />
              submit report
            </button>
          </div>
        </div>
      </div>
    );
  }
}


ReportContent.propTypes = {
  post: PropTypes.object.isRequired,
  content: PropTypes.object.isRequired,
  hideReportDialog: PropTypes.func.isRequired,
  fetchRequest: PropTypes.func.isRequired,
};

export default ReportContent;

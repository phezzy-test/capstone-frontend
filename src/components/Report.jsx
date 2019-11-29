import React from 'react';
import PropTypes from 'prop-types';
import lib from '../js/lib';

class Report extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      report: {
        ...props.report,
      },
      willDelete: false,
      dateTimeRef: '',
      submitting: false,
    };

    this._isMounted = false;
    this.updatePostDateTimeRef = null;
    this.attendTo = this.attendTo.bind(this);
  }

  componentDidMount() {
    this._isMounted = true;
    this.setState((prevState) => ({
      dateTimeRef: lib.getRelativeTime(prevState.report.reportedOn),
    }));
    this.updatePostDateTimeRef = setInterval(() => {
      if (this._isMounted) {
        this.setState((prevState) => ({
          dateTimeRef: lib.getRelativeTime(prevState.report.reportedOn),
        }));
      }
    }, 60000); // 60 seconds (1 min)
  }

  componentWillUnmount() {
    this._isMounted = false;
    clearInterval(this.updatePostDateTimeRef);
  }


  attendTo(action) {
    if (!this.state.submitting) {
      this.setState(() => ({ submitting: true }));

      const deleteReport = () => {
        setTimeout(() => {
          if (this._isMounted) {
            this.props.removeReport(this.state.report.reportId);
          }
        }, 500);
      };

      const prepDelete = () => {
        this.setState(() => ({
          willDelete: true,
        }));
      };

      this.props.fetchRequest({
        url: `https://akintomiwa-capstone-backend.herokuapp.com/api/v1/reports/${this.state.report.reportId}`,
        method: 'patch',
        body: `{
        "action": "${action}"
      }`,
        headers: {
          'Content-Type': 'application/json',
        },
      }).then(() => {
        prepDelete();
        deleteReport();
      });
    }
  }


  render() {
    const { state } = this;
    const { report } = state;
    let reportedPost = '';
    let reportComment = '';
    if (report.contentType === 'comment') {
      const reportedComment = report.comment;
      reportedPost = reportedComment.post;
      reportComment = (
        <div>
          <div className="report-content">
            <div className="head">
              <div className="user-image">
                <a href="/">
                  <img src={reportedComment.author.passportUrl} alt={`${reportedComment.author.firstName} ${reportedComment.author.lastName}`} />
                </a>
              </div>
              <a href="/" className="user-name">{`${reportedComment.author.firstName} ${reportedComment.author.lastName}`}</a>
            </div>
            <div className="">{reportedComment.comment}</div>
          </div>
          <div className="trailer" />
        </div>
      );
    } else {
      reportedPost = report.contentType === 'article'
        ? { ...report.article, type: 'article' }
        : { ...report.gif, type: 'gif' };
    }
    const content = reportedPost.type === 'gif' ? <img className="item" src={reportedPost.imageUrl} alt="" /> : <div className="item">{reportedPost.article}</div>;
    const willDelete = state.willDelete ? 'remove' : '';

    return (
      <div
        className={`report ${report.contentType} ${willDelete}`}
        id={report.id}
        data-type={report.type}
      >
        <div className="head">
          <div className="user-image">
            <a href="man">
              <img src={report.reporter.passportUrl} alt={`${report.reporter.firstName} ${report.reporter.lastName}`} />
            </a>
          </div>
          <div>
            <a href="man" className="user-name">{`${report.reporter.firstName} ${report.reporter.lastName}`}</a>
            <p
              className="date-time"
              data-timestamp={report.reportedOn}
              title={lib.getRelativeTime(report.reportedOn, false)}
            >{state.dateTimeRef}
            </p>
          </div>
          <span className="report-id">{report.reportId}</span>
        </div>

        <div className="body">
          <div className="report-details">
            <div className="detail">
              <div className="info">content</div>
              <div className="value">{report.contentType}</div>
            </div>
            <div className="detail">
              <div className="info">flag</div>
              <div className="value">{report.flag}</div>
            </div>
            <div className="detail">
              <div className="info">reason</div>
              <div className="value">{report.reason}</div>
            </div>
          </div>
          {reportComment}
          <div className="report-content">
            <div className="head">
              <div className="user-image">
                <a href="man">
                  <img src={reportedPost.author.passportUrl} alt={`${reportedPost.author.firstName} ${reportedPost.author.lastName}`} />
                </a>
              </div>
              <a href="man" className="user-name">{`${reportedPost.author.firstName} ${reportedPost.author.lastName}`}</a>
            </div>
            <div className="title">{reportedPost.title}</div>
            <div className="content">
              {content}
            </div>
          </div>
        </div>
        <div className="bottom">
          <button
            type="button"
            className={`action btn btn-danger ${state.submitting ? 'disabled' : ''}`}
            onClick={() => { this.attendTo('delete'); }}
          > delete
          </button>
          <button
            type="button"
            className={`action btn btn-warning ${state.submitting ? 'disabled' : ''}`}
            onClick={() => { this.attendTo('ignore'); }}
          > ignore
          </button>
        </div>
      </div>
    );
  }
}

Report.propTypes = {
  report: PropTypes.object.isRequired,
  fetchRequest: PropTypes.func.isRequired,
  removeReport: PropTypes.func.isRequired,
};

export default Report;

/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/forbid-prop-types */
/* eslint-disable dot-notation */
import React from 'react';
import PropTypes from 'prop-types';
import lib from '../js/lib';
import '../css/signin.css';
import pageBk from '../images/coverimage.jpg';

class SignIn extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      submitting: false,
      isValidForm: true,
      error: 'The email or password you entered is not correct, please try again.',
      email: {
        state: 'empty',
        value: '',
        focused: '',
        invalid: '',
      },
      password: {
        state: 'empty',
        value: '',
        focused: '',
        invalid: '',
      },
    };

    this._isMounted = false;
    this.submitForm = this.submitForm.bind(this);
    this.regFieldInput = this.regFieldInput.bind(this);
    this.blurField = this.blurField.bind(this);
    this.focusField = this.focusField.bind(this);
    this.clickTofocusField = this.clickTofocusField.bind(this);
  }

  componentDidMount() {
    this._isMounted = true;
  }

  componentWillUnmount() {
    this._isMounted = false;
  }


  submitForm() {
    const { submitting } = this.state;
    if (submitting === false) {
      const { email } = this.state;
      const { password } = this.state;
      if (email.state === 'filled' && password.state === 'filled') {
        this.setState(() => ({
          submitting: true,
        }));

        fetch('https://akintomiwa-capstone-backend.herokuapp.com/api/v1/auth/signin', {
          method: 'POST',
          body: JSON.stringify({
            username: email.value,
            password: password.value,
          }),
          headers: {
            'Content-Type': 'application/json',
          },
        }).then((res) => {
          if (res.status === 200) return res.json();
          throw new Error(res.status);
        }).then(({ data: user }) => {
          const { history } = this.props;
          // start user session and redirect to home page
          localStorage.setItem('sessionUserToken', user.token);
          localStorage.setItem('sessionUserId', user.userId);
          history.push('/');
        }).catch(({ message: err }) => {
          const error = parseInt(err, 10);
          if (this._isMounted) {
            if (error === 500) {
              this.setState(() => ({
                isValidForm: false,
                error: 'Oops!, there was a server error, please try again',
              }));
            } else if (error === 400) {
              this.setState(() => ({
                isValidForm: false,
                error: 'The email or password you entered is not correct, please try again.',
              }));
            }
            this.setState(() => ({ submitting: false }));
          }
        });
      } else {
        if (email.state !== 'filled') {
          this.setState((prevState) => ({
            email: { ...prevState.email, invalid: 'invalid' },
          }));
        }

        if (password.state !== 'filled') {
          this.setState((prevState) => ({
            password: { ...prevState.password, invalid: 'invalid' },
          }));
        }

        this.setState(() => ({
          error: 'You need both email and password to sign in',
          isValidForm: false,
        }));
      }
    }
  }

  clickTofocusField(event) {
    const field = event.target.getAttribute('name');
    const fieldFocus = field === 'email' ? this.state.email.focused : this.state.password.focused;
    if (fieldFocus !== 'focused') {
      const heroInput = lib.isDescendant(event.target, '.hero-input');
      heroInput.querySelector('.hero-input-field').focus();
    }
  }

  focusField(event) {
    const field = event.target.getAttribute('name');
    this.setState((prevState) => ((field === 'email') ? {
      email: { ...prevState.email, focused: 'focused' },
    } : {
      password: { ...prevState.password, focused: 'focused' },
    }));
  }

  regFieldInput(event) {
    const field = event.target.getAttribute('name');
    if (field === 'email' || field === 'password') {
      const { value } = event.target;
      const fieldState = lib.isEmpty(value) ? 'empty' : 'filled';
      this.setState(() => ((field === 'email') ? {
        email: {
          state: fieldState,
          focused: 'focused',
          invalid: '',
          value,
        },
      } : {
        password: {
          state: fieldState,
          focused: 'focused',
          invalid: '',
          value,
        },
      }));
    }
  }

  blurField(event) {
    const field = event.target.getAttribute('name');
    this.setState((prevState) => ((field === 'email') ? {
      email: { ...prevState.email, focused: '' },
    } : {
      password: { ...prevState.password, focused: '' },
    }));
  }

  render() {
    return (
      <div id="pageContent" data-page="signin">
        <img id="pageBK" src={pageBk} alt="" />
        <div id="siteLogoHolder">
          <span id="siteLogo">ignite</span>
        </div>
        <div id="contentHolder">
          <div id="signInForm">
            <div id="pageBKcloneHolder">
              <img id="pageBKclone" src={pageBk} alt="" />
            </div>
            <div className="form">
              <h1 className="label">sign in</h1>
              <div id="errorMessage" className={this.state.isValidForm ? 'hide' : 'show'}>
                <span>{this.state.error}</span>
              </div>
              <div
                className={`${this.state.email.state} ${this.state.email.focused} ${this.state.email.invalid} hero-input form-element mandatory`}
                onClick={this.clickTofocusField}
                name="email"
              >
                <p className="hero-input-label">
                  <span>email</span>
                </p>
                <input type="text" name="email" className="hero-input-field" onInput={this.regFieldInput} onBlur={this.blurField} onFocus={this.focusField} />
              </div>

              <div
                className={`${this.state.password.state} ${this.state.password.focused} ${this.state.password.invalid} hero-input form-element mandatory`}
                onClick={this.clickTofocusField}
                name="password"
              >
                <p className="hero-input-label">
                  <span>password</span>
                </p>
                <input type="password" name="password" className="hero-input-field" onInput={this.regFieldInput} onBlur={this.blurField} onFocus={this.focusField} />
              </div>

              <button type="button" id="signInBtn" className={`btn ${this.state.submitting === true ? 'disabled' : ''} `} onClick={this.submitForm}>sign in</button>
            </div>
          </div>
        </div>

      </div>
    );
  }
}
SignIn.propTypes = {
  history: PropTypes.object.isRequired,
};
export default SignIn;

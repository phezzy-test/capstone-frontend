import React from 'react';
import PropTypes from 'prop-types';
import lib from '../js/lib';

const defaultState = {
  submitting: false,
  password: {
    state: 'empty',
    value: '',
    focused: '',
    invalid: '',
  },
  conPassword: {
    state: 'empty',
    value: '',
    focused: '',
    invalid: '',
  },
  newPassword: {
    state: 'empty',
    value: '',
    focused: '',
    invalid: '',
  },
  error: false,
};

class ChangePassword extends React.Component {
  constructor(props) {
    super(props);
    this.state = defaultState;

    this._isMounted = false;
    this.regFieldInput = this.regFieldInput.bind(this);
    this.blurField = this.blurField.bind(this);
    this.focusField = this.focusField.bind(this);
    this.clickTofocusField = this.clickTofocusField.bind(this);
    this.changePassword = this.changePassword.bind(this);
  }

  componentDidMount() {
    this._isMounted = true;
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  clickTofocusField(event) {
    let field = lib.isDescendant(event.target, '.hero-input.form-element');
    if (field) {
      field = field.getAttribute('data-field');
      const fieldFocus = this.state[field].focused;
      if (fieldFocus !== 'focused') {
        const heroInput = lib.isDescendant(event.target, '.hero-input');
        heroInput.querySelector('.hero-input-field').focus();
      }
    }
  }

  focusField(event) {
    const field = event.target.getAttribute('name');
    this.setState((prevState) => {
      const Field = {
        ...prevState[field],
        focused: 'focused',
      };
      const n = {};
      n[field] = Field;
      return n;
    });
  }

  blurField(event) {
    const field = event.target.getAttribute('name');
    this.setState((prevState) => {
      const Field = {
        ...prevState[field],
        focused: '',
      };
      const n = {};
      n[field] = Field;
      return n;
    });
  }

  regFieldInput(event) {
    const field = event.target.getAttribute('name');
    const { value } = event.target;
    const fieldState = lib.isEmpty(value) ? 'empty' : 'filled';
    this.setState(() => {
      const Field = {
        state: fieldState,
        focused: 'focused',
        invalid: '',
        value,
      };
      const n = {};
      n[field] = Field;
      return n;
    });
  }

  changePassword() {
    const { state } = this;
    if (!state.submitting) {
      const { password } = state;
      const { newPassword } = state;
      const { conPassword } = state;
      if (lib.isEmpty(password.value)) {
        this.setState((prevState) => ({
          password: {
            ...prevState.password,
            invalid: 'invalid',
          },
          error: 'you need to input your current password',
        }));
      } else if (newPassword.value.length < 8) {
        this.setState((prevState) => ({
          newPassword: {
            ...prevState.newPassword,
            invalid: 'invalid',
          },
          conPassword: {
            ...prevState.conPassword,
            invalid: 'invalid',
          },
          error: 'password needs to be atleast 8 character long',
        }));
      } else if (newPassword.value !== conPassword.value) {
        this.setState((prevState) => ({
          newPassword: {
            ...prevState.newPassword,
            invalid: 'invalid',
          },
          conPassword: {
            ...prevState.conPassword,
            invalid: 'invalid',
          },
          error: 'the specified passwords do not match',
        }));
      } else {
        // Proceed to change password
        this.setState(() => ({ submitting: true }));

        this.props.fetchRequest({
          url: 'https://akintomiwa-capstone-backend.herokuapp.com/api/v1/auth/password',
          method: 'patch',
          body: `{
            "oldPassword" : "${password.value}",
            "newPassword" : "${newPassword.value}"
          }`,
          headers: {
            'Content-Type': 'application/json',
          },
        }).then((res) => {
          const { token: newToken } = res;
          if (this._isMounted) {
            this.setState(() => defaultState);
          }
          localStorage.setItem('sessionUserToken', newToken);
          lib.popMessage('password changed successfully');
        }).catch((error) => {
          if (this._isMounted) {
            if (error.body === 'Old password incorrect') {
              this.setState((prevState) => ({
                password: {
                  ...prevState.password,
                  invalid: 'invalid',
                },
                error: 'password incorrect',
                submitting: false,
              }));
            } else {
              this.setState(() => ({
                submitting: true,
              }));
              lib.popMessage('opps!, we were unable to complete your request, please try again');
            }
          }
        });
      }
    }
  }

  render() {
    return (
      <div id="changePassForm">
        <p className={`error${this.state.error === false ? ' hide' : ''}`}>{this.state.error}</p>

        <div
          className={`${this.state.password.state} ${this.state.password.focused} ${this.state.password.invalid} hero-input form-element`}
          onClick={this.clickTofocusField}
          data-field="password"
        >
          <p className="hero-input-label">
            <span>password</span>
          </p>
          <input
            type="password"
            name="password"
            className="hero-input-field"
            onChange={this.regFieldInput}
            onBlur={this.blurField}
            onFocus={this.focusField}
            value={this.state.password.value}
          />
        </div>

        <div
          className={`${this.state.newPassword.state} ${this.state.newPassword.focused} ${this.state.newPassword.invalid} hero-input form-element`}
          onClick={this.clickTofocusField}
          data-field="newPassword"

        >
          <p className="hero-input-label">
            <span>new password</span>
          </p>
          <input
            type="password"
            name="newPassword"
            className="hero-input-field"
            onChange={this.regFieldInput}
            onBlur={this.blurField}
            onFocus={this.focusField}
            value={this.state.newPassword.value}
          />
        </div>

        <div
          className={`${this.state.conPassword.state} ${this.state.conPassword.focused} ${this.state.conPassword.invalid} hero-input form-element`}
          onClick={this.clickTofocusField}
          data-field="conPassword"
        >
          <p className="hero-input-label">
            <span>confirm password</span>
          </p>
          <input
            type="password"
            name="conPassword"
            className="hero-input-field"
            onChange={this.regFieldInput}
            onBlur={this.blurField}
            onFocus={this.focusField}
            value={this.state.conPassword.value}
          />
        </div>

        <button type="button" className={`btn ${this.state.submitting === true ? 'disabled' : ''} `} onClick={this.changePassword}>submit</button>
      </div>
    );
  }
}

ChangePassword.propTypes = {
  fetchRequest: PropTypes.func.isRequired,
};

export default ChangePassword;

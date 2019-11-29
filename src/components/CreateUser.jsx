import React from 'react';
import PropTypes from 'prop-types';
import lib from '../js/lib';
import '../css/createuser.css';
import Error from './Error';

const $ = (query) => document.querySelector(query);
const defaultStates = {
  submitting: false,
  passport: null,
  firstName: '',
  lastName: '',
  email: '',
  department: '',
  jobRole: '',
  password: '',
  gender: '',
  address: '',
  emailError: '',
  passwordError: '',
};

class CreateUser extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ...defaultStates,
      departments: props.companyDeptStruc,
    };

    this._isMounted = false;
    this.fetchRequest = this.props.fetchRequest;
    this.onJobRoleChange = this.onJobRoleChange.bind(this);
    this.onDepartmentChange = this.onDepartmentChange.bind(this);
    this.onGenderChange = this.onGenderChange.bind(this);
    this.regInputsState = this.regInputsState.bind(this);
    this.onDisplayChange = this.onDisplayChange.bind(this);
    this.createUser = this.createUser.bind(this);
    this.resetForm = this.resetForm.bind(this);
  }

  componentDidMount() {
    this._isMounted = true;
    if (this.props.sessionUser.isAdmin) {
      this.props.pageSwitch('createUser');
    }
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  onDisplayChange(event) {
    const el = event.target;
    const regDisplay = $('#regDisplay');
    const passport = el.files[0];
    if (passport && passport.type === 'image/jpeg') {
      if (passport.size > 5242880) { // 5mb
        lib.popMessage("can't upload image larger than 5mb");
      } else {
        const fileReader = new FileReader();
        fileReader.readAsDataURL(passport);

        fileReader.onerror = () => {
          lib.popMessage('Oops!, we couldn\'t attach the file picked please try again or try another one');
        };

        fileReader.onload = (frEvent) => {
          const fileSrc = frEvent.target.result;
          $('#regPassport').src = fileSrc;
          regDisplay.classList.add('selected');
          regDisplay.classList.remove('Error');
          if (this._isMounted) {
            this.setState(() => ({ passport }));
          }
        };
      }
    } else {
      lib.popMessage('Image as to be a JPEG (.jpg or .jpeg) file');
    }
  }

  onJobRoleChange(event) {
    const jobRole = event.target.value;
    this.setState(() => ({ jobRole }));
  }

  onDepartmentChange(event) {
    const department = event.target.value;
    this.setState(() => ({ department, jobRole: '' }));
  }

  onGenderChange(event) {
    const gender = event.target.value;
    this.setState(() => ({ gender: gender === 'male' || gender === 'female' ? gender : '' }));
  }

  regInputsState(event) {
    // eslint-disable-next-line dot-notation
    const input = event.target.name;
    if (Object.keys(this.state).indexOf(input) !== -1) {
      const { value } = event.target;
      this.setState(() => {
        const n = {};
        n[input] = value;
        return n;
      });

      if (!lib.isEmpty(value)) event.target.classList.remove('Error');
    }
  }

  resetForm() {
    if (this._isMounted) this.setState(() => (defaultStates));

    $('#regPassport').src = '';
    $('#regPassportPicker').value = null;
  }

  createUser() {
    const { state } = this;
    if (state.submitting === false) {
      const validate = () => {
        let err = false;

        if (state.passport === null) {
          $('#regDisplay').classList.add('Error');
          err = true;
        } else $('#regDisplay').classList.remove('Error');

        if (lib.isEmpty(state.firstName)) {
          $('#regForm .form-element[name=firstName]').classList.add('Error');
          err = true;
        } else $('#regForm .form-element[name=firstName]').classList.remove('Error');

        if (lib.isEmpty(state.lastName)) {
          $('#regForm .form-element[name=lastName]').classList.add('Error');
          err = true;
        } else $('#regForm .form-element[name=lastName]').classList.remove('Error');

        try {
          if (!lib.isEmpty(state.email)) {
            if (lib.isEmail(state.email)) {
              this.setState(() => ({ emailError: '' }));
              $('#regForm .form-element[name=email]').classList.remove('Error');
            } else {
              this.setState(() => ({ emailError: 'not a valid email address' }));
              throw Error;
            }
          } else throw Error;
        } catch (error) {
          $('#regForm .form-element[name=email]').classList.add('Error');
          err = true;
        }

        try {
          if (!lib.isEmpty(state.password)) {
            if (state.password.length >= 8) {
              this.setState(() => ({ passwordError: '' }));
              $('#regForm .form-element[name=password]').classList.remove('Error');
            } else {
              this.setState(() => ({ passwordError: 'password needs to be atleast 8 characters long' }));
              throw Error;
            }
          } else throw Error;
        } catch (error) {
          $('#regForm .form-element[name=password]').classList.add('Error');
          err = true;
        }

        if (['male', 'female'].indexOf(state.gender) === -1) {
          $('#regForm .form-element[name=gender]').classList.add('Error');
          err = true;
        } else $('#regForm .form-element[name=gender]').classList.remove('Error');

        const { departments } = this.state;
        const { department } = this.state;
        if (Object.keys(departments).indexOf(department) === -1) {
          $('#regForm .form-element[name=department]').classList.add('Error');
          $('#regForm .form-element[name=jobRole]').classList.add('Error');
          err = true;
        } else {
          $('#regForm .form-element[name=department]').classList.remove('Error');
          const deptJobRoles = departments[department].jobRoles;
          let jobRoleValid = false;
          for (let i = 0; i < deptJobRoles.length; i += 1) {
            if (deptJobRoles[i].id === this.state.jobRole) {
              jobRoleValid = true;
              break;
            }
          }

          if (jobRoleValid) {
            $('#regForm .form-element[name=jobRole]').classList.remove('Error');
          } else {
            err = true;
            $('#regForm .form-element[name=jobRole]').classList.add('Error');
          }
        }

        if (lib.isEmpty(state.address)) {
          $('#regForm .form-element[name=address]').classList.add('Error');
          err = true;
        } else $('#regForm .form-element[name=address]').classList.remove('Error');

        return !err;
      };


      if (validate()) {
        this.setState(() => ({ submitting: true }));

        const form = new FormData();
        form.append('passport', state.passport);
        form.append('firstName', state.firstName);
        form.append('lastName', state.lastName);
        form.append('email', state.email);
        form.append('password', state.password);
        form.append('gender', state.gender);
        form.append('jobRole', state.jobRole);
        form.append('department', state.department);
        form.append('address', state.address);

        this.fetchRequest({
          url: 'https://akintomiwa-capstone-backend.herokuapp.com/api/v1/auth/create-user',
          method: 'POST',
          body: form,
        }).then(() => {
          if (this._isMounted) {
            this.resetForm();
            lib.popMessage('user account created successfully');
          }
        }).catch((error) => {
          if (error.body.email) {
            $('#regForm .form-element[name=email]').classList.add('Error');
            this.setState(() => ({ emailError: 'email invalid or already exist' }));
            lib.popMessage('Opps!, couldn\'t create user account ');
          } else lib.popMessage('Opps!, couldn\'t complete your request please try again');
        }).finally(() => {
          if (this._isMounted) this.setState(() => ({ submitting: false }));
        });
      } else {
        lib.popMessage('Please complete the form before submitting');
      }
    }
  }

  render() {
    if (!this.props.sessionUser.isAdmin) {
      return <Error />;
    }

    const departmentsArr = [];
    const { departments } = this.state;
    const deptsKeys = Object.keys(departments);
    deptsKeys.forEach((key) => {
      departmentsArr.push(<option value={key} key={key}>{departments[key].name}</option>);
    });

    const jobRolesArr = [];
    const { department } = this.state;
    if (deptsKeys.indexOf(department) !== -1) {
      const deptJobRoles = departments[department].jobRoles;
      deptJobRoles.forEach((jobRole) => {
        jobRolesArr.push(<option value={jobRole.id} key={jobRole.id}>{jobRole.title}</option>);
      });
    }

    return (
      <div id="regForm">
        <h2 id="regFormLabel">Create a new user account</h2>
        <div id="regDisplay" onClick={() => { $('#regPassportPicker').click(); }}>
          <img id="regPassport" alt="" />
          <div className="overlay">
            <p className="far fa-image" />
            <p>pick passport</p>
          </div>
          <input type="file" className="form-element" name="passport" id="regPassportPicker" accept="image/jpeg,image/jpg" onChange={this.onDisplayChange} />
        </div>

        <div className="input-group">
          <p className="form-label">first name</p>
          <input type="text" name="firstName" value={this.state.firstName} className="form-element" placeholder="user first name" onChange={this.regInputsState} />
        </div>

        <div className="input-group">
          <p className="form-label">last name</p>
          <input type="text" name="lastName" value={this.state.lastName} className="form-element" placeholder="user last name" onChange={this.regInputsState} />
        </div>

        <div className="input-group">
          <p className="form-label">email</p>
          <input type="text" name="email" value={this.state.email} className="form-element" placeholder="user email address" onChange={this.regInputsState} />
          <p className={`error-msg ${this.state.emailError === '' ? 'hide' : ''}`}>{this.state.emailError}</p>
        </div>

        <div className="input-group">
          <p className="form-label">password</p>
          <input type="password" name="password" value={this.state.password} className="form-element" placeholder="user password" onChange={this.regInputsState} />
          <p className={`error-msg ${this.state.passwordError === '' ? 'hide' : ''}`}>{this.state.passwordError}</p>
        </div>

        <div className="input-group">
          <p className="form-label">gender</p>
          <select className={`form-element ${lib.isEmpty(this.state.gender) ? 'placeholder' : ''}`} name="gender" value={lib.isEmpty(this.state.gender) ? '-placeholder-' : this.state.gender} onChange={this.onGenderChange}>
            <option value="-placeholder-" disabled>user gender</option>
            <option value="male">male</option>
            <option value="female">female</option>
          </select>
        </div>

        <div className="input-group">
          <p className="form-label">department</p>
          <select className={`form-element ${lib.isEmpty(this.state.department) ? 'placeholder' : ''}`} value={lib.isEmpty(this.state.department) ? '-placeholder-' : this.state.department} name="department" onChange={this.onDepartmentChange}>
            <option value="-placeholder-" disabled>user department</option>
            {departmentsArr}
          </select>
        </div>

        <div className="input-group">
          <p className="form-label">job role</p>
          <select className={`form-element ${lib.isEmpty(this.state.jobRole) ? 'placeholder' : ''}`} value={lib.isEmpty(this.state.jobRole) ? '-placeholder-' : this.state.jobRole} name="jobRole" onChange={this.onJobRoleChange}>
            <option value="-placeholder-" disabled>user job role</option>
            {jobRolesArr}
          </select>
        </div>

        <div className="input-group">
          <p className="form-label">address</p>
          <input type="text" name="address" value={this.state.address} className="form-element" placeholder="user home address" onChange={this.regInputsState} />
        </div>

        <button type="submit" className={`btn btn-success ${this.state.submitting ? 'disabled' : ''}`} onClick={this.createUser}>
          <span className="fas fa-user-plus icon" />
          create user
        </button>
      </div>

    );
  }
}

CreateUser.propTypes = {
  sessionUser: PropTypes.object.isRequired,
  companyDeptStruc: PropTypes.object.isRequired,
  pageSwitch: PropTypes.func.isRequired,
  fetchRequest: PropTypes.func.isRequired,
};

export default CreateUser;

/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable class-methods-use-this */
/* eslint-disable react/prefer-stateless-function */
import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import './css/general.css';
import SignIn from './components/SignIn';
import Home from './components/Home';

class App extends React.Component {
  render() {
    return (
      <div className="App">
        <BrowserRouter>
          <Switch>
            <Route path="/signin" render={(props) => <SignIn {...props} />} />
            <Route path="/" render={(props) => <Home {...props} />} />
          </Switch>
        </BrowserRouter>
      </div>
    );
  }
}

export default App;

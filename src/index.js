import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import Home from './components/Homepage';
import { browserHistory } from 'react-router';
// import { BrowserRouter, Route } from 'react-router-dom';
import { HashRouter as Router, Route } from 'react-router-dom';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(     <Router history={browserHistory}>
  <div>
    <Route path="/home" component={Home} />
      <Route exact path="/" component={App} />
    </div>
  </Router>
  , document.getElementById('root'));
registerServiceWorker();

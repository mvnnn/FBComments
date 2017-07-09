import React, { Component } from 'react';
import createHistory from 'history/createBrowserHistory'

const history = createHistory();
import FacebookLogin from 'react-facebook-login';
let WindowWidth = window.innerHeight;
let WindowHeight = window.WindowHeight;


class App extends Component {
  constructor(props){
    super(props);
  }

  componentWillMount = () => {
    if(localStorage.getItem('FBname') != undefined){
      console.log(localStorage.getItem('FBname'));
      this.props.history.push('/home');
    }
  }

  responseFacebook = (response) => {
    // this.props.history.push('/home');
    localStorage.setItem('FBname', response.name);
    localStorage.setItem('FBAvtar', response.picture.data['url']);
    this.props.history.push({
  pathname: '/home',
  search: '',
  state: { name: response.name, avtar_url: response.picture.data['url'] }
});
  }

  render() {
    return (
      <div className="App" style={{marginLeft:'30%', marginTop:'15%'}}>
        <FacebookLogin
         appId="823298704501453"
         autoLoad={true}
         fields="name,email,picture"
         callback={this.responseFacebook}
       />
      </div>
    );
  }
}

export default App;

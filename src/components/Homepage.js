import React, { Component } from 'react';
import { Button, Form, FormGroup, ControlLabel, FormControl, Col, Row, Image, Navbar, Nav, NavItem} from 'react-bootstrap';
import config from '../../config';

import * as firebase from 'firebase';
import { browserHistory } from 'react-router';
import createHistory from 'history/createBrowserHistory'

const history = createHistory();
let timeInIST = new Date();

let WindowWidth = window.innerHeight;

class Home extends Component {
  constructor(){
    super();
    this.state={
      post: null,
      comments:[],
      username: null,
      avtar_url: null,
      isloading: false,
      CommentCount: 0
    };
  }

  componentWillMount = () => {
    firebase.initializeApp(config);
    var ref = firebase.database().ref('Data');
    ref.child('post').on('value', (snapshot) => {
      var items = [];
      snapshot.forEach(function(child) {
        items.push(child.val());
      });

      let NewCount = 0;
      if(items.length > 4){
         NewCount = 4;
      }
      else{
        NewCount = items.length;
      }

      this.setState({
        CommentCount: NewCount,
        comments: items,
        isloading: true
      }, () => this.timeIntervalFunc());
      console.log(items);
    })
  }

  timeIntervalFunc = () => {
    console.log("Interval called");
    timeInIST = new Date();
    let timeInMon = timeInIST.getMonth()
    let timeInDate = timeInIST.getDate();
    let timeInHrs = timeInIST.getHours();
    let timeInMin = timeInIST.getMinutes();
    let Comments = this.state.comments;
    let UpdatedComments = [];
    Comments.map((comment, i)=>{
      let CommentTime = comment.time;
      let res = CommentTime.split(" ");
      // let resp = res[1].split("-");
      let month = parseInt(res[0]);
      let date = parseInt(res[1]);
      // let respon = respo[1].split(":");
      let hours = parseInt(res[2]);
      let minites = parseInt(res[3]);
      console.log(CommentTime+"==>"+month+","+date+","+hours+","+minites);
      console.log(timeInIST+"-->"+timeInMon+","+timeInDate+","+timeInHrs+","+timeInMin);

      let TimeStr = "";
      if(timeInMon - month > 1){
        if(timeInMon - (month-1) == 1){
        TimeStr = `${timeInMon - (month-1)} month ago`;
      }
      else{
        TimeStr = `${timeInMon - (month-1)} months ago`;
      }
      }
      else if((timeInDate - date) >= 1){
        console.log(typeof timeInDate+", "+ typeof date);
        if(timeInDate - date == 1){
        TimeStr = `${timeInDate - date} day ago`;
      }
      else{
        TimeStr = `${timeInDate - date} days ago`;
      }
      }
      else if((timeInHrs - hours) >= 1){
        if(timeInHrs - hours == 1){
        TimeStr = `${timeInHrs - hours} hour ago`;
      }
      else{
        TimeStr = `${timeInHrs - hours} hours ago`;
      }
      }
      else if((timeInMin - minites) >= 0){
        if(timeInMin - minites <= 1){
        TimeStr = `${timeInMin - minites} min. ago`;
      }
      else{
        TimeStr = `${timeInMin - minites} mins ago`;
      }
      }

      UpdatedComments.push({
        'message' : comment.message,
        'time' : comment.time,
        'username' : comment.username,
        'avtar_url' : comment.avtar_url,
        'duration' : TimeStr
      });

    });

    this.setState({comments : UpdatedComments});
  }

  componentDidMount = () => {
    // this.timeIntervalFunc;
    let Name = localStorage.getItem('FBname');
    let Avtar_URL = localStorage.getItem('FBAvtar');
    this.setState({
      username: Name,
      avtar_url: Avtar_URL
    });
    setInterval(() => this.timeIntervalFunc() , 60000);
    // console.log(this.props.location.state.name +" "+timeInMin+" "+timeInMs);
  }

  SubmitPost = () => {
    var ref = firebase.database().ref('Data');

    timeInIST = new Date();
    let timeStr = timeInIST.getMonth()+" "+timeInIST.getDate()+" "+timeInIST.getHours()+" "+timeInIST.getMinutes();
    let NewComments = this.state.comments;
    NewComments.push({
          'message' : this.state.post,
          'time' : timeStr,
          'username' : this.state.username,
          'avtar_url' : this.state.avtar_url,
          'duration' : "0 min. ago"
        });

    // NewComments[NewComments.length] = {
    //       'message' : this.state.post,
    //       'time' : timeStr,
    //       'username' : this.state.username,
    //       'avtar_url' : this.state.avtar_url,
    //       'duration' : "0 min. ago"
    //     };

    ref.update({post : NewComments});
  }


  ChangePost = (e) => {
    this.setState({post:e.target.value})
  }

  loadComments = () => {
    let NewCount = 0;
    if(this.state.comments.length > (this.state.CommentCount + 4)){
       NewCount = this.state.CommentCount + 4;
    }
    else{
      NewCount = this.state.comments.length;
    }
    this.setState({CommentCount:NewCount})
  }

  FBLogout = () => {
    localStorage.removeItem('FBname');
    localStorage.removeItem('FBAvtar');
    this.props.history.push('/');
  }

  render() {
    let CommentData = this.state.comments;
    return (
      <div>
        <Navbar inverse collapseOnSelect>

  <Navbar.Header>
    <Navbar.Brand>
      <a href="#">Facebook</a>
    </Navbar.Brand>
    <Navbar.Toggle />
  </Navbar.Header>
  <Navbar.Collapse>
    <Nav pullRight>
      <NavItem eventKey={1} onClick={this.FBLogout}>Logout</NavItem>
    </Nav>
  </Navbar.Collapse>
</Navbar>

        <div className="container">
        <Row style={{paddingLeft:'10%',  paddingRight:'10%'}}>
              <Col componentClass={ControlLabel} sm={6} xs={6} md={6} lg={6} style={{padding:'10'}}>
              <FormControl type="text" placeholder="Enter Comment" onChange={(e) => this.ChangePost(e)} />
              </Col>
              <Col sm={4} xs={4} md={2} lg={2} style={{paddingTop:7}}>
              <Button type="submit" style={{width:'100%'}} onClick={this.SubmitPost}>
                Submit
              </Button>
              </Col>
            </Row>
            { this.state.isloading && this.state.CommentCount > 0 ?
              CommentData.slice((CommentData.length - this.state.CommentCount), CommentData.length).reverse().map((comment, i)=>{
                return <div key={i} style={{marginLeft:'10%'}}>
                  <Row>
                    <Col sm={2} xs={2} md={2} lg={2}>
                    <Image style={{width:'50', height:'50'}} src={comment.avtar_url} responsive />
                    </Col>
                    <Col sm={10} xs={10} md={8} lg={8} style={{marginLeft:'-5%'}}>
                      <p><span style={{color:'blue'}}> {comment.username}</span> {comment.message}</p>
                      <p>{comment.duration}</p>
                        </Col>
                      </Row>
                </div>
              }): null
            }
            { this.state.CommentCount < CommentData.length ?
            <div style={{marginLeft:'10%'}}>
            <Button bsStyle="primary" onClick={this.loadComments} active>View More Comments</Button>
            </div>:null
          }
          </div>
      </div>
    );
  }
}

export default Home;

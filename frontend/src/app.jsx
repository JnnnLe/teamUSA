import React from 'react';

import AppBar from 'material-ui/AppBar';
import DatePicker from 'material-ui/DatePicker';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';
import SunIcon from 'material-ui/svg-icons/image/wb-sunny';
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';
import CircularProgress from 'material-ui/CircularProgress';

import AddressAutoComplete from './AddressAutoComplete.jsx';

import {BarChart} from 'react-easy-chart'

var warnings = {
  '11+': {
    color: '#801fa3',
    title: 'Extreme Danger',
    burn: '10 min.',
    advice: 'Seek shade, apply SPF 30 every two hours; wear a hat, sunglasses, and protective clothing.'
  },
  '8-10': {
    color: '#ce3300',
    title: 'Very High Danger',
    burn: '15-25 min.',
    advice: 'Apply SPF 30 sunscreen; wear a hat, sunglasses, and protective clothing.'
  },
  '6-7': {
    color: '#e8ae00',
    title: 'High Danger',
    burn: '30 min.',
    advice: 'Apply SPF 15 to 30 sunscreen; wear a hat and sunglasses.'
  },
  '3-5': {
    color: '#f9ef22',
    title: 'Moderate Danger',
    burn: '45 min.',
    advice: 'Apply SPF 15 sunscreen; wear a hat.'
  },
  '0-2': {
    color: '#007507',
    title: 'Low Danger',
    burn: '60 min.',
    advice: 'Apply SPF 15 sunscreen; wear a hat.'
  }
}

var uviMap = {
  '0': '0-2',
  '1': '0-2',
  '2': '0-2',
  '3': '3-5',
  '4': '3-5',
  '5': '3-5',
  '6': '6-7',
  '7': '6-7',
  '8': '8-10',
  '9': '8-10',
  '10': '8-10',
  '11': '11+'
}

var styles = {
  text: {
    color: 'yellow',
    fontSize: 40,
    textShadow: '1px 0 0 #000, 0 -1px 0 #000, 0 1px 0 #000, -1px 0 0 #000'
  },
  legend: {
    display: 'inline-block',
    marginLeft: 30,
    marginRight: 30
  },
  box: {
    width: 7,
    height: 7,
    margin: 5,
    border: '1px solid rgba(0, 0, 0, .2)',
    display: 'inline-block'
  },
  green: {
    backgroundColor: '#007507',
  },
  yellow: {
    backgroundColor: '#f9ef22',
  },
  orange: {
    backgroundColor: '#e8ae00',
  },
  red: {
    backgroundColor: '#ce3300',
  },
  violet: {
    backgroundColor: '#801fa3',
  },
  label: {
    display: 'inline-block'
  },
  paper: {
    paddingLeft: 50,
    paddingRight: 50,
    paddingTop: 25,
    paddingBottom: 25,
    display: 'block',
    marginLeft: 15,
    marginRight: 15,
    backgroundImage: 'url("https://s-media-cache-ak0.pinimg.com/originals/0c/5c/b9/0c5cb9a74e9674d921b7be5621d3ad58.jpg")'
  },
  body: {
    marginTop: 100
  },
  td: {
    width: '49%',
  },
  pad1top: {
    height: 55
  },
  pad1bot: {
    height: 450
  },
  pad2top: {
    height: 10
  },
  pad2bot: {
    height: 20
  },
  table: {
    marginTop: 30,
    width: '100%',
  },
  appbar: {
    backgroundColor: '#c6a567',
    color: 'black',
    backgroundImage: 'url("http://d-beach.com/wp-content/uploads/2015/01/beach-healing.jpg")',
    backgroundSize: '2000px 200px'


  },
  map: {
    height: 500,
    width: 800
  }
}

export default class App extends React.Component {

  constructor() {
    super();
    this.state = {
      date: new Date(2017,4,1,10,0,0,0),
      address: '28 Great Hwy, San Francisco, CA 94121',
      serverResponse: {"response": []},
      zipcode: '94121',
      minTemp: -50,
      maxTemp: 150,
      maxUVI: 0,
      mouseOver: 0,
      isLoading: false,
      err: ''
    };

    document.body.style.backgroundColor = "#012A52";
    document.body.style.backgroundImage = 'url("http://backgrounds.picaboo.com/download/e3/33/e33400a443094bdcb7c30c9e8990e12f/Beach%20Vacation%20Sand.jpg")';


    this.handleSubmit = this.handleSubmit.bind(this);
    this.changeDate = this.changeDate.bind(this);
    this.updateAddress = this.updateAddress.bind(this);
    this.setZipcode = this.setZipcode.bind(this);
    this.mouseOverHandler = this.mouseOverHandler.bind(this);
    this.mouseOutHandler = this.mouseOutHandler.bind(this);
  }

  componentDidMount() {
    document.getElementById('addressAutocompleteField').value = this.state.address;
    this.handleSubmit();
  }

  formatData(serverResponse) {
    var data = []
    for (var i=0;i<serverResponse.length;i++) {
      
      var hour = parseInt(serverResponse[i].hour, 10) < 12 ? parseInt(serverResponse[i].hour, 10) + 'a' : (parseInt(serverResponse[i].hour, 10) - 12) + 'p';
      if (hour == '0a') {
        hour = '12a'
      } else if (hour == '0p') {
        hour = '12p'
      }

      var UVIndex = parseInt(serverResponse[i].UVIndex);
      UVIndex = UVIndex == 0 ? .15 : UVIndex;
      var color = "#007507";

      if (UVIndex > 10) {
        color = "#801fa3";
      } else if (UVIndex > 7) {
        color = "#ce3300";
      } else if (UVIndex > 5) {
        color = "#e8ae00";
      } else if (UVIndex > 2) {
        color = "f9ef22";
      }

      data.push({x:hour, y:parseInt(serverResponse[i].temp), color, uvi:parseInt(serverResponse[i].UVIndex)});
    }
    return data;
  }

  updateAddress() {
    this.handleSubmit();
  }

  setZipcode(zipcode) {
    this.setState({zipcode});
  }

  handleSubmit(){
    var address = document.getElementById('addressAutocompleteField').value;
    this.setState({address});

    this.setState({isLoading: true})

    fetch('http://localhost:1337/findUVIndex', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        zipcode: this.state.zipcode,
        timestamp: this.state.date.getTime(),
      })
    })
    .then(response => response.json())
    .then(serverResponse => this.setState({serverResponse:serverResponse.response}))
    .then(() => {
      this.setState({isLoading: false})
      this.setState({err: ''})
      var minTemp = 200;
      var maxTemp = -200;
      var maxUVI = 0;
      for (var i=0;i<this.state.serverResponse.length;i++) {
        var temp = parseInt(this.state.serverResponse[i].temp);
        var UVI = parseInt(this.state.serverResponse[i].UVIndex);
        minTemp = temp < minTemp ? temp : minTemp;
        maxTemp = temp > maxTemp ? temp : maxTemp;
        maxUVI = UVI > maxUVI ? UVI : maxUVI;
      }
      this.setState({minTemp,maxTemp,maxUVI,mouseOver:maxUVI});
    })
    .catch(() => {
        this.setState({isLoading: false})
        this.setState({err: 'Not a valid address'})
      }
    );

  }

  changeDate(event,date) {
    this.setState({date}, () => {
      this.handleSubmit()
    })
  }

  mouseOverHandler(d,e) {
    this.setState({mouseOver: d.uvi});
  }

  mouseOutHandler() {
    this.setState({mouseOver: this.state.maxUVI});
  }

  disableDays(date) {
    return date.getTime() - new Date().getTime() > 1000*60*60*24*9 || date.getTime() < new Date().getTime() - 1000*60*60*24*1;
  }

  render() {
    return (
      <div>

        <CircularProgress style={{position: 'absolute',left:452,top:270, visibility: this.state.isLoading ? 'visible' : 'hidden'}} size={50}/>


        <AppBar
          title={<img src="http://localhost:1337/logo.png"/>}
          iconElementLeft={<span />}
          style={styles.appbar}
        />

        <table style={styles.table}>
          <tbody>
            <tr>
              <td style={styles.td}>
                <Paper style={styles.paper}>
                  
                  <div style={styles.pad1top}/>
                  
                  <table style={{display: 'block'}}>
                  <tbody>
                  <tr>
                  <td style={{paddingLeft: 70}}>
                  <i>Date</i>
                  <DatePicker
                  hintText="What day are you going?"
                  value={this.state.date}
                  onChange={this.changeDate}
                  shouldDisableDate={this.disableDays}/>
                  </td>

                  <td style={{paddingLeft: 140}}>
                  <i>Location</i><br/>
                  <AddressAutoComplete updateAddress={this.updateAddress} setZipcode={this.setZipcode}/>
                  </td>
                  </tr>

                  </tbody>
                  </table>

                  <br/><br/>
                  
                  <br/><br/><br/>

                  <iframe
                    style={styles.map}
                    src={this.state.address.length == 0 ? 
                    "https://www.google.com/maps/embed/v1/place?key=AIzaSyB2PN2DWBME3STMNFugV___yXb4q57pECg&q=Berkeley+CA" 
                    : 
                    "https://www.google.com/maps/embed/v1/place?key=AIzaSyB2PN2DWBME3STMNFugV___yXb4q57pECg&q=" + this.state.address.replace(" ","+")}
                    >
                  </iframe><br/><br/><br/>

                </Paper>
              </td>

              <td style={styles.td}>
                <Paper style={styles.paper}>
                  <div style={styles.pad2top}/>
                    <span style={{display: 'block', textAlign: 'center'}}>{this.state.err ? this.state.err : this.state.address}</span><br/>
                    Temperature
                    <BarChart
                      data={this.formatData(this.state.serverResponse)}
                      height={450}
                      width={650}
                      axes
                      axisLabels={{x: 'Time', y: ''}}
                      yDomainRange={[this.state.minTemp-10, this.state.maxTemp+5]}
                      mouseOverHandler={this.mouseOverHandler}
                      mouseOutHandler={this.mouseOutHandler}
                    />

                    <div>
                      <div style={styles.legend}>
                      <div style={Object.assign({},styles.box,styles.green)}></div><div style={styles.label}>0-2 UVI</div>
                      </div>

                      <div style={styles.legend}>
                      <div style={Object.assign({},styles.box,styles.yellow)}></div><div style={styles.label}>3-5 UVI</div>
                      </div>
                      
                      <div style={styles.legend}>
                      <div style={Object.assign({},styles.box,styles.orange)}></div><div style={styles.label}>6-7 UVI</div>
                      </div>
                      
                      <div style={styles.legend}>
                      <div style={Object.assign({},styles.box,styles.red)}></div><div style={styles.label}>8-10 UVI</div>
                      </div>

                      <div style={styles.legend}>
                      <div style={Object.assign({},styles.box,styles.violet)}></div><div style={styles.label}>11+ UVI</div>
                      </div>
                    </div>

                    <br/><br/><br/>
                    <div>
                      <table>
                      <tbody>
                      <tr>
                      <td id="purple" style={{backgroundColor: warnings[uviMap[this.state.mouseOver]].color, width: '40'}}></td>
                      <td style={{width: '40'}}/>
                      <td>
                        <h2>{warnings[uviMap[this.state.mouseOver]].title}</h2>
                        <p>
                          <b>Time to burn: {warnings[uviMap[this.state.mouseOver]].burn}</b>
                          <br/><br/>
                          <i>{warnings[uviMap[this.state.mouseOver]].advice}</i>
                        </p>
                      </td>
                      </tr>
                      </tbody>
                      </table>
                    </div>

                  <div style={styles.pad2bot}/>
                </Paper>
              </td>
            </tr>
          </tbody>

        </table>
      </div>
    )
  }
}

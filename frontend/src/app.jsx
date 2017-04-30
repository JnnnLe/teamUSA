import React from 'react';

import AppBar from 'material-ui/AppBar';
import DatePicker from 'material-ui/DatePicker';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';
import SunIcon from 'material-ui/svg-icons/image/wb-sunny';
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';
import AddressAutoComplete from './AddressAutoComplete.jsx';

import {BarChart} from 'react-easy-chart'

var warnings = {
  '11+': {
    color: '#801fa3',
    title: 'Extreme Danger',
    burn: '10 min.',
    advice: 'Seek shade, apply SPF 30 sunscreen every two hours; wear a hat, sunglasses, and protective clothing.'
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
    marginRight: 15
  },
  body: {
    marginTop: 100
  },
  td: {
    width: '49%',
  },
  pad1top: {
    height: 50
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
    width: '100%'
  },
  appbar: {
    backgroundColor: '#FAF2C7',
    color: 'black',
    // backgroundImage: 'url("https://i.ytimg.com/vi/0PPq6_51P7c/maxresdefault.jpg")'
    backgroundImage: 'url("http://gallery.yopriceville.com/var/albums/Backgrounds/Background_Beach_Sand.jpg?m=1432123262")'
  },
  map: {
    height: 450,
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
      mouseOver: 0
    };

    document.body.style.backgroundColor = "#A3CCFF";
    // document.body.style.backgroundImage = 'url("https://i.ytimg.com/vi/0PPq6_51P7c/maxresdefault.jpg")';
    document.body.style.backgroundImage = 'url("http://allswalls.com/images/ocean-sea-water-surf-nature-landscape-wallpaper-8.jpg")';
    // document.body.style.backgroundRepeat = 'no-repeat';
    // document.body.style.backgroundSize = '2000px 1000px';


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

      // data.push({x:hour, y:UVIndex, color});
      data.push({x:hour, y:parseInt(serverResponse[i].temp), color, uvi:parseInt(serverResponse[i].UVIndex)});
    }
    return data;
  }

  updateAddress() {
    var address = document.getElementById('addressAutocompleteField').value;
    this.setState({address});
  }

  setZipcode(zipcode) {
    this.setState({zipcode});
  }

  handleSubmit(){
    var address = document.getElementById('addressAutocompleteField').value;
    this.setState({address});

    // var regex = /[0-9]+/ig;
    // var zipcode = '';
    // var oldZipcode = '';
    // while (true) {
    //   oldZipcode = zipcode;
    //   zipcode = regex.exec(address);
    //   if (zipcode == null) {
    //     zipcode = oldZipcode[0];
    //     break;
    //   }
    // }

    // if (this.state.zipcode.length == 0) {
    //   fetch('http://maps.googleapis.com/maps/api/geocode/json?address=' + address.replace(" ","+") + '&sensor=true_or_false', {
    //     method: 'GET'
    //   })
    //   .then(response => response.json())
    //   .then(zipcode => this.setState({zipcode}))
    // }

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

  }

  changeDate(event,date) {
    this.setState({date})
  }

  mouseOverHandler(d,e) {
    this.setState({mouseOver: d.uvi});
  }

  mouseOutHandler() {
    this.setState({mouseOver: this.state.maxUVI});
  }

  render() {
    return (
      <div>

        <AppBar
          title={<strong style={styles.text}>Solar Scout</strong>}
          iconElementLeft={<IconButton iconStyle={{width: 30, height: 30}} ><SunIcon color='yellow'/></IconButton>}
          style={styles.appbar}
        />

        <table style={styles.table}>
          <tbody>
            <tr>
              <td style={styles.td}>
                <Paper style={styles.paper}>

                  <div style={styles.pad1top}/>
                  Date
                  <DatePicker
                  hintText="What day are you going?"
                  value={this.state.date}
                  onChange={this.changeDate}/>



                  <br/><br/><br/>Location <br/>
                  <AddressAutoComplete style={{width: 300}} updateAddress={this.updateAddress} setZipcode={this.setZipcode}/>


                  <br/><br/>
                  <RaisedButton label="Submit" onTouchTap={this.handleSubmit} />
                  <br/><br/>
                  

                  <iframe
                    style={styles.map}
                    src={this.state.address.length == 0 ? 
                    "https://www.google.com/maps/embed/v1/place?key=AIzaSyB2PN2DWBME3STMNFugV___yXb4q57pECg&q=Berkeley+CA" 
                    : 
                    "https://www.google.com/maps/embed/v1/place?key=AIzaSyB2PN2DWBME3STMNFugV___yXb4q57pECg&q=" + this.state.address.replace(" ","+")}
                    >
                  </iframe>

                </Paper>
              </td>

              <td style={styles.td}>
                <Paper style={styles.paper}>
                  <div style={styles.pad2top}/>
                    
                    <BarChart
                      data={this.formatData(this.state.serverResponse)}
                      height={450}
                      width={650}
                      axes
                      axisLabels={{x: 'Time', y: 'Temp'}}
                      yDomainRange={[this.state.minTemp-10, this.state.maxTemp+10]}
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

                    <br/><br/><br/><br/><br/>
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

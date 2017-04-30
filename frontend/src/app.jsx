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
      maxTemp: 150
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
      data.push({x:hour, y:parseInt(serverResponse[i].temp), color});
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
      console.log(this.state.serverResponse)
      for (var i=0;i<this.state.serverResponse.length;i++) {
        var temp = parseInt(this.state.serverResponse[i].temp);
        minTemp = temp < minTemp ? temp : minTemp;
        maxTemp = temp > maxTemp ? temp : maxTemp;
      }
      this.setState({minTemp,maxTemp});  
    })

  }

  changeDate(event,date) {
    this.setState({date})
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
                      axisLabels={{x: 'Time', y: 'Temp'}}
                      yDomainRange={[this.state.minTemp-10, this.state.maxTemp+10]}
                      axes
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

    // <div>
    //   <td id="purple" class="uv-number" style="background-color: purple;"><span>UV 11+</span></td>
    //   <td class="emoji"><img src="https://gallery.mailchimp.com/47ae7f0af141375f4a24dd7ad/images/bde79451-77c1-45c7-91d8-ef4f27896303.png" alt="" /></td><td class="info"><h2> Extreme Danger</h2>
    //   <p>
    //   <b>Time to burn: 10 min.</b>
    //   <br/><br/>
    //   <i>Seek shade, apply SPF 30 sunscreen every two hours; wear a hat, sunglasses, and protective clothing.</i>
    //   </p>
    // </div>
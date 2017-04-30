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

var Chart = require('react-d3-core').Chart;
var LineChart = require('react-d3-basic').LineChart;

var width = 700,
    height = 300,
    margins = {left: 100, right: 100, top: 50, bottom: 50},
    title = "UV Index per Hour",
    // chart series,
    // field: is what field your data want to be selected
    // name: the name of the field that display in legend
    // color: what color is the line
    chartSeries = [
      {
        field: 'UV',
        color: '#f4e242'
      }
    ],
    // your x accessor
    x = function(d) {
      return d.hour;
    },
    xScale = 'ordinal',
    xLabel = "Hour",
    yLabel = "UV Index",
    yTicks = [3];


var styles = {
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
    height: 420
  },
  table: {
    marginTop: 20,
    width: '100%'
  },
  appbar: {
    backgroundImage: 'url("https://i.ytimg.com/vi/0PPq6_51P7c/maxresdefault.jpg")'
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
      date: {},
      address: '',
      serverResponse: {"response": []}
    };

    document.body.style.backgroundColor = "#ddd";

    this.handleSubmit = this.handleSubmit.bind(this);
    this.changeDate = this.changeDate.bind(this);
    this.updateAddress = this.updateAddress.bind(this);
  }

  formatData(serverResponse) {
    var data = []
    for (var i=0;i<serverResponse.length;i++) {
      data.push({hour: serverResponse[i].hour, UV: serverResponse[i].UVIndex});
    }
    console.log(data);
    return data;
  }

  updateAddress() {
    var address = document.getElementById('addressAutocompleteField').value;
    this.setState({address});
  }

  handleSubmit(state){
    var address = document.getElementById('addressAutocompleteField').value;
    this.setState({address});

    var regex = /[0-9]+/ig;
    var zipcode = '';
    var oldZipcode = '';
    while (true) {
      oldZipcode = zipcode;
      zipcode = regex.exec(address);
      if (zipcode == null) {
        zipcode = oldZipcode[0];
        break;
      }
    }

    fetch('http://localhost:1337/findUVIndex', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        zipcode: zipcode,
        timestamp: this.state.date.getTime(),
      })
    })
    .then(response => response.json())
    // .then(serverResponse => this.setState({serverResponse}))
    .then(responseJson => this.setState({serverResponse: {
      "response": [
        {
          "hour": "2",
          "UVIndex": "10",
          "risk": "Violet",
          "recommendation": "Take all precautions: Wear SPF 30+ sunscreen, a long-sleeved shirt and trousers, sunglasses, and a very broad hat. Avoid the sun within three hours of solar noon."
        },
        {
          "hour": "3",
          "UVIndex": "8",
          "risk": "Violet",
          "recommendation": "Take all precautions: Wear SPF 30+ sunscreen, a long-sleeved shirt and trousers, sunglasses, and a very broad hat. Avoid the sun within three hours of solar noon."
        },
        {
          "hour": "4",
          "UVIndex": "7",
          "risk": "Violet",
          "recommendation": "Take all precautions: Wear SPF 30+ sunscreen, a long-sleeved shirt and trousers, sunglasses, and a very broad hat. Avoid the sun within three hours of solar noon."
        },
        {
          "hour": "5",
          "UVIndex": "10",
          "risk": "Violet",
          "recommendation": "Take all precautions: Wear SPF 30+ sunscreen, a long-sleeved shirt and trousers, sunglasses, and a very broad hat. Avoid the sun within three hours of solar noon."
        },
        {
          "hour": "6",
          "UVIndex": "8",
          "risk": "Violet",
          "recommendation": "Take all precautions: Wear SPF 30+ sunscreen, a long-sleeved shirt and trousers, sunglasses, and a very broad hat. Avoid the sun within three hours of solar noon."
        },
        {
          "hour": "7",
          "UVIndex": "7",
          "risk": "Violet",
          "recommendation": "Take all precautions: Wear SPF 30+ sunscreen, a long-sleeved shirt and trousers, sunglasses, and a very broad hat. Avoid the sun within three hours of solar noon."
        },
        {
          "hour": "8",
          "UVIndex": "10",
          "risk": "Violet",
          "recommendation": "Take all precautions: Wear SPF 30+ sunscreen, a long-sleeved shirt and trousers, sunglasses, and a very broad hat. Avoid the sun within three hours of solar noon."
        },
        {
          "hour": "9",
          "UVIndex": "8",
          "risk": "Violet",
          "recommendation": "Take all precautions: Wear SPF 30+ sunscreen, a long-sleeved shirt and trousers, sunglasses, and a very broad hat. Avoid the sun within three hours of solar noon."
        },
        {
          "hour": "10",
          "UVIndex": "7",
          "risk": "Violet",
          "recommendation": "Take all precautions: Wear SPF 30+ sunscreen, a long-sleeved shirt and trousers, sunglasses, and a very broad hat. Avoid the sun within three hours of solar noon."
        }
      ]
    }}))
    console.log(this.state.serverResponse)
  }

  changeDate(event,date) {
    this.setState({date})
  }

  render() {
    return (
      <div>

        <AppBar
          title="Solar Scout"
          iconElementLeft={<IconButton><SunIcon /></IconButton>}
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
                  <AddressAutoComplete style={{width: 300}} updateAddress={this.updateAddress}/>


                  <br/><br/>
                  <RaisedButton label="Submit" onTouchTap={() => this.handleSubmit(this.state)} />
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
                    
                    <LineChart  
                      margins= {margins}
                      title={title}
                      data={this.formatData(this.state.serverResponse.response)}
                      width={width}
                      height={height}
                      chartSeries={chartSeries}
                      x={x}
                      showXGrid={false}
                      showYGrid={false}
                      />

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
                      // xLabel= {xLabel}
                      // xScale= {xScale}
                      // yTicks= {yTicks}
                      // yLabel = {yLabel}

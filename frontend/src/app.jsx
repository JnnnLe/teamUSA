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
    height: 380
  },
  pad2bot: {
    height: 380
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
      hour1: 10,
      hour2: 14,
      searchText: '',
      date: {},
      address: '',
      serverResponse: {}
    };

    document.body.style.backgroundColor = "#ddd";

    this.handleHour1Change = this.handleHour1Change.bind(this);
    this.onAutoCompleteInputChange = this.onAutoCompleteInputChange.bind(this);
    this.onClickLocation = this.onClickLocation.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.changeDate = this.changeDate.bind(this);
  }

  handleHour1Change(event, index, hour1) {
    this.setState({
      hour1
    });
  }

  handleHour2Change(event, index, hour2) {
    this.setState({
      hour2
    });
  }

  onAutoCompleteInputChange(searchText) {
    this.setState({
      searchText
    });
  }

  onClickLocation(selectedData, searchedText, selectedDataIndex) {

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
    }).then(response => response.json())
    .then(responseJson => console.log(responseJson));
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
                  <AddressAutoComplete style={{width: 300}}/>


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

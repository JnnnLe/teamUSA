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
    // display: 'inline-block',
    // marginLeft: 100,
    // marginRight: 100,
    height: 100,
    paddingLeft: 50,
    paddingRight: 50,
    paddingTop: 25,
    paddingBottom: 25,
  },
  body: {
    marginTop: 100
  },
}

export default class App extends React.Component {

  constructor() {
    super();
    this.state = {
      hour1: 10,
      hour2: 14,
      searchText: '',
      date: {},
      zipcode: 0
    };

    this.handleHour1Change = this.handleHour1Change.bind(this);
    this.onAutoCompleteInputChange = this.onAutoCompleteInputChange.bind(this);
    this.onClickLocation = this.onClickLocation.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.changeDate = this.changeDate.bind(this);
  }

  handleHour1Change(event, index, value) {
    this.setState({
      hour1: value
    });
  }

  handleHour2Change(event, index, value) {
    this.setState({
      hour2: value
    });
  }

  onAutoCompleteInputChange(value) {
    this.setState({
      searchText: value
    });
  }

  onClickLocation(selectedData, searchedText, selectedDataIndex) {

  }

  handleSubmit(state){
    var zipcode = document.getElementById('addressAutocompleteField').value.split(" ")[3];
    this.setState({zipcode:zipcode})
    fetch('http://localhost:1337/findUVIndex', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        zipcode: state.zipcode,
        timestamp: state.date.getTime(),
      })
    }).then(response => response.json())
    .then(responseJson => console.log(responseJson));
  }

  changeDate(event,date) {
    this.setState({date:date})
  }

  render() {
    return (
      <div>

        <AppBar
          title="UV Detector"
          iconElementLeft={<IconButton><SunIcon /></IconButton>}
        />

        <div className="row" style={styles.body}>


            Date
            <DatePicker
            hintText="What day are you going?"
            value={this.state.date}
            onChange={this.changeDate}/>



            Location <br/>
            <AddressAutoComplete/>



            <br/>Time of day<br/>
            <DropDownMenu value={this.state.hour1} onChange={this.handleHour1Change} style={styles.menu}>
              <MenuItem value={5} primaryText="5am" />
              <MenuItem value={6} primaryText="6am" />
              <MenuItem value={7} primaryText="7am" />
              <MenuItem value={8} primaryText="8am" />
              <MenuItem value={9} primaryText="9am" />
              <MenuItem value={10} primaryText="10am" />
              <MenuItem value={11} primaryText="11am" />
              <MenuItem value={12} primaryText="12pm" />
              <MenuItem value={13} primaryText="1pm" />
              <MenuItem value={14} primaryText="2pm" />
              <MenuItem value={15} primaryText="3pm" />
              <MenuItem value={16} primaryText="4pm" />
              <MenuItem value={17} primaryText="5pm" />
              <MenuItem value={18} primaryText="6pm" />
              <MenuItem value={19} primaryText="7pm" />
              <MenuItem value={20} primaryText="8pm" />
              <MenuItem value={21} primaryText="9pm" />
            </DropDownMenu>
            until
            <DropDownMenu value={this.state.hour2} onChange={this.handleHour2Change} style={styles.menu}>
              <MenuItem value={5} primaryText="5am" />
              <MenuItem value={6} primaryText="6am" />
              <MenuItem value={7} primaryText="7am" />
              <MenuItem value={8} primaryText="8am" />
              <MenuItem value={9} primaryText="9am" />
              <MenuItem value={10} primaryText="10am" />
              <MenuItem value={11} primaryText="11am" />
              <MenuItem value={12} primaryText="12pm" />
              <MenuItem value={13} primaryText="1pm" />
              <MenuItem value={14} primaryText="2pm" />
              <MenuItem value={15} primaryText="3pm" />
              <MenuItem value={16} primaryText="4pm" />
              <MenuItem value={17} primaryText="5pm" />
              <MenuItem value={18} primaryText="6pm" />
              <MenuItem value={19} primaryText="7pm" />
              <MenuItem value={20} primaryText="8pm" />
              <MenuItem value={21} primaryText="9pm" />
            </DropDownMenu>


        </div>
<RaisedButton label="Submimt" onTouchTap={() => this.handleSubmit(this.state)} />
      </div>
    )
  }
}

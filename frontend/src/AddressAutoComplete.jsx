import React, { Component, PropTypes } from 'react'
import { TextField } from 'material-ui'

export default class AddressAutocomplete extends Component {
  static propTypes = {
    value: PropTypes.string,
    floatingLabelText: PropTypes.string,
    hintText: PropTypes.string,
    onChange: PropTypes.func,
    updateAddress: PropTypes.func,
    setZipcode: PropTypes.func
  }

  componentWillMount () {
    this.setState({ value: this.props.value || '' })
  }

  componentDidMount () {
    var props = this.props;

    const input = document.getElementById('addressAutocompleteField')
    const options = {
      // componentRestrictions: {country: 'fr'},
      // types: ['address']
    }
    const geoAutocomplete = new window.google.maps.places.Autocomplete((input), options)
    geoAutocomplete.addListener('place_changed', () => {
      const selectedPlace = geoAutocomplete.getPlace()
      const componentForm = {
        street_number: 'short_name',
        route: 'long_name',
        locality: 'long_name',
        administrative_area_level_1: 'short_name',
        country: 'long_name',
        postal_code: 'short_name'
      }
      // Get each component of the address from the place details
      // and fill the corresponding field on the form.
      let selectedSuggest = {}
      var zipcode = '';
      for (let addressComponent of selectedPlace.address_components) {
        if (addressComponent.types[0] == 'postal_code') {
          zipcode = addressComponent.short_name;
          console.log(addressComponent.short_name);
        }
        const addressType = addressComponent.types[0]
        if (componentForm[addressType]) {
          selectedSuggest[addressType] = addressComponent[componentForm[addressType]]
        }
      }

      // input.value = selectedPlace.name // Code injection risk (check doc)
      var address = '';
      if (selectedSuggest.street_number != undefined) {
        address += selectedSuggest.street_number;
        address += ', ';
      }
      if (selectedSuggest.route != undefined) {
        address += selectedSuggest.route;
        address += ', ';
      }
      if (selectedSuggest.locality != undefined) {
        address += selectedSuggest.locality;
        address += ', ';
      }
      if (selectedSuggest.administrative_area_level_1 != undefined) {
        address += selectedSuggest.administrative_area_level_1;
        address += ', ';
      }
      if (selectedSuggest.country != undefined) {
        address += selectedSuggest.country;
        address += ', ';
      }
      if (selectedSuggest.postal_code != undefined) {
        address += selectedSuggest.postal_code;
        address += ', ';
      }
      address = address.substring(0,address.length - 2);

      if (zipcode == '') {
        var geocoder = new window.google.maps.Geocoder;
        fetch('http://maps.googleapis.com/maps/api/geocode/json?address=' + address.replace(" ","+") + '&sensor=true_or_false', {
          method: 'GET'
        })
        .then(response => response.json())
        .then(responseJson => {return {lat:responseJson.results[0].geometry.location.lat,lng:responseJson.results[0].geometry.location.lng};})
        .then(latLng => {
          geocoder.geocode({location: latLng}, function(results, status) {
            if (results[0]) {
              for (var i = 0; i < results[0].address_components.length; i++) {
                  var types = results[0].address_components[i].types;
                  for (var typeIdx = 0; typeIdx < types.length; typeIdx++) {
                      if (types[typeIdx] == 'postal_code') {
                          zipcode = results[0].address_components[i].short_name;
                      }
                  }
              }
              address += " " + zipcode
              input.value = address;
              console.log(address, zipcode)
              props.setZipcode(zipcode);
              props.updateAddress();
            } else {
                console.log("No results found");
            }
          });

        })
      } else {
        input.value = address;
        console.log(address, zipcode)
        this.props.setZipcode(zipcode);
        this.props.updateAddress();
        // this.props.onChange(selectedSuggest);  
      }
      
    })
  }

  _handleChange = (event, value) => this.setState({ value })

  render () {
    return (
      <TextField
        id='addressAutocompleteField'
        floatingLabelText={this.props.floatingLabelText}
        hintText={this.props.hintText}
        value={this.state.value}
        onChange={this._handleChange}
        placeholder='Where are you going?'
      />
    )
  }
}
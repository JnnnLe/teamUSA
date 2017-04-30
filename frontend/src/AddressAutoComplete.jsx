import React, { Component, PropTypes } from 'react'
import { TextField } from 'material-ui'

export default class AddressAutocomplete extends Component {
  static propTypes = {
    value: PropTypes.string,
    floatingLabelText: PropTypes.string,
    hintText: PropTypes.string,
    onChange: PropTypes.func,
    updateAddress: PropTypes.func
  }

  componentWillMount () {
    this.setState({ value: this.props.value || '' })
  }

  componentDidMount () {
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
      for (let addressComponent of selectedPlace.address_components) {
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
      input.value = address;
      this.props.updateAddress();
      this.props.onChange(selectedSuggest)
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
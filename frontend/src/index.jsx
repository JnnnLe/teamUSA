import React from 'react';
import { render } from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import App from './app.jsx';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();

render( <MuiThemeProvider><AppContainer><App/></AppContainer></MuiThemeProvider>, document.querySelector("#app"));

if (module && module.hot) {
  module.hot.accept('./app.jsx', () => {
    const App = require('./app.jsx').default;
    render(
      <MuiThemeProvider>
      <AppContainer>
        <App/>
      </AppContainer>
      </MuiThemeProvider>,
      document.querySelector("#app")
    );
  });
}

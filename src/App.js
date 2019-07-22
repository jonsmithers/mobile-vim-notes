import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import { Dropbox } from 'dropbox'
import { BrowserRouter as Router, Route } from "react-router-dom";
import { createContainer } from "unstated-next"
import Button from '@material-ui/core/Button';

function useDropboxCredentials(initialState = null) {
  let [credentials, setCredentials] = useState(initialState)
  return { credentials, setCredentials }
}
const DropboxCredentials = createContainer(useDropboxCredentials)
const dropbox_credential_prefix = 'dropbox-credentials.';

const dropbox = new Dropbox({ clientId: "wl4k2y0xsplg260", fetch: window.fetch });
const authUrl = dropbox.getAuthenticationUrl(window.location.toString())

function App() {
  return (
    <DropboxCredentials.Provider>
      <DropboxLoginPopup />
      <Router>
        <Route exact path="/" component={Home}/>
        <Route path="/about" component={About} />
        <div className="App">
          <header className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <p>
                Edit <code>src/App.js</code> and save to reload.
              </p>
              <a
                className="App-link"
                href="https://reactjs.org"
                target="_blank"
                rel="noopener noreferrer"
              > Learn React </a>
            </header>
          </div>
        </Router>
    </DropboxCredentials.Provider>
  );
}

function About() {
  console.log("WUT");
  return (
    <span>about!</span>
  )
}

function DropboxLoginPopup() {
  const dropboxCredentials = DropboxCredentials.useContainer();
  useEffect(() => {
    // get creds from dropbox return url
    const location = window.location;
    if (location.hash) {
      const params = new URLSearchParams(location.hash.slice(1));
      const paramsObject = Array.from(params.entries()).reduce((accumulator, [k,v]) => {
        accumulator[k] = v;
        return accumulator;
      }, {});
      for (let [key, val] of params.entries()) {
        sessionStorage.setItem(`${dropbox_credential_prefix}${key}`, val);
      }
      dropboxCredentials.setCredentials(paramsObject);
      location.hash = '';
    }
  });
  useEffect(() => {
    // get creds from session stroage
    if (!dropboxCredentials.credentials && sessionStorage.getItem(`${dropbox_credential_prefix}access_token`)) {
      const credentials = {};
      for (let i = 0; i < sessionStorage.length; i++) {
        const key = sessionStorage.key(i);
        if (key.startsWith(dropbox_credential_prefix)) {
          credentials[key.replace(dropbox_credential_prefix, '')] = sessionStorage.getItem(key);
        }
      }
      dropboxCredentials.setCredentials(credentials);
      console.log('credentials', credentials);
    }
  })
  if (dropboxCredentials.credentials) {
    return <></>
  }
  return (
    <a
      className="App-link"
      href={authUrl}
    >
      <Button color="primary" variant="contained">Authenticate Dropbox</Button>
    </a>
  );
}

function Home() {
  return (
    <div>
      <span>Im home</span>
    </div>
  );
}

export default App;
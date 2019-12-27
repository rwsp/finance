import React from 'react';
import logo from './logo.svg';
import './App.css';

const axios = require('axios');


const doSomething = () => {
  axios.get('http://localhost:4000/people').then(response => console.log(response));
};

const doSomethingElse = async () =>{
  const params = {id: 10, name: 'jimothy',};
  axios.post('http://localhost:4000/people', params, { headers: { 'Content-Type': 'application/json', } })
};


function App() {
  doSomething();
  doSomethingElse();
  return (
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
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;

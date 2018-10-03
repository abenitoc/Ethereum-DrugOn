import { render } from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import App from './components/App';
import React from 'react';
import EmbarkJS from 'Embark/EmbarkJS';
import DrugOn from 'Embark/contracts/DrugOn';

window.EmbarkJS = EmbarkJS;
window.DrugOn = DrugOn;

render((
  <BrowserRouter>
    <App />
  </BrowserRouter>
), document.getElementById('root'));
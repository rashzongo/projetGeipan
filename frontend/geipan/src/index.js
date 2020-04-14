import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { Route, BrowserRouter as Router } from 'react-router-dom';
import ListeCas from './ListeCas';
import DetailsCas from './DetailsCas';
import DetailsTemoignage from './DetailsTemoignage';
import Statistiques from './Statistiques';
import Accueil from './Accueil';
import ImportData from './ImportData';

const routing = (
    <Router>
      <div>
        <Route path="/" component={App} />
        <Route path="/accueil" component={Accueil} />
        <Route path="/importData" component={ImportData} />
        <Route path="/listeCas" component={ListeCas} />
        <Route path="/cas/:id" component={DetailsCas} />
        <Route path="/temoignage/:id" component={DetailsTemoignage} />
        <Route path="/statistiques" component={Statistiques} />
      </div>
    </Router>
  )

ReactDOM.render(routing, document.getElementById('root'))

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

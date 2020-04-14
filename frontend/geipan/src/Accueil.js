import React, { Component } from 'react';
import { withStyles } from '@material-ui/styles';

const styles = {
};

class Accueil extends Component {
  
  constructor(props) {
		super(props);
		   
		this.state= {
    };
  }
  
 
  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
      <h1>Université Côte d'azur - Master 2 MBDS</h1>
      <h2>Technlogies JS : Projet Geipan</h2>
        
      Etudiants:
      <ul>
        <li>DIAZ Gabriel</li>
        <li>ZONGO S. H. Rachida</li>
      </ul>

      Enseignant : M. BUFFA Michel
      </div>
    )
  }
}

export default withStyles(styles)(Accueil);
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
        
      Etudiants:
        - DIAZ Gabriel
        - ZONGO S; H. Rachida
      </div>
    )
  }
}

export default withStyles(styles)(Accueil);
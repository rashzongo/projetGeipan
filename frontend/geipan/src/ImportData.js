import React, { Component } from 'react';
import { withStyles } from '@material-ui/styles';
import { Button } from '@material-ui/core';
import { IMPORT_DATA_PATH, SERVER_URL } from './constant';

const styles = {
};

class ImportData extends Component {
  
  constructor(props) {
		super(props);
		   
		this.state= {
      message: ""
    };
  }

  importData() {
    console.log('Import des données en cours');
    //this.setState({message: 'Import des données en cours ...'});
    let url = SERVER_URL + IMPORT_DATA_PATH;
    fetch(url)
      .then(response => response.json())
      .then(result => {
        console.log(result.msg);
        this.setState({message: result.msg});
      });
  }
  
 
  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <br></br>
        <Button variant="contained" color="primary" onClick={() => this.importData()}>Importer les données</Button>
        <div>{this.state.message}</div>
      </div>
    )
  }
}

export default withStyles(styles)(ImportData);
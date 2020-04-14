import React, { Component } from 'react';
import { withStyles } from '@material-ui/styles';
import { TEMOIGNAGES_PATH, SERVER_URL } from './constant';

const styles = {
};

class Statistiques extends Component {
  id = this.props.match.params.id
  
  constructor(props) {
		super(props);
		   
		this.state= {
    };
  }

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <p>Statistiques</p>
      </div>
    )
  }
}

export default withStyles(styles)(Statistiques);
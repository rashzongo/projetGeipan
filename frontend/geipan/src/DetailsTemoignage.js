import React, { Component } from 'react';
import { withStyles } from '@material-ui/styles';
import { TEMOIGNAGES_PATH, SERVER_URL } from './constant';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

const styles = {
};

class DetailsTemoignage extends Component {
  id = this.props.match.params.id
  
  constructor(props) {
		super(props);
		   
		this.state= {
      temoignage: {},
    };
    this.getTemoignage();
  }
  
  getTemoignage(){
    let url = SERVER_URL + TEMOIGNAGES_PATH + '/' + this.id;
    fetch(url)
      .then(response => response.json())
      .then(result => {
        this.setState({temoignage: result.data});
      });
  }

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <p>Temoignage :  {this.state.temoignage.id_temoignage}</p>
        <ExpansionPanel>
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
          Tous les détails du temoignage
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <div>
            {Object.keys(this.state.temoignage).map((key, index) => 
              <div value={key} key={key}>{key} : {this.state.temoignage[key]}</div>
            )}
            </div>
          </ExpansionPanelDetails>
        </ExpansionPanel>
      </div>
    )
  }
}

export default withStyles(styles)(DetailsTemoignage);
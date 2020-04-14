import React, { Component } from 'react';
import MaterialTable from 'material-table';
import { withStyles } from '@material-ui/styles';
import { CAS_PATH, SERVER_URL, TEMOIGNAGES_PATH } from './constant';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { InputLabel, Card, Input, OutlinedInput, FormControl, TextField, FormHelperText, Table } from '@material-ui/core';

const styles = {
  root: {},
  field: {
    '& > *': {
      margin: 10,
      width: '50%',
    },
  },
  table: {},
  row: {
    border: 'solid black 1px',
    '& > *': {
      border: 'solid black 1px',
      'vertical-align': 'text-top'
    }
  }
};

class DetailsCas extends Component {
  tableRef = React.createRef();
  id = this.props.match.params.id
  
  constructor(props) {
		super(props);
		   
		this.state= {
      case: {},
    };
    this.getCas();
  }
  
  getCas(){
    let url = SERVER_URL + CAS_PATH + '/' + this.id;
    fetch(url)
      .then(response => response.json())
      .then(result => {
        this.setState({case: result.data});
      });
  }

  goToTemoignage(id_cas) {
    this.props.history.push('/temoignage/' + id_cas);
  }

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <h1>Cas : {this.state.case.cas_nom_dossier}</h1>
        <Table  className={classes.table}>
          <tbody>
            <tr className={classes.row}>
              <td> Classe </td>
              <td> {this.state.case.cas_classification}</td>
            </tr>
            <tr className={classes.row}>
              <td> Zone </td>
              <td>{this.state.case.cas_zone_nom}</td>
            </tr>
            <tr className={classes.row}>
              <td> Date </td>
              <td> {this.state.case.cas_date}</td>
            </tr>
            <tr className={classes.row}>
              <td> Résumé </td>
              <td> {this.state.case.cas_resume}</td>
            </tr>
          </tbody>
        </Table>
        <ExpansionPanel>
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
          Tous les détails du cas
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <div>
            {Object.keys(this.state.case).map((key, index) => 
              <div value={key} key={key}>{key} : {this.state.case[key]}</div>
            )}
            </div>
          </ExpansionPanelDetails>
        </ExpansionPanel>
        

        {/* DataTable Temoignages */}
        <MaterialTable
          tableRef={this.tableRef}
          title="Temoignages du cas"
          columns={[
            { title: 'id', field: 'id_temoignage' },
          ]}
          options={{
            search: false
          }}
          data={query =>
            new Promise((resolve, reject) => {
              let url = SERVER_URL + CAS_PATH + '/' + 
              this.id + TEMOIGNAGES_PATH + '?';
              url += 'pageSize=' + query.pageSize;
              url += '&page=' + query.page;
              fetch(url)
                .then(response => response.json())
                .then(result => {
                  resolve({
                    data: result.data,
                    page: query.page,
                    totalCount: result.total,
                  })
                })
            })
          }
          actions={[
            {
              icon: 'infos',
              tooltip: 'Voir Plus',
              onClick: (event, rowData) => this.goToTemoignage(rowData.id_temoignage)
            }
          ]}
          localization={{
            pagination: {
                labelDisplayedRows: '{from}-{to} sur {count}',
                labelRowsSelect: 'résulats'
            },
            header: {
                actions: ''
            },
            body: {
                emptyDataSourceMessage: 'Aucun résultat'
            }
          }}
        />

        <ExpansionPanel>
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
          Tous les détails du cas
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <div>
            {Object.keys(this.state.case).map((key, index) => 
              <div value={key} key={key}>{key} : {this.state.case[key]}</div>
            )}
            </div>
          </ExpansionPanelDetails>
        </ExpansionPanel>
      </div>
    )
  }
}

export default withStyles(styles)(DetailsCas);
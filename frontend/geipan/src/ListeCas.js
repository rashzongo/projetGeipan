import React, { Component } from 'react';
import MaterialTable from 'material-table';
import { withStyles } from '@material-ui/styles';
import { FormControl, InputLabel, OutlinedInput, Select, MenuItem, TextField,} from '@material-ui/core';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

const styles = {
  root: {
    '& > *': {
      margin: 10,
    },
  },
  filters: {
    '& > *': {
      margin: 10,
      width: '30%',
    },
  }
};

class ListeCas extends Component {
  SEARCH_INPUT = 'searchInput';
  ZONE = 'zone';
  CATEGORY = 'category';
  START_DATE = 'startDate';
  END_DATE = 'endDate';
  SERVER_URL= 'http://localhost:1234';
  ZONES_PATH='/zones';
  CATEGORIES_PATH='/categories';
  CAS_PATH='/cas';
  tableRef = React.createRef();
  
  constructor(props) {
		super(props);
		   
		this.state= {
      searchInput: "",
      zone: "",
      category: "",
      startDate: "",
      endDate: "",
      allZones: ['Zone1', 'Zone2'],
      allCategories: ['Cat1', 'Cat2'],
      cases: []
    };
    this.getZones();
    this.getCategories();
  }
  
  handleChange(evt){
    const value = evt.target.value;
    this.setState({
      ...this.state,
      [evt.target.name]: value
    });
    this.tableRef.current.onQueryChange();
  };

  getZones(){
    let url = this.SERVER_URL + this.ZONES_PATH;
    fetch(url)
      .then(response => response.json())
      .then(result => {
        this.setState({allZones: result});
      });
  }

  getCategories(){
    let url = this.SERVER_URL + this.CATEGORIES_PATH;
    fetch(url)
      .then(response => response.json())
      .then(result => {
        this.setState({allCategories: result});
      });
  }

  goToCase(id_cas) {
    this.props.history.push('/cas/' + id_cas);
  }

  render() {
    const { classes } = this.props;
    const handleChange = (event) => {
     this.handleChange(event);
    };
    return (
      <div className={classes.root}>
        {/* Filters */}
        <ExpansionPanel defaultExpanded>
          <ExpansionPanelSummary
            expandIcon={<ExpandMoreIcon />}
          >
            <h2>Filtres de recherche</h2>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <form className={classes.filters} noValidate autoComplete="off">
              <FormControl variant="outlined">
                <InputLabel htmlFor={this.SEARCH_INPUT}>Mot clé</InputLabel>
                <OutlinedInput id={this.SEARCH_INPUT} name={this.SEARCH_INPUT} value={this.state.searchInput} onChange={handleChange} label="Mot clé" />
              </FormControl>

              <FormControl variant="outlined">
                <InputLabel htmlFor={this.ZONE}>Zone</InputLabel>
                <Select id={this.ZONE} name={this.ZONE} value={this.state.zone} onChange={handleChange} label="Zone">
                  <MenuItem value="" selected>Aucune</MenuItem>
                  {this.state.allZones.map((zone, index) => 
                  <MenuItem value={zone} key={zone}>{zone}</MenuItem>
                  )}
                  <MenuItem value={20}>20</MenuItem>
                </Select>
              </FormControl>

              <FormControl variant="outlined">
              <InputLabel htmlFor={this.CATEGORY}>Categorie</InputLabel>
                <Select id={this.CATEGORY} name={this.CATEGORY} value={this.state.category} onChange={handleChange} label="Categorie">
                  <MenuItem value="" selected>Aucune</MenuItem>
                  {this.state.allCategories.map((zone, index) => 
                  <MenuItem value={zone} key={zone}>{zone}</MenuItem>
                  )}
                  <MenuItem value={20}>B</MenuItem>
                </Select>
              </FormControl>

              <TextField
                type="date"
                id={this.START_DATE}
                name={this.START_DATE}
                value={this.state.startDate}
                onChange={handleChange}
                label="Du"
                InputLabelProps={{ shrink: true }}
                variant="outlined"
              />
              <TextField
                type="date"
                id={this.END_DATE}
                name={this.END_DATE}
                value={this.state.endDate}
                onChange={handleChange}
                label="Au"
                InputLabelProps={{ shrink: true }}
                variant="outlined"
              />
            </form>
          </ExpansionPanelDetails>
        </ExpansionPanel>
        
        {/* DataTable */}
        <h2>Résultats</h2>
        <MaterialTable
          tableRef={this.tableRef}
          title=""
          columns={[
            { title: 'Nom', field: 'cas_nom_dossier' },
            { title: 'Zone', field: 'cas_zone_nom' },
            { title: 'Categorie', field: 'cas_classification' },
            { title: 'Date', field: 'cas_date' },
          ]}
          options={{
            search: false
          }}
          data={query =>
            new Promise((resolve, reject) => {
              let url = 'http://localhost:1234/cas?'
              url += 'pageSize=' + query.pageSize
              url += '&page=' + query.page
              
              if(this.state.searchInput) {
                url += '&searchInput=' + this.state.searchInput
              }
              if(this.state.zone) {
                url += '&zone=' + this.state.zone
              }
              if(this.state.category) {
                url += '&category=' + this.state.category
              }
              if(this.state.startDate) {
                url += '&startDate=' + this.state.startDate
              }
              if(this.state.endDate) {
                url += '&endDate=' + this.state.endDate
              }
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
              onClick: (event, rowData) => this.goToCase(rowData.id_cas)
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
      </div>
    )
  }
}

export default withStyles(styles)(ListeCas);
import React, { Component } from 'react';
import MaterialTable from 'material-table';

class ListCas extends Component {
  render() {
    return (
      <MaterialTable
        title="Liste des Cas"
        columns={[
          { title: 'id', field: 'id_cas' },
          { title: 'Nom', field: 'cas_nom_dossier' },
          { title: 'Zone', field: 'cas_zone_nom' },
        ]}
        data={query =>
          new Promise((resolve, reject) => {
            let url = 'http://localhost:1234/cas?'
            url += 'pageSize=' + query.pageSize
            url += '&page=' + (query.page)
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
      />
    )
  }
}

export default ListCas;
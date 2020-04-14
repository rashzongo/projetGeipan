import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import React from 'react';
import { Link } from "react-router-dom";

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
}));

function App() {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const items = [ 
    {
      label: 'Accueil',
      link: '/accueil',
      value: 0
    }, {
      label: 'Importer les données',
      link: '/importData',
      value: 1
    },{
      label: 'Liste et Recherche de cas',
      link: '/listeCas',
      value: 2
    },{
      label: 'Statistiques',
      link: '/statistiques',
      value: 3
    },

  ]

  const classes = useStyles();
  return (
    <div className={classes.root}>
      <header>
        <AppBar position="static">
          <Tabs value={value} onChange={handleChange}>
            {items.map((item, index) => 
              <Tab label={item.label} value={item.value} key={item.link} component={Link} to={item.link}></Tab>
            )}
          </Tabs>
        </AppBar>
      </header>
    </div>
  );
}

export default App;
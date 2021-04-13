import './App.css';
import { AppBar, createMuiTheme, Toolbar, Typography, Button, makeStyles, Box } from '@material-ui/core';
import { withStyles } from '@material-ui/core'

const useStyles = makeStyles((theme) => ({
  title : {
    flexGrow : 1
  },
  appbarbutton : {
    marginRight : 20,
    paddingTop : 10
  },
  temp : {
    paddingTop : 10
  },
}))

const LandingStyles = makeStyles((theme) => ({
  temp2 : {
    color :"#4dffdb"
  },
  temp1 : {
    color :"#4dff9d"
  },
  temp3 : {
    color : "#3b3b3b"
  }
}))
const font = "'Montserrat', sans-serif";

const GreenHeading = withStyles({
  root: {
    color: "#45ffab",
    fontFamily : font,
    fontWeight : 700,
    letterSpacing: -2
  }
})(Typography);

const ButtonHeading = withStyles({
  root : {
    fontFamily : "Montserrat",
    fontWeight : "Black",
  }
})(Typography);

const Header = () => {
  const classes = useStyles();
  return (
    <div>
      <AppBar color='transparent' elevation={2} position="relative">
        <Toolbar>
        <GreenHeading variant="h4" className={classes.title}>
          Mindex.
        </GreenHeading>
        <Button className={classes.appbarbutton}>
          <Box fontWeight = {650} fontSize = {15} >
            LOGIN
          </Box>
        </Button>
        <Button variant="outlined" className = {classes.appbarbutton, classes.temp}>
          <Box fontWeight={650} fontSize = {15}>
            SIGN UP
          </Box>
        </Button>
        </Toolbar>
      </AppBar>
    </div>
  )
} 

const Page = () => {
  const classes = LandingStyles();
  return(
    <div class="split left">
        <Box fontFamily="Montserrat" fontSize={60} fontWeight={400} className={classes.temp3}>
          Turn your <Box fontFamily="Montserrat" fontSize={80} fontWeight={600} className={classes.temp2}>ideas</Box> into <Box fontFamily="Montserrat" fontSize={80} fontWeight={600} className={classes.temp1}>reality.</Box>
        </Box>
    </div>
  )
}

function App() {
  return (
      <div>
        <Header />
        <Page />
      </div>
  );
}

export {App};

import { makeStyles } from '@material-ui/core/styles';
import { deepPurple } from '@material-ui/core/colors';

export default makeStyles((theme) => ({
  appBar: {
    borderRadius: 15,
    margin: '20px 0', // Adjusted the top margin
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 50px', 
    fontSize: '1.74em', 
    position: 'sticky', // Added sticky position
    top: 0, // Stick to the top
    zIndex: 1000, // Ensure the app bar is above other elements
    background: 'white', // Change the background color if needed
  },
  heading: {
    color: 'rgba(0,183,255, 1)',
    textDecoration: 'none', 
    fontSize: '1em', 
  },
  image: {
    marginLeft: '15px',
  },
  toolbar: {
    display: 'flex',
    justifyContent: 'flex-end',
    width: '400px',
  },
  profile: {
    display: 'flex',
    justifyContent: 'space-between',
    width: '400px',
  },
  userName: {
    display: 'flex',
    alignItems: 'center',
  },
  brandContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  purple: {
    color: theme.palette.getContrastText(deepPurple[500]),
    backgroundColor: deepPurple[500],
  },
}));

import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { useHistory } from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import { useMainApp, UserTypeEnum } from 'hooks';
import userImage from 'assets/images/users.png';
import companiesImage from 'assets/images/companies.png';

const useStyles = makeStyles({
  root: {
    maxWidth: 345
  },
  media: {
    height: 140
  }
});

const Main = () => {
  const classes = useStyles();
  const history = useHistory();
  const goTo = (to) => history.push(to);
  const { currentUser } = useMainApp();

  return (
    <>
      <Grid item xs={6}>
        <Card className={classes.root}>
          <CardActionArea>
            <CardMedia className={classes.media} image={userImage} title="Users" />
            <CardContent>
              <Typography gutterBottom variant="h5" component="h2">
                Usuarios
              </Typography>
              <Typography variant="body2" color="textSecondary" component="p">
                Listado de todos los usuarios
              </Typography>
            </CardContent>
          </CardActionArea>
          <CardActions>
            <Button size="small" color="primary" onClick={() => goTo('/users')}>
              Mostrar Lista
            </Button>
          </CardActions>
        </Card>
      </Grid>
      {currentUser?.type === UserTypeEnum.superuser && (
        <Grid item xs={6}>
          <Card className={classes.root}>
            <CardActionArea>
              <CardMedia className={classes.media} image={companiesImage} title="Companies" />
              <CardContent>
                <Typography gutterBottom variant="h5" component="h2">
                  Negocios
                </Typography>
                <Typography variant="body2" color="textSecondary" component="p">
                  Listado de todos los negocios registrados
                </Typography>
              </CardContent>
            </CardActionArea>
            <CardActions>
              <Button size="small" color="primary" onClick={() => goTo('/business')}>
                Mostrar Lista
              </Button>
            </CardActions>
          </Card>
        </Grid>
      )}
    </>
  );
};

export default Main;

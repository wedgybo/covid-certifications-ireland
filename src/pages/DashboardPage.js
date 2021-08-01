import React from 'react';
import { Link as RouterLink, BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Container from '@material-ui/core/Container';
import Link from '@material-ui/core/Link';
import SettingsIcon from '@material-ui/icons/Settings';

import NegativeCovidCertificatePage from '../pages/NegativeCovidCertificatePage';
import CovidVaccineCertificatePage from '../pages/CovidVaccineCertificatePage';
import CovidRecoveryCertificatePage from '../pages/CovidRecoveryCertificatePage';
import SettingsPage from '../pages/SettingsPage';

function Copyright() {
    return (
        <Typography variant="body2" color="textSecondary" align="center">
            {'Copyright © '}
            <Link color="inherit" href="https://www.precisionhealth.ie/">
                Precision Healthcare
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
    },
    toolbar: {
        paddingRight: 24, // keep right padding when drawer closed
    },
    toolbarIcon: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: '0 8px',
        ...theme.mixins.toolbar,
    },
    appBar: {
        zIndex: theme.zIndex.drawer + 1,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
    },
    menuButton: {
        marginRight: 36,
    },
    menuButtonHidden: {
        display: 'none',
    },
    title: {
        // flexGrow: 1,
        marginRight: 20,
        textAlign: 'left',
    },
    spacer: {
        flexGrow: 1,
    },
    drawerPaper: {
        position: 'relative',
        whiteSpace: 'nowrap',
        width: drawerWidth,
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    drawerPaperClose: {
        overflowX: 'hidden',
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        width: theme.spacing(7),
        [theme.breakpoints.up('sm')]: {
            width: theme.spacing(9),
        },
    },
    appBarSpacer: theme.mixins.toolbar,
    content: {
        flexGrow: 1,
        height: '100vh',
        overflow: 'auto',
    },
    container: {
        paddingTop: theme.spacing(4),
        paddingBottom: theme.spacing(4),
    },
    paper: {
        padding: theme.spacing(2),
        display: 'flex',
        overflow: 'auto',
        flexDirection: 'column',
    },
    fixedHeight: {
        height: 240,
    },
}));

export default function DashboardPage() {
    const classes = useStyles();

    return (
        <div className={classes.root}>
            <Router>
                <CssBaseline />
                <AppBar position="absolute" className={classes.appBar}>
                    <Toolbar className={classes.toolbar}>
                        <Typography component="h1" variant="h6" color="inherit" noWrap className={classes.title}>
                            COVID Certifications
                        </Typography>
                        <Button component={RouterLink} to="/" color="secondary">Negative Certificate</Button>
                        {/* <Button component={RouterLink} to="/vaccine" color="secondary">Vaccine Certificate</Button>
                        <Button component={RouterLink} to="/recovery" color="secondary">Recovery Certificate</Button> */}
                        <div className={classes.spacer}></div>
                        <IconButton component={RouterLink} to="/settings" color="inherit">
                            <SettingsIcon />
                        </IconButton>
                    </Toolbar>

                </AppBar>
                <main className={classes.content}>
                    <div className={classes.appBarSpacer} />
                    <Switch>
                        <Route path="/settings" component={SettingsPage} />
                        <Route path="/vaccine" component={CovidVaccineCertificatePage} />
                        <Route path="/recovery" component={CovidRecoveryCertificatePage} />
                        <Route path="/" component={NegativeCovidCertificatePage} />
                    </Switch>
                    <Container maxWidth="lg" className={classes.container}>
                        <Box pt={4}>
                            <Copyright />
                        </Box>
                    </Container>
                </main>
            </Router>
        </div>
    );
}

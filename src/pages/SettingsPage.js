import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

import SettingsForm from '../components/SettingsForm';


const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
    },
}));

export default function SettingsPage() {
    const classes = useStyles();

    return (
        <div className={classes.root}>
            <SettingsForm />
        </div>
    );
}

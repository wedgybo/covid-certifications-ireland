import React, { useState } from 'react';

import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import KeyValueList from './KeyValueList';
import { useForm, Controller } from 'react-hook-form';
import { useSnackbar } from '../context/snackbar';
import { useAuth } from '../context/auth';
import { useConfig } from '../context/config';
import { useEmail } from '../context/email';
import { Typography } from '@material-ui/core';

import CertificateDialog from './CertificateDialog';

const useStyles = makeStyles((theme) => ({
    paper: {
        marginTop: theme.spacing(4),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: theme.spacing(2)
    },
}));

export default function SettingsForm({ onSubmit }) {
    const config = useConfig();
    const auth = useAuth();
    const email = useEmail();
    const classes = useStyles();

    const [open, setOpen] = useState(false);

    const defaultValues = {
        emailApiKey: config.get('emailApiKey') || '',
        emailFrom: config.get('emailFrom') || '',
        emailSubject: config.get('emailSubject') || '',
        emailText: config.get('emailText') || '',
        endpoint: config.get('endpoint') || '',
        clientId: config.get('clientId') || '',
        clientSecret: config.get('clientSecret') || '',
        testCentres: config.get('testCentres') || [],
        testManufacturers: config.get('testManufacturers') || [],
        testTypes: config.get('testTypes') || [],
    };

    const snackbar = useSnackbar();
    const { control, handleSubmit, formState: { errors, isDirty, isValid } } = useForm({
        defaultValues,
        mode: 'onChange'
    });

    const handleOnSubmit = (data) => {
        console.log('Saving settings', data);
        config.replace(data);
        snackbar.success('Settings updated successfully');
        if (onSubmit) {
            onSubmit(data);
        }
    };

    const handleTestCertificateDialog = () => {
        setOpen(true);
    }

    const onClose = () => {
        setOpen(false);
    }

    const handleHealthCheck = async () => {

        const healthCheck = await auth.healthCheck();
        window.alert(JSON.stringify(healthCheck));

        console.log('Health check', healthCheck);
    };

    const handleAuthCheck = async () => {

        const authCheck = await auth.authCheck();
        window.alert(JSON.stringify(authCheck));
        console.log('Auth check', authCheck);
    };

    const handleGetToken = async () => {

        const token = await auth.getToken();

        window.alert(JSON.stringify(token));
        console.log('Token', token);
    };

    const handleTestEmail = async () => {
        console.log('Test email');
        const msg = {
            to: 'me@jamiesutherland.com', // Change to your recipient
            from: 'me+health@jamiesutherland.com', // Change to your verified sender
            subject: 'Sending with SendGrid is Fun',
            text: 'and easy to do anywhere, even with Node.js',
            html: '<strong>and easy to do anywhere, even with Node.js</strong>',
        };
        const response = await email.send(msg);
        console.log('Response', response);
    };

    return (
        <Container component="main" maxWidth="md">
            <CertificateDialog open={open} onClose={onClose} certificate={({ unique_certificate_identifier: 'URN:UVCI:01:IE:1006868#6', report_html: '<h1>Report HTML test</h1>' })} />
            <div>
                <form id="settings">
                    <Paper align="center" className={classes.paper}>
                        <Typography variant="h6" component="h2">Department of Health API Settings</Typography>
                        <Controller
                            name="endpoint"
                            control={control}
                            rules={({ required: { value: true, message: 'Endpoint is required' } })}
                            render={({ field }) => (
                                <TextField
                                    autoFocus
                                    margin="dense"
                                    id="endpoint"
                                    name="endpoint"
                                    label="API Endpoint"
                                    type="text"
                                    fullWidth
                                    {...field}
                                    error={!!errors && !!errors.endpoint}
                                    helperText={errors && errors.endpoint && errors.endpoint.message}
                                />
                            )}
                        />
                        <Controller
                            name="clientId"
                            control={control}
                            rules={({ required: { value: true, message: 'Client ID is required' } })}
                            render={({ field }) => (
                                <TextField
                                    margin="dense"
                                    id="clientId"
                                    name="clientId"
                                    label="Client ID"
                                    type="text"
                                    fullWidth
                                    {...field}
                                    error={!!errors && !!errors.clientId}
                                    helperText={errors && errors.clientId && errors.clientId.message}
                                />
                            )}
                        />
                        <Controller
                            name="clientSecret"
                            control={control}
                            rules={({ required: { value: true, message: 'Client Secret is required' } })}
                            render={({ field }) => (
                                <TextField
                                    margin="dense"
                                    id="clientSecret"
                                    name="clientSecret"
                                    label="Client Secret"
                                    type="text"
                                    fullWidth
                                    {...field}
                                    error={!!errors && !!errors.clientSecret}
                                    helperText={errors && errors.clientSecret && errors.clientSecret.message}
                                />
                            )}
                        />
                    </Paper>

                    <Paper align="center" className={classes.paper}>
                        <Typography variant="h6" component="h2">SendGrid Settings</Typography>

                        <Controller
                            name="emailApiKey"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    margin="dense"
                                    id="emailApiKey"
                                    name="emailApiKey"
                                    label="SendGrid Email API Key"
                                    type="text"
                                    fullWidth
                                    {...field}
                                    error={!!errors && !!errors.emailApiKey}
                                    helperText={errors && errors.emailApiKey && errors.emailApiKey.message}
                                />
                            )}
                        />
                        <Controller
                            name="emailFrom"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    margin="dense"
                                    id="emailFrom"
                                    name="emailFrom"
                                    label="Email From Address"
                                    type="text"
                                    fullWidth
                                    {...field}
                                    error={!!errors && !!errors.emailFrom}
                                    helperText={errors && errors.emailFrom && errors.emailFrom.message}
                                />
                            )}
                        />
                        <Controller
                            name="emailSubject"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    margin="dense"
                                    id="emailSubject"
                                    name="emailSubject"
                                    label="Email Subject"
                                    type="text"
                                    fullWidth
                                    {...field}
                                    error={!!errors && !!errors.emailSubject}
                                    helperText={errors && errors.emailSubject && errors.emailSubject.message}
                                />
                            )}
                        />
                        <Controller
                            name="emailText"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    margin="dense"
                                    id="emailText"
                                    name="emailText"
                                    label="Email Text"
                                    type="text"
                                    fullWidth
                                    {...field}
                                    error={!!errors && !!errors.emailText}
                                    helperText={errors && errors.emailText && errors.emailText.message}
                                />
                            )}
                        />
                    </Paper>
                    <Paper align="center" className={classes.paper}>
                        <Typography variant="h6" component="h2">Test Centres</Typography>
                        <FormControl
                            fullWidth
                            margin="normal">
                            <Controller
                                name="testCentres"
                                control={control}
                                render={({ field }) => (
                                    <KeyValueList
                                        value={field.value}
                                        onChange={field.onChange}
                                        id="testCentres"
                                        name="testCentres"
                                        label="Test Centres"
                                    />
                                )}
                            />
                        </FormControl>
                    </Paper>
                    <Paper align="center" className={classes.paper}>
                        <Typography variant="h6" component="h2">Test Types</Typography>

                        <FormControl
                            fullWidth
                            margin="normal">
                            <Controller
                                name="testTypes"
                                control={control}
                                render={({ field }) => (
                                    <KeyValueList
                                        value={field.value}
                                        onChange={field.onChange}
                                        id="testTypes"
                                        name="testTypes"
                                        label="Test Types"
                                    />
                                )}
                            />
                        </FormControl>
                    </Paper>
                    <Paper align="center" className={classes.paper}>
                        <Typography variant="h6" component="h2">Test Manufacturers</Typography>

                        <FormControl
                            fullWidth
                            margin="normal">
                            <Controller
                                name="testManufacturers"
                                control={control}
                                render={({ field }) => (
                                    <KeyValueList
                                        value={field.value}
                                        onChange={field.onChange}
                                        id="testManufacturers"
                                        name="testManufacturers"
                                        label="Test Manufacturers"
                                    />
                                )}
                            />
                        </FormControl>
                    </Paper>

                    <Paper align="center" className={classes.paper}>

                        <Button onClick={handleSubmit(handleOnSubmit)} disabled={!isDirty || !isValid} color="primary">
                            Save
                        </Button>
                    </Paper>
                    <Paper align="center" className={classes.paper}>
                        <Button onClick={handleTestCertificateDialog} color="primary">
                            Test Certificate Dialog
                        </Button>
                        <Button onClick={handleTestEmail} color="primary">
                            Test Email
                        </Button>
                        <Button onClick={handleHealthCheck} color="primary">
                            Health Check
                        </Button>
                        <Button onClick={handleAuthCheck} color="primary">
                            Auth Check
                        </Button>
                        <Button onClick={handleGetToken} color="primary">
                            Get Token
                        </Button>
                    </Paper>
                </form>
            </div>
        </Container>
    );
}
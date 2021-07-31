import React, { useEffect, useState } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import CssBaseline from '@material-ui/core/CssBaseline';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import Grid from '@material-ui/core/Grid';
import VerifiedUserIcon from '@material-ui/icons/VerifiedUser';
import Typography from '@material-ui/core/Typography';
import { KeyboardDatePicker, KeyboardDateTimePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import { green, red } from '@material-ui/core/colors';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import DateFnsUtils from '@date-io/date-fns';
import { useForm, Controller } from 'react-hook-form';
import useFetch from 'use-http';
import { useSnackbar } from '../context/snackbar';
import { useEmail } from '../context/email';
import { useConfig } from '../context/config';
import CertificateDialog from './CertificateDialog';

const dateFns = new DateFnsUtils();

const GreenRadio = withStyles({
    root: {
        color: green[400],
        '&$checked': {
            color: green[600],
        },
    },
    checked: {},
})((props) => <Radio color="default" {...props} />);

const RedRadio = withStyles({
    root: {
        color: red[400],
        '&$checked': {
            color: red[600],
        },
    },
    checked: {},
})((props) => <Radio color="default" {...props} />);

const useStyles = makeStyles((theme) => ({
    paper: {
        marginTop: theme.spacing(4),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: theme.spacing(2)
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(1),
    },
    formTitle: {
        marginBottom: theme.spacing(2)
    },
    submit: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'left',
        '& > *': {
            margin: theme.spacing(1)
        }
    },
    formControl: {
        // margin: theme.spacing(1),
        minWidth: 120,
    },
    selectEmpty: {
        marginTop: theme.spacing(2),
    },
    details: {
        padding: theme.spacing(2),
    }
}));

const handleChange = () => { };

export default function TestCertificateForm() {
    const classes = useStyles();
    const snackbar = useSnackbar();
    const email = useEmail();
    const config = useConfig();

    const [certificate, setCertificate] = useState({
        unique_certificate_identifier: null,
        report_html: null
    });
    const [showCertificate, setShowCertificate] = useState(null);

    const { request, response } = useFetch('/covid-test-certificate/');

    // Material-ui pickers need a null if you want to start them off as blank.
    const defaultValues = {
        forename: null,
        surname: null,
        date_of_birth: null,
        sample_collection_time: new Date(),
        sample_id: null,
        test_centre: 'Precision Health',
        test_manufacturer: '1604',
        test_type: 'SARS-CoV-2 Antigen',
        test_result: 'negative',
        naa_test_name: ' ' // Required blank entry to get around API validation limitation
    };

    const { register, reset, control, handleSubmit, formState: { errors } } = useForm({ defaultValues });

    const clearForm = () => {

        console.log('Clear form');
        console.log('Errors', errors);
        reset(defaultValues);
    };

    const onSubmit = async (data) => {

        data.date_of_birth = dateFns.format(data.date_of_birth, 'yyyy-MM-dd');
        data.sample_collection_time = data.sample_collection_time.toISOString();
        console.log('Submitting data to create negative test certificate', data);
        const certificateRequest = await request.post(data);

        if (response.ok) {
            console.log('Response OK', certificate);

            const msg = {
                to: data.email, // Change to your recipient
                subject: config.get('emailSubject'),
                text: config.get('emailText'),
                html: certificate.report_html,
            };

            setCertificate(certificateRequest);
            setShowCertificate(true);
            await email.send(msg);

            snackbar.success('Certificate sent');
        } else {
            console.log('Response ERR', response);
            snackbar.error('Tests submission failed');
        }
    };

    const onCloseCertificate = () => {
        setShowCertificate(false);
    };

    return (
        <Container component="main" maxWidth="md">
            <CertificateDialog open={showCertificate} onClose={onCloseCertificate} certificate={certificate} />
            <CssBaseline />
            <div className={classes.paper}>
                <form className={classes.form} noValidate autoComplete="off">
                    <input type="hidden" {...register('naa_test_name')} />
                    <Paper align="center" className={classes.paper}>

                        <Avatar align="center" className={classes.avatar}>
                            <VerifiedUserIcon />
                        </Avatar>
                        <Typography component="h1" variant="h5" className={classes.formTitle}>
                            COVID Negative Test Certification
                        </Typography>
                        <FormControl variant="outlined" className={classes.formControl} fullWidth>
                            <InputLabel id="test-centre-label">Test centre</InputLabel>
                            <Controller
                                name="test_centre"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        {...field}
                                        labelId="test-centre-label"
                                        id="test_centre"
                                        name="test_centre"
                                        label="Test center"
                                        fullWidth
                                        required
                                    >
                                        {config.get('testCentres').map(tc => (<MenuItem value={tc.value}>{tc.key}</MenuItem>))}
                                    </Select>
                                )}
                            />
                        </FormControl>
                    </Paper>
                    <Paper className={classes.paper}>
                        <Typography align="left" component="h2" variant="h6">
                            Patient details
                        </Typography>
                        <Grid container align="left" spacing={2}>
                            <Grid item md={6} xs={12}>
                                <Controller
                                    name="forename"
                                    control={control}
                                    rules={({ required: { value: true, message: 'forename is required' } })}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            variant="outlined"
                                            margin="normal"
                                            required
                                            fullWidth
                                            id="forename"
                                            label="Forename"
                                            name="forename"
                                            autoFocus
                                            error={!!errors && errors.forename}
                                            helperText={errors && errors.forename && errors.forename.message}
                                        />
                                    )}
                                />
                            </Grid>
                            <Grid item md={6} xs={12}>
                                <Controller
                                    name="surname"
                                    control={control}
                                    rules={({ required: { value: true, message: 'Surname is required' } })}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            variant="outlined"
                                            margin="normal"
                                            required
                                            fullWidth
                                            id="surname"
                                            label="Surname"
                                            name="surname"
                                            error={!!errors && errors.surname}
                                            helperText={errors && errors.surname && errors.surname.message}
                                        />
                                    )}
                                />
                            </Grid>
                            <Grid item md={6} xs={12}>
                                <Controller
                                    name="email"
                                    control={control}
                                    rules={({ required: { value: true, message: 'Email is required' } })}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            variant="outlined"
                                            margin="normal"
                                            required
                                            fullWidth
                                            id="email"
                                            label="Email address"
                                            name="email"
                                            error={!!errors && errors.email}
                                            helperText={errors && errors.email && errors.email.message}
                                        />
                                    )}
                                />
                            </Grid>
                            <Grid item md={6} xs={12}>
                                <FormControl variant="outlined" required fullWidth className={classes.formControl}>
                                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                        <Controller
                                            control={control}
                                            name="date_of_birth"
                                            required
                                            placeholder="Date of Birth"
                                            defaultValue={new Date()}
                                            rules={({ required: { value: true, message: 'Date of Birth is required' } })}
                                            render={({ field: { ref, ...rest } }) => (
                                                <KeyboardDatePicker
                                                    margin="normal"
                                                    required
                                                    id="date_of_birth"
                                                    name="date_of_birth"
                                                    label="Date of Birth"
                                                    format="dd/MM/yyyy"
                                                    inputVariant="outlined"
                                                    KeyboardButtonProps={{
                                                        "aria-label": "select date of birth",
                                                    }}
                                                    invalidDateMessage={"Date of birth is required"}
                                                    fullWidth
                                                    error={!!errors && errors.date_of_birth}
                                                    helperText={errors && errors.date_of_birth && errors.date_of_birth.message}
                                                    {...rest}
                                                />
                                            )}
                                        />
                                    </ MuiPickersUtilsProvider>
                                </FormControl>
                            </Grid>
                        </Grid>
                    </Paper>

                    <Paper className={classes.paper}>
                        <Typography align="left" component="h2" variant="h6">
                            Test details
                        </Typography>
                        <Grid container spacing={2}>
                            <Grid item md={6} xs={12}>
                                <Controller
                                    name="sample_id"
                                    control={control}
                                    rules={({ required: { value: true, message: 'Sample ID is required' } })}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            variant="outlined"
                                            margin="normal"
                                            required
                                            fullWidth
                                            name="sample_id"
                                            label="Sample ID"
                                            id="sample_id"
                                            error={!!errors && errors.sample_id}
                                            helperText={errors && errors.sample_id && errors.sample_id.message}
                                        />
                                    )}
                                />
                            </Grid>
                            <Grid item md={6} xs={12}>
                                <FormControl variant="outlined" fullWidth className={classes.formControl}>
                                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                        <Controller
                                            control={control}
                                            name="sample_collection_time"
                                            placeholder="Sample collection time"
                                            defaultValue={new Date()}
                                            rules={({ required: { value: true, message: 'Sample collection time is required' } })}
                                            render={({ field: { ref, ...rest } }) => (
                                                <KeyboardDateTimePicker
                                                    margin="normal"
                                                    required
                                                    id="sample_collection_time"
                                                    name="sample_collection_time"
                                                    label="Sample collection time"
                                                    inputVariant="outlined"
                                                    value={new Date()}
                                                    KeyboardButtonProps={{
                                                        "aria-label": "select the sample collection time",
                                                    }}
                                                    invalidDateMessage={"Sample collection time is required"}
                                                    fullWidth
                                                    error={!!errors && errors.sample_collection_time}
                                                    helperText={errors && errors.sample_collection_time && errors.sample_collection_time.message}
                                                    {...rest}
                                                />
                                            )}
                                        />
                                    </ MuiPickersUtilsProvider>
                                </FormControl>
                            </Grid>
                            <Grid item md={6} xs={12}>
                                <FormControl
                                    variant="outlined"
                                    fullWidth
                                    error={!!errors && errors.test_type}
                                    margin="normal">
                                    <InputLabel id="test-type-label">Type</InputLabel>
                                    <Controller
                                        name="test_type"
                                        control={control}
                                        rules={({ required: { value: true, message: 'Test type is required' } })}
                                        render={({ field }) => (
                                            <Select
                                                {...field}
                                                labelId="test-type-label"
                                                id="test_type"
                                                required
                                                error={!!errors && errors.test_type}
                                            >
                                                {config.get('testTypes').map(tc => (<MenuItem value={tc.value}>{tc.key}</MenuItem>))}
                                                {/* <MenuItem value="SARS-CoV-2 Antigen">SARS-CoV-2 Antigen</MenuItem>
                                                <MenuItem value="LP217198-3">SARS-CoV-2 Antigen (LP217198-3)</MenuItem> */}
                                            </Select>
                                        )}
                                    />
                                    {!!errors && errors.test_type && (<FormHelperText>{errors && errors.test_type && errors.test_type.message}</FormHelperText>)}

                                </FormControl>
                            </Grid>
                            <Grid item md={6} xs={12}>
                                <FormControl
                                    variant="outlined"
                                    fullWidth
                                    error={!!errors && errors.test_manufacturer}
                                    margin="normal">
                                    <InputLabel id="test-manufacturer-label">Manufacturer</InputLabel>
                                    <Controller
                                        name="test_manufacturer"
                                        control={control}
                                        rules={({ required: { value: true, message: 'Endpoint is required' } })}
                                        render={({ field }) => (
                                            <Select
                                                {...field}
                                                labelId="test-manufacturer-label"
                                                id="test_manufacturer"
                                                required
                                                error={!!errors && errors.test_manufacturer}
                                            >
                                                {config.get('testManufacturers').map(tc => (<MenuItem value={tc.value}>{tc.key}</MenuItem>))}
                                                {/* <MenuItem value="1604">Roche SD Biosensor Test Kit (1604)</MenuItem>
                                                <MenuItem value="1833">Test Manufacturer (1833)</MenuItem> */}
                                            </Select>
                                        )}
                                    />
                                    {!!errors && errors.test_manufacturer && (<FormHelperText>{errors && errors.test_manufacturer && errors.test_manufacturer.message}</FormHelperText>)}
                                </FormControl>
                            </Grid>
                            <Grid item md={12} xs={12}>
                                <FormControl component="fieldset" margin="normal">
                                    <FormLabel component="legend">Test result</FormLabel>
                                    <RadioGroup row aria-label="test result" name="test_result" value="negative" onChange={handleChange} {...register('test_result')}>
                                        <FormControlLabel value="negative" control={<GreenRadio />} label="Negative" />
                                        <FormControlLabel value="positive" control={<RedRadio />} label="Positive" />
                                    </RadioGroup>
                                </FormControl>
                            </Grid>
                        </Grid>
                    </Paper>
                    <Paper className={classes.paper}>
                        <Typography component="h3" variant="subtitle1">I confirm that the above details are correct to the best of my knowledge</Typography>
                        <div className={classes.submit}>
                            <div className={classes.spacer}></div>
                            <Button variant="contained" color="secondary" onClick={clearForm}>Clear</Button>
                            <Button variant="contained" color="primary" onClick={handleSubmit(onSubmit)}>Create Test Certificate</Button>
                        </div>
                    </Paper>
                </form>
            </div>
        </Container>
    );
}
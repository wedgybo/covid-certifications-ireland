import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

const useStyles = makeStyles((theme) => ({
    html: {
        marginTop: theme.spacing(4),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: theme.spacing(2)
    },
}));

export default function CertificateDialog({ open, onClose, certificate }) {
    const classes = useStyles();

    return (
        <div>
            <form id="settings">
                <Dialog open={open} onClose={onClose} aria-labelledby="form-dialog-title">
                    <DialogTitle id="form-dialog-title">Negative Test Certificate</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Unique Certificate Identifier: {certificate.unique_certificate_identifier}
                        </DialogContentText>
                        { <div className={classes.html} dangerouslySetInnerHTML={{ __html: certificate.report_html }} /> }
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={onClose} color="primary">
                            Close
                        </Button>
                    </DialogActions>
                </Dialog>
            </form>
        </div>
    );
}
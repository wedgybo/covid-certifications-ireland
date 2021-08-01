import React, { useState } from 'react';
import IconButton from '@material-ui/core/IconButton';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import DeleteIcon from '@material-ui/icons/Delete';
import AddIcon from '@material-ui/icons/Add';


export default function KeyValueList(props) {

    const [keyValues, setKeyValues] = useState(props.value || []);
    const [key, setKey] = useState('');
    const [value, setValue] = useState('');


    const handleOnKeyChange = (event) => {
            setKey(event.target.value);
    };

    const handleOnValueChange = (event) => {
            setValue(event.target.value);
    };

    const handleAdd = (data) => {
        if (key !== '' && value !== '') {

            const newKeyValues = [...keyValues, { key, value }];
            setKeyValues(newKeyValues);
            props.onChange(newKeyValues);

            setKey('');
            setValue('');
        }
    };

    const handleDelete = (index) => {
        return () => {
            console.log('Deleting item at index', index);
            const newKeyValues = [...keyValues];
            newKeyValues.splice(index, 1);
            setKeyValues(newKeyValues);
            props.onChange(newKeyValues);
        }
    };

    return (
        <div>
            <Grid container spacing={2}>
                <Grid item xs={5}>
                    Label
                </Grid>
                <Grid item xs={5}>
                    Value
                </Grid>
                <Grid item xs={2}>

                </Grid>
            </Grid>
            <Grid container spacing={2}>
                {
                    keyValues.map((kvp, index) => (
                        <React.Fragment key={kvp.key}>
                            <Grid item xs={5}>
                                <TextField disabled value={kvp.key} />
                            </Grid>
                            <Grid item xs={5}>
                                <TextField disabled value={kvp.value} />
                            </Grid>
                            <Grid item xs={2}>
                                <IconButton aria-label="delete" onClick={handleDelete(index)}>
                                    <DeleteIcon />
                                </IconButton>
                            </Grid>
                        </React.Fragment>
                    ))
                }
            </Grid>
            <Grid container spacing={2}>
                <Grid item xs={5}>
                    <TextField name="key" value={key} onChange={handleOnKeyChange} />
                </Grid>
                <Grid item xs={5}>
                    <TextField name="value" value={value} onChange={handleOnValueChange} />
                </Grid>
                <Grid item xs={2}>
                    <IconButton aria-label="add" onClick={handleAdd}>
                        <AddIcon />
                    </IconButton>
                </Grid>
            </Grid>
        </div>
    );
}
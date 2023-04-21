import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import { Link } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
        borderRadius: '0.5rem',
        backgroundColor: '#f2f2f2',
        boxShadow: '0 0.25rem 0.5rem rgba(0, 0, 0, 0.1)',
        maxWidth: '30%',
        margin: '1rem',
        [theme.breakpoints.down('sm')]: {
            maxWidth: '80%',
        },
    },
    input: {
        margin: '0.2rem 0',
    },
    button: {
        margin: '1rem 0',
        backgroundColor: '#ff0000',
        color: '#fff',
        '&:hover': {
            backgroundColor: '#cc0000',
        },
    },
    logo: {
        marginBottom: '1rem',
        maxWidth: '100%',
    },
}));

const Signup = () => {
    const classes = useStyles();
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [emailError, setEmailError] = useState(false);
    const [passwordError, setPasswordError] = useState(false);
    const [fullnameError, setFullnameError] = useState(false);

    const validateEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    }

    const validatePassword = (password) => {
        return password.length >= 4;
    }

    const validatefullName = (fullName) => {
        return fullName.length >= 8;
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!email) {
            setEmailError('Email is required');
            return;
        } else if (!validateEmail(email)) {
            setEmailError('Please enter a valid email address');
            return;
        } else {
            setEmailError('');
        }

        if (!password) {
            setPasswordError('Password is required');
            return;
        } else if (!validatePassword(password)) {
            setPasswordError('Password should be at least 4 characters long');
            return;
        } else {
            setPasswordError('');
        }

        if (!fullName) {
            setFullnameError('fullName is required');
            return;
        } else if (!validatefullName(password)) {
            setFullnameError('fullName should be at least 8 characters long');
            return;
        } else {
            setFullnameError('');
        }
        console.log(`Full Name: ${fullName} Email: ${email} Password: ${password}`);
    };

    return (
        <div className={classes.root}>
            <form onSubmit={handleSubmit} className={classes.form}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <img src="https://lenvica.com/wp-content/uploads/2021/05/KRA-P9Form.png" alt="logo" className={classes.logo} />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            label="Full Name"
                            variant="outlined"
                            fullWidth
                            className={classes.input}
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            error={Boolean(emailError)}
                            helperText={emailError}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            label="Email"
                            variant="outlined"
                            fullWidth
                            className={classes.input}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            error={Boolean(passwordError)}
                            helperText={passwordError}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            label="Password"
                            variant="outlined"
                            fullWidth
                            className={classes.input}
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            error={Boolean(fullnameError)}
                            helperText={fullnameError}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Button type="submit" variant="contained" className={classes.button}>
                            Sign up
                        </Button>
                    </Grid>
                    <Grid item xs={12}>
                    <Button variant="text" style={{ color: '#ff6666' }}>Forgot password?</Button>
                    </Grid>
                    <Grid item xs={12}>
                        <Link to="/Login" style={{ color: '#ff6666' }}>Already registered click to? Login</Link>
                    </Grid>
                </Grid>
            </form>
        </div>
    );
};

export default Signup;

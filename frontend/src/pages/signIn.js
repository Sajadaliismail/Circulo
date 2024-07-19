import React, { useState } from 'react';
import {
  Avatar,
  Button,
  CssBaseline,
  TextField,
  FormControlLabel,
  Checkbox,
  Link,
  Paper,
  Box,
  Grid,
  Typography
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

import { createTheme, ThemeProvider } from '@mui/material/styles';
import {useNavigate} from 'react-router-dom'

import { object, string } from 'yup';
import Copyright from './copyright';
import { Logo } from './logoComponent';

const validationSchema = object({
  email: string().email('Invalid email').required('Email is required'),
  password: string().required('Password is required').min(6, 'Password must be at least 6 characters'),
});


const defaultTheme = createTheme();

export default function SignInSide() {
  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    validationSchema.validate({
        email: data.get('email'),
        password: data.get('password'),
      }, { abortEarly: false })
      .then(() => {
        // Handle form submission
        console.log('Form data is valid:', data);
        setErrors({})
      })
      .catch((err) => {
        const newErrors = {};
        err.inner.forEach((error) => {
          newErrors[error.path] = error.message;
        });
        setErrors(newErrors);
        console.log(newErrors);
      });
    console.log({
      email: data.get('email'),
      password: data.get('password'),
    });
  };

  const navigate = useNavigate()
  const [errors, setErrors] = useState({});

  

  return (
    
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
                        <Logo/>

            <Typography component="h1" variant="h5">
              Sign in
            </Typography>
            <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                error={!!errors.email}
        helperText={errors.email}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                error={!!errors.password}
                helperText={errors.password}
              />
              <FormControlLabel
                control={<Checkbox value="remember" color="primary" />}
                label="Remember me"
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Sign In
              </Button>
              <Grid container>
                <Grid item xs>
                  <Link  onClick={()=>navigate('/resetpassword')} sx={{ cursor: 'pointer' }}  variant="body2">
                    Forgot password?
                  </Link>
                </Grid>
                <Grid item>
                  <Link  onClick={()=>navigate('/signup')} sx={{ cursor: 'pointer' }} variant="body2">
                    {"Don't have an account? Sign Up"}
                  </Link>
                </Grid>
              </Grid>
              <Copyright   sx={{ mt: 5 }} />  
            </Box>
          </Box>
  
  );
}
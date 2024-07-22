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

import {useNavigate} from 'react-router-dom'

import { object, string } from 'yup';
import { Logo } from './logoComponent';
import Copyright from './copyright';
import { useDispatch } from 'react-redux';
import { signin } from '../feautures/auth/authAsyncThunks';

const validationSchema = object({
  email: string().email('Invalid email').required('Email is required'),
  password: string().required('Password is required'),
});



export default function SignInSide() {
  const [formData,setFormData] = useState({email:'',password:''})
  const [errors, setErrors] = useState({});
  
  const dispatch = useDispatch()
  const navigate = useNavigate()
  
  const handleInput =(event)=>{
    event.preventDefault()
     const { name, value } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  }
  const handleSubmit = (event) => {
    event.preventDefault();
    validationSchema.validate(formData, { abortEarly: false })
      .then(() => {
        setErrors({})
        dispatch(signin(formData))
        console.log('ent');

      })
      .catch((err) => {
        const newErrors = {};
        err.inner.forEach((error) => {
          newErrors[error.path] = error.message;
        });
        setErrors(newErrors);
        console.log(newErrors);
      });
    
  };


  

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
                value={formData.email}
                error={!!errors.email}
                helperText={errors.email}
                onChange={handleInput}
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
                value={formData.password}
                error={!!errors.password}
                helperText={errors.password}
                onChange={handleInput}
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
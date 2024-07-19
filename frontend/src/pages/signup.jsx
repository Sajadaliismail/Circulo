import React, { useEffect, useState } from 'react';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import FormHelperText from '@mui/material/FormHelperText';
import { months, years, errorState, validateForm, formValues } from './signupUtils';
import { Box} from '@mui/material';
import Copyright from './copyright';
import { useNavigate } from 'react-router-dom';
import { signupStyle } from './Style';
import { useDispatch, useSelector } from 'react-redux';
import { signup } from '../feautures/auth/authAsyncThunks';
import {  useSnackbar } from 'notistack';
import { Logo } from './logoComponent';
import { setError } from '../feautures/auth/authSlice';

function SignUp() {
  const [errors, setErrors] = useState(errorState);
  const [formData,setFormData] = useState(formValues)
  const {error} = useSelector((state)=>state.auth)
   const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const validatedData = await validateForm(formData);
      if (validatedData) {
        setErrors(validatedData);
        return
      } 
        setErrors(errorState);
        const resultAction = await dispatch(signup(formData));

      if (signup.fulfilled.match(resultAction)) {
        navigate('/verify');
      } else{
        dispatch(setError({err:'Some unexpected error occured'}))
      }
      
    } catch (error) {
        dispatch(setError({err:'Some unexpected error occured'}))
    }
    
  };

  useEffect(()=>{
   Object.values(error).forEach((val) => {
        enqueueSnackbar(val, { variant: 'error' });
      });
    }
  , [error, enqueueSnackbar]);

  function handleInput(e){
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  }

  const renderTextField = (name, label, type = 'text') => (
    <TextField
      required
      fullWidth
      name={name}
      label={label}
      type={type}
      id={name}
      autoComplete={name}
      error={errors[name].error}
      helperText={errors[name].error ? errors[name].message : ''}
      value={formData[name]}
      onChange={handleInput}
    />
  );

  const renderSelectField = (name, label, options) => (
    <FormControl fullWidth>
      <InputLabel id={`${name}-label`}>{label}</InputLabel>
      <Select
        label={label}
        labelId={`${name}-label`}
        id={name}
        name={name}
        value={formData[name]}
        error={errors[name].error}
        onChange={handleInput}
      >
        {options.map((option) => (
          <MenuItem key={option.value || option} value={option.value || option}>
            {option.label || option}
          </MenuItem>
        ))}
      </Select>
      {errors[name].error && (
        <FormHelperText sx={signupStyle.errorText}>{errors[name].message}</FormHelperText>
      )}
    </FormControl>
  );

  return (
    <>
          <Box
            sx={signupStyle.grid}>
          <Logo/>
            <Typography component="h1" variant="h5">
              Sign up
            </Typography>
            <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3, width: '100%' }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  {renderTextField('firstName','First Name')}
                </Grid>
                <Grid item xs={12} sm={6}>
                {renderTextField('lastName','Last Name')}
                </Grid>
                <Grid item xs={12}>
                {renderTextField('email','Email Address','email')}
                </Grid>
                <Grid item xs={12}>
                {renderTextField('password', 'Password', 'password')}
                </Grid>
                <Grid item xs={12}>
                {renderTextField('cnf_password', 'Confirm password', 'password')}
                </Grid>
                <Grid item xs={12} sm={6}>
                {renderSelectField('birthMonth', 'Birth Month', months)}
                </Grid>
                <Grid item xs={12} sm={6}>
                {renderSelectField('birthYear', 'Birth Year', years)}
                </Grid>
              </Grid>
              <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
                Sign Up
              </Button>
              <Grid container justifyContent="flex-end">
                <Grid item>
                  <Link onClick={()=>navigate('/login')} sx={{ cursor: 'pointer' }}  variant="body2">
                    Already have an account? Sign in
                  </Link>
                </Grid>
              </Grid>
              <Copyright/>  
            </Box>
          </Box>
    
    </>
 
  );
}

export default SignUp;



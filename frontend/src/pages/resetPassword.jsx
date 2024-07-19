import { Box, Button, Checkbox, Grid, Paper, TextField, Typography } from "@mui/material";
import Copyright from "./copyright";
import { MuiOtpInput } from 'mui-one-time-password-input'
import { useEffect, useState } from "react";
import { Logo } from "./logoComponent";



export default function ResetPassword() {
    const [count,setCount] = useState(60)

    const [otp, setOtp] = useState('')
    const decrementCount = () => {
        setCount((prevCount) => {
            if (prevCount <= 1) {
                return 0;
            }
            return prevCount - 1;
        });
    };

    useEffect(() => {
        const timer = setInterval(decrementCount, 1000);
        return () => clearInterval(timer);
    }, []);

    const handleChange = (newValue) => {
        setOtp(newValue)
    }

  
    return (
        <>
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
                        Reset password
                    </Typography>
                    <Box component="form" noValidate sx={{ mt: 1, width: '100%' }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Enter linked Email Address"
                            name="email"
                            autoComplete="email"
                            autoFocus

                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Send OTP
                        </Button>
                        <MuiOtpInput length={6} value={otp} onChange={handleChange} />
                        <Box sx={{display:'flex', justifyContent:'space-around'}}>

                        <Button
                            variant="contained"
                            sx={{ mt: 3, mb: 'auto' }}
                            >
                            Proceed
                        </Button>
                        <Button
                            variant="contained"
                            sx={{ mt: 3, mb: 5 }}
                            disabled={count===0?false:true}
                            onClick={()=>{
                                setCount(60)
                            }}
                            >
                            Resend OTP {count>0 && `(${count})`}
                        </Button>
                            </Box>
                            <Grid container spacing={2}>
                            <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type="password"
                    id="password"
                    autoComplete="new-password"
                    // error={errors.password.error}
                    // helperText={errors.password.error ? errors.password.message : ''}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    name="cnf_password"
                    label="Confirm password"
                    type="password"
                    id="cnf_password"
                    autoComplete="new-cnf_password"
                    // error={errors.cnf_password.error}
                    // helperText={errors.cnf_password.error ? errors.cnf_password.message : ''}
                  />
                </Grid>
                            </Grid>
                <Button variant="contained">
                    Change Password
                </Button>

                        <Copyright sx={{ mt: 5, mx: 'auto' }} />
                    </Box>
                </Box>
        </>
    )
}
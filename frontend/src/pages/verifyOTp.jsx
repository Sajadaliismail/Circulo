import { Box, Button, Checkbox, Grid, Paper, TextField, Typography } from "@mui/material";
import Copyright from "./copyright";
import { MuiOtpInput } from 'mui-one-time-password-input'
import { useEffect, useState } from "react";
import { Logo } from "./logoComponent";



export default function VerifyOtp() {
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
                    <Typography component="h1" variant="h4" sx={{mt:5}}>
                       Verify Account
                    </Typography>
                    <Box component="form" noValidate sx={{ mt: 5, width: '100%' }}>
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
                            

                        <Copyright sx={{ mt: 5, mx: 'auto' }} />
                    </Box>
                </Box>
        </>
    )
}
import React, { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  FormControl,
  FormHelperText,
  Grid,
  InputAdornment,
  IconButton,
  InputLabel,
  OutlinedInput,
  Typography,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useFormik } from "formik";
import { NavLink, useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { usePostApiMutation } from "../../redux/apiSlice";
import useAlerts from "../../hooks/useAlerts";
import { login } from "../../redux/authSlice";
import { useDispatch, useSelector } from "react-redux";

const LogIn = () => {
  const authToken = useSelector((state) => state.auth);
  const { success, error } = useAlerts();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [logIn, { isLoading: isLogIn }] = usePostApiMutation({
    authToken,
  });

  const [showPassword, setShowPassword] = useState(false);

  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    password: Yup.string().required("Password is required"),
  });

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        const response = await logIn({
          endpoint: "auth/login",
          body: values,
        });

        if (response.data?.success) {
          dispatch(login(response.data?.data));
          success(response.data?.message);
          navigate(response.data?.data?.role === "admin" ? "/admin" : "/");
        } else {
          error(response.error?.data?.message || "Log in failed");
        }
      } catch (err) {
        error("Failed to log in. Please try again.");
      }
    },
  });

  const handleClickShowPassword = () => setShowPassword((prev) => !prev);

  return (
    <Box
      height="100vh"
      display="flex"
      justifyContent="center"
      alignItems="center"
    >
      <Card sx={{ width: 500 }}>
        <CardContent>
          <Typography variant="h5" align="center" gutterBottom>
            Log In
          </Typography>

            <Box component="form"
        onSubmit={formik.handleSubmit}>
            <Grid item xs={12} md={12}>
              <FormControl
                fullWidth
                variant="outlined"
                margin="normal"
                error={formik.touched.email && Boolean(formik.errors.email)}
              >
                <InputLabel htmlFor="email">Email</InputLabel>
                <OutlinedInput
                  id="email"
                  name="email"
                  type="email"
                  label="Email"
                  {...formik.getFieldProps("email")}
                />
                <FormHelperText>
                  {formik.touched.email && formik.errors.email}
                </FormHelperText>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={12}>
              <FormControl
                fullWidth
                variant="outlined"
                margin="normal"
                error={
                  formik.touched.password && Boolean(formik.errors.password)
                }
              >
                <InputLabel htmlFor="password">Password</InputLabel>
                <OutlinedInput
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  label="Password"
                  {...formik.getFieldProps("password")}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        onClick={handleClickShowPassword}
                        edge="end"
                        aria-label="toggle password visibility"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  }
                />
                <FormHelperText>
                  {formik.touched.password && formik.errors.password}
                </FormHelperText>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={12}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                disabled={formik.isSubmitting || isLogIn}
                sx={{ marginTop: 2 }}
              >
                {isLogIn ? "Loading..." : "Log In"}
              </Button>
            </Grid>
            </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default LogIn;

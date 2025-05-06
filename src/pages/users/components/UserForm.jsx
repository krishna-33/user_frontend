import React, { useState } from "react";
import {
  Button,
  Box,
  Typography,
  Avatar,
  Stack,
  InputAdornment,
  IconButton,
  FormControl,
  OutlinedInput,
  InputLabel,
  FormHelperText,
} from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const UserForm = ({
  initialValues,
  onSubmit,
  isLoading,
  buttonLabel = "Submit",
  isEdit = false,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const validationSchema = Yup.object({
    name: Yup.string().required("Name is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    phoneNumber: Yup.string()
      .required("Phone number is required")
      .test(
        "is-digits-only",
        "Phone number must not contain letters or special characters",
        (value) => /^\d*$/.test(value)
      )
      .length(10, "Phone number must be exactly 10 digits"),
    ...(isEdit
      ? {}
      : {
          password: Yup.string()
            .required("Password is required")
            .min(4, "Password must be at least 4 characters")
            .max(20, "Password cannot exceed 20 characters")
            .matches(
              /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]+$/,
              "Password must contain at least one letter and one number"
            ),
        }),
  });

  const formik = useFormik({
    initialValues,
    enableReinitialize: true,
    validationSchema,
    onSubmit,
  });

  const handleClickShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  const renderField = (label, name, type = "text", disabled = false) => (
    <FormControl
      fullWidth
      margin="normal"
      variant="outlined"
      error={formik.touched[name] && Boolean(formik.errors[name])}
    >
      <InputLabel htmlFor={name}>{label}</InputLabel>
      <OutlinedInput
        id={name}
        name={name}
        type={type}
        value={formik.values[name]}
        onChange={formik.handleChange}
        disabled={disabled}
        label={label}
      />
      <FormHelperText>
        {formik.touched[name] && formik.errors[name]}
      </FormHelperText>
    </FormControl>
  );

  return (
    <>
      <Typography variant="h5" gutterBottom>
        {buttonLabel === "Update" ? "Edit User" : "Create New User"}
      </Typography>

      <Box
        component="form"
        onSubmit={formik.handleSubmit}
        sx={{
          display: "flex",
          flexDirection: "column",
          width: "600px",
        }}
      >
        {renderField("Name", "name")}
        {renderField("Email", "email", "email", isEdit)}

        {!isEdit && (
          <FormControl
            variant="outlined"
            fullWidth
            margin="normal"
            error={formik.touched.password && Boolean(formik.errors.password)}
          >
            <InputLabel htmlFor="password">Password</InputLabel>
            <OutlinedInput
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              value={formik.values.password}
              onChange={formik.handleChange}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    onClick={handleClickShowPassword}
                    edge="end"
                    aria-label="toggle password visibility"
                  >
                    { showPassword ? <Visibility /> : <VisibilityOff /> }
                  </IconButton>
                </InputAdornment>
              }
              label="Password"
            />
            <FormHelperText>
              {formik.touched.password && formik.errors.password}
            </FormHelperText>
          </FormControl>
        )}

        {renderField("Phone Number", "phoneNumber")}
        {renderField("Address", "address")}

        <Box sx={{ mt: 2, mb:2 }}>
          <Stack
            direction="row"
            spacing={2}
            alignItems="center"
            justifyContent={"center"}
            sx={{ mb: 2 }}
          >
            <Avatar
              alt={formik.values.name}
              src={
                formik.values.profilePicture instanceof File
                  ? URL.createObjectURL(formik.values.profilePicture)
                  : formik.values.profilePicture
              }
              sx={{ width: 64, height: 64 }}
            />
          </Stack>

          <input
            id="profilePicture"
            name="profilePicture"
            type="file"
            accept="image/*"
            onChange={(event) =>
              formik.setFieldValue(
                "profilePicture",
                event.currentTarget.files[0]
              )
            }
          />
          {formik.touched.profilePicture && formik.errors.profilePicture && (
            <Typography variant="caption" color="error">
              {formik.errors.profilePicture}
            </Typography>
          )}
        </Box>

        <Button variant="contained" disabled={isLoading} type="submit">
          {isLoading ? "Loading..." : buttonLabel}
        </Button>
      </Box>
    </>
  );
};

export default UserForm;

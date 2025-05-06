import React from "react";
import UserForm from "./components/UserForm";
import { usePostApiMutation } from "../../redux/apiSlice";
import { useSelector } from "react-redux";
import useAlerts from "../../hooks/useAlerts";
import { useNavigate } from "react-router-dom";

const UserCreateForm = () => {
  const authToken = useSelector((state) => state.auth.authToken);
  const { success, error } = useAlerts();
  const navigate = useNavigate();
  const [addNewUser, { isLoading }] = usePostApiMutation();

  const initialValues = {
    name: "",
    email: "",
    password: "",
    phoneNumber: "",
    address: "",
    profilePicture: null,
  };

  const handleSubmit = async (values) => {
    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) => {
      if (key === "profilePicture" && value) {
        formData.append(key, value);
      } else {
        formData.append(key, value || "");
      }
    });

    try {
      const response = await addNewUser({
        endpoint: "users",
        authToken,
        body: formData,
      });
      if (response?.data?.success) {
        success("User created successfully!");
        navigate("/");
      } else {
        error(response?.error?.data?.message || "Failed to add user");
      }
    } catch (err) {
      error(err?.message || "Something went wrong!");
    }
  };

  return (
    <UserForm
      initialValues={initialValues}
      onSubmit={handleSubmit}
      isLoading={isLoading}
      buttonLabel="Create User"
      isEdit={false}
    />
  );
};

export default UserCreateForm;

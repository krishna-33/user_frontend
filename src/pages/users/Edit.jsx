import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import UserForm from "./components/UserForm";
import {
  useUpdateUserByIdMutation,
  useGetUserByIdQuery,
} from "../../redux/apiSlice";
import useAlerts from "../../hooks/useAlerts";
import NoDataDiv from "../../common/nodatadiv";
import Loader from "../../common/loader";

const UserEditForm = () => {
  const { id } = useParams();
  const authToken = useSelector((state) => state.auth.authToken);
  const { success, error } = useAlerts();
  const navigate = useNavigate();

  const {
    data,
    isLoading: isFetching,
    error: fetchError,
    refetch,
  } = useGetUserByIdQuery({ id, authToken });
  const [updateUser, { isLoading }] = useUpdateUserByIdMutation();

  const initialValues = data?.data
    ? {
        name: data.data?.name || "",
        email: data.data?.email || "",
        phoneNumber: data.data?.phoneNumber || "",
        address: data.data?.address || "",
        profilePicture: data.data?.profilePicture || "",
      }
    : null;

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
      const response = await updateUser({
        endpoint: `users/${id}`,
        authToken,
        body: formData,
      });
      if (response?.data?.success) {
        await refetch();
        success("User updated successfully!");
        navigate("/");
      } else {
        error(response?.error?.data?.message || "Failed to update user");
      }
    } catch (err) {
      error(err?.message || "Something went wrong!");
    }
  };

  return (
    <>
      <Loader open={isLoading || isFetching} />
      {!(isFetching || isFetching) && fetchError && (
        <NoDataDiv title={"Failed to load user details"} />
      )}
      {(!(isLoading || isFetching) || initialValues) && (
        <UserForm
          initialValues={initialValues}
          onSubmit={handleSubmit}
          isLoading={isLoading}
          buttonLabel="Update"
          isEdit={true}
        />
      )}
    </>
  );
};

export default UserEditForm;

import React from "react";
import { useParams } from "react-router-dom";
import { useGetUserByIdQuery } from "../../redux/apiSlice";
import { Container, Typography, Paper, Box, Avatar } from "@mui/material";
import { useSelector } from "react-redux";
import NoDataDiv from "../../common/nodatadiv";
import Loader from "../../common/loader";

const UserProfile = () => {
  const { id } = useParams();
  const authToken = useSelector((state) => state.auth.authToken);

  const { data, isLoading, isError } = useGetUserByIdQuery({
    id,
    authToken,
  });

  return (
    <Container maxWidth="sm" sx={{ mt: 4, width: "700px" }}>
      <Loader open={isLoading} />
      <Paper elevation={3} sx={{ p: 4 }}>
        {!isLoading || isError || Object.values(data?.data).length == 0 ? (
          <NoDataDiv
            title={isError ? "Failed to Load User Details" : "No details found"}
          />
        ) : (
          <>
            <Typography variant="body1" gutterBottom>
              {`Profile Details - #${data?.data?.id}`}
            </Typography>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                m: 2,
              }}
            >
              <Avatar alt={data?.data?.name} src={data?.data?.profilePicture} />
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <Typography variant="body1" sx={{ fontWeight: 600, mr: 1 }}>
                Name:{" "}
              </Typography>
              <Typography variant="body1">{data?.data?.name}</Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mr: 1 }}>
                Email:{" "}
              </Typography>
              <Typography variant="body1">{data?.data?.email}</Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mr: 1 }}>
                Phone Number:{" "}
              </Typography>
              <Typography variant="body1">{data?.data?.phoneNumber}</Typography>
            </Box>
          </>
        )}
      </Paper>
    </Container>
  );
};

export default UserProfile;

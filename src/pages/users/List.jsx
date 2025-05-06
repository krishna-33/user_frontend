import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Stack,
  Paper,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TablePagination,
  IconButton,
  Avatar,
} from "@mui/material";
import { useGetUsersQuery, useDeleteByIdMutation } from "../../redux/apiSlice";
import Loader from "../../common/loader";
import NoDataDiv from "../../common/nodatadiv";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useSelector } from "react-redux";
import { selectUser } from "../../redux/authSlice";
import useAlerts from "../../hooks/useAlerts";
import ConfirmDialog from "../../common/dialog";

const columns = ["Profile", "Name", "Email", "Phone Number", "Actions"];

const Row = ({ row, onView, onEdit, onDelete, loginUser }) => (
  <TableRow hover tabIndex={-1} key={row.id}>
    <TableCell>
      <Avatar alt={row.name} src={row.profilePicture} />
    </TableCell>
    <TableCell>{row.name}</TableCell>
    <TableCell>{row.email}</TableCell>
    <TableCell>{row.phoneNumber}</TableCell>
    <TableCell>
      <IconButton onClick={() => onView(row.id)}>
        <VisibilityIcon />
      </IconButton>
      {loginUser?.role === "admin" || loginUser?.id === row.id ? (
        <IconButton onClick={() => onEdit(row.id)}>
          <EditIcon />
        </IconButton>
      ) : null}

      {loginUser?.role === "admin" && row.role == "user" ? (
        <IconButton onClick={() => onDelete(row.id)}>
          <DeleteIcon color="error" />
        </IconButton>
      ) : null}
    </TableCell>
  </TableRow>
);

const UserList = () => {
  const loginUser = useSelector(selectUser);
  const authToken = useSelector((state) => state?.auth?.authToken);
  const { success, error } = useAlerts();
  const [isDelete, setIsDelete] = useState(false);
  const [userId, setUserId] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const { data, isLoading, refetch } = useGetUsersQuery({
    endpoint: "users",
    authToken,
    page: page + 1,
    limit: rowsPerPage,
  });

  const [deleteUser, { isLoading: isDeleting }] = useDeleteByIdMutation();
  const navigate = useNavigate();

  useEffect(() => {
    refetch();
  }, [refetch, page, rowsPerPage, authToken]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const onView = (id) => navigate(`/profile/${id}`);
  const onEdit = (id) => navigate(`/profile/edit/${id}`);
  const onDelete = (id) => {
    setIsDelete(true);
    setUserId(id);
  };

  const handleDelete = async () => {
    try {
      const res = await deleteUser({ id: userId, authToken });
      if (res?.data?.success) {
        success("User deleted successfully");
        refetch();
      } else {
        error(res?.error?.data?.message || "Failed to delete user");
      }
    } catch (err) {
      error(err.message || "Something went wrong");
    } finally {
      setIsDelete(false);
    }
  };

  const users = data?.data?.users || [];
  const pagination = data?.data?.pagination || { total: 0 };

  return (
    <Paper sx={{ width: "100%", overflow: "hidden" }}>
      <Loader open={isLoading || isDeleting} />
      {loginUser?.role === "admin" && (
        <Stack direction="row" justifyContent="flex-end" sx={{ p: 2 }}>
          <Button variant="contained" onClick={() => navigate("/create")}>
            New User
          </Button>
        </Stack>
      )}

      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="users table">
          <TableHead>
            <TableRow>
              {columns.map((column, index) => (
                <TableCell
                  key={`${column}-${index}`}
                  style={{ minWidth: 170, fontWeight: 900 }}
                >
                  {column}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {users.length > 0 ? (
              users.map((row) => (
                <Row
                  key={row.id}
                  row={row}
                  onView={onView}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  loginUser={loginUser}
                />
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5}>
                  <NoDataDiv title="No Entries Found" />
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[5, 10, 15, 20]}
        component="div"
        count={pagination.total || 0}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      <ConfirmDialog
        open={isDelete}
        setOpen={setIsDelete}
        title="Delete User"
        description="Are you sure you want to delete this user?"
        onConfirm={handleDelete}
        confirmText="Delete"
        cancelText="Cancel"
      />
    </Paper>
  );
};

export default UserList;

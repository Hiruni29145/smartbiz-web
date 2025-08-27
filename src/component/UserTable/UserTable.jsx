import React from "react";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Tooltip,
  Chip,
  Avatar,
  Switch,
  TablePagination,
  TableSortLabel,
  Box,
  Typography,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";

const roleChipColor = (role) => {
  switch (role) {
    case "Admin":
      return "error";
    case "Manager":
      return "warning";
    default:
      return "default";
  }
};

const UserTable = ({
  users,
  onEdit,
  onDelete,
  onToggleActive,
  sortBy,
  sortDirection,
  onSort,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
  total,
}) => {
  const handleSort = (field) => () => onSort(field);

  return (
    <Paper sx={{ overflow: "hidden" }}>
      <TableContainer>
        <Table size="medium">
          <TableHead sx={{ backgroundColor: "#f1f5f9" }}>
            <TableRow>
              <TableCell>
                <TableSortLabel
                  active={sortBy === "name"}
                  direction={sortBy === "name" ? sortDirection : "asc"}
                  onClick={handleSort("name")}
                >
                  Name
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortBy === "email"}
                  direction={sortBy === "email" ? sortDirection : "asc"}
                  onClick={handleSort("email")}
                >
                  Email
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortBy === "role"}
                  direction={sortBy === "role" ? sortDirection : "asc"}
                  onClick={handleSort("role")}
                >
                  Role
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortBy === "status"}
                  direction={sortBy === "status" ? sortDirection : "asc"}
                  onClick={handleSort("status")}
                >
                  Status
                </TableSortLabel>
              </TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {users.length === 0 && (
              <TableRow>
                <TableCell colSpan={5}>
                  <Box py={6} textAlign="center">
                    <Typography color="text.secondary">No users found</Typography>
                  </Box>
                </TableCell>
              </TableRow>
            )}

            {users.map((user) => (
              <TableRow key={user.id} hover>
                <TableCell>
                  <Box display="flex" alignItems="center" gap={1.5}>
                    <Avatar sx={{ bgcolor: "#164e63" }}>
                      {user.name?.charAt(0)?.toUpperCase() || "U"}
                    </Avatar>
                    <Typography>{user.name}</Typography>
                  </Box>
                </TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Chip size="small" label={user.role} color={roleChipColor(user.role)} />
                </TableCell>
                <TableCell>
                  <Switch
                    checked={user.status === "Active"}
                    onChange={() => onToggleActive(user.id)}
                    inputProps={{ "aria-label": "toggle user status" }}
                  />
                  <Typography component="span" sx={{ ml: 1 }} color="text.secondary">
                    {user.status}
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <Tooltip title="Edit">
                    <IconButton onClick={() => onEdit(user)}>
                      <Edit sx={{ color: "#10b981" }} />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <IconButton onClick={() => onDelete(user.id)}>
                      <Delete sx={{ color: "#ef4444" }} />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={total}
        page={page}
        onPageChange={onPageChange}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={onRowsPerPageChange}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </Paper>
  );
};

export default UserTable;
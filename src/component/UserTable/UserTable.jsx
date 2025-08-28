import React from "react";
import {
  Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  IconButton, Tooltip, Chip, Avatar, Switch, TablePagination, TableSortLabel,
  Box, Typography
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";

const roleChipColor = (role) => {
  switch (role) {
    case "Admin": return "error";
    case "Manager": return "warning";
    default: return "default";
  }
};

const UserTable = ({
  // Generic mode
  columns,
  rows,
  renderActions,

  // Legacy user mode
  users,

  // Shared
  onEdit, onDelete, onToggleActive,
  sortBy, sortDirection, onSort,
  page, rowsPerPage, onPageChange, onRowsPerPageChange, total,
  emptyMessage = "No records found",
}) => {
  const isGeneric = Array.isArray(columns) && columns.length > 0;
  const data = isGeneric ? (rows || []) : (users || []);
  const handleSort = (field) => () => onSort?.(field);

  return (
    <Paper sx={{ overflow: "hidden" }}>
      <TableContainer>
        <Table size="medium">
          <TableHead sx={{ backgroundColor: "#f1f5f9" }}>
            <TableRow>
              {isGeneric ? (
                <>
                  {columns.map((col) => (
                    <TableCell key={col.id} align={col.align || "left"}>
                      {col.sortable ? (
                        <TableSortLabel
                          active={sortBy === col.id}
                          direction={sortBy === col.id ? sortDirection : "asc"}
                          onClick={handleSort(col.id)}
                        >
                          {col.label}
                        </TableSortLabel>
                      ) : (col.label)}
                    </TableCell>
                  ))}
                  {(renderActions || onEdit || onDelete) && <TableCell align="right">Actions</TableCell>}
                </>
              ) : (
                <>
                  <TableCell>
                    <TableSortLabel active={sortBy === "name"} direction={sortBy === "name" ? sortDirection : "asc"} onClick={handleSort("name")}>Name</TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel active={sortBy === "email"} direction={sortBy === "email" ? sortDirection : "asc"} onClick={handleSort("email")}>Email</TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel active={sortBy === "role"} direction={sortBy === "role" ? sortDirection : "asc"} onClick={handleSort("role")}>Role</TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel active={sortBy === "status"} direction={sortBy === "status" ? sortDirection : "asc"} onClick={handleSort("status")}>Status</TableSortLabel>
                  </TableCell>
                  <TableCell align="right">Actions</TableCell>
                </>
              )}
            </TableRow>
          </TableHead>

          <TableBody>
            {data.length === 0 && (
              <TableRow>
                <TableCell colSpan={isGeneric ? (columns.length + 1) : 5}>
                  <Box py={6} textAlign="center"><Typography color="text.secondary">{emptyMessage}</Typography></Box>
                </TableCell>
              </TableRow>
            )}

            {data.map((row) =>
              isGeneric ? (
                <TableRow key={row.id} hover>
                  {columns.map((col) => (
                    <TableCell key={col.id} align={col.align || "left"}>
                      {col.render ? col.render(row) : String(row[col.id] ?? "")}
                    </TableCell>
                  ))}
                  {(renderActions || onEdit || onDelete) && (
                    <TableCell align="right">
                      {renderActions ? renderActions(row) : (
                        <>
                          {onEdit && <Tooltip title="Edit"><IconButton onClick={() => onEdit(row)}><Edit sx={{ color: "#10b981" }} /></IconButton></Tooltip>}
                          {onDelete && <Tooltip title="Delete"><IconButton onClick={() => onDelete(row.id)}><Delete sx={{ color: "#ef4444" }} /></IconButton></Tooltip>}
                        </>
                      )}
                    </TableCell>
                  )}
                </TableRow>
              ) : (
                <TableRow key={row.id} hover>
                  <TableCell>
                    <Box display="flex" alignItems="center" gap={1.5}>
                      <Avatar sx={{ bgcolor: "#164e63" }}>{row.name?.charAt(0)?.toUpperCase() || "U"}</Avatar>
                      <Typography>{row.name}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>{row.email}</TableCell>
                  <TableCell><Chip size="small" label={row.role} color={roleChipColor(row.role)} /></TableCell>
                  <TableCell>
                    <Switch checked={row.status === "Active"} onChange={() => onToggleActive?.(row.id)} />
                    <Typography component="span" sx={{ ml: 1 }} color="text.secondary">{row.status}</Typography>
                  </TableCell>
                  <TableCell align="right">
                    {onEdit && <Tooltip title="Edit"><IconButton onClick={() => onEdit(row)}><Edit sx={{ color: "#10b981" }} /></IconButton></Tooltip>}
                    {onDelete && <Tooltip title="Delete"><IconButton onClick={() => onDelete(row.id)}><Delete sx={{ color: "#ef4444" }} /></IconButton></Tooltip>}
                  </TableCell>
                </TableRow>
              )
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={total ?? data.length}
        page={page ?? 0}
        onPageChange={onPageChange || (() => {})}
        rowsPerPage={rowsPerPage ?? 5}
        onRowsPerPageChange={onRowsPerPageChange || (() => {})}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </Paper>
  );
};

export default UserTable;
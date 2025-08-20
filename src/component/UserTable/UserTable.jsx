import { Table, TableBody, TableCell, TableHead, TableRow, IconButton, Paper } from "@mui/material"
import { Edit, Delete } from "@mui/icons-material"

const UserTable = ({ users, onEdit, onDelete }) => {
  return (
    <Paper>
      <Table>
        <TableHead sx={{ backgroundColor: "#f1f5f9" }}>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Role</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.role}</TableCell>
              <TableCell align="right">
                <IconButton onClick={() => onEdit(user)}>
                  <Edit sx={{ color: "#10b981" }} />
                </IconButton>
                <IconButton onClick={() => onDelete(user.id)}>
                  <Delete sx={{ color: "#ef4444" }} />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  )
}

export default UserTable

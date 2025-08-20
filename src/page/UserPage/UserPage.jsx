import { useState } from "react"
import { Box, Typography, Button, TextField } from "@mui/material"
import { Add } from "@mui/icons-material"
import UserFormModal from "../../component/UserFormModal/UserFormModal"
import UserTable from "../../component/UserTable/UserTable"

const UserPage = () => {
    const [users, setUsers] = useState([
        { id: 1, name: "Hiruni", email: "hiruni@example.com", role: "Admin" },
        { id: 2, name: "Kasun", email: "kasun@example.com", role: "Manager" },
        { id: 3, name: "Prarthana", email: "Prarthana@example.com", role: "Manager" },
        { id: 4, name: "Nimal", email: "Nimal@example.com", role: "Manager" },
    ])

    const [open, setOpen] = useState(false)
    const [editingUser, setEditingUser] = useState(null)

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        role: "User",
    })

    const handleOpen = (user = null) => {
        setEditingUser(user)
        setFormData(
            user || { name: "", email: "", password: "", role: "User" }
        )
        setOpen(true)
    }

    const handleClose = () => setOpen(false)

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSave = () => {
        if (editingUser) {
            setUsers(users.map((u) => (u.id === editingUser.id ? { ...formData, id: u.id } : u)))
        } else {
            setUsers([...users, { ...formData, id: Date.now() }])
        }
        handleClose()
    }

    const handleDelete = (id) => {
        setUsers(users.filter((u) => u.id !== id))
    }

    return (
        <Box p={3}>
            <Typography variant="h4" mb={3} sx={{ fontWeight: 700, color: "#164e63" }}>
                User Management
            </Typography>

            {/* Actions */}
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <TextField label="Search user..." size="small" />
                <Button
                    startIcon={<Add />}
                    variant="contained"
                    sx={{ backgroundColor: "#164e63" }}
                    onClick={() => handleOpen()}
                >
                    Add User
                </Button>
            </Box>

            {/* Table */}
            <UserTable users={users} onEdit={handleOpen} onDelete={handleDelete} />

            {/* Modal */}
            <UserFormModal
                open={open}
                handleClose={handleClose}
                handleSubmit={e => { e.preventDefault(); handleSave(); }}
                formData={formData}
                handleChange={handleChange}
            />
        </Box>
    )
}

export default UserPage

import { useMemo, useState } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  InputAdornment,
  Chip,
} from "@mui/material";
import { Add, Search } from "@mui/icons-material";
import UserFormModal from "../../component/UserFormModal/UserFormModal";
import UserTable from "../../component/UserTable/UserTable";

const roles = ["Admin", "Manager", "User"];

const initialUsers = [
  { id: 1, name: "Hiruni", email: "hiruni@example.com", role: "Admin", status: "Active" },
  { id: 2, name: "Kasun", email: "kasun@example.com", role: "Manager", status: "Active" },
  { id: 3, name: "Prarthana", email: "prarthana@example.com", role: "Manager", status: "Inactive" },
  { id: 4, name: "Nimal", email: "nimal@example.com", role: "User", status: "Active" },
];

const defaultForm = { name: "", email: "", password: "", role: "User", status: "Active" };

const UserPage = () => {
  const [users, setUsers] = useState(initialUsers);

  // modal/editing
  const [open, setOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState(defaultForm);

  // filters/search/sort/pagination
  const [query, setQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sort, setSort] = useState({ field: "name", direction: "asc" });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleOpen = (user = null) => {
    setEditingUser(user);
    setFormData(user ? { ...user, password: "" } : defaultForm);
    setOpen(true);
  };
  const handleClose = () => setOpen(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((f) => ({ ...f, [name]: value }));
  };

  const handleSave = () => {
    if (!formData.name?.trim() || !formData.email?.trim()) return;

    if (editingUser) {
      setUsers((prev) =>
        prev.map((u) =>
          u.id === editingUser.id
            ? {
                ...u,
                name: formData.name.trim(),
                email: formData.email.trim(),
                role: formData.role,
                status: formData.status,
              }
            : u
        )
      );
    } else {
      setUsers((prev) => [
        ...prev,
        {
          id: Date.now(),
          name: formData.name.trim(),
          email: formData.email.trim(),
          role: formData.role,
          status: formData.status,
        },
      ]);
    }
    handleClose();
  };

  const handleDelete = (id) => setUsers((prev) => prev.filter((u) => u.id !== id));
  const handleToggleActive = (id) =>
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, status: u.status === "Active" ? "Inactive" : "Active" } : u))
    );

  const handleSort = (field) => {
    setSort((s) => {
      const direction = s.field === field && s.direction === "asc" ? "desc" : "asc";
      return { field, direction };
    });
  };

  const filteredSorted = useMemo(() => {
    const q = query.toLowerCase();
    let data = users.filter((u) => {
      const matchesQuery =
        u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || u.role.toLowerCase().includes(q);
      const matchesRole = roleFilter === "All" || u.role === roleFilter;
      const matchesStatus = statusFilter === "All" || u.status === statusFilter;
      return matchesQuery && matchesRole && matchesStatus;
    });

    if (sort.field) {
      data = data.sort((a, b) => {
        const aVal = String(a[sort.field]).toLowerCase();
        const bVal = String(b[sort.field]).toLowerCase();
        if (aVal < bVal) return sort.direction === "asc" ? -1 : 1;
        if (aVal > bVal) return sort.direction === "asc" ? 1 : -1;
        return 0;
      });
    }
    return data;
  }, [users, query, roleFilter, statusFilter, sort]);

  const total = filteredSorted.length;
  const paginated = useMemo(() => {
    const start = page * rowsPerPage;
    return filteredSorted.slice(start, start + rowsPerPage);
  }, [filteredSorted, page, rowsPerPage]);

  // simple KPIs
  const activeCount = users.filter((u) => u.status === "Active").length;
  const adminCount = users.filter((u) => u.role === "Admin").length;

  return (
    <Box p={3}>
      {/* Header */}
      <Stack direction={{ xs: "column", sm: "row" }} alignItems={{ xs: "flex-start", sm: "center" }} justifyContent="space-between" spacing={2} mb={3}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, color: "#164e63" }}>
            User Management
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage users, roles and access
          </Typography>
        </Box>
        <Button startIcon={<Add />} variant="contained" sx={{ backgroundColor: "#164e63" }} onClick={() => handleOpen()}>
          Add User
        </Button>
      </Stack>

      {/* KPI cards */}
      <Stack direction={{ xs: "column", md: "row" }} spacing={2} mb={3}>
        <Paper sx={{ p: 2, flex: 1 }}>
          <Typography variant="overline" color="text.secondary">Total Users</Typography>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>{users.length}</Typography>
        </Paper>
        <Paper sx={{ p: 2, flex: 1 }}>
          <Typography variant="overline" color="text.secondary">Active</Typography>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>{activeCount}</Typography>
        </Paper>
        <Paper sx={{ p: 2, flex: 1 }}>
          <Typography variant="overline" color="text.secondary">Admins</Typography>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>{adminCount}</Typography>
        </Paper>
      </Stack>

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 2 }}>
        <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
          <TextField
            placeholder="Search by name or email"
            size="small"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(0);
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
            sx={{ minWidth: 240 }}
          />
          <FormControl size="small" sx={{ minWidth: 160 }}>
            <InputLabel>Role</InputLabel>
            <Select
              label="Role"
              value={roleFilter}
              onChange={(e) => {
                setRoleFilter(e.target.value);
                setPage(0);
              }}
            >
              <MenuItem value="All">All</MenuItem>
              {roles.map((r) => (
                <MenuItem key={r} value={r}>
                  {r}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 160 }}>
            <InputLabel>Status</InputLabel>
            <Select
              label="Status"
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(0);
              }}
            >
              <MenuItem value="All">All</MenuItem>
              <MenuItem value="Active">Active</MenuItem>
              <MenuItem value="Inactive">Inactive</MenuItem>
            </Select>
          </FormControl>
        </Stack>
      </Paper>

      {/* Table */}
      <UserTable
        users={paginated}
        total={total}
        page={page}
        rowsPerPage={rowsPerPage}
        sortBy={sort.field}
        sortDirection={sort.direction}
        onSort={handleSort}
        onPageChange={(_, newPage) => setPage(newPage)}
        onRowsPerPageChange={(e) => {
          setRowsPerPage(parseInt(e.target.value, 10));
          setPage(0);
        }}
        onEdit={handleOpen}
        onDelete={handleDelete}
        onToggleActive={handleToggleActive}
      />

      {/* Modal */}
      <UserFormModal
        open={open}
        handleClose={handleClose}
        handleSubmit={(e) => {
          e.preventDefault();
          handleSave();
        }}
        formData={formData}
        handleChange={handleChange}
      />
    </Box>
  );
};

export default UserPage;
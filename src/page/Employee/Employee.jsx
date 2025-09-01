import React, { useMemo, useState } from "react";
import {
  Box, Typography, Button, Paper, TextField, Stack, InputAdornment, Chip, Grid
} from "@mui/material";
import { Add, Search } from "@mui/icons-material";
import UserFormModal from "../../component/UserFormModal/UserFormModal";
import UserTable from "../../component/UserTable/UserTable";

const roles = ["Owner", "Manager", "Stores", "Cashier"];
const statuses = ["Active", "Inactive"];

// Example businesses (replace with shared data later if you have it)
const businesses = [
  { id: 1, name: "Acme Ltd" },
  { id: 2, name: "Sunrise Mart" },
];

const initialEmployees = [
  { id: 1, businessId: 1, name: "Sahan Perera", email: "sahan@acme.com", salary: 90000, role: "Manager", status: "Active", joined_date: "2024-04-10" },
  { id: 2, businessId: 2, name: "Isha Kumari", email: "isha@sunrise.com", salary: 65000, role: "Cashier", status: "Inactive", joined_date: "2024-03-21" },
];

const Employee = () => {
  const [rows, setRows] = useState(initialEmployees);

  // modal/edit
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    businessId: businesses[0].id,
    name: "",
    email: "",
    salary: "",
    role: "Manager",
    status: "Active",
    joined_date: "",
  });

  // search/sort/pagination
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState("name"); // name | email | role | status | salary | business | joined_date
  const [dir, setDir] = useState("asc");
  const [page, setPage] = useState(0);
  const [rpp, setRpp] = useState(5);

  const businessName = (id) => businesses.find((b) => b.id === Number(id))?.name || "—";

  // Table columns for generic UserTable
  const columns = [
    { id: "name", label: "Name", sortable: true },
    { id: "email", label: "Email", sortable: true },
    { id: "business", label: "Business", sortable: true, render: (r) => businessName(r.businessId) },
    { id: "role", label: "Role", sortable: true, render: (r) => <Chip size="small" label={r.role} /> },
    { id: "status", label: "Status", sortable: true, render: (r) => <Chip size="small" label={r.status} color={r.status === "Active" ? "success" : "default"} /> },
    { id: "salary", label: "Salary", sortable: true, render: (r) => new Intl.NumberFormat().format(r.salary) },
    { id: "joined_date", label: "Joined", sortable: true },
  ];

  // Sorting + search
  const filteredSorted = useMemo(() => {
    const q = query.toLowerCase();

    const accessor = (row, key) => {
      if (key === "business") return businessName(row.businessId);
      return row[key];
    };

    let data = rows.filter((r) => {
      const hay = [
        r.name,
        r.email,
        r.role,
        r.status,
        String(r.salary),
        businessName(r.businessId),
      ]
        .join(" ")
        .toLowerCase();
      return hay.includes(q);
    });

    data = data.sort((a, b) => {
      const A = String(accessor(a, sortBy) ?? "").toLowerCase();
      const B = String(accessor(b, sortBy) ?? "").toLowerCase();
      if (A < B) return dir === "asc" ? -1 : 1;
      if (A > B) return dir === "asc" ? 1 : -1;
      return 0;
    });

    return data;
  }, [rows, query, sortBy, dir]);

  const total = filteredSorted.length;
  const paged = filteredSorted.slice(page * rpp, page * rpp + rpp);

  // CRUD handlers
  const openAdd = () => {
    setEditing(null);
    setForm({
      businessId: businesses[0].id,
      name: "",
      email: "",
      salary: "",
      role: "Manager",
      status: "Active",
      joined_date: "",
    });
    setOpen(true);
  };
  const openEdit = (row) => {
    setEditing(row);
    setForm({
      businessId: row.businessId,
      name: row.name,
      email: row.email,
      salary: row.salary,
      role: row.role,
      status: row.status,
      joined_date: row.joined_date,
    });
    setOpen(true);
  };
  const save = () => {
    if (!form.name.trim() || !form.email.trim()) return;

    const clean = {
      ...form,
      businessId: Number(form.businessId),
      salary: Number(form.salary) || 0,
      name: form.name.trim(),
      email: form.email.trim(),
    };

    if (editing) {
      setRows((prev) => prev.map((r) => (r.id === editing.id ? { ...editing, ...clean } : r)));
    } else {
      setRows((prev) => [...prev, { id: Date.now(), ...clean }]);
    }
    setOpen(false);
  };
  const remove = (id) => setRows((prev) => prev.filter((r) => r.id !== id));

  // KPIs (just UI counters)
  const totalCount = rows.length;
  const activeCount = rows.filter((r) => r.status === "Active").length;
  const managerCount = rows.filter((r) => r.role === "Manager").length;

  return (
    <Box p={3}>
      {/* Header */}
      <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" alignItems={{ xs: "flex-start", sm: "center" }} spacing={2} mb={3}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, color: "#164e63" }}>Employees</Typography>
          <Typography variant="body2" color="text.secondary">Manage employees, roles and assignments</Typography>
        </Box>
        <Button startIcon={<Add />} variant="contained" sx={{ backgroundColor: "#164e63" }} onClick={openAdd}>
          Add Employee
        </Button>
      </Stack>

      {/* KPIs */}
      <Grid container spacing={2} mb={2}>
        <Grid item xs={12} sm={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="overline" color="text.secondary">Total Employees</Typography>
            <Typography variant="h5" sx={{ fontWeight: 700 }}>{totalCount}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="overline" color="text.secondary">Active</Typography>
            <Typography variant="h5" sx={{ fontWeight: 700 }}>{activeCount}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="overline" color="text.secondary">Managers</Typography>
            <Typography variant="h5" sx={{ fontWeight: 700 }}>{managerCount}</Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Search */}
      <Paper sx={{ p: 2, mb: 2 }}>
        <TextField
          placeholder="Search employees (name, email, business, role)"
          size="small"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setPage(0); }}
          InputProps={{ startAdornment: <InputAdornment position="start"><Search /></InputAdornment> }}
          sx={{ width: 360 }}
        />
      </Paper>

      {/* Table */}
      <UserTable
        columns={columns}
        rows={paged}
        sortBy={sortBy}
        sortDirection={dir}
        onSort={(id) => {
          setPage(0);
          if (sortBy === id) setDir((d) => (d === "asc" ? "desc" : "asc"));
          else { setSortBy(id); setDir("asc"); }
        }}
        page={page}
        rowsPerPage={rpp}
        onPageChange={(_, p) => setPage(p)}
        onRowsPerPageChange={(e) => { setRpp(parseInt(e.target.value, 10)); setPage(0); }}
        total={total}
        onEdit={openEdit}
        onDelete={remove}
      />

      {/* Dialog */}
      <UserFormModal
        open={open}
        handleClose={() => setOpen(false)}
        handleSubmit={(e) => { e.preventDefault(); save(); }}
        formData={form}
        handleChange={(e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }))}
        title={editing ? "Edit Employee" : "Add Employee"}
        fields={[
          { name: "businessId", label: "Business", type: "select", options: businesses.map((b) => ({ value: b.id, label: b.name })), required: true },
          { name: "name", label: "Full Name", required: true },
          { name: "email", label: "Email", type: "email", required: true },
          { name: "salary", label: "Salary", type: "number", required: true },
          { name: "role", label: "Role", type: "select", options: roles, required: true },
          { name: "status", label: "Status", type: "select", options: statuses, required: true },
          { name: "joined_date", label: "Joined Date", type: "date", required: true },
        ]}
        submitLabel="Save"
      />
    </Box>
  );
};

export default Employee;
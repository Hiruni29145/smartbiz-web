import React, { useMemo, useState } from "react";
import {
  Box, Typography, Button, Paper, TextField, Stack, InputAdornment, Chip
} from "@mui/material";
import { Add, Search } from "@mui/icons-material";
import UserFormModal from "../../component/UserFormModal/UserFormModal";
import UserTable from "../../component/UserTable/UserTable";

const subscriptions = ["Basic", "Pro", "Enterprise"];
const statuses = ["Active", "Inactive"];

const initialBusinesses = [
  { id: 1, name: "Acme Ltd", subscription: "Pro", status: "Active" },
  { id: 2, name: "Sunrise Mart", subscription: "Basic", status: "Inactive" },
];

const Business = () => {
  const [rows, setRows] = useState(initialBusinesses);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: "", subscription: "Basic", status: "Active" });

  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [dir, setDir] = useState("asc");
  const [page, setPage] = useState(0);
  const [rpp, setRpp] = useState(5);

  const columns = [
    { id: "name", label: "Name", sortable: true },
    {
      id: "subscription",
      label: "Subscription",
      sortable: true,
      render: (r) => (
        <Chip
          size="small"
          label={r.subscription}
          color={
            r.subscription === "Enterprise" ? "secondary" :
            r.subscription === "Pro" ? "primary" : "default"
          }
        />
      ),
    },
    {
      id: "status",
      label: "Status",
      sortable: true,
      render: (r) => (
        <Chip
          size="small"
          label={r.status}
          color={r.status === "Active" ? "success" : "default"}
        />
      ),
    },
  ];

  const filteredSorted = useMemo(() => {
    const q = query.toLowerCase();
    let data = rows.filter(
      (r) =>
        r.name.toLowerCase().includes(q) ||
        r.subscription.toLowerCase().includes(q) ||
        r.status.toLowerCase().includes(q)
    );
    data = data.sort((a, b) => {
      const A = String(a[sortBy]).toLowerCase();
      const B = String(b[sortBy]).toLowerCase();
      if (A < B) return dir === "asc" ? -1 : 1;
      if (A > B) return dir === "asc" ? 1 : -1;
      return 0;
    });
    return data;
  }, [rows, query, sortBy, dir]);

  const total = filteredSorted.length;
  const paged = filteredSorted.slice(page * rpp, page * rpp + rpp);

  const openAdd = () => {
    setEditing(null);
    setForm({ name: "", subscription: "Basic", status: "Active" });
    setOpen(true);
  };
  const openEdit = (row) => {
    setEditing(row);
    setForm({ name: row.name, subscription: row.subscription, status: row.status });
    setOpen(true);
  };
  const save = () => {
    if (!form.name.trim()) return;
    if (editing) {
      setRows((prev) =>
        prev.map((r) =>
          r.id === editing.id ? { ...r, ...form, name: form.name.trim() } : r
        )
      );
    } else {
      setRows((prev) => [
        ...prev,
        { id: Date.now(), ...form, name: form.name.trim() },
      ]);
    }
    setOpen(false);
  };
  const remove = (id) => setRows((prev) => prev.filter((r) => r.id !== id));

  return (
    <Box p={3}>
      {/* Header */}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", sm: "center" }}
        spacing={2}
        mb={3}
      >
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, color: "#164e63" }}>
            Businesses
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage businesses and subscriptions 
          </Typography>
        </Box>
        <Button
          startIcon={<Add />}
          variant="contained"
          sx={{ backgroundColor: "#164e63" }}
          onClick={openAdd}
        >
          Add Business
        </Button>
      </Stack>

      {/* Search */}
      <Paper sx={{ p: 2, mb: 2 }}>
        <TextField
          placeholder="Search businesses"
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
          sx={{ width: 320 }}
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
          else {
            setSortBy(id);
            setDir("asc");
          }
        }}
        page={page}
        rowsPerPage={rpp}
        onPageChange={(_, p) => setPage(p)}
        onRowsPerPageChange={(e) => {
          setRpp(parseInt(e.target.value, 10));
          setPage(0);
        }}
        total={total}
        onEdit={openEdit}
        onDelete={remove}
      />

      {/* Modal */}
      <UserFormModal
        open={open}
        handleClose={() => setOpen(false)}
        handleSubmit={(e) => {
          e.preventDefault();
          save();
        }}
        formData={form}
        handleChange={(e) =>
          setForm((f) => ({ ...f, [e.target.name]: e.target.value }))
        }
        title={editing ? "Edit Business" : "Add Business"}
        fields={[
          { name: "name", label: "Business Name", required: true },
          {
            name: "subscription",
            label: "Subscription",
            type: "select",
            options: subscriptions,
          },
          { name: "status", label: "Status", type: "select", options: statuses },
        ]}
        submitLabel="Save"
      />
    </Box>
  );
};

export default Business;
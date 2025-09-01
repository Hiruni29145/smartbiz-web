import React, { useMemo, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Paper,
  TextField,
  Stack,
  InputAdornment,
  Chip,
  Grid,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Avatar,
} from "@mui/material";
import {
  Add,
  Search,
  FilterListRounded,
  DownloadRounded,
  LocalShippingRounded,
  BusinessRounded,
  TaskAltRounded,
} from "@mui/icons-material";
import UserFormModal from "../../component/UserFormModal/UserFormModal";
import UserTable from "../../component/UserTable/UserTable";

// Demo businesses (swap to shared data later if needed)
const businesses = [
  { id: 1, name: "Acme Ltd" },
  { id: 2, name: "Sunrise Mart" },
];

const initialSuppliers = [
  {
    id: 1,
    businessId: 1,
    name: "Global Supply Co.",
    email: "contact@global.com",
    reg_date: "2024-02-01",
    status: "Active",
  },
  {
    id: 2,
    businessId: 2,
    name: "FreshFarm",
    email: "hello@freshfarm.com",
    reg_date: "2024-03-11",
    status: "Inactive",
  },
];

const statuses = ["Active", "Inactive"];

// Small KPI card
const KpiCard = ({ icon, label, value, color = "#164e63" }) => (
  <Paper sx={{ p: 2, height: "100%" }}>
    <Stack direction="row" alignItems="center" spacing={2}>
      <Box
        sx={{
          width: 44,
          height: 44,
          borderRadius: "12px",
          bgcolor: `${color}15`,
          color,
          display: "grid",
          placeItems: "center",
        }}
      >
        {icon}
      </Box>
      <Box>
        <Typography variant="overline" color="text.secondary">
          {label}
        </Typography>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>
          {value}
        </Typography>
      </Box>
    </Stack>
  </Paper>
);

const Suppliers = () => {
  const [rows, setRows] = useState(initialSuppliers);

  // modal/edit
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    businessId: businesses[0].id,
    name: "",
    email: "",
    reg_date: "",
    status: "Active",
  });

  // filters / sorting / pagination
  const [query, setQuery] = useState("");
  const [businessFilter, setBusinessFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortBy, setSortBy] = useState("name"); // name | email | business | reg_date | status
  const [dir, setDir] = useState("asc");
  const [page, setPage] = useState(0);
  const [rpp, setRpp] = useState(5);

  const businessName = (id) =>
    businesses.find((b) => b.id === Number(id))?.name || "—";

  // Columns for UserTable (generic mode)
  const columns = [
    {
      id: "name",
      label: "Supplier",
      sortable: true,
      render: (r) => (
        <Stack direction="row" alignItems="center" spacing={1.5}>
          <Avatar sx={{ bgcolor: "#164e63" }}>
            {r.name?.[0]?.toUpperCase() ?? "S"}
          </Avatar>
          <Stack spacing={0}>
            <Typography>{r.name}</Typography>
            <Typography variant="caption" color="text.secondary">
              {r.email}
            </Typography>
          </Stack>
        </Stack>
      ),
    },
    {
      id: "business",
      label: "Business",
      sortable: true,
      render: (r) => <Chip size="small" label={businessName(r.businessId)} />,
    },
    {
      id: "reg_date",
      label: "Registered",
      sortable: true,
      render: (r) =>
        r.reg_date ? new Date(r.reg_date).toLocaleDateString() : "—",
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

  // Search + filters + sort (no date filter)
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
        businessName(r.businessId),
        r.status,
        r.reg_date,
      ]
        .join(" ")
        .toLowerCase();

      const matchSearch = hay.includes(q);
      const matchBusiness =
        businessFilter === "All" || r.businessId === Number(businessFilter);
      const matchStatus = statusFilter === "All" || r.status === statusFilter;
      return matchSearch && matchBusiness && matchStatus;
    });

    data = data.sort((a, b) => {
      const A = String(accessor(a, sortBy) ?? "").toLowerCase();
      const B = String(accessor(b, sortBy) ?? "").toLowerCase();
      if (A < B) return dir === "asc" ? -1 : 1;
      if (A > B) return dir === "asc" ? 1 : -1;
      return 0;
    });

    return data;
  }, [rows, query, businessFilter, statusFilter, sortBy, dir]);

  const total = filteredSorted.length;
  const paged = filteredSorted.slice(page * rpp, page * rpp + rpp);

  // CRUD
  const openAdd = () => {
    setEditing(null);
    setForm({
      businessId: businesses[0].id,
      name: "",
      email: "",
      reg_date: "",
      status: "Active",
    });
    setOpen(true);
  };

  const openEdit = (row) => {
    setEditing(row);
    setForm({
      businessId: row.businessId,
      name: row.name,
      email: row.email,
      reg_date: row.reg_date,
      status: row.status,
    });
    setOpen(true);
  };

  const save = () => {
    if (!form.name.trim() || !form.email.trim()) return;

    const clean = {
      ...form,
      businessId: Number(form.businessId),
      name: form.name.trim(),
      email: form.email.trim(),
    };

    if (editing) {
      setRows((prev) =>
        prev.map((r) => (r.id === editing.id ? { ...editing, ...clean } : r))
      );
    } else {
      setRows((prev) => [...prev, { id: Date.now(), ...clean }]);
    }
    setOpen(false);
  };

  const remove = (id) => setRows((prev) => prev.filter((r) => r.id !== id));

  // KPIs
  const totalCount = rows.length;
  const activeCount = rows.filter((r) => r.status === "Active").length;

  // Export CSV
  const exportCsv = () => {
    const data = filteredSorted.map((r) => ({
      Name: r.name,
      Email: r.email,
      Business: businessName(r.businessId),
      Registered: r.reg_date,
      Status: r.status,
    }));
    const header = Object.keys(
      data[0] || { Name: "", Email: "", Business: "", Registered: "", Status: "" }
    );
    const csv = [
      header.join(","),
      ...data.map((row) =>
        header
          .map((h) => `"${String(row[h] ?? "").replace(/"/g, '""')}"`)
          .join(",")
      ),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "suppliers.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const clearFilters = () => {
    setQuery("");
    setBusinessFilter("All");
    setStatusFilter("All");
    setPage(0);
  };

  return (
    <Box p={3} sx={{ overflowX: "hidden" }}>
      {/* Hero header */}
      <Paper
        sx={{
          p: 3,
          mb: 3,
          borderRadius: 3,
          background: "linear-gradient(135deg, #8b5cf6 0%, #06b6d4 100%)",
          color: "white",
        }}
      >
        <Stack
          direction={{ xs: "column", md: "row" }}
          alignItems={{ xs: "flex-start", md: "center" }}
          justifyContent="space-between"
          spacing={2}
        >
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 800 }}>
              Suppliers
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              Manage supplier accounts and partnerships
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={openAdd}
            sx={{ bgcolor: "white", color: "#312e81", "&:hover": { bgcolor: "#f8fafc" } }}
          >
            Add Supplier
          </Button>
        </Stack>
      </Paper>

      {/* KPIs */}
      <Grid container spacing={2} mb={2}>
        <Grid item xs={12} sm={4}>
          <KpiCard icon={<LocalShippingRounded />} label="Total Suppliers" value={totalCount} />
        </Grid>
        <Grid item xs={12} sm={4}>
          <KpiCard icon={<TaskAltRounded />} label="Active Suppliers" value={activeCount} color="#10b981" />
        </Grid>
        <Grid item xs={12} sm={4}>
          <KpiCard icon={<BusinessRounded />} label="Businesses" value={businesses.length} color="#f59e0b" />
        </Grid>
      </Grid>

      {/* Filters toolbar (no date filter) */}
      <Paper sx={{ p: 2, mb: 2 }}>
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={2}
          alignItems={{ xs: "stretch", md: "center" }}
        >
          <TextField
            placeholder="Search suppliers (name, email, business)"
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
            sx={{ minWidth: 260 }}
          />

          <FormControl size="small" sx={{ minWidth: 160 }}>
            <InputLabel>Business</InputLabel>
            <Select
              label="Business"
              value={businessFilter}
              onChange={(e) => {
                setBusinessFilter(e.target.value);
                setPage(0);
              }}
            >
              <MenuItem value="All">All</MenuItem>
              {businesses.map((b) => (
                <MenuItem key={b.id} value={b.id}>
                  {b.name}
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
              {statuses.map((s) => (
                <MenuItem key={s} value={s}>
                  {s}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Stack direction="row" spacing={1} sx={{ ml: { md: "auto" } }}>
            <Button startIcon={<FilterListRounded />} onClick={clearFilters}>
              Clear
            </Button>
            <Button startIcon={<DownloadRounded />} variant="outlined" onClick={exportCsv}>
              Export CSV
            </Button>
          </Stack>
        </Stack>
      </Paper>

      {/* Table (wrap to avoid horizontal scroll leaks) */}
      <Box sx={{ overflowX: "hidden" }}>
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
      </Box>

      {/* Add/Edit Modal */}
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
        title={editing ? "Edit Supplier" : "Add Supplier"}
        fields={[
          {
            name: "businessId",
            label: "Business",
            type: "select",
            options: businesses.map((b) => ({ value: b.id, label: b.name })),
            required: true,
          },
          { name: "name", label: "Supplier Name", required: true },
          { name: "email", label: "Email", type: "email", required: true },
          { name: "reg_date", label: "Registered Date", type: "date", required: true },
          { name: "status", label: "Status", type: "select", options: statuses, required: true },
        ]}
        submitLabel="Save"
      />
    </Box>
  );
};

export default Suppliers;
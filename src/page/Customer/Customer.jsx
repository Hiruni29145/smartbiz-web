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
  IconButton,
  Avatar,
} from "@mui/material";
import {
  Add,
  Search,
  FilterListRounded,
  DownloadRounded,
  PeopleAltRounded,
  BusinessRounded,
  PersonAddAltRounded,
} from "@mui/icons-material";
import UserFormModal from "../../component/UserFormModal/UserFormModal";
import UserTable from "../../component/UserTable/UserTable";

// Demo businesses (swap to a shared store later if you have one)
const businesses = [
  { id: 1, name: "Acme Ltd" },
  { id: 2, name: "Sunrise Mart" },
];

const initialCustomers = [
  { id: 1, businessId: 1, name: "Maya Fernando", email: "maya@mail.com", reg_date: "2024-05-01" },
  { id: 2, businessId: 2, name: "Dev Peris", email: "dev@mail.com", reg_date: "2024-04-15" },
];

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

const Customer = () => {
  const [rows, setRows] = useState(initialCustomers);

  // modal/edit
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    businessId: businesses[0].id,
    name: "",
    email: "",
    reg_date: "",
  });

  // filters / sorting / pagination
  const [query, setQuery] = useState("");
  const [businessFilter, setBusinessFilter] = useState("All");
  const [dateFilter, setDateFilter] = useState("All"); // All | Today | This week | This month
  const [sortBy, setSortBy] = useState("name"); // name | email | business | reg_date
  const [dir, setDir] = useState("asc");
  const [page, setPage] = useState(0);
  const [rpp, setRpp] = useState(5);

  const businessName = (id) => businesses.find((b) => b.id === Number(id))?.name || "—";

  // Date range filter helpers
  const inRange = (iso) => {
    if (!iso || dateFilter === "All") return true;
    const d = new Date(iso);
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const day = 24 * 60 * 60 * 1000;

    if (dateFilter === "Today") {
      return d >= startOfDay;
    }
    if (dateFilter === "This week") {
      const dayIndex = startOfDay.getDay(); // 0 Sun .. 6 Sat
      const startOfWeek = new Date(startOfDay.getTime() - (dayIndex === 0 ? 6 : dayIndex - 1) * day);
      return d >= startOfWeek;
    }
    if (dateFilter === "This month") {
      return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
    }
    return true;
  };

  // Columns for generic UserTable
  const columns = [
    {
      id: "name",
      label: "Customer",
      sortable: true,
      render: (r) => (
        <Stack direction="row" alignItems="center" spacing={1.5}>
          <Avatar sx={{ bgcolor: "#164e63" }}>{r.name?.[0]?.toUpperCase() ?? "C"}</Avatar>
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
  ];

  // Search + filter + sort
  const filteredSorted = useMemo(() => {
    const q = query.toLowerCase();
    const accessor = (row, key) => {
      if (key === "business") return businessName(row.businessId);
      return row[key];
    };

    let data = rows.filter((r) => {
      const hay = [r.name, r.email, businessName(r.businessId), r.reg_date]
        .join(" ")
        .toLowerCase();

      const matchSearch = hay.includes(q);
      const matchBusiness =
        businessFilter === "All" || r.businessId === Number(businessFilter);
      const matchDate = inRange(r.reg_date);

      return matchSearch && matchBusiness && matchDate;
    });

    data = data.sort((a, b) => {
      const A = String(accessor(a, sortBy) ?? "").toLowerCase();
      const B = String(accessor(b, sortBy) ?? "").toLowerCase();
      if (A < B) return dir === "asc" ? -1 : 1;
      if (A > B) return dir === "asc" ? 1 : -1;
      return 0;
    });

    return data;
  }, [rows, query, businessFilter, dateFilter, sortBy, dir]);

  const total = filteredSorted.length;
  const paged = filteredSorted.slice(page * rpp, page * rpp + rpp);

  // CRUD
  const openAdd = () => {
    setEditing(null);
    setForm({ businessId: businesses[0].id, name: "", email: "", reg_date: "" });
    setOpen(true);
  };
  const openEdit = (row) => {
    setEditing(row);
    setForm({
      businessId: row.businessId,
      name: row.name,
      email: row.email,
      reg_date: row.reg_date,
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
      setRows((prev) => prev.map((r) => (r.id === editing.id ? { ...editing, ...clean } : r)));
    } else {
      setRows((prev) => [...prev, { id: Date.now(), ...clean }]);
    }
    setOpen(false);
  };
  const remove = (id) => setRows((prev) => prev.filter((r) => r.id !== id));

  // KPIs
  const totalCount = rows.length;
  const newThisMonth = rows.filter((r) => inRange(r.reg_date) && dateFilter === "This month").length || rows.filter((r) => {
    if (!r.reg_date) return false;
    const d = new Date(r.reg_date);
    const now = new Date();
    return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
  }).length;

  // Export CSV
  const exportCsv = () => {
    const data = filteredSorted.map((r) => ({
      Name: r.name,
      Email: r.email,
      Business: businessName(r.businessId),
      Registered: r.reg_date,
    }));
    const header = Object.keys(data[0] || { Name: "", Email: "", Business: "", Registered: "" });
    const csv = [
      header.join(","),
      ...data.map((row) => header.map((h) => `"${String(row[h] ?? "").replace(/"/g, '""')}"`).join(",")),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "customers.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const clearFilters = () => {
    setQuery("");
    setBusinessFilter("All");
    setDateFilter("All");
    setPage(0);
  };

  return (
    <Box p={3}>
      {/* Hero header */}
      <Paper
        sx={{
          p: 3,
          mb: 3,
          borderRadius: 3,
          background: "linear-gradient(135deg, #0ea5e9 0%, #14b8a6 100%)",
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
              Customers
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              Manage your customers linked to each business
            </Typography>
          </Box>
          <Button
            startIcon={<Add />}
            variant="contained"
            onClick={openAdd}
            sx={{ bgcolor: "white", color: "#0f766e", "&:hover": { bgcolor: "#f8fafc" } }}
          >
            Add Customer
          </Button>
        </Stack>
      </Paper>

      {/* KPIs */}
      <Grid container spacing={2} mb={2}>
        <Grid item xs={12} sm={4}>
          <KpiCard icon={<PeopleAltRounded />} label="Total Customers" value={totalCount} />
        </Grid>
        <Grid item xs={12} sm={4}>
          <KpiCard icon={<PersonAddAltRounded />} label="New This Month" value={newThisMonth} color="#0ea5e9" />
        </Grid>
        <Grid item xs={12} sm={4}>
          <KpiCard icon={<BusinessRounded />} label="Businesses" value={businesses.length} color="#f59e0b" />
        </Grid>
      </Grid>

      {/* Filters toolbar */}
      <Paper sx={{ p: 2, mb: 2 }}>
        <Stack direction={{ xs: "column", md: "row" }} spacing={2} alignItems={{ xs: "stretch", md: "center" }}>
          <TextField
            placeholder="Search customers (name, email, business)"
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

          <FormControl size="small" sx={{ minWidth: 180 }}>
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
            <InputLabel>Date</InputLabel>
            <Select
              label="Date"
              value={dateFilter}
              onChange={(e) => {
                setDateFilter(e.target.value);
                setPage(0);
              }}
            >
              <MenuItem value="All">All</MenuItem>
              <MenuItem value="Today">Today</MenuItem>
              <MenuItem value="This week">This week</MenuItem>
              <MenuItem value="This month">This month</MenuItem>
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

      {/* Add/Edit Modal */}
      <UserFormModal
        open={open}
        handleClose={() => setOpen(false)}
        handleSubmit={(e) => {
          e.preventDefault();
          save();
        }}
        formData={form}
        handleChange={(e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }))}
        title={editing ? "Edit Customer" : "Add Customer"}
        fields={[
          {
            name: "businessId",
            label: "Business",
            type: "select",
            options: businesses.map((b) => ({ value: b.id, label: b.name })),
            required: true,
          },
          { name: "name", label: "Full Name", required: true },
          { name: "email", label: "Email", type: "email", required: true },
          { name: "reg_date", label: "Registered Date", type: "date", required: true },
        ]}
        submitLabel="Save"
      />
    </Box>
  );
};

export default Customer;
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
  Avatar,
} from "@mui/material";
import {
  Add,
  Search,
  CategoryRounded,
  DownloadRounded,
  LocalOfferRounded,
  WhatshotRounded,
} from "@mui/icons-material";
import UserFormModal from "../../component/UserFormModal/UserFormModal";
import UserTable from "../../component/UserTable/UserTable";

// Demo seed data
const initialCategories = [
  { id: 1, name: "Beverages" },
  { id: 2, name: "Snacks" },
  { id: 3, name: "Dairy" },
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

const Category = () => {
  const [rows, setRows] = useState(initialCategories);

  // modal/edit
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: "" });

  // search/sort/pagination
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState("name"); // only "name" for this entity
  const [dir, setDir] = useState("asc");
  const [page, setPage] = useState(0);
  const [rpp, setRpp] = useState(5);

  // Table columns (for UserTable generic mode)
  const columns = [
    {
      id: "name",
      label: "Category",
      sortable: true,
      render: (r) => (
        <Stack direction="row" alignItems="center" spacing={1.5}>
          <Avatar sx={{ bgcolor: "#164e63" }}>
            {r.name?.[0]?.toUpperCase() ?? "C"}
          </Avatar>
          <Typography>{r.name}</Typography>
        </Stack>
      ),
    },
  ];

  // Search + sort
  const filteredSorted = useMemo(() => {
    const q = query.toLowerCase();
    let data = rows.filter((r) => r.name.toLowerCase().includes(q));
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

  // CRUD
  const openAdd = (preset = "") => {
    setEditing(null);
    setForm({ name: preset });
    setOpen(true);
  };
  const openEdit = (row) => {
    setEditing(row);
    setForm({ name: row.name });
    setOpen(true);
  };
  const save = () => {
    if (!form.name.trim()) return;
    const clean = { name: form.name.trim() };

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
  const topExamples = ["Beverages", "Snacks", "Dairy", "Bakery", "Produce"];

  // Export CSV
  const exportCsv = () => {
    const data = filteredSorted.map((r) => ({ Name: r.name }));
    const header = ["Name"];
    const csv = [
      header.join(","),
      ...data.map((row) => header.map((h) => `"${String(row[h] ?? "").replace(/"/g, '""')}"`).join(",")),
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "categories.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Box p={3} sx={{ overflowX: "hidden" }}>
      {/* Hero header */}
      <Paper
        sx={{
          p: 3,
          mb: 3,
          borderRadius: 3,
          background: "linear-gradient(135deg, #f97316 0%, #06b6d4 100%)",
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
              Categories
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              Organize items with clean, simple categories
            </Typography>
          </Box>
          <Stack direction="row" spacing={1}>
            <Button
              startIcon={<DownloadRounded />}
              variant="outlined"
              onClick={exportCsv}
              sx={{ bgcolor: "white", color: "#0f766e", border: "none", "&:hover": { bgcolor: "#f8fafc" } }}
            >
              Export CSV
            </Button>
            <Button
              startIcon={<Add />}
              variant="contained"
              onClick={() => openAdd("")}
              sx={{ bgcolor: "white", color: "#0f766e", "&:hover": { bgcolor: "#f8fafc" } }}
            >
              Add Category
            </Button>
          </Stack>
        </Stack>
      </Paper>

      {/* KPIs + Quick add */}
      <Grid container spacing={2} mb={2}>
        <Grid item xs={12} md={4}>
          <KpiCard icon={<CategoryRounded />} label="Total Categories" value={totalCount} />
        </Grid>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2, height: "100%" }}>
            <Typography variant="overline" color="text.secondary">Quick add</Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap" mt={1}>
              {topExamples.map((name) => (
                <Chip
                  key={name}
                  label={name}
                  icon={<LocalOfferRounded sx={{ fontSize: 18 }} />}
                  onClick={() => openAdd(name)}
                  sx={{
                    bgcolor: "#f1f5f9",
                    "&:hover": { bgcolor: "#e2e8f0" },
                  }}
                />
              ))}
              <Chip
                label="Popular"
                icon={<WhatshotRounded sx={{ fontSize: 18 }} />}
                sx={{ bgcolor: "#fee2e2", color: "#b91c1c" }}
              />
            </Stack>
          </Paper>
        </Grid>
      </Grid>

      {/* Search */}
      <Paper sx={{ p: 2, mb: 2 }}>
        <TextField
          placeholder="Search categories"
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
        title={editing ? "Edit Category" : "Add Category"}
        fields={[
          { name: "name", label: "Category Name", required: true },
        ]}
        submitLabel="Save"
      />
    </Box>
  );
};

export default Category;
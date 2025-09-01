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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Avatar,
} from "@mui/material";
import {
  Add,
  Search,
  CategoryRounded,
  DownloadRounded,
  Inventory2Rounded,
  StarRounded,
} from "@mui/icons-material";
import UserFormModal from "../../component/UserFormModal/UserFormModal";
import UserTable from "../../component/UserTable/UserTable";

// Demo categories (replace with your shared store if you have one)
const categories = [
  { id: 1, name: "Beverages" },
  { id: 2, name: "Snacks" },
  { id: 3, name: "Dairy" },
  { id: 4, name: "Bakery" },
];

const initialItems = [
  { id: 1, name: "Orange Juice", categoryId: 1 },
  { id: 2, name: "Potato Chips", categoryId: 2 },
  { id: 3, name: "Milk", categoryId: 3 },
];

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

const Items = () => {
  const [rows, setRows] = useState(initialItems);

  // modal/edit
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: "", categoryId: categories[0].id });

  // filters / sorting / pagination
  const [query, setQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [sortBy, setSortBy] = useState("name"); // name | category
  const [dir, setDir] = useState("asc");
  const [page, setPage] = useState(0);
  const [rpp, setRpp] = useState(5);

  const categoryName = (id) =>
    categories.find((c) => c.id === Number(id))?.name || "—";

  // Columns for UserTable (generic mode)
  const columns = [
    {
      id: "name",
      label: "Item",
      sortable: true,
      render: (r) => (
        <Stack direction="row" alignItems="center" spacing={1.5}>
          <Avatar sx={{ bgcolor: "#164e63" }}>
            {r.name?.[0]?.toUpperCase() ?? "I"}
          </Avatar>
          <Typography>{r.name}</Typography>
        </Stack>
      ),
    },
    {
      id: "category",
      label: "Category",
      sortable: true,
      render: (r) => <Chip size="small" label={categoryName(r.categoryId)} />,
    },
  ];

  // Search + filter + sort
  const filteredSorted = useMemo(() => {
    const q = query.toLowerCase();
    const accessor = (row, key) => {
      if (key === "category") return categoryName(row.categoryId);
      return row[key];
    };

    let data = rows.filter((r) => {
      const hay = [r.name, categoryName(r.categoryId)].join(" ").toLowerCase();
      const matchSearch = hay.includes(q);
      const matchCategory =
        categoryFilter === "All" || r.categoryId === Number(categoryFilter);
      return matchSearch && matchCategory;
    });

    data = data.sort((a, b) => {
      const A = String(accessor(a, sortBy) ?? "").toLowerCase();
      const B = String(accessor(b, sortBy) ?? "").toLowerCase();
      if (A < B) return dir === "asc" ? -1 : 1;
      if (A > B) return dir === "asc" ? 1 : -1;
      return 0;
    });

    return data;
  }, [rows, query, categoryFilter, sortBy, dir]);

  const total = filteredSorted.length;
  const paged = filteredSorted.slice(page * rpp, page * rpp + rpp);

  // CRUD
  const openAdd = () => {
    setEditing(null);
    setForm({ name: "", categoryId: categories[0].id });
    setOpen(true);
  };
  const openEdit = (row) => {
    setEditing(row);
    setForm({ name: row.name, categoryId: row.categoryId });
    setOpen(true);
  };
  const save = () => {
    if (!form.name.trim()) return;
    const clean = {
      name: form.name.trim(),
      categoryId: Number(form.categoryId),
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
  const totalItems = rows.length;
  const totalCategories = new Set(rows.map((r) => r.categoryId)).size || 0;
  const topCategory = (() => {
    const count = rows.reduce((acc, r) => {
      acc[r.categoryId] = (acc[r.categoryId] || 0) + 1;
      return acc;
    }, {});
    const topId = Object.entries(count).sort((a, b) => b[1] - a[1])[0]?.[0];
    return topId ? categoryName(topId) : "—";
  })();

  // Export CSV
  const exportCsv = () => {
    const data = filteredSorted.map((r) => ({
      Name: r.name,
      Category: categoryName(r.categoryId),
    }));
    const header = ["Name", "Category"];
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
    a.download = "items.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const clearFilters = () => {
    setQuery("");
    setCategoryFilter("All");
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
          background: "linear-gradient(135deg, #22c55e 0%, #06b6d4 100%)",
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
              Items
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              Manage your catalog and categories
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
              onClick={openAdd}
              sx={{ bgcolor: "white", color: "#0f766e", "&:hover": { bgcolor: "#f8fafc" } }}
            >
              Add Item
            </Button>
          </Stack>
        </Stack>
      </Paper>

      {/* KPIs */}
      <Grid container spacing={2} mb={2}>
        <Grid item xs={12} sm={4}>
          <KpiCard icon={<Inventory2Rounded />} label="Total Items" value={totalItems} />
        </Grid>
        <Grid item xs={12} sm={4}>
          <KpiCard icon={<CategoryRounded />} label="Categories Used" value={totalCategories} color="#f59e0b" />
        </Grid>
        <Grid item xs={12} sm={4}>
          <KpiCard icon={<StarRounded />} label="Top Category" value={topCategory} color="#10b981" />
        </Grid>
      </Grid>

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 2 }}>
        <Stack direction={{ xs: "column", md: "row" }} spacing={2} alignItems={{ xs: "stretch", md: "center" }}>
          <TextField
            placeholder="Search items (name, category)"
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
            <InputLabel>Category</InputLabel>
            <Select
              label="Category"
              value={categoryFilter}
              onChange={(e) => {
                setCategoryFilter(e.target.value);
                setPage(0);
              }}
            >
              <MenuItem value="All">All</MenuItem>
              {categories.map((c) => (
                <MenuItem key={c.id} value={c.id}>
                  {c.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Stack direction="row" spacing={1} sx={{ ml: { md: "auto" } }}>
            <Button onClick={clearFilters}>Clear</Button>
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
        handleChange={(e) =>
          setForm((f) => ({ ...f, [e.target.name]: e.target.value }))
        }
        title={editing ? "Edit Item" : "Add Item"}
        fields={[
          { name: "name", label: "Item Name", required: true },
          {
            name: "categoryId",
            label: "Category",
            type: "select",
            options: categories.map((c) => ({ value: c.id, label: c.name })),
            required: true,
          },
        ]}
        submitLabel="Save"
      />
    </Box>
  );
};

export default Items;
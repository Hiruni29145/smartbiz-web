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
  FilterListRounded,
  DownloadRounded,
  Inventory2Rounded,
  TrendingUpRounded,
  WarningAmberRounded,
  CheckCircleRounded,
  LocalOfferRounded,
} from "@mui/icons-material";
import UserFormModal from "../../component/UserFormModal/UserFormModal";
import UserTable from "../../component/UserTable/UserTable";

// Demo categories and items (replace with your shared store)
const categories = [
  { id: 1, name: "Beverages" },
  { id: 2, name: "Snacks" },
  { id: 3, name: "Dairy" },
  { id: 4, name: "Bakery" },
];

const items = [
  { id: 1, name: "Orange Juice", categoryId: 1 },
  { id: 2, name: "Potato Chips", categoryId: 2 },
  { id: 3, name: "Milk", categoryId: 3 },
  { id: 4, name: "Bread", categoryId: 4 },
];

const initialStock = [
  { 
    id: 1, 
    itemId: 1, 
    qty: 100, 
    unitPrice: 250, 
    expDate: "2025-12-01",
    minLevel: 20,
    lastUpdated: "2025-09-01T10:30:00"
  },
  { 
    id: 2, 
    itemId: 2, 
    qty: 15, 
    unitPrice: 100, 
    expDate: "2025-08-15",
    minLevel: 50,
    lastUpdated: "2025-09-01T14:20:00"
  },
  { 
    id: 3, 
    itemId: 3, 
    qty: 150, 
    unitPrice: 180, 
    expDate: "2026-01-10",
    minLevel: 30,
    lastUpdated: "2025-09-02T09:15:00"
  },
];

const stockLevels = ["All", "Low Stock", "Normal", "Overstocked"];
const expiryFilters = ["All", "Expiring Soon", "Fresh"];

const KpiCard = ({ icon, label, value, color = "#164e63", subtitle = "" }) => (
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
        {subtitle && (
          <Typography variant="caption" color="text.secondary">
            {subtitle}
          </Typography>
        )}
      </Box>
    </Stack>
  </Paper>
);

const Stock = () => {
  const [rows, setRows] = useState(initialStock);

  // modal/edit
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    itemId: items[0]?.id || 1,
    qty: "",
    unitPrice: "",
    expDate: "",
    minLevel: "",
  });

  // filters / sorting / pagination
  const [query, setQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [stockLevelFilter, setStockLevelFilter] = useState("All");
  const [expiryFilter, setExpiryFilter] = useState("All");
  const [sortBy, setSortBy] = useState("name");
  const [dir, setDir] = useState("asc");
  const [page, setPage] = useState(0);
  const [rpp, setRpp] = useState(5);

  // Helper functions
  const getItem = (itemId) => items.find((i) => i.id === Number(itemId));
  const getCategory = (categoryId) => categories.find((c) => c.id === Number(categoryId));
  
  const getStockStatus = (stock) => {
    if (stock.qty <= stock.minLevel * 0.5) return "Low Stock";
    if (stock.qty <= stock.minLevel) return "Low";
    if (stock.qty > stock.minLevel * 3) return "Overstocked";
    return "Normal";
  };

  const getExpiryStatus = (expDate) => {
    const today = new Date();
    const expiry = new Date(expDate);
    const daysUntilExpiry = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));
    
    if (daysUntilExpiry <= 7) return "Expired/Critical";
    if (daysUntilExpiry <= 30) return "Expiring Soon";
    return "Fresh";
  };

  const formatCurrency = (amount) => 
    new Intl.NumberFormat('en-LK', { 
      style: 'currency', 
      currency: 'LKR',
      minimumFractionDigits: 0 
    }).format(amount);

  // Table columns
  const columns = [
    {
      id: "name",
      label: "Item",
      sortable: true,
      render: (r) => {
        const item = getItem(r.itemId);
        const category = getCategory(item?.categoryId);
        return (
          <Stack direction="row" alignItems="center" spacing={1.5}>
            <Avatar sx={{ bgcolor: "#164e63" }}>
              {item?.name?.[0]?.toUpperCase() ?? "I"}
            </Avatar>
            <Stack spacing={0}>
              <Typography>{item?.name}</Typography>
              <Typography variant="caption" color="text.secondary">
                {category?.name}
              </Typography>
            </Stack>
          </Stack>
        );
      },
    },
    {
      id: "qty",
      label: "Quantity",
      sortable: true,
      align: "center",
      render: (r) => {
        const status = getStockStatus(r);
        const color = 
          status === "Low Stock" ? "error" :
          status === "Low" ? "warning" :
          status === "Overstocked" ? "info" : "success";
        
        return (
          <Stack alignItems="center" spacing={0.5}>
            <Typography sx={{ fontWeight: 600 }}>{r.qty}</Typography>
            <Chip size="small" label={status} color={color} />
          </Stack>
        );
      },
    },
    {
      id: "unitPrice",
      label: "Unit Price",
      sortable: true,
      align: "right",
      render: (r) => (
        <Typography sx={{ fontWeight: 600 }}>{formatCurrency(r.unitPrice)}</Typography>
      ),
    },
    {
      id: "totalValue",
      label: "Total Value",
      sortable: true,
      align: "right",
      render: (r) => (
        <Typography sx={{ fontWeight: 600, color: "#10b981" }}>
          {formatCurrency(r.qty * r.unitPrice)}
        </Typography>
      ),
    },
    {
      id: "expDate",
      label: "Expiry",
      sortable: true,
      render: (r) => {
        const status = getExpiryStatus(r.expDate);
        const color = 
          status === "Expired/Critical" ? "error" :
          status === "Expiring Soon" ? "warning" : "success";
        
        return (
          <Stack spacing={0.5}>
            <Typography variant="body2">
              {new Date(r.expDate).toLocaleDateString()}
            </Typography>
            <Chip size="small" label={status} color={color} />
          </Stack>
        );
      },
    },
    {
      id: "lastUpdated",
      label: "Last Updated",
      sortable: true,
      render: (r) => (
        <Typography variant="body2" color="text.secondary">
          {new Date(r.lastUpdated).toLocaleDateString()}
        </Typography>
      ),
    },
  ];

  // Search + filter + sort logic
  const filteredSorted = useMemo(() => {
    const q = query.toLowerCase();
    
    const accessor = (row, key) => {
      const item = getItem(row.itemId);
      const category = getCategory(item?.categoryId);
      
      switch (key) {
        case "name": return item?.name || "";
        case "category": return category?.name || "";
        case "totalValue": return row.qty * row.unitPrice;
        default: return row[key];
      }
    };

    let data = rows.filter((r) => {
      const item = getItem(r.itemId);
      const category = getCategory(item?.categoryId);
      
      // Search filter
      const hay = [
        item?.name,
        category?.name,
        String(r.qty),
        String(r.unitPrice),
        getStockStatus(r),
        getExpiryStatus(r.expDate)
      ].join(" ").toLowerCase();
      const matchSearch = hay.includes(q);

      // Category filter
      const matchCategory = 
        categoryFilter === "All" || 
        category?.id === Number(categoryFilter);

      // Stock level filter
      const stockStatus = getStockStatus(r);
      const matchStockLevel = 
        stockLevelFilter === "All" ||
        (stockLevelFilter === "Low Stock" && (stockStatus === "Low Stock" || stockStatus === "Low")) ||
        (stockLevelFilter === "Normal" && stockStatus === "Normal") ||
        (stockLevelFilter === "Overstocked" && stockStatus === "Overstocked");

      // Expiry filter
      const expiryStatus = getExpiryStatus(r.expDate);
      const matchExpiry = 
        expiryFilter === "All" ||
        (expiryFilter === "Expiring Soon" && (expiryStatus === "Expired/Critical" || expiryStatus === "Expiring Soon")) ||
        (expiryFilter === "Fresh" && expiryStatus === "Fresh");

      return matchSearch && matchCategory && matchStockLevel && matchExpiry;
    });

    // Sort
    data = data.sort((a, b) => {
      const A = accessor(a, sortBy);
      const B = accessor(b, sortBy);
      
      if (typeof A === "number" && typeof B === "number") {
        return (A - B) * (dir === "asc" ? 1 : -1);
      }
      
      const As = String(A ?? "").toLowerCase();
      const Bs = String(B ?? "").toLowerCase();
      if (As < Bs) return dir === "asc" ? -1 : 1;
      if (As > Bs) return dir === "asc" ? 1 : -1;
      return 0;
    });

    return data;
  }, [rows, query, categoryFilter, stockLevelFilter, expiryFilter, sortBy, dir]);

  const total = filteredSorted.length;
  const paged = filteredSorted.slice(page * rpp, page * rpp + rpp);

  // CRUD operations
  const openAdd = () => {
    setEditing(null);
    setForm({
      itemId: items[0]?.id || 1,
      qty: "",
      unitPrice: "",
      expDate: "",
      minLevel: "",
    });
    setOpen(true);
  };

  const openEdit = (row) => {
    setEditing(row);
    setForm({
      itemId: row.itemId,
      qty: row.qty,
      unitPrice: row.unitPrice,
      expDate: row.expDate,
      minLevel: row.minLevel,
    });
    setOpen(true);
  };

  const save = () => {
    if (!form.qty || !form.unitPrice) return;

    const clean = {
      itemId: Number(form.itemId),
      qty: Number(form.qty),
      unitPrice: Number(form.unitPrice),
      expDate: form.expDate,
      minLevel: Number(form.minLevel) || 0,
      lastUpdated: new Date().toISOString(),
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
  const totalItems = rows.length;
  const lowStockCount = rows.filter(r => getStockStatus(r) === "Low Stock" || getStockStatus(r) === "Low").length;
  const expiringSoonCount = rows.filter(r => {
    const status = getExpiryStatus(r.expDate);
    return status === "Expiring Soon" || status === "Expired/Critical";
  }).length;
  const totalValue = rows.reduce((sum, r) => sum + (r.qty * r.unitPrice), 0);

  // Export CSV
  const exportCsv = () => {
    const data = filteredSorted.map((r) => {
      const item = getItem(r.itemId);
      const category = getCategory(item?.categoryId);
      
      return {
        ItemID: item?.name || "—",
        Category: category?.name || "—",
        Quantity: r.qty,
        UnitPrice: r.unitPrice,
        TotalValue: r.qty * r.unitPrice,
        MinLevel: r.minLevel,
        StockStatus: getStockStatus(r),
        ExpiryDate: r.expDate,
        ExpiryStatus: getExpiryStatus(r.expDate),
        LastUpdated: r.lastUpdated,
      };
    });

    const header = Object.keys(data[0] || {});
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
    a.download = "stock.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const clearFilters = () => {
    setQuery("");
    setCategoryFilter("All");
    setStockLevelFilter("All");
    setExpiryFilter("All");
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
              Stock Management
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              Monitor inventory levels, expiry dates, and stock values
            </Typography>
          </Box>
          <Stack direction="row" spacing={1}>
            <Button
              startIcon={<DownloadRounded />}
              variant="outlined"
              onClick={exportCsv}
              sx={{ 
                bgcolor: "white", 
                color: "#0f766e", 
                border: "none", 
                "&:hover": { bgcolor: "#f8fafc" } 
              }}
            >
              Export CSV
            </Button>
            <Button
              startIcon={<Add />}
              variant="contained"
              onClick={openAdd}
              sx={{ 
                bgcolor: "white", 
                color: "#0f766e", 
                "&:hover": { bgcolor: "#f8fafc" } 
              }}
            >
              Add Stock
            </Button>
          </Stack>
        </Stack>
      </Paper>

      {/* KPIs */}
      <Grid container spacing={2} mb={2}>
        <Grid item xs={12} sm={6} lg={3}>
          <KpiCard 
            icon={<Inventory2Rounded />} 
            label="Total Items" 
            value={totalItems}
            subtitle="In inventory"
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <KpiCard 
            icon={<WarningAmberRounded />} 
            label="Low Stock" 
            value={lowStockCount}
            color="#ef4444"
            subtitle="Need restocking"
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <KpiCard 
            icon={<LocalOfferRounded />} 
            label="Expiring Soon" 
            value={expiringSoonCount}
            color="#f59e0b"
            subtitle="Within 30 days"
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <KpiCard 
            icon={<TrendingUpRounded />} 
            label="Total Value" 
            value={formatCurrency(totalValue)}
            color="#10b981"
            subtitle="Inventory worth"
          />
        </Grid>
      </Grid>

      {/* Advanced Filters */}
      <Paper sx={{ p: 2, mb: 2 }}>
        <Stack direction={{ xs: "column", lg: "row" }} spacing={2} alignItems={{ xs: "stretch", lg: "center" }}>
          <TextField
            placeholder="Search items (name, category, status)"
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
            sx={{ minWidth: 280 }}
          />

          <FormControl size="small" sx={{ minWidth: 160 }}>
            <InputLabel>Category</InputLabel>
            <Select
              label="Category"
              value={categoryFilter}
              onChange={(e) => {
                setCategoryFilter(e.target.value);
                setPage(0);
              }}
            >
              <MenuItem value="All">All Categories</MenuItem>
              {categories.map((c) => (
                <MenuItem key={c.id} value={c.id}>
                  {c.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 140 }}>
            <InputLabel>Stock Level</InputLabel>
            <Select
              label="Stock Level"
              value={stockLevelFilter}
              onChange={(e) => {
                setStockLevelFilter(e.target.value);
                setPage(0);
              }}
            >
              {stockLevels.map((level) => (
                <MenuItem key={level} value={level}>
                  {level}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 140 }}>
            <InputLabel>Expiry</InputLabel>
            <Select
              label="Expiry"
              value={expiryFilter}
              onChange={(e) => {
                setExpiryFilter(e.target.value);
                setPage(0);
              }}
            >
              {expiryFilters.map((filter) => (
                <MenuItem key={filter} value={filter}>
                  {filter}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Stack direction="row" spacing={1} sx={{ ml: { lg: "auto" } }}>
            <Button 
              startIcon={<FilterListRounded />} 
              onClick={clearFilters}
              size="small"
            >
              Clear
            </Button>
          </Stack>
        </Stack>
      </Paper>

      {/* Stock Alerts */}
      {(lowStockCount > 0 || expiringSoonCount > 0) && (
        <Paper 
          sx={{ 
            p: 2, 
            mb: 2, 
            bgcolor: "#fef3c7", 
            border: "1px solid #fbbf24" 
          }}
        >
          <Stack direction="row" alignItems="center" spacing={1}>
            <WarningAmberRounded sx={{ color: "#f59e0b" }} />
            <Typography color="#92400e">
              Attention needed: {lowStockCount} low stock items, {expiringSoonCount} expiring soon
            </Typography>
          </Stack>
        </Paper>
      )}

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
        emptyMessage="No stock items found. Add your first stock item to get started."
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
        title={editing ? "Edit Stock Item" : "Add Stock Item"}
        fields={[
          {
            name: "itemId",
            label: "Item",
            type: "select",
            options: items.map((i) => ({ 
              value: i.id, 
              label: `${i.name} (${getCategory(i.categoryId)?.name})` 
            })),
            required: true,
          },
          { 
            name: "qty", 
            label: "Quantity", 
            type: "number", 
            required: true 
          },
          { 
            name: "unitPrice", 
            label: "Unit Price (LKR)", 
            type: "number", 
            required: true 
          },
          { 
            name: "minLevel", 
            label: "Minimum Stock Level", 
            type: "number", 
            required: true 
          },
          { 
            name: "expDate", 
            label: "Expiry Date", 
            type: "date", 
            required: true 
          },
        ]}
        submitLabel="Save Stock"
      />
    </Box>
  );
};

export default Stock;
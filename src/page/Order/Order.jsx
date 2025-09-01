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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
} from "@mui/material";
import {
  Add,
  Search,
  FilterListRounded,
  DownloadRounded,
  ShoppingCartRounded,
  MonetizationOnRounded,
  PersonOutlineRounded,
  DeleteOutline,
} from "@mui/icons-material";
import UserTable from "../../component/UserTable/UserTable";       // generic table
// We’ll use a custom dialog here (UserFormModal isn’t ideal for line-items)

// Demo masters (swap to your shared store when ready)
const customers = [
  { id: 1, name: "Maya Fernando" },
  { id: 2, name: "Dev Peris" },
  { id: 3, name: "Anu Silva" },
];

const items = [
  { id: 1, name: "Orange Juice", price: 2.5 },
  { id: 2, name: "Potato Chips", price: 1.7 },
  { id: 3, name: "Milk", price: 3.1 },
];

const initialOrders = [
  {
    id: 101,
    customerId: 1,
    date_time: "2025-01-05T10:10",
    status: "Pending",
    lines: [
      { itemId: 1, qty: 5, price: 2.5, discount: 0 },
      { itemId: 2, qty: 2, price: 1.7, discount: 0.4 },
    ],
    amount: 5 * 2.5 + 2 * 1.7 - 0.4,
  },
];

const formatMoney = (n) =>
  new Intl.NumberFormat(undefined, { style: "currency", currency: "USD" }).format(
    Number(n || 0)
  );

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

// Dialog for adding/editing an order (with line items)
const OrderDialog = ({ open, onClose, onSave, initial, customers, items }) => {
  const customerName = (id) => customers.find((c) => c.id === Number(id))?.name || "—";
  const itemName = (id) => items.find((i) => i.id === Number(id))?.name || "—";
  const itemPrice = (id) => items.find((i) => i.id === Number(id))?.price || 0;

  const [order, setOrder] = useState(
    initial || {
      customerId: customers[0]?.id,
      date_time: new Date().toISOString().slice(0, 16),
      status: "Pending",
      lines: [{ itemId: items[0]?.id, qty: 1, price: itemPrice(items[0]?.id), discount: 0 }],
    }
  );

  const updateLine = (idx, patch) => {
    setOrder((o) => {
      const next = { ...o, lines: o.lines.map((ln, i) => (i === idx ? { ...ln, ...patch } : ln)) };
      // If item changed, default price
      if (patch.itemId !== undefined) {
        next.lines[idx].price = itemPrice(patch.itemId);
      }
      return next;
    });
  };

  const addLine = () =>
    setOrder((o) => ({
      ...o,
      lines: [
        ...o.lines,
        { itemId: items[0]?.id, qty: 1, price: itemPrice(items[0]?.id), discount: 0 },
      ],
    }));

  const removeLine = (idx) =>
    setOrder((o) => ({ ...o, lines: o.lines.filter((_, i) => i !== idx) }));

  const total = order.lines.reduce(
    (sum, ln) => sum + Number(ln.qty) * Number(ln.price) - Number(ln.discount || 0),
    0
  );

  const handleSave = () => {
    onSave({ ...order, amount: Number(total.toFixed(2)) });
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>{initial ? "Edit Order" : "New Order"}</DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Customer</InputLabel>
              <Select
                label="Customer"
                value={order.customerId}
                onChange={(e) => setOrder((o) => ({ ...o, customerId: Number(e.target.value) }))}
              >
                {customers.map((c) => (
                  <MenuItem key={c.id} value={c.id}>
                    {c.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label="Date & Time"
              type="datetime-local"
              value={order.date_time}
              onChange={(e) => setOrder((o) => ({ ...o, date_time: e.target.value }))}
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
        </Grid>

        <Box mt={3}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
            Items
          </Typography>
          <Grid container spacing={2}>
            {order.lines.map((ln, idx) => (
              <React.Fragment key={idx}>
                <Grid item xs={12} md={4}>
                  <FormControl fullWidth>
                    <InputLabel>Item</InputLabel>
                    <Select
                      label="Item"
                      value={ln.itemId}
                      onChange={(e) =>
                        updateLine(idx, { itemId: Number(e.target.value) })
                      }
                    >
                      {items.map((i) => (
                        <MenuItem key={i.id} value={i.id}>
                          {i.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={6} md={2}>
                  <TextField
                    label="Qty"
                    type="number"
                    value={ln.qty}
                    onChange={(e) => updateLine(idx, { qty: Number(e.target.value) })}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={6} md={2}>
                  <TextField
                    label="Price"
                    type="number"
                    value={ln.price}
                    onChange={(e) => updateLine(idx, { price: Number(e.target.value) })}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={6} md={2}>
                  <TextField
                    label="Discount"
                    type="number"
                    value={ln.discount}
                    onChange={(e) =>
                      updateLine(idx, { discount: Number(e.target.value) })
                    }
                    fullWidth
                  />
                </Grid>
                <Grid
                  item
                  xs={6}
                  md={2}
                  sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}
                >
                  <Typography color="text.secondary">
                    {formatMoney(ln.qty * ln.price - (ln.discount || 0))}
                  </Typography>
                  <IconButton onClick={() => removeLine(idx)} color="error">
                    <DeleteOutline />
                  </IconButton>
                </Grid>
              </React.Fragment>
            ))}
          </Grid>
          <Button onClick={addLine} sx={{ mt: 2 }}>
            Add Item
          </Button>

          <Stack direction="row" justifyContent="flex-end" spacing={3} mt={3}>
            <Typography color="text.secondary">Total:</Typography>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              {formatMoney(total)}
            </Typography>
          </Stack>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit">
          Cancel
        </Button>
        <Button onClick={handleSave} variant="contained">
          Save Order
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const Orders = () => {
  const [orders, setOrders] = useState(initialOrders);

  // dialog
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  // filters / sorting / pagination
  const [query, setQuery] = useState("");
  const [customerFilter, setCustomerFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All"); // Pending | Paid
  const [sortBy, setSortBy] = useState("date_time"); // id | customer | date_time | amount | status
  const [dir, setDir] = useState("desc");
  const [page, setPage] = useState(0);
  const [rpp, setRpp] = useState(5);

  const customerName = (id) =>
    customers.find((c) => c.id === Number(id))?.name || "—";

  const openAdd = () => {
    setEditing(null);
    setOpen(true);
  };
  const openEdit = (row) => {
    setEditing(row);
    setOpen(true);
  };
  const saveOrder = (order) => {
    if (editing) {
      setOrders((prev) =>
        prev.map((o) => (o.id === editing.id ? { ...editing, ...order } : o))
      );
    } else {
      setOrders((prev) => [
        ...prev,
        { id: Date.now(), status: "Pending", ...order },
      ]);
    }
    setOpen(false);
    setEditing(null);
  };
  const remove = (id) => setOrders((prev) => prev.filter((o) => o.id !== id));
  const togglePaid = (id) =>
    setOrders((prev) =>
      prev.map((o) =>
        o.id === id ? { ...o, status: o.status === "Paid" ? "Pending" : "Paid" } : o
      )
    );

  // KPIs
  const todayStr = new Date().toISOString().slice(0, 10);
  const ordersToday = orders.filter((o) => (o.date_time || "").slice(0, 10) === todayStr)
    .length;
  const revenueThisWeek = orders
    .filter((o) => true) // simple demo
    .reduce((s, o) => s + Number(o.amount), 0);

  // Columns for UserTable (generic mode)
  const columns = [
    {
      id: "id",
      label: "Order#",
      sortable: true,
      render: (r) => <Chip size="small" label={r.id} />,
    },
    {
      id: "customer",
      label: "Customer",
      sortable: true,
      render: (r) => (
        <Stack direction="row" alignItems="center" spacing={1.5}>
          <Avatar sx={{ bgcolor: "#164e63" }}>
            {customerName(r.customerId)?.[0]?.toUpperCase() ?? "C"}
          </Avatar>
          <Typography>{customerName(r.customerId)}</Typography>
        </Stack>
      ),
    },
    {
      id: "date_time",
      label: "Date",
      sortable: true,
      render: (r) =>
        r.date_time ? new Date(r.date_time).toLocaleString() : "—",
    },
    {
      id: "items",
      label: "Items",
      sortable: false,
      render: (r) => <Chip size="small" label={`${r.lines?.length || 0} items`} />,
    },
    {
      id: "amount",
      label: "Amount",
      sortable: true,
      align: "right",
      render: (r) => <Typography sx={{ fontWeight: 600 }}>{formatMoney(r.amount)}</Typography>,
    },
    {
      id: "status",
      label: "Status",
      sortable: true,
      render: (r) => (
        <Chip
          size="small"
          label={r.status}
          color={r.status === "Paid" ? "success" : "warning"}
        />
      ),
    },
  ];

  // Search + filters + sort
  const filteredSorted = useMemo(() => {
    const q = query.toLowerCase();
    const accessor = (row, key) => {
      if (key === "customer") return customerName(row.customerId);
      return row[key];
    };

    let data = orders.filter((o) => {
      const hay = [String(o.id), customerName(o.customerId), o.status]
        .join(" ")
        .toLowerCase();
      const matchSearch = hay.includes(q);
      const matchCustomer =
        customerFilter === "All" || o.customerId === Number(customerFilter);
      const matchStatus = statusFilter === "All" || o.status === statusFilter;
      return matchSearch && matchCustomer && matchStatus;
    });

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
  }, [orders, query, customerFilter, statusFilter, sortBy, dir]);

  const total = filteredSorted.length;
  const paged = filteredSorted.slice(page * rpp, page * rpp + rpp);

  // Export CSV
  const exportCsv = () => {
    const data = filteredSorted.map((o) => ({
      Order: o.id,
      Customer: customerName(o.customerId),
      Date: o.date_time,
      Items: o.lines?.length || 0,
      Amount: o.amount,
      Status: o.status,
    }));
    const header = Object.keys(
      data[0] || { Order: "", Customer: "", Date: "", Items: "", Amount: "", Status: "" }
    );
    const csv = [
      header.join(","),
      ...data.map((row) =>
        header.map((h) => `"${String(row[h] ?? "").replace(/"/g, '""')}"`).join(",")
      ),
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "orders.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const clearFilters = () => {
    setQuery("");
    setCustomerFilter("All");
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
          background: "linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)",
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
              Orders
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              Create, track, and manage your orders
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
              New Order
            </Button>
          </Stack>
        </Stack>
      </Paper>

      {/* KPIs */}
      <Grid container spacing={2} mb={2}>
        <Grid item xs={12} md={6}>
          <KpiCard icon={<ShoppingCartRounded />} label="Orders today" value={ordersToday} />
        </Grid>
        <Grid item xs={12} md={6}>
          <KpiCard
            icon={<MonetizationOnRounded />}
            label="Revenue (demo)"
            value={formatMoney(revenueThisWeek)}
            color="#10b981"
          />
        </Grid>
      </Grid>

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 2 }}>
        <Stack direction={{ xs: "column", md: "row" }} spacing={2} alignItems={{ xs: "stretch", md: "center" }}>
          <TextField
            placeholder="Search orders (id, customer)"
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
            <InputLabel>Customer</InputLabel>
            <Select
              label="Customer"
              value={customerFilter}
              onChange={(e) => {
                setCustomerFilter(e.target.value);
                setPage(0);
              }}
            >
              <MenuItem value="All">All</MenuItem>
              {customers.map((c) => (
                <MenuItem key={c.id} value={c.id}>
                  {c.name}
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
              <MenuItem value="Pending">Pending</MenuItem>
              <MenuItem value="Paid">Paid</MenuItem>
            </Select>
          </FormControl>

          <Stack direction="row" spacing={1} sx={{ ml: { md: "auto" } }}>
            <Button startIcon={<FilterListRounded />} onClick={clearFilters}>
              Clear
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
          else setSortBy(id), setDir("asc");
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
        onDelete={(rowId) => remove(rowId)}
      />

      {/* New/Edit Order dialog */}
      <OrderDialog
        open={open}
        onClose={() => {
          setOpen(false);
          setEditing(null);
        }}
        onSave={saveOrder}
        initial={editing}
        customers={customers}
        items={items}
      />
    </Box>
  );
};

export default Orders;
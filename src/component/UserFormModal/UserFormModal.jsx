import React from "react";
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, Stack, FormControl, InputLabel, Select, MenuItem
} from "@mui/material";

const defaultRoles = ["Admin", "Manager", "User"];
const defaultStatuses = ["Active", "Inactive"];

const UserFormModal = ({
  open, handleClose, handleSubmit, formData, handleChange,
  // generic form (optional)
  fields, title, submitLabel = "Save",
}) => {
  const isEditing = Boolean(formData?.id);

  if (!fields) {
    return (
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>{isEditing ? "Edit User" : "Add User"}</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent dividers>
            <Stack spacing={2}>
              <TextField label="Name" name="name" value={formData.name || ""} onChange={handleChange} fullWidth required />
              <TextField label="Email" name="email" value={formData.email || ""} onChange={handleChange} type="email" fullWidth required />
              <TextField label="Password" name="password" value={formData.password || ""} onChange={handleChange} type="password" fullWidth placeholder={isEditing ? "Leave blank to keep unchanged" : "Set a password"} />
              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                <FormControl fullWidth>
                  <InputLabel>Role</InputLabel>
                  <Select label="Role" name="role" value={formData.role || "User"} onChange={handleChange}>
                    {defaultRoles.map((r) => <MenuItem key={r} value={r}>{r}</MenuItem>)}
                  </Select>
                </FormControl>
                <FormControl fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Select label="Status" name="status" value={formData.status || "Active"} onChange={handleChange}>
                    {defaultStatuses.map((s) => <MenuItem key={s} value={s}>{s}</MenuItem>)}
                  </Select>
                </FormControl>
              </Stack>
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="inherit">Cancel</Button>
            <Button type="submit" variant="contained">{submitLabel}</Button>
          </DialogActions>
        </form>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>{title || (isEditing ? "Edit" : "Add")}</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent dividers>
          <Stack spacing={2}>
            {fields.map((f) =>
              f.type === "select" ? (
                <FormControl key={f.name} fullWidth required={f.required}>
                  <InputLabel>{f.label}</InputLabel>
                  <Select label={f.label} name={f.name} value={formData[f.name] ?? ""} onChange={handleChange}>
                    {(f.options || []).map((opt) => (
                      <MenuItem key={opt.value ?? opt} value={opt.value ?? opt}>
                        {opt.label ?? opt}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              ) : (
                <TextField
                  key={f.name}
                  label={f.label}
                  name={f.name}
                  value={formData[f.name] ?? ""}
                  onChange={handleChange}
                  type={f.type || "text"}
                  fullWidth
                  required={f.required}
                />
              )
            )}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="inherit">Cancel</Button>
          <Button type="submit" variant="contained">{submitLabel}</Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default UserFormModal;
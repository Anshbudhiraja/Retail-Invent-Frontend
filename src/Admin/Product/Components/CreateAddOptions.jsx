import React, { useState, useEffect } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, IconButton } from "@mui/material";
import { Trash } from "lucide-react";

const CreateAddOptions = ({ onClose, onSave, open, initialData }) => {
    const [optionName, setOptionName] = useState("");
    const [values, setValues] = useState([""]); // At least one input field

    // Pre-fill when editing
    useEffect(() => {
        if (initialData) {
            setOptionName(initialData.name || "");
            setValues(initialData.values.length > 0 ? initialData.values : [""]);
        } else {
            setOptionName("");
            setValues([""]);
        }
    }, [initialData, open]);

    const handleChangeValue = (index, newValue) => {
        const updatedValues = [...values];
        updatedValues[index] = newValue;
        setValues(updatedValues);

        // Automatically add a new input when typing in the last one
        if (index === values.length - 1 && newValue.trim() !== "") {
            setValues([...updatedValues, ""]);
        }
    };

    const handleRemoveValue = (index) => {
        const updatedValues = values.filter((_, i) => i !== index);
        setValues(updatedValues.length > 0 ? updatedValues : [""]); // Ensure at least one input remains
    };

    const handleSave = () => {
        if (optionName.trim()) {
            const filteredValues = values.filter((value) => value.trim() !== ""); // Remove empty inputs
            onSave({ name: optionName, values: filteredValues });
            setOptionName("");
            setValues([""]); // Reset after saving
            onClose();
        }
    };

    const handleClose = () => {
        onClose();
        setOptionName("");
        setValues([""]);
    };

    return (
        <Dialog open={open} onClose={handleClose} fullWidth>
            <DialogTitle>{initialData ? "Edit Option" : "Add Option"}</DialogTitle>
            <DialogContent>
                <TextField
                    label="Name"
                    fullWidth
                    value={optionName}
                    onChange={(e) => setOptionName(e.target.value)}
                    margin="normal"
                />
                {values.map((value, index) => (
                    <div key={index} style={{ display: "flex", alignItems: "center", marginBottom: "8px" }}>
                        <TextField
                            fullWidth
                            value={value}
                            onChange={(e) => handleChangeValue(index, e.target.value)}
                        />
                        {values.length > 1 && (
                            <IconButton onClick={() => handleRemoveValue(index)}>
                                <Trash size={18} />
                            </IconButton>
                        )}
                    </div>
                ))}
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button onClick={handleSave} color="primary">Save</Button>
            </DialogActions>
        </Dialog>
    );
};

export default CreateAddOptions;

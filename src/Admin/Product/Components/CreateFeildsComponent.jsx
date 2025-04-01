import React, { useState } from "react";
import { FaTimes, FaTrash, FaPlus, FaGripVertical, FaCheck } from "react-icons/fa";
import Api from "../../../Api/InstanceApi";
import Swal from "sweetalert2"; // Import SweetAlert2

Swal.mixin({
  customClass: {
    confirmButton: 'bg-[#795ded] text-white hover:bg-[#6b4de5] shadow-lg',
    cancelButton: 'bg-gray-400 text-white hover:bg-gray-500 shadow-lg',
    popup: 'rounded-lg',
    title: 'text-2xl font-bold text-gray-800',
    htmlContainer: 'text-lg text-gray-600',
  },
  buttonsStyling: false,
  showCloseButton: true,
  focusConfirm: false,
});

const CreateFieldsComponent = ({ cancel, subSubCategory, token, refreshOptions }) => {
  const [fields, setFields] = useState([]);
  const [editMode, setEditMode] = useState(fields.map(() => true));
  const [errors, setErrors] = useState({}); // Store duplicate errors

  // Update Option Name
  const handleFieldChange = (index, newName) => {
    const updatedFields = [...fields];
    updatedFields[index].name = newName;
    setFields(updatedFields);
  };

  // Update Option Values & Check for Duplicates
  const handleValueChange = (fieldIndex, valueIndex, newValue) => {
    const updatedFields = [...fields];
    const trimmedValue = newValue.trim();

    // Check for duplicates within the same option
    const isDuplicate = trimmedValue && updatedFields[fieldIndex].values.includes(trimmedValue) && valueIndex !== updatedFields[fieldIndex].values.indexOf(trimmedValue);

    // Update value
    updatedFields[fieldIndex].values[valueIndex] = newValue;
    setFields(updatedFields);

    // Update errors state
    setErrors((prevErrors) => ({
      ...prevErrors,
      [`${fieldIndex}-${valueIndex}`]: isDuplicate ? "Duplicate values are not allowed." : "",
    }));

    // Auto-add new empty input if typing in the last input
    if (valueIndex === updatedFields[fieldIndex].values.length - 1 && newValue.trim() !== "") {
      updatedFields[fieldIndex].values.push("");
    }
  };

  // Remove Specific Value
  const handleRemoveValue = (fieldIndex, valueIndex) => {
    const updatedFields = [...fields];
    updatedFields[fieldIndex].values.splice(valueIndex, 1);
    setFields(updatedFields);

    // Remove error for deleted field
    setErrors((prevErrors) => {
      const newErrors = { ...prevErrors };
      delete newErrors[`${fieldIndex}-${valueIndex}`];
      return newErrors;
    });
  };

  // Add New Option
  const handleAddField = () => {
    setFields([...fields, { name: "", values: [""] }]);
    setEditMode([...editMode, true]);
  };

  // Remove Option
  const handleRemoveField = (index) => {
    setFields(fields.filter((_, i) => i !== index));
    setEditMode(editMode.filter((_, i) => i !== index));
  };

  // Toggle Done for individual option with validation
  const handleDone = (index) => {
    const field = fields[index];
    if (!field.name || field.name.trim() === "") {
      Swal.fire({
        title: 'Validation Error',
        text: 'Variant name is required.',
        icon: 'warning',
        confirmButtonText: 'OK',
      });
      return; // Stop if name is empty
    }

    setEditMode((prev) => prev.map((mode, i) => (i === index ? false : mode)));
  };

  const handleSaveOptions = async () => {
    try {
      const formattedFields = fields
        .filter((field) => field.name.trim())
        .map((field) => {
          const formattedField = { name: field.name.trim() };
          const filteredValues = field.values.filter((value) => value.trim() !== "");

          if (filteredValues.length > 0) {
            formattedField.values = filteredValues;
          }

          return formattedField;
        });

      if (formattedFields.length === 0) {
        Swal.fire({
          title: 'Error',
          text: "Please enter at least one valid option.",
          icon: 'error',
          confirmButtonText: 'OK',
        });
        return;
      }
      const response = await Api.post(`/createOptions/${subSubCategory}`, {
        fields: formattedFields,
      }, {
        headers: {
          Authorization: token
        }
      });

      Swal.fire({
        title: 'Success',
        text: 'Product added successfully',
        icon: 'success',
        confirmButtonText: 'OK',
      }).then(() => {
        refreshOptions();
        cancel();
      });
    } catch (error) {
      console.error("Error saving options:", error.response?.data || error.message);
    } finally {
      // Reset all states to initial values
      setFields([{ name: "", values: [""] }]);
      setEditMode([true]);
      setErrors({});
    }
  };

  return (
    <div className="w-full mt-4 border-2 bg-white rounded-2xl overflow-hidden">

      {fields.map((field, fieldIndex) => (
        <div
          key={fieldIndex}
          className="w-full p-6 bg-white border border-gray-300 hover:bg-gray-50 relative"
        >
          {/* Edit Button at the Top-Right Corner */}
          <i
            className="ri-edit-line absolute top-2 right-2 text-gray-500 text-[14px] cursor-pointer hover:text-gray-700 transition"
            onClick={() =>
              setEditMode((prev) => prev.map((mode, i) => (i === fieldIndex ? true : mode)))
            }
          ></i>

          {editMode[fieldIndex] ? (
            <>
              {/* Input for Field Name with required validation */}
              <input
                type="text"
                className="w-full border p-2 rounded-md"
                placeholder="Variant name"
                value={field.name}
                required
                onChange={(e) => handleFieldChange(fieldIndex, e.target.value)}
              />

              {field.values.map((value, valueIndex) => (
                <div key={valueIndex} className="mt-2">
                  <div className="flex items-center">
                    <input
                      type="text"
                      className={`w-full border p-2 rounded-md ${errors[`${fieldIndex}-${valueIndex}`] ? "border-red-500" : ""}`}
                      placeholder={`Variant value-${valueIndex + 1} `}
                      value={value}
                      onChange={(e) => handleValueChange(fieldIndex, valueIndex, e.target.value)}
                    />
                    {/* Delete Button */}
                    {value.trim() !== "" && (
                      <i
                        className="ri-delete-bin-line ml-2 text-red-500 text-[12px] cursor-pointer hover:text-red-700 transition"
                        onClick={() => handleRemoveValue(fieldIndex, valueIndex)}
                      ></i>
                    )}
                  </div>
                  {/* Error Message */}
                  {errors[`${fieldIndex}-${valueIndex}`] && (
                    <p className="text-red-500 text-sm mt-1">{errors[`${fieldIndex}-${valueIndex}`]}</p>
                  )}
                </div>
              ))}

              {/* Done & Cancel Buttons */}
              <div className="flex justify-between mt-3">
                <button
                  onClick={() => handleRemoveField(fieldIndex)}
                  className="px-4 py-2 cursor-pointer bg-red-500 text-white rounded-md flex items-center hover:bg-red-600 transition"
                >
                  <i className="ri-close-line text-[14px] mr-2"></i> Cancel
                </button>
                <button
                  onClick={() => handleDone(fieldIndex)}
                  className="px-4 py-2 cursor-pointer bg-[#795ded] text-white rounded-md flex items-center transition"
                >
                  <i className="ri-check-line text-[14px] mr-2"></i> Done
                </button>
              </div>
            </>
          ) : (
            // Display Mode
            <div className="flex flex-col md:flex-row md:items-center gap-2">
              {/* Field Name */}
              <p className="font-medium text-xl text-[#555555] whitespace-nowrap">
                {field.name}:-
              </p>

              {/* Values List */}
              <div className="flex flex-wrap gap-2 mt-1">
                {field.values
                  .filter((v) => v.trim() !== "")
                  .map((value, valueIndex) => (
                    <span
                      key={valueIndex}
                      className="px-3 py-2 bg-gray-100 border cursor-pointer rounded-md text-[#555555] text-sm font-medium hover:bg-gray-200 transition"
                    >
                      {value}
                    </span>
                  ))}
              </div>
            </div>
          )}
        </div>
      ))}

      {/* Add New Option Button */}
      <button onClick={handleAddField} className="w-full cursor-pointer hover:bg-gray-100 bg-gray-50 p-3 text-gray-500 font-semibold rounded-md flex">
        <FaPlus className="mr-2" /> Add another Variant
      </button>
      <div className="flex item-center justify-center m-2 bg-gray-50">
        <button onClick={handleSaveOptions} className="w-full cursor-pointer p-2 bg-[#795ded] text-white font-semibold rounded-md flex items-center justify-center">
          Save
        </button>
      </div>
    </div>
  );
};

export default CreateFieldsComponent;
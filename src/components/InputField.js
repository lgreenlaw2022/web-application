import React from "react";

// Export a function called InputField which takes an object of props as an argument
export default function InputField({
	// The name of the field
	name,
	label,
	type = "text",
	// Any errors associated with the field
	error,
	// A ref to assign to the field
	fieldRef,
	value,
	// A callback to run when the field is changed
	onChange,
}) {
	// Return a div with a label and an input element
	return (
		<div className="form-group">
			<label htmlFor={name}>{label}</label>
			<input
				type={type}
				className={`form-control ${error ? "is-invalid" : ""}`}
				id={name}
				name={name}
				ref={fieldRef}
				value={value}
				onChange={onChange}
			/>
			{error && <div className="invalid-feedback">{error}</div>}
		</div>
	);
}

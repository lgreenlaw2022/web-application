import React from 'react';

export default function InputField({ name, label, type = 'text', error, fieldRef, value, onChange }) {
    return (
        <div className="form-group">
            <label htmlFor={name}>{label}</label>
            <input type={type} className={`form-control ${error ? 'is-invalid' : ''}`}
                id={name} name={name} ref={fieldRef} value={value} onChange={onChange} />
            {error && <div className="invalid-feedback">{error}</div>}
        </div>
    );
}
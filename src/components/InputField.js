import React from 'react';
import { Form } from 'react-bootstrap';

export default function InputField({ name, label, type = 'text', error, fieldRef, value, onChange }) {
  return (
    <div className="form-group">
      <label htmlFor={name}>{label}</label>
      <input type={type} className={`form-control ${error ? 'is-invalid' : ''}`} id={name} name={name} ref={fieldRef} value={value} onChange={onChange} />
      {error && <div className="invalid-feedback">{error}</div>}
    </div>
  );
}

// export default function InputField({ name, label, type, placeholder, value, onChange, error, fieldRef }) {
//   return (
//     <Form.Group controlIds={name} className="InputField">
//       {label && <Form.Label>{label}</Form.Label>}
//       <Form.Control
//         type={type || 'text'}
//         placeholder={placeholder}
//         value={value}
//         onChange={onChange}
//         ref={fieldRef}
//       />
//       <Form.Text className="text-danger">{error}</Form.Text>
//     </Form.Group>
//   );
// }
// .InputField { TODO
//     margin-top: 15px;
//     margin-bottom: 15px;
//   }
import Form from 'react-bootstrap/Form';

// .InputField { TODO
//     margin-top: 15px;
//     margin-bottom: 15px;
//   }

export default function InputField(
  { name, label, type, placeholder, error, fieldRef }
) {
  return (
    <Form.Group controlId={name} className="InputField">
      {label && <Form.Label>{label}</Form.Label>}
      <Form.Control
        type={type || 'text'}
        placeholder={placeholder}
        ref={fieldRef}
      />
      <Form.Text className="text-danger">{error}</Form.Text>
    </Form.Group>
  );
}
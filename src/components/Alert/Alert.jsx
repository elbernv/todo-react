import { useContext, useEffect } from 'react';
import Alert from 'react-bootstrap/Alert';
import { AlertContext } from '../../context/AlertContext';

export function CustomAlert({ className, style }) {
  const {
    show,
    setShow,
    alertInfo: { message, variant, closeInSecods },
  } = useContext(AlertContext);

  useEffect(() => {
    if (closeInSecods && show) {
      setTimeout(() => {
        setShow(false);
      }, closeInSecods * 1000);
    }
  });

  if (show) {
    return (
      <Alert
        className={className}
        style={style}
        variant={variant}
        onClose={() => setShow(false)}
        dismissible
      >
        {message}
      </Alert>
    );
  }

  return;
}

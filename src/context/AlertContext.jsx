import { createContext, useState } from 'react';

export const AlertContext = createContext();

export function AlertContextProvider({ children }) {
  const [show, setShow] = useState(false);
  const [alertInfo, setAlertInfo] = useState({
    message: '',
    variant: '',
    closeInSecods: 0,
  });

  return (
    <AlertContext.Provider value={{ show, setShow, alertInfo, setAlertInfo }}>
      {children}
    </AlertContext.Provider>
  );
}

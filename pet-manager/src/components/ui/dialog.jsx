import * as React from "react";

const DialogContext = React.createContext();

export function Dialog({ open, onOpenChange, children }) {
  return (
    <DialogContext.Provider value={{ open, onOpenChange }}>
      {open && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg">{children}</div>
        </div>
      )}
    </DialogContext.Provider>
  );
}

export function DialogTrigger({ children, asChild, onClick }) {
  const { onOpenChange } = React.useContext(DialogContext);
  return (
    <button onClick={() => onOpenChange(true)} className="bg-blue-500 text-white p-2 rounded">
      {children}
    </button>
  );
}

export function DialogContent({ children }) {
  return <div>{children}</div>;
}

export function DialogHeader({ children }) {
  return <div className="text-lg font-bold">{children}</div>;
}

export function DialogTitle({ children }) {
  return <h2 className="text-xl font-semibold">{children}</h2>;
}

export function DialogFooter({ children }) {
  return <div className="mt-4">{children}</div>;
}

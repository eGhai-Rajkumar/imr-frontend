import React from 'react';

export function Select({ value, onValueChange, children }) {
  const [isOpen, setIsOpen] = React.useState(false);
  const selectRef = React.useRef(null);

  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={selectRef} className="relative">
      {React.Children.map(children, child => {
        if (child.type === SelectTrigger) {
          return React.cloneElement(child, { 
            isOpen, 
            setIsOpen,
            value 
          });
        }
        if (child.type === SelectContent) {
          return isOpen ? React.cloneElement(child, { 
            onValueChange: (val) => {
              onValueChange(val);
              setIsOpen(false);
            }
          }) : null;
        }
        return child;
      })}
    </div>
  );
}

export function SelectTrigger({ className = '', children, isOpen, setIsOpen }) {
  return (
    <button
      type="button"
      onClick={() => setIsOpen(!isOpen)}
      className={`flex h-10 w-full items-center justify-between rounded-md border border-slate-300 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    >
      {children}
      <svg className="h-4 w-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    </button>
  );
}

export function SelectValue({ placeholder, children }) {
  return <span className={children ? '' : 'text-slate-500'}>{children || placeholder}</span>;
}

export function SelectContent({ children, onValueChange }) {
  return (
    <div className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border bg-white py-1 shadow-lg">
      {React.Children.map(children, child => 
        React.cloneElement(child, { onValueChange })
      )}
    </div>
  );
}

export function SelectItem({ value, children, onValueChange }) {
  return (
    <div
      onClick={() => onValueChange?.(value)}
      className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-slate-100 focus:bg-slate-100"
    >
      {children}
    </div>
  );
}
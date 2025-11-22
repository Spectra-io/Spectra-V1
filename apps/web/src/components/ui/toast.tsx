import * as React from 'react';

type ToastProps = {
  id: string;
  title?: string;
  description?: string;
  variant?: 'default' | 'destructive';
};

type ToastContextValue = {
  toasts: ToastProps[];
  toast: (props: Omit<ToastProps, 'id'>) => void;
  dismiss: (id: string) => void;
};

const ToastContext = React.createContext<ToastContextValue | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<ToastProps[]>([]);

  const toast = React.useCallback((props: Omit<ToastProps, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { ...props, id }]);

    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 5000);
  }, []);

  const dismiss = React.useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, toast, dismiss }}>
      {children}
      <div className="fixed bottom-0 right-0 z-50 flex flex-col gap-2 p-4 md:max-w-md">
        {toasts.map(t => (
          <div
            key={t.id}
            className={`rounded-lg border p-4 shadow-lg animate-slide-up ${
              t.variant === 'destructive'
                ? 'border-red-200 bg-red-50 text-red-900'
                : 'border-gray-200 bg-white'
            }`}
          >
            {t.title && <div className="font-semibold">{t.title}</div>}
            {t.description && <div className="text-sm mt-1">{t.description}</div>}
            <button
              onClick={() => dismiss(t.id)}
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
}

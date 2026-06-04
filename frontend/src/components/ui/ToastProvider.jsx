

import { Toaster } from 'react-hot-toast';

export default function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      gutter={10}
      toastOptions={{
        duration: 4000,
        style: {
          background: '#161b22',
          color: '#f4f4f0',
          border: '1px solid #30363d',
          borderRadius: '12px',
          fontFamily: '"DM Sans", sans-serif',
          fontSize: '14px',
          padding: '12px 16px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
          maxWidth: '380px',
        },
        success: {
          iconTheme: {
            primary: '#34d399',
            secondary: '#161b22',
          },
        },
        error: {
          iconTheme: {
            primary: '#fb7185',
            secondary: '#161b22',
          },
          duration: 5000,
        },
        loading: {
          iconTheme: {
            primary: '#fbbf24',
            secondary: '#161b22',
          },
        },
      }}
    />
  );
}

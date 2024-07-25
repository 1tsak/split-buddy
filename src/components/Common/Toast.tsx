type ToastProp = {
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  show: boolean;
  onClose: () => void;
};

const Toast = ({ message, type, show, onClose }: ToastProp) => {

  if (!show) return null;

  const getTypeStyles = () => {
    switch (type) {
      case 'success':
        return 'bg-green-100 border-green-500 text-green-700';
      case 'error':
        return 'bg-red-100 border-red-500 text-red-700';
      case 'info':
        return 'bg-blue-100 border-blue-500 text-blue-700';
      case 'warning':
        return 'bg-yellow-100 border-yellow-500 text-yellow-700';
      default:
        return '';
    }
  };

  return (
    <div className={`fixed bottom-4 right-4 max-w-xs w-full ${getTypeStyles()} border-l-4 p-4 rounded shadow-lg flex items-center`}>
      <div className="flex-1">
        {message}
      </div>
      <button onClick={onClose} className="ml-4 text-gray-600 hover:text-gray-900">
        &times;
      </button>
    </div>
  );
};

export default Toast;

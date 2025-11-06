import { useEffect, useState } from 'react';
import { usePage } from '@inertiajs/react';
import { CheckCircle, AlertCircle, Info, X, Sparkles } from 'lucide-react';

export default function FlashMessage() {
  const { flash } = usePage().props;
  const [isVisible, setIsVisible] = useState(false);
  const [currentMessage, setCurrentMessage] = useState(null);

  useEffect(() => {
    if (flash.success || flash.error || flash.warning || flash.info) {
      const messageType = flash.error ? 'error' : 
                         flash.warning ? 'warning' : 
                         flash.success ? 'success' : 'info';
      
      setCurrentMessage({
        type: messageType,
        content: flash[messageType]
      });
      setIsVisible(true);

      // Auto dismiss after 5 seconds
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [flash]);

  const getStyles = (type) => {
    const baseStyles = "rounded-xl border-2 shadow-lg p-4 max-w-md backdrop-blur-sm";
    
    switch (type) {
      case 'success':
        return `${baseStyles} border-green-200 bg-green-50 text-green-800`;
      case 'error':
        return `${baseStyles} border-red-200 bg-red-50 text-red-800`;
      case 'warning':
        return `${baseStyles} border-yellow-200 bg-yellow-50 text-yellow-800`;
      default:
        return `${baseStyles} border-blue-200 bg-blue-50 text-blue-800`;
    }
  };

  const getIcon = (type) => {
    const iconClass = "h-5 w-5 flex-shrink-0";
    
    switch (type) {
      case 'success':
        return <CheckCircle className={`${iconClass} text-green-600`} />;
      case 'error':
        return <AlertCircle className={`${iconClass} text-red-600`} />;
      case 'warning':
        return <AlertCircle className={`${iconClass} text-yellow-600`} />;
      default:
        return <Info className={`${iconClass} text-blue-600`} />;
    }
  };

  if (!isVisible || !currentMessage) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 left-4 sm:left-auto sm:right-4 z-50 animate-in slide-in-from-top-full duration-500">
      <div className={getStyles(currentMessage.type)}>
        <div className="flex items-start gap-3">
          {getIcon(currentMessage.type)}
          <div className="flex-1 font-medium text-sm leading-relaxed">
            {currentMessage.content}
          </div>
          <button
            onClick={() => setIsVisible(false)}
            className="flex-shrink-0 h-6 w-6 p-0 hover:opacity-70 transition-opacity rounded-full flex items-center justify-center"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
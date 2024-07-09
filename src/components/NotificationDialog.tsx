// src/Dialog.js
type DialogProps ={
    isOpen:boolean,
    setIsOpen:any,
    title:string,
    children:any
}

const Dialog:React.FC<DialogProps> = ({ isOpen, title, children ,setIsOpen}) => {

    const handleClose = () => {
        setIsOpen(false);
    };

    const handleContentClick = (e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
    };
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 flex items-start justify-end z-50" onClick={handleClose}>
      <div className="bg-white rounded-lg mt-12 mr-12 overflow-hidden shadow-xl transform transition-all sm:max-w-lg sm:w-full" onClick={handleContentClick}>
        <div className="bg-white px-4 pt-5 pb-4  sm:pb-4">
          <div className="sm:flex sm:items-start">
            <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                {title}
              </h3>
              <div className="mt-2">
                {children}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dialog;

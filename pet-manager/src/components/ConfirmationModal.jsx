const ConfirmationModal = ({ show, onConfirm, onCancel, message }) => {
    if (!show) return null;
    
    return (
      <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-[1000]">
        <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 max-w-md z-60">
          <p className="mb-4">{message}</p>
          <div className="flex justify-end">
            <button 
              onClick={onCancel} 
              className="bg-gray-300 text-black rounded px-4 py-2 mr-2 hover:cursor-pointer"
            >
              Cancel
            </button>
            <button 
              onClick={onConfirm} 
              className="bg-red-500 text-white rounded px-4 py-2 hover:cursor-pointer"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    );
  };
  
  export default ConfirmationModal;
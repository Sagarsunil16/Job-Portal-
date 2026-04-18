import React from 'react';

interface DeleteJobModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isDeleting?: boolean;
}

export const DeleteJobModal: React.FC<DeleteJobModalProps> = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  isDeleting = false 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[40px] bg-black/30 animate-in fade-in duration-200 px-4">
      <div 
        className="bg-white rounded-[16px] p-[24px] flex flex-col w-full max-w-[432px] shadow-2xl animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col gap-[6px]">
          <h3 className="text-[20px] font-medium text-[#434348] leading-[24px] tracking-[0.65px] font-poppins">
            Delete Job
          </h3>
          <p className="text-[14px] font-normal text-[#7E7E86] leading-[21px] font-poppins">
            Are you sure you want to delete this job?
          </p>
        </div>
        
        <div className="flex flex-row justify-end items-start pt-[16px] gap-[12px] border-t border-[#E5E5E6] mt-[24px]">
          <button
            onClick={onClose}
            className="flex flex-row justify-center items-center px-[30px] py-[10px] w-[120px] h-[48px] bg-white border border-[#E5E5E6] rounded-[50px] text-[#434348] text-[16px] font-medium hover:bg-gray-50 transition-colors font-poppins disabled:opacity-75"
            disabled={isDeleting}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex flex-row justify-center items-center px-[30px] py-[10px] w-[120px] h-[48px] bg-[#EB4335] rounded-[50px] text-white text-[16px] font-medium hover:bg-[#d63a2d] transition-colors shadow-sm disabled:opacity-75 font-poppins"
            disabled={isDeleting}
          >
            {isDeleting ? 'Deleting' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
};

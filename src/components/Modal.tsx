import type { ReactNode } from "react";

type ModalProps = {
  title: string;
  children?: ReactNode;
  onClose: () => void;
};

export function Modal({ title, children, onClose }: ModalProps) {
  return (
    <div className="fixed inset-0 bg-opacity-100 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        >
          &times;
        </button>
        <h2 className="text-xl font-bold mb-2 text-black">{title}</h2>
        {children && <div className="text-gray-700 mb-4 break-words">{children}</div>}
      </div>
    </div>
  );
}

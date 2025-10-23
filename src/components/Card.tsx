import type { ReactNode } from "react";

type CardProps = {
  title?: string;
  children?: ReactNode;
};

export function Card({ title, children }: CardProps) {
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-lg p-6 border border-gray-200">
      {title && <div className="font-bold text-xl mb-4 text-gray-800">{title}</div>}
      {children}
    </div>
  );
}

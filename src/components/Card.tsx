import type { ReactNode } from "react";

type CardProps = {
  title?: string;
  children?: ReactNode;
};

export function Card({ title, children }: CardProps) {
  return (
    <div className="rounded overflow-hidden shadow-lg p-4">
      {title && <div className="font-bold text-xl mb-2">{title}</div>}
      {children}
    </div>
  );
}

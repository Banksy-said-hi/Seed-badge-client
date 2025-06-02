import { useState, type ReactNode } from "react";
import { Card } from "./Card";

type ExpandableProps = {
  title: string;
  children: ReactNode;
};

export function Expandable({ title, children }: ExpandableProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Card>
      <div className="flex items-center gap-2 cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
        <span className={`transition-transform ${isOpen ? "rotate-90" : ""}`}>▶</span>
        <h2 className="text-lg font-semibold">{title}</h2>
      </div>
      {isOpen && <div className="pl-4">{children}</div>}
    </Card>
  );
}

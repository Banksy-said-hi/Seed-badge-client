import type { JSX } from "react";
import { useState } from "react";
import Card from "./Card";

type ExpandableProps = {
  title: string;
  content: JSX.Element;
};

export default function Expandable({ title, content }: ExpandableProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Card
      content={
        <>
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => setIsOpen(!isOpen)}
          >
            <span className={`transition-transform ${isOpen ? "rotate-90" : ""}`}>▶</span>
            <h2 className="text-lg font-semibold">{title}</h2>
          </div>
          {isOpen && <div className="pl-4">{content}</div>}
        </>
      }
    />
  );
}

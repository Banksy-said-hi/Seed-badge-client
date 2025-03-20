import "./Card.css";
import { JSX } from "react";

interface CardProps {
  title: string;
  content: JSX.Element;
}

function Card({ title, content }: CardProps) {
  return (
    <div className="rounded overflow-hidden shadow-lg p-4">
      <div className="font-bold text-xl mb-2">{title}</div>
      {content}
    </div>
  );
}

export default Card;

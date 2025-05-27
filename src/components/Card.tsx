import "./Card.css";
import type { JSX } from "react";

type CardProps = {
  title?: string;
  content?: JSX.Element;
};

function Card({ title, content }: CardProps) {
  return (
    <div className="rounded overflow-hidden shadow-lg p-4">
      {title && <div className="font-bold text-xl mb-2">{title}</div>}
      {content}
    </div>
  );
}

export default Card;

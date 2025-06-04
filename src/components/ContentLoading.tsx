import type { ReactNode } from "react";
import { Loading } from "./Loading";

type ContentLoadingProps = {
  children: ReactNode;
  isLoading: boolean;
};

export function ContentLoading({ children, isLoading }: ContentLoadingProps) {
  return <div>{isLoading ? <Loading /> : children}</div>;
}

import type { ReactNode } from 'react';
export default function Template({ children }: { children: ReactNode }) {
  return <div className="mosaic-page-transition">{children}</div>;
}

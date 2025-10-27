import type { SVGProps } from "react";

export function MotorcycleIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <circle cx="5.5" cy="17.5" r="2.5" />
      <circle cx="18.5" cy="17.5" r="2.5" />
      <path d="M12 6H5.5l5 8.5H2" />
      <path d="M12 6h3.5a3.5 3.5 0 0 1 3.5 3.5v0a3.5 3.5 0 0 1-3.5 3.5h-5" />
    </svg>
  );
}

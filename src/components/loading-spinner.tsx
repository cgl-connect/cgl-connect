import { twMerge } from "tailwind-merge";

interface Args {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

export default function LoadingSpinner({ size = "md" }: Args) {
  return (
    <div
      className={twMerge(
        "flex justify-center items-center p-4",
        size === "sm" && "h-8 w-8",
        size === "md" && "h-12 w-12",
        size === "lg" && "h-16 w-16",
        size === "xl" && "h-20 w-20"
      )}
    >
      <div className={`animate-spin rounded-full border-b-2 border-primary`}>
        <div
          className={`animate-spin rounded-full border-b-2 border-primary ${
            size === "sm"
              ? "h-8 w-8"
              : size === "md"
              ? "h-12 w-12"
              : size === "lg"
              ? "h-16 w-16"
              : "h-20 w-20"
          }`}
        ></div>
      </div>
    </div>
  );
}

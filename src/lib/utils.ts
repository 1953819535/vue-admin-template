import type { ClassValue } from "clsx"
import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** 将数字或字符串转换为 CSS 长度值 */
export function toPx(value: number | string | undefined): string | undefined {
  if (value == null) return undefined
  return typeof value === "number" ? `${value}px` : value
}

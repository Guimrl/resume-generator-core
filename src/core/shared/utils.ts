import fs from "node:fs";
import path from "node:path";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export const readCSSFile = (filePath: string): string => {
  return fs.readFileSync(path.resolve(filePath), "utf-8");
};

export const formatDate = (date?: Date): string => {
  if (!date) return "";
  return format(date, "MM/yyyy");
};

export const formatMonthYear = (date?: Date): string => {
  if (!date) return "";
  const formatted = format(date, "LLLL yyyy", { locale: ptBR });
  return formatted.charAt(0).toUpperCase() + formatted.slice(1);
};

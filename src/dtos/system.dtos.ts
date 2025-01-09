export type logRequestType = "warning" | "success" | "error" | "info";
export interface logRequestDTO {
  type?: logRequestType;
  label?: string;
  data: any;
}
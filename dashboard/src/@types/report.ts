export type ReportLabel= "WARNING" | "ERROR" | "INFO";

export type ReportResponse = {
  id: number;
  environment: string;
  tag: string;
  path: string;
  label: ReportLabel;
  created_at: string;
  error: object;
  user: object;
};

export type ReportItem = {
    [K in keyof ReportResponse]: K extends 'created_at'
      ? Date
      : ReportResponse[K]
}

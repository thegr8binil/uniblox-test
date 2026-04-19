export const canonicalSchema = [
  "employee_id",
  "first_name",
  "last_name",
  "date_of_birth",
  "state",
  "zip",
  "annual_salary",
  "hire_date",
  "employment_status",
  "coverage_amount",
  "smoker",
  "dependent_count",
] as const;

export type CanonicalColumn = (typeof canonicalSchema)[number];

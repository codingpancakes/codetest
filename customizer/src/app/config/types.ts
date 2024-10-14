export interface Option {
  id: string;
  image: string;
  title: string;
  subtitle: string;
}

export interface StepConfig {
  id: number;
  title: string;
  mandatory: boolean;
  multiple: boolean;
  options: Option[];
}

export interface Category {
  name: string;
  color: string;
  fields: string[];
}

export interface GraphProps {
  categories: Category[];
  scale: number;
}

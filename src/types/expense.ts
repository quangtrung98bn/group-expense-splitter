
export type Person = 
  | "Trung"
  | "Vũ"
  | "Trường"
  | "Quang"
  | "Ngọc"
  | "Nguyên"
  | "Minh"
  | "Giang"
  | "Mạnh"
  | "Hiếu"
  | "Liên";

export const PEOPLE: Person[] = [
  "Trung", "Vũ", "Trường", "Quang", "Ngọc", "Nguyên", 
  "Minh", "Giang", "Mạnh", "Hiếu", "Liên"
];

export interface PersonExpense {
  person: Person;
  amount: number;
}

export interface Expense {
  id: string;
  name: string;
  amount: number;
  paidBy: Person;
  participants: Person[];
  splitEqually: boolean;
  individualExpenses: PersonExpense[];
  date: Date;
}

export interface Transaction {
  from: Person;
  to: Person;
  amount: number;
}

export interface PersonBalance {
  person: Person;
  balance: number;
}

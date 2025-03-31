
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Expense, Person, Transaction, PersonBalance } from '@/types/expense';
import { toast } from '@/components/ui/use-toast';

interface ExpenseContextType {
  expenses: Expense[];
  addExpense: (expense: Expense) => void;
  updateExpense: (expense: Expense) => void;
  deleteExpense: (id: string) => void;
  transactions: Transaction[];
  balances: PersonBalance[];
}

const ExpenseContext = createContext<ExpenseContextType | undefined>(undefined);

export const ExpenseProvider = ({ children }: { children: React.ReactNode }) => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [balances, setBalances] = useState<PersonBalance[]>([]);

  // Load expenses from localStorage
  useEffect(() => {
    const savedExpenses = localStorage.getItem('expenses');
    if (savedExpenses) {
      try {
        const parsed = JSON.parse(savedExpenses);
        // Convert string dates back to Date objects
        const processedExpenses = parsed.map((expense: any) => ({
          ...expense,
          date: new Date(expense.date)
        }));
        setExpenses(processedExpenses);
      } catch (error) {
        console.error('Failed to parse saved expenses', error);
        toast({
          title: "Lỗi",
          description: "Không thể tải danh sách chi tiêu đã lưu",
          variant: "destructive"
        });
      }
    }
  }, []);

  // Save expenses to localStorage when they change
  useEffect(() => {
    localStorage.setItem('expenses', JSON.stringify(expenses));
    calculateBalances();
  }, [expenses]);

  const addExpense = (expense: Expense) => {
    setExpenses((prev) => [...prev, expense]);
    toast({
      title: "Đã thêm chi tiêu",
      description: `${expense.name} - ${expense.amount.toLocaleString('vi-VN')}đ`,
    });
  };

  const updateExpense = (updatedExpense: Expense) => {
    setExpenses((prev) => 
      prev.map((expense) => 
        expense.id === updatedExpense.id ? updatedExpense : expense
      )
    );
    toast({
      title: "Đã cập nhật chi tiêu",
      description: `${updatedExpense.name} - ${updatedExpense.amount.toLocaleString('vi-VN')}đ`,
    });
  };

  const deleteExpense = (id: string) => {
    const expenseToDelete = expenses.find(expense => expense.id === id);
    setExpenses((prev) => prev.filter((expense) => expense.id !== id));
    if (expenseToDelete) {
      toast({
        title: "Đã xóa chi tiêu",
        description: `${expenseToDelete.name} - ${expenseToDelete.amount.toLocaleString('vi-VN')}đ`,
      });
    }
  };

  const calculateBalances = () => {
    // Initialize balances for each person
    const personBalances: Record<Person, number> = {} as Record<Person, number>;
    
    // Calculate individual balances
    expenses.forEach(expense => {
      // Add money to person who paid
      personBalances[expense.paidBy] = (personBalances[expense.paidBy] || 0) + expense.amount;
      
      // Subtract money from participants
      if (expense.splitEqually) {
        const shareAmount = expense.amount / expense.participants.length;
        expense.participants.forEach(person => {
          personBalances[person] = (personBalances[person] || 0) - shareAmount;
        });
      } else {
        expense.individualExpenses.forEach(({ person, amount }) => {
          personBalances[person] = (personBalances[person] || 0) - amount;
        });
      }
    });
    
    // Convert to array format
    const balancesArray = Object.entries(personBalances).map(([person, balance]) => ({
      person: person as Person,
      balance
    }));
    
    setBalances(balancesArray);
    
    // Calculate transactions to settle debts
    const debtors = balancesArray.filter(b => b.balance < 0)
      .sort((a, b) => a.balance - b.balance);  // Highest debt first
    
    const creditors = balancesArray.filter(b => b.balance > 0)
      .sort((a, b) => b.balance - a.balance);  // Highest credit first
    
    const newTransactions: Transaction[] = [];
    
    // Simple algorithm to minimize number of transactions
    let debtorIndex = 0;
    let creditorIndex = 0;
    
    while (debtorIndex < debtors.length && creditorIndex < creditors.length) {
      const debtor = debtors[debtorIndex];
      const creditor = creditors[creditorIndex];
      
      // Calculate the transaction amount (minimum of the absolute values)
      const amount = Math.min(Math.abs(debtor.balance), creditor.balance);
      
      if (amount > 0) {
        // Create a transaction
        newTransactions.push({
          from: debtor.person,
          to: creditor.person,
          amount: Math.round(amount) // Round to avoid floating point issues
        });
      
        // Update balances
        debtor.balance += amount;
        creditor.balance -= amount;
      }
      
      // Move to next person if their balance is settled
      if (Math.abs(debtor.balance) < 1) debtorIndex++;
      if (creditor.balance < 1) creditorIndex++;
    }
    
    setTransactions(newTransactions);
  };

  return (
    <ExpenseContext.Provider 
      value={{ 
        expenses, 
        addExpense, 
        updateExpense, 
        deleteExpense, 
        transactions, 
        balances 
      }}
    >
      {children}
    </ExpenseContext.Provider>
  );
};

export const useExpenses = () => {
  const context = useContext(ExpenseContext);
  if (context === undefined) {
    throw new Error('useExpenses must be used within an ExpenseProvider');
  }
  return context;
};

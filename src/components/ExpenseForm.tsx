import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { IOSSwitch } from "@/components/ui/ios-switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Expense, Person, PersonExpense, PEOPLE } from "@/types/expense";
import { useExpenses } from "@/context/ExpenseContext";
import { v4 as uuidv4 } from 'uuid';

interface ExpenseFormProps {
  existingExpense?: Expense;
  onClose?: () => void;
}

const ExpenseForm: React.FC<ExpenseFormProps> = ({ 
  existingExpense,
  onClose 
}) => {
  const { addExpense, updateExpense } = useExpenses();
  const isEditing = !!existingExpense;

  const [name, setName] = useState(existingExpense?.name || "");
  const [amount, setAmount] = useState(existingExpense?.amount || 0);
  const [paidBy, setPaidBy] = useState<Person>(existingExpense?.paidBy || "Trung");
  const [participants, setParticipants] = useState<Person[]>(existingExpense?.participants || []);
  const [splitEqually, setSplitEqually] = useState(existingExpense?.splitEqually ?? true);
  const [individualExpenses, setIndividualExpenses] = useState<PersonExpense[]>(
    existingExpense?.individualExpenses || []
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Update individual expenses when participants change
  useEffect(() => {
    if (splitEqually) return;

    // Keep only current participants
    const updatedExpenses = individualExpenses.filter(exp => 
      participants.includes(exp.person)
    );
    
    // Add any new participants with 0 amount
    participants.forEach(person => {
      if (!updatedExpenses.some(exp => exp.person === person)) {
        updatedExpenses.push({ person, amount: 0 });
      }
    });
    
    setIndividualExpenses(updatedExpenses);
  }, [participants]);

  // Calculate equal split when toggling or when participants/amount changes
  useEffect(() => {
    if (splitEqually && participants.length > 0) {
      const equalShare = amount / participants.length;
      const newIndividualExpenses = participants.map(person => ({
        person,
        amount: equalShare
      }));
      setIndividualExpenses(newIndividualExpenses);
    }
  }, [splitEqually, participants, amount]);

  const toggleParticipant = (person: Person) => {
    if (participants.includes(person)) {
      setParticipants(participants.filter(p => p !== person));
    } else {
      setParticipants([...participants, person]);
    }
  };

  const updateIndividualAmount = (person: Person, newAmount: number) => {
    setIndividualExpenses(prev => 
      prev.map(exp => 
        exp.person === person ? { ...exp, amount: newAmount } : exp
      )
    );
  };

  const calculateRemainingAmount = () => {
    const totalIndividual = individualExpenses.reduce((sum, exp) => sum + exp.amount, 0);
    return amount - totalIndividual;
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!name.trim()) {
      newErrors.name = "Vui lòng nhập tên chi tiêu";
    }
    
    if (amount <= 0) {
      newErrors.amount = "Số tiền phải lớn hơn 0";
    }
    
    if (participants.length === 0) {
      newErrors.participants = "Chọn ít nhất một người tham gia";
    }
    
    if (!splitEqually) {
      const total = individualExpenses.reduce((sum, exp) => sum + exp.amount, 0);
      const difference = Math.abs(total - amount);
      
      if (difference > 1) { // Allow for small rounding errors
        newErrors.individualExpenses = `Tổng số tiền chi tiêu cá nhân (${total.toLocaleString('vi-VN')}đ) không bằng tổng chi tiêu (${amount.toLocaleString('vi-VN')}đ)`;
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    const expenseData: Expense = {
      id: existingExpense?.id || uuidv4(),
      name,
      amount,
      paidBy,
      participants: [...participants],
      splitEqually,
      individualExpenses: [...individualExpenses],
      date: existingExpense?.date || new Date()
    };
    
    if (isEditing) {
      updateExpense(expenseData);
    } else {
      addExpense(expenseData);
    }
    
    // Reset form if not editing
    if (!isEditing) {
      setName("");
      setAmount(0);
      setPaidBy("Trung");
      setParticipants([]);
      setSplitEqually(true);
      setIndividualExpenses([]);
    }
    
    if (onClose) onClose();
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-center text-primary">
          {isEditing ? "Chỉnh sửa chi tiêu" : "Thêm chi tiêu mới"}
        </CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Tên chi tiêu</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ví dụ: Ăn trưa tại ABC"
              className={errors.name ? "border-destructive" : ""}
            />
            {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="amount">Số tiền (VNĐ)</Label>
            <Input
              id="amount"
              type="number"
              value={amount || ""}
              onChange={(e) => setAmount(Number(e.target.value))}
              placeholder="Nhập số tiền"
              min="0"
              className={errors.amount ? "border-destructive" : ""}
            />
            {errors.amount && <p className="text-xs text-destructive">{errors.amount}</p>}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="paidBy">Người trả</Label>
            <Select value={paidBy} onValueChange={(value) => setPaidBy(value as Person)}>
              <SelectTrigger id="paidBy">
                <SelectValue placeholder="Chọn người trả" />
              </SelectTrigger>
              <SelectContent>
                {PEOPLE.map((person) => (
                  <SelectItem key={person} value={person}>
                    {person}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label>Người tham gia</Label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-2">
              {PEOPLE.map((person) => (
                <div key={person} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`participant-${person}`}
                    checked={participants.includes(person)}
                    onCheckedChange={() => toggleParticipant(person)}
                  />
                  <Label 
                    htmlFor={`participant-${person}`}
                    className="cursor-pointer text-sm"
                  >
                    {person}
                  </Label>
                </div>
              ))}
            </div>
            {errors.participants && (
              <p className="text-xs text-destructive">{errors.participants}</p>
            )}
          </div>
          
          <div className="flex items-center justify-between py-2">
            <Label htmlFor="splitEqually">Chia đều theo đầu người</Label>
            <IOSSwitch 
              id="splitEqually"
              checked={splitEqually}
              onCheckedChange={setSplitEqually}
            />
          </div>
          
          {!splitEqually && participants.length > 0 && (
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <Label>Chi tiêu từng người</Label>
                <span className={`text-xs ${calculateRemainingAmount() !== 0 ? "text-destructive" : "text-primary"}`}>
                  {calculateRemainingAmount() === 0 
                    ? "Đã phân bổ đủ" 
                    : `Còn thiếu: ${calculateRemainingAmount().toLocaleString('vi-VN')}đ`}
                </span>
              </div>
              
              {individualExpenses.map((exp) => (
                <div key={exp.person} className="flex items-center space-x-3">
                  <span className="w-20">{exp.person}:</span>
                  <Input
                    type="number"
                    value={exp.amount || ""}
                    onChange={(e) => updateIndividualAmount(exp.person, Number(e.target.value))}
                    className="flex-1"
                    min="0"
                  />
                </div>
              ))}
              
              {errors.individualExpenses && (
                <p className="text-xs text-destructive">{errors.individualExpenses}</p>
              )}
            </div>
          )}
        </CardContent>
        
        <CardFooter className="flex justify-between">
          {onClose && (
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
            >
              Hủy
            </Button>
          )}
          <Button 
            type="submit" 
            className="bg-primary hover:bg-primary/90 text-white ml-auto"
          >
            {isEditing ? "Cập nhật" : "Lưu chi tiêu"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default ExpenseForm;

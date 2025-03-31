
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useExpenses } from "@/context/ExpenseContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const ExpenseResults: React.FC = () => {
  const { balances, transactions } = useExpenses();
  
  return (
    <Card className="w-full mt-6">
      <CardHeader>
        <CardTitle className="text-primary">Kết quả chia tiền</CardTitle>
        <CardDescription>Số dư và các giao dịch cần thực hiện</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="balances">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="balances">Số dư cá nhân</TabsTrigger>
            <TabsTrigger value="transactions">Giao dịch cần thực hiện</TabsTrigger>
          </TabsList>
          
          <TabsContent value="balances" className="mt-4">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Người</TableHead>
                    <TableHead className="text-right">Số dư</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {balances.sort((a, b) => b.balance - a.balance).map((balance) => (
                    <TableRow key={balance.person}>
                      <TableCell className="font-medium">{balance.person}</TableCell>
                      <TableCell className={`text-right ${
                        balance.balance > 0 
                          ? "text-green-600" 
                          : balance.balance < 0 
                          ? "text-red-600" 
                          : ""
                      }`}>
                        {balance.balance.toLocaleString("vi-VN")}đ
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
          
          <TabsContent value="transactions" className="mt-4">
            {transactions.length === 0 ? (
              <p className="text-center text-muted-foreground py-4">
                Không có giao dịch nào cần thực hiện.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Người trả</TableHead>
                      <TableHead>Người nhận</TableHead>
                      <TableHead className="text-right">Số tiền</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transactions.map((transaction, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{transaction.from}</TableCell>
                        <TableCell>{transaction.to}</TableCell>
                        <TableCell className="text-right">
                          {transaction.amount.toLocaleString("vi-VN")}đ
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ExpenseResults;

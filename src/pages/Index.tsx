
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ExpenseForm from "@/components/ExpenseForm";
import ExpenseList from "@/components/ExpenseList";
import ExpenseResults from "@/components/ExpenseResults";
import { ExpenseProvider } from "@/context/ExpenseContext";

const Index: React.FC = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  
  return (
    <ExpenseProvider>
      <div className="flex flex-col min-h-screen">
        <Header />
        
        <main className="container mx-auto px-4 flex-1 py-4">
          <div className="flex justify-end mb-6">
            <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
              <DialogTrigger asChild>
                <Button className="bg-primary hover:bg-primary/90">
                  <Plus className="mr-2 h-4 w-4" />
                  Thêm chi tiêu
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <ExpenseForm onClose={() => setIsFormOpen(false)} />
              </DialogContent>
            </Dialog>
          </div>
          
          <ExpenseList />
          <ExpenseResults />
        </main>
        
        <Footer />
      </div>
    </ExpenseProvider>
  );
};

export default Index;

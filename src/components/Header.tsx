
import React from "react";
import { CircleDollarSign } from "lucide-react";

const Header: React.FC = () => {
  return (
    <header className="py-4">
      <div className="container flex items-center justify-center">
        <div className="flex items-center gap-2">
          <CircleDollarSign className="h-8 w-8 text-primary" />
          <h1 className="text-2xl font-bold text-primary">NQTrung App</h1>
        </div>
      </div>
    </header>
  );
};

export default Header;

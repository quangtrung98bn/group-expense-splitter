
import React from "react";

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="py-6 mt-auto">
      <div className="container flex flex-col items-center">
        <p className="text-sm text-muted-foreground mb-1">Made with ♥️ by quangtrung</p>
        <p className="text-xs text-muted-foreground">
          &copy; {currentYear} NQTrung App. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;

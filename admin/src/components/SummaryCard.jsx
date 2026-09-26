import { icons } from "lucide-react";
import React from "react";

const SummaryCard = ({ title, value,className,onClick,icon }) => {
  return (
    <div onClick={onClick} className={`bg-white rounded-2xl border-l-4 shadow-sm hover:shadow-lg transition-all duration-300 p-6 ${className}`}>
      
      <h3 className="text-sm font-medium text-gray-500 flex gap-2">
       {icon} {title} 
      </h3>

      <p className="mt-3 text-4xl font-bold text-gray-800">
        {value}
      </p>
      
      
    </div>
  );
};

export default SummaryCard;
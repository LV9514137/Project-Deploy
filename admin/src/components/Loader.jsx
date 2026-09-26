import React from "react";
import { Loader2 } from "lucide-react";

const Loader = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">
      <Loader2
        size={42}
        className="text-blue-600 animate-spin"
      />
    </div>
  );
};

export default Loader;
import { AlertTriangle } from "lucide-react";

const MaintenanceBanner = () => {
  return (
    <div className="bg-black border-b border-perfume-gold/30 text-gray-300 py-2.5 px-4 text-center text-[11px] uppercase tracking-widest font-medium">
      <div className="container mx-auto flex items-center justify-center gap-3 flex-wrap">
        <AlertTriangle className="h-3.5 w-3.5 text-perfume-gold flex-shrink-0" />
        <span>
          Our website is currently under maintenance. For assistance, contact us at{" "}
          <a href="tel:+919104455400" className="text-perfume-gold font-bold hover:text-white transition-colors">
            +91-9104455400
          </a>{" "}
          or{" "}
          <a href="mailto:malikusama95@gmail.com" className="text-perfume-gold font-bold hover:text-white transition-colors lowercase tracking-normal">
            malikusama95@gmail.com
          </a>
        </span>
      </div>
    </div>
  );
};

export default MaintenanceBanner;

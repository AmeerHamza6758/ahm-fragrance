import { CreditCard, Truck, BadgeCheck, MapPin } from "lucide-react";

export default function TrustBar() {
  const trustItems = [
    {
      icon: CreditCard,
      title: "Cash on Delivery",
      description: "Pay at your doorstep",
    },
    {
      icon: Truck,
      title: "3-5 Days Delivery",
      description: "Swift nationwide shipping",
    },
    {
      icon: BadgeCheck,
      title: "100% Authenticity",
      description: "Guaranteed premium quality",
    },
    {
      icon: MapPin,
      title: "All Over Pakistan",
      description: "Reaching every corner",
    },
  ];

  return (
    <section className="w-full flex justify-center -mt-30 md:-mt-12 lg:-mt-14 relative z-10 px-3 sm:px-4">
      <div className="w-full max-w-6xl bg-white/80 backdrop-blur-md rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-5 md:gap-6 shadow-md">
        
        {trustItems.map((item, index) => (
          <div key={index} className="flex items-center gap-3 sm:gap-4">
            <div className="w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 rounded-full bg-[#f5f0e8] text-[#6c444e] flex items-center justify-center flex-shrink-0">
              <item.icon size={18} strokeWidth={1.8} className="sm:w-[19px] sm:h-[19px] md:w-5 md:h-5" />
            </div>
            <div>
              <h4 className="text-sm sm:text-base font-semibold text-gray-900">
                {item.title}
              </h4>
              <p className="text-xs sm:text-sm text-gray-500">
                {item.description}
              </p>
            </div>
          </div>
        ))}
        
      </div>
    </section>
  );
}
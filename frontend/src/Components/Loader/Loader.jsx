"use client";

import React from "react";
const Loader = ({ fullScreen = false, size = "md", className = "" }) => {
  const sizeClasses = {
    sm: "w-6 h-6 border-2",
    md: "w-10 h-10 border-4",
    lg: "w-16 h-16 border-4",
    xl: "w-24 h-24 border-8",
  };

  const spinnerSize = sizeClasses[size] || sizeClasses.md;

  const loaderContent = (
    <div className={`relative flex items-center justify-center ${className}`}>
      {/* Outer Pulse Effect */}
      <div className={`absolute inset-0 animate-pulse rounded-full bg-primary/10 blur-xl ${size === 'xl' ? 'scale-150' : 'scale-125'}`} />
      
      {/* Spinner Container */}
      <div className={`relative ${spinnerSize.split(' ')[0]} ${spinnerSize.split(' ')[1]}`}>
        {/* Static Background Ring */}
        <div className={`absolute inset-0 rounded-full border-muted/20 ${spinnerSize.split(' ')[2]}`} />
        
        {/* Animated Primary Ring */}
        <div 
          className={`absolute inset-0 rounded-full border-primary border-t-transparent animate-spin ${spinnerSize.split(' ')[2]}`} 
        />
      </div>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-[9999] bg-background/80 backdrop-blur-md flex items-center justify-center transition-all duration-300">
        <div className="flex flex-col items-center gap-4">
          {loaderContent}
          <p className="text-primary/60 font-noto italic text-sm animate-pulse tracking-widest">
            AHM
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex items-center justify-center py-12 w-full ${className}`}>
      {loaderContent}
    </div>
  );
};

export default Loader;

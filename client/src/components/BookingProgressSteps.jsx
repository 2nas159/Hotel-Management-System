import React from "react";
import { assets } from "../assets/assets";

const BookingProgressSteps = ({ currentStep = 1, isLoading = false }) => {
  const steps = [
    { id: 1, title: "Check Availability", description: "Verify room availability" },
    { id: 2, title: "Review Details", description: "Confirm booking information" },
    { id: 3, title: "Payment", description: "Complete payment process" },
    { id: 4, title: "Confirmation", description: "Receive booking confirmation" }
  ];

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between relative">
        {/* Progress Line */}
        <div className="absolute top-6 left-0 w-full h-0.5 bg-gray-200">
          <div 
            className="h-full bg-blue-500 transition-all duration-500 ease-in-out"
            style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
          ></div>
        </div>

        {steps.map((step, index) => (
          <div key={step.id} className="flex flex-col items-center relative z-10">
            {/* Step Circle */}
            <div className={`
              w-12 h-12 rounded-full flex items-center justify-center text-sm font-medium
              transition-all duration-300 ease-in-out
              ${currentStep >= step.id 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-200 text-gray-500'
              }
              ${isLoading && currentStep === step.id ? 'animate-pulse' : ''}
            `}>
              {isLoading && currentStep === step.id ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                step.id
              )}
            </div>
            
            {/* Step Info */}
            <div className="mt-3 text-center">
              <h3 className={`
                text-sm font-medium
                ${currentStep >= step.id ? 'text-gray-900' : 'text-gray-500'}
              `}>
                {step.title}
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                {step.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BookingProgressSteps;

import { Check } from "lucide-react";

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
  steps: string[];
}

export const StepIndicator = ({ currentStep, totalSteps, steps }: StepIndicatorProps) => {
  return (
    <div className="bg-card rounded-xl p-4 shadow-soft mb-6">
      <div className="flex items-center justify-between mb-3">
        {steps.map((step, index) => (
          <div key={index} className="flex items-center">
            <div className={`
              w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300
              ${index < currentStep 
                ? 'bg-success text-success-foreground shadow-soft' 
                : index === currentStep 
                ? 'bg-primary text-primary-foreground shadow-medium' 
                : 'bg-muted text-muted-foreground'
              }
            `}>
              {index < currentStep ? (
                <Check className="h-4 w-4" />
              ) : (
                index + 1
              )}
            </div>
            {index < totalSteps - 1 && (
              <div className={`
                w-12 h-0.5 mx-2 transition-all duration-300
                ${index < currentStep ? 'bg-success' : 'bg-muted'}
              `} />
            )}
          </div>
        ))}
      </div>
      
      <div className="text-center">
        <p className="text-sm text-muted-foreground">
          步骤 {currentStep + 1} / {totalSteps}
        </p>
        <p className="font-medium text-foreground">
          {steps[currentStep]}
        </p>
      </div>
    </div>
  );
};
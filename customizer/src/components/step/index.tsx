import React from "react";
import Card from "../card";
import { Option, StepConfig } from "../../app/config/types";

interface StepProps {
  step: StepConfig;
  selections: string[];
  setSelections: (selections: string[]) => void;
}

const Step: React.FC<StepProps> = ({ step, selections, setSelections }) => {
  const handleSelect = (id: string) => {
    if (step.multiple) {
      if (selections.includes(id)) {
        setSelections(selections.filter((item) => item !== id));
      } else {
        setSelections([...selections, id]);
      }
    } else {
      setSelections([id]);
    }
  };

  return (
    <div>
      <h2 className="text-md text-gray-700 mb-4">{step.title}</h2>
      <div className="grid md:grid-cols-[repeat(auto-fit,_26.666666%)] gap-1 m-auto p-24 justify-center grid-cols-1">
        {step.options.map((option: Option) => (
          <Card
            key={option.id}
            option={option}
            isSelected={selections.includes(option.id)}
            onSelect={handleSelect}
            multiple={step.multiple}
          />
        ))}
      </div>
    </div>
  );
};

export { Step };

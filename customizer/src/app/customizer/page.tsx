"use client";

import React, { useState, ChangeEvent } from "react";
import { Planner, Step } from "@/components";
import { Option } from "@/app/config/types";

interface StepConfig {
  id: number;
  title: string;
  mandatory: boolean;
  multiple: boolean;
  options: Option[];
}

const stepsConfig: StepConfig[] = [
  {
    id: 1,
    title: "Step 1",
    mandatory: true,
    multiple: false,
    options: [
      {
        id: "a",
        image: "/images/opt1.png",
        title: "Part-shade, East Facing",
        subtitle: "An east-facing yard, with shade in the back",
      },
      {
        id: "b",
        image: "/images/opt2.png",
        title: "Full Sun, South Facing",
        subtitle: "A south-facing yard, receiving full sun",
      },
    ],
  },
  {
    id: 2,
    title: "Step 2",
    mandatory: true,
    multiple: true,
    options: [
      {
        id: "c",
        image: "/images/opt3.png",
        title: "Drought Tolerant",
        subtitle:
          "Designed for water conservation, using drought-tolerant plants and efficient irrigation.",
      },
      {
        id: "d",
        image: "/images/opt4.png",
        title: "English/Traditional",
        subtitle:
          "Characterized by formal design, structured layouts, and a mix of flowering plants, shrubs, and hedges.",
      },
      {
        id: "e",
        image: "/images/opt5.png",
        title: "Pollinator",
        subtitle:
          "Attracts and supports pollinators like bees, butterflies, and hummingbirds with a variety of flowering plants.",
      },
    ],
  },
];

const Customizer: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [selections, setSelections] = useState<string[][]>(
    stepsConfig.map(() => [])
  );
  const [backgroundColor, setBackgroundColor] = useState<string>("#ffffff");
  const [title, setTitle] = useState<string>("Blue Garden Center");
  const [logo, setLogo] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  const handleContinue = async () => {
    const step = stepsConfig[currentStep];
    if (step.mandatory && selections[currentStep].length === 0) {
      alert("Please make a selection to continue.");
      return;
    }
    if (currentStep < stepsConfig.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      const data = {
        selections,
        backgroundColor,
        title,
        logo,
      };

      try {
        const response = await fetch("/api/save-config", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });

        const result = await response.json();
        if (response.ok) {
          const { token } = result;
          setToken(token);
          setIsOpen(true);
        } else {
          console.error("Error saving configuration:", result.error);
          alert("Failed to save configuration");
        }
      } catch (error) {
        console.error("Error:", error);
        alert("Failed to save configuration");
      }
    }
  };

  const handleLogoUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        if (e.target?.result) {
          setLogo(e.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex">
      <div className="w-1/4 p-4 bg-[#F8F4EC] shadow-md">
        <img
          src="https://images.squarespace-cdn.com/content/v1/654ef49144cfc912a2435941/2bb1f4f8-bdb9-4fd7-b85f-77a502f5e1e0/Plantista_Logo_CMYK.png?format=1500w"
          alt="logo"
          className="w-40 h-12 object-contain mr-4"
        />

        <h3 className="text-md mt-10 mb-10 text-semibold text-amber-900/70">
          Customize your widget
        </h3>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 p-2 block w-full border-gray-300 rounded-md shadow-sm text-gray-700 text-sm"
            placeholder="Enter title"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Background Color
          </label>
          <input
            type="color"
            value={backgroundColor}
            onChange={(e) => setBackgroundColor(e.target.value)}
            className="mt-1 p-2 block w-10 h-10"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Upload Logo
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleLogoUpload}
            className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:border-0 file:text-sm file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
        </div>

        {logo && (
          <div className="mt-4">
            <img
              src={logo}
              alt="Uploaded Logo"
              className="w-32 h-32 object-contain"
            />
          </div>
        )}
      </div>

      <div className="w-3/4 p-8" style={{ backgroundColor }}>
        <div className="flex items-center mb-4">
          {logo && (
            <img
              src={logo}
              alt="Logo"
              className="w-12 h-12 object-contain mr-4"
            />
          )}
          <h2 className="text-md text-gray-700">{title}</h2>
        </div>

        <Step
          step={stepsConfig[currentStep]}
          selections={selections[currentStep]}
          setSelections={(newSelection: string[]) => {
            const updatedSelections = [...selections];
            updatedSelections[currentStep] = newSelection;
            setSelections(updatedSelections);
          }}
        />

        <div className="mt-6 flex justify-end">
          <button
            onClick={handleContinue}
            className="px-2 py-1 bg-emerald-500 text-white rounded hover:bg-emerald-600"
          >
            {currentStep === stepsConfig.length - 1
              ? "Get my widget"
              : "Save & Continue"}
          </button>
        </div>
      </div>

      <Planner isOpen={isOpen} setIsOpen={setIsOpen} token={token} />
    </div>
  );
};

export default Customizer;

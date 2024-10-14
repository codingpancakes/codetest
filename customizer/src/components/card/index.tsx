import React from "react";
import { Option } from "../../app/config/types";

interface CardProps {
  option: Option;
  isSelected: boolean;
  onSelect: (id: string) => void;
  multiple: boolean;
}

const Card: React.FC<CardProps> = ({
  option,
  isSelected,
  onSelect,
  multiple,
}) => {
  const handleClick = () => {
    onSelect(option.id);
  };

  return (
    <div
      onClick={handleClick}
      className={`border rounded-lg p-4 cursor-pointer flex flex-col items-center ${
        isSelected ? multiple ? "bg-green-400 " :"border-blue-400" : "border-gray-300"
      } ${
        isSelected ? (multiple ? "bg-green-100 " : "bg-blue-100 ") : "bg-white"
      }`}
    >
      <img
        src={option.image}
        alt={option.title}
        className="w-fill object-cover"
      />
      <h3 className="mt-4 text-md text-gray-400">{option.title}</h3>
      <p className="text-sm text-gray-500">{option.subtitle}</p>
    </div>
  );
};

export default Card;

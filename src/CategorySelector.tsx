import React from "react";

interface CategorySelectorProps {
  category: string;
  currentCategory: string;
  handleCategoryChange: (category: string) => void;
}

const CategorySelector: React.FC<CategorySelectorProps> = ({
  category,
  currentCategory,
  handleCategoryChange,
}) => {
  const active =
    currentCategory === category
      ? "border-2 border-white bg-purple-600 hover:bg-purple-500 border-b-purple-600 font-bold text-white"
      : "border-2 border-white hover:bg-white hover:text-black";

  return (
    <div
      className={`${active} px-2 py-5 cursor-pointer select-none`}
      onClick={() => handleCategoryChange(category)}
    >
      {category}
    </div>
  );
};

export default CategorySelector;

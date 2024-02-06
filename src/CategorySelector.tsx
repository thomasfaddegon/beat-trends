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
      ? "border-t-2 border-l-2 border-r-2 border-white bg-purple-500"
      : "border-2 border-white";

  return (
    <div
      className={`${active} px-2 py-2 cursor-pointer hover:bg-white hover:text-black`}
      onClick={() => handleCategoryChange(category)}
    >
      {category}
    </div>
  );
};

export default CategorySelector;

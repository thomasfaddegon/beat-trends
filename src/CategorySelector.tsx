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
  const border =
    currentCategory === category
      ? "border-2 border-purple-500"
      : "border-2 border-white";

  return (
    <div
      className={`${border} px-2 py-2`}
      onClick={() => handleCategoryChange(category)}
    >
      {category}
    </div>
  );
};

export default CategorySelector;

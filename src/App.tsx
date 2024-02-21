import React, { useEffect, useState } from "react";
import Graph from "./graph";
import "./App.css";
import { DataSeries } from "./types";
import CategorySelector from "./CategorySelector";
import { genres, subGenres, labels, artists } from "./fields";

const App: React.FC = () => {
  const [selectedFields, setSelectedFields] = useState<string[]>([]);
  const [data, setData] = useState<DataSeries[]>([]);
  const [currentCategory, setCurrentCategory] = useState<string>("Genres");

  const categories = ["Genres", "Subgenres", "Labels", "Artists"];

  // Object to map category names to their respective data arrays
  const categoryDataMap = {
    Genres: genres,
    Subgenres: subGenres,
    Labels: labels,
    Artists: artists,
  };

  useEffect(() => {
    fetch("/allData.json")
      .then((response) => response.json())
      .then((allData) => {
        const categoryData = allData[currentCategory] || {};
        // Loop through the selected fields, filter to make sure the fields exist in allData, and create a new array of DataSeries objects
        const transformedData: DataSeries[] = selectedFields
          .filter((field) => categoryData.hasOwnProperty(field))
          .map((field) => ({
            name: field,
            data: Object.entries(categoryData[field]).map(([year, value]) => ({
              year: parseInt(year),
              value: Number(value),
            })),
          }));
        setData(transformedData);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, [selectedFields, currentCategory]);

  const handleFieldChange = (field: string) => {
    if (!selectedFields.includes(field)) {
      setSelectedFields((prevFields) => [...prevFields, field]);
    } else {
      setSelectedFields((prevFields) => prevFields.filter((f) => f !== field));
    }
  };

  const handleCategoryChange = (category: string) => {
    setCurrentCategory(category);
  };

  return (
    <div>
      <h1 className="mb-10">Beatport Popularity</h1>
      <div className="border-2 border-white w-full max-w-7xl bg-slate-900">
        <div className="flex flex-row items-center justify-center w-full">
          {categories.map((category) => (
            <div className="w-1/4">
              <CategorySelector
                key={category}
                category={category}
                currentCategory={currentCategory}
                handleCategoryChange={handleCategoryChange}
              />
            </div>
          ))}
        </div>
        <div className="py-6 px-12">
          <div className="flex flex-row flex-wrap gap-1 justify-center">
            {currentCategory &&
              categoryDataMap[
                currentCategory as keyof typeof categoryDataMap
              ].map((field, index) => (
                <div className="flex flex-row px-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    key={index}
                    id={`checkbox-${index}`}
                    name={field}
                    value={field}
                    checked={selectedFields.includes(field)}
                    onChange={() => handleFieldChange(field)}
                    className="cursor-pointer"
                  />
                  <label
                    className="pl-1 cursor-pointer"
                    htmlFor={`checkbox-${index}`}
                  >
                    {field}
                  </label>
                </div>
              ))}
          </div>
        </div>
        <div className="p-8">
          <Graph data={data} />
        </div>
      </div>
    </div>
  );
};

export default App;

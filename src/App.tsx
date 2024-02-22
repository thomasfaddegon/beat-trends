import React, { useEffect, useState } from "react";
import Graph from "./Graph";
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
    <div className="min-h-screen flex justify-center pt-12">
      <div className="max-w-screen-xl w-full flex flex-grow flex-col px-8">
        <h1 className="mb-10 text-center">Beatport Popularity</h1>
        <div className="border-2 border-white w-full bg-slate-900 max-w-6xl rounded-sm shadow-sm">
          <div className="flex flex-row items-center justify-center w-full">
            {categories.map((category) => (
              <div className="w-1/4 text-center ">
                <CategorySelector
                  key={category}
                  category={category}
                  currentCategory={currentCategory}
                  handleCategoryChange={handleCategoryChange}
                />
              </div>
            ))}
          </div>
          <div className="py-6 px-16 w-full flex flex-grow">
            <div className="flex flex-row flex-wrap gap-[6px] justify-center w-full">
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
          <div className="p-8 w-full" style={{ width: "100%" }}>
            <Graph data={data} />
          </div>{" "}
          <div
            id="tooltip"
            style={{
              position: "absolute",
              opacity: 0,
              background: "#fff",
              border: "1px solid #000",
              padding: "10px",
              pointerEvents: "none",
            }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default App;

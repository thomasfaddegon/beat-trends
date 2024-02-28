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
  const [limitReached, setLimitReached] = useState(false);

  const categories = ["Genres", "Subgenres", "Labels", "Artists"];

  // Object to map category names to their respective data arrays
  const categoryDataMap = {
    Genres: genres,
    Subgenres: subGenres,
    Labels: labels,
    Artists: artists,
  };

  // Fetch the JSON data and transform it into a format that can be used by the graph
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
      if (selectedFields.length <= 11) {
        // Check limit before adding
        setSelectedFields((prevFields) => [...prevFields, field]);
      } else {
        setLimitReached(true);
      }
    } else {
      setSelectedFields((prevFields) => {
        const updatedFields = prevFields.filter((f) => f !== field);
        setLimitReached(updatedFields.length >= 12); // Update limitReached based on new length
        return updatedFields;
      });
    }
  };

  const handleClear = () => {
    setSelectedFields([]);
    setLimitReached(false); // Ensure limitReached is reset when clearing all fields
  };

  const handleCategoryChange = (category: string) => {
    // Access the first three options from the newly selected category
    const firstThreeOptions = categoryDataMap[
      category as keyof typeof categoryDataMap
    ].slice(0, 3);
    setSelectedFields(firstThreeOptions.length > 0 ? firstThreeOptions : []);

    setCurrentCategory(category);
  };

  const sortData = (data: DataSeries[]) => {
    console.log();
    const totalData = data.map((series) => {
      const total = series.data.reduce((acc, curr) => acc + curr.value, 0);
      return { [series.name]: total };
    });

    const sortedData = totalData.sort((a, b) => {
      const aValue = Object.values(a)[0];
      const bValue = Object.values(b)[0];
      return bValue - aValue;
    });

    return sortedData;
  };

  const sortedData = sortData(data);

  return (
    <div className="min-h-screen flex justify-center pt-12">
      <div className="max-w-screen-xl w-full flex flex-grow flex-col px-8">
        <h1 className="mb-10 text-center">Beatport Popularity</h1>
        <div className="border-2 border-white w-full bg-slate-900 max-w-6xl rounded-sm shadow-sm pb-12">
          {/* CATEGORIES */}
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
          <div className="pt-8 pb-2 px-16 w-full flex flex-col flex-grow">
            {/* LIST OF INPUTS*/}
            <div className="flex flex-row flex-wrap gap-[6px] justify-center w-full">
              {currentCategory &&
                categoryDataMap[
                  currentCategory as keyof typeof categoryDataMap // Union type assertion to avoid TS error
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
            {limitReached && (
              <div className="flex justify-center pt-2">
                <p className="text-red-600">12 Line Limit Reached</p>
              </div>
            )}
            <div className="flex justify-center py-4">
              <button onClick={handleClear}>Clear All</button>
            </div>
          </div>
          {/* LEGEND & GRAPH */}
          <div className="px-8 pt-4 pb-8 w-full" style={{ width: "100%" }}>
            <Graph data={data} />
          </div>{" "}
          <div className="pl-24">
            <table className="mt-4 w-full text-white">
              <thead>
                <tr>
                  <th className="text-left text-lg">
                    {currentCategory.substring(0, currentCategory.length - 1)}
                  </th>
                  <th className="text-left text-lg">
                    Total Beatport Appearances
                  </th>
                </tr>
              </thead>
              <tbody>
                {sortedData.map((series, index) => (
                  <tr key={index}>
                    <td className="w-1/3">{Object.keys(series)[0]}</td>
                    <td className="w-2/3">{Object.values(series)[0]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div
            id="tooltip"
            style={{
              position: "absolute",
              opacity: 0,
              background: "black",
              color: "white",
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

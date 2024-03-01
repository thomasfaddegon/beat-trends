import React, { useEffect, useState } from "react";
import Graph from "./Graph.tsx";
import "./App.css";
import { DataSeries } from "./types";
import CategorySelector from "./CategorySelector";
import questionMark from "../src/assets/questionMark.svg";
import { genres, subGenres, labels, artists } from "./fields";
import FAQ from "./FAQ";

const App: React.FC = () => {
  // Check screen size
  const [isScreenSmall, setIsScreenSmall] = useState(window.innerWidth < 300);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsScreenSmall(window.innerWidth < 600);
    };
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  // Object to map category names to their respective data arrays
  const categoryDataMap = {
    Genres: genres,
    Subgenres: subGenres,
    Labels: labels,
    Artists: artists,
  };

  const defaultCategory = "Genres";
  const initialSelectedFields = categoryDataMap[defaultCategory].slice(0, 3);

  const [currentCategory, setCurrentCategory] =
    useState<string>(defaultCategory);
  const [selectedFields, setSelectedFields] = useState<string[]>(
    initialSelectedFields
  );
  const [data, setData] = useState<DataSeries[]>([]);
  const [limitReached, setLimitReached] = useState(false);

  const categories = ["Genres", "Subgenres", "Labels", "Artists"];

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
    <div className="min-h-screen flex justify-center items-center pt-12 w-full flex-col">
      <div>
        {isScreenSmall && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0, 0, 0, 0.8)",
              color: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 1000,
            }}
          >
            <p className="px-12 text-center text-xl">
              For an optimal viewing experience, please use a larger device.
            </p>
          </div>
        )}
      </div>
      <div className="max-w-screen-xl w-full flex flex-grow flex-col px-8 ">
        <h1 className="mb-4 text-5xl text-center">
          The Popularity of Dance Music Genres
        </h1>
        <h2 className="mb-10 text-center text-xl">
          (According to the Beatport Top 100)
        </h2>
        <div className="border-2 border-white w-full bg-slate-900 max-w-7xl rounded-sm shadow-sm pb-12">
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
            {/* LIST OF FIELDS*/}
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
                    {field === "EDM" && (
                      <>
                        <img
                          src={questionMark}
                          className="ml-1"
                          onMouseOver={(e) => {
                            const tooltip =
                              document.getElementById("EDM-tooltip");
                            if (tooltip) {
                              const iconRect =
                                e.currentTarget.getBoundingClientRect();
                              tooltip.style.opacity = "1";
                              tooltip.style.left = `${iconRect.right + 5}px`;
                              tooltip.style.top = `${iconRect.top}px`;
                            }
                          }}
                          onMouseLeave={() => {
                            const tooltip =
                              document.getElementById("EDM-tooltip");
                            tooltip?.style.setProperty("opacity", "0");
                          }}
                        />
                        <div id="EDM-tooltip" className="tooltip">
                          "EDM" is bundle of subgenres including Progressive
                          House, Electro House, Future House, and Big Room. If
                          you disagree with this classification, you are wrong.
                        </div>
                      </>
                    )}
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
          <div id="tooltip" className="tooltip"></div>
        </div>
        <FAQ />
      </div>
    </div>
  );
};

export default App;

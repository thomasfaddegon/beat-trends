import Graph from "./graph";
import "./App.css";
import { useEffect, useState } from "react";
import { DataSeries } from "./types";
import CategorySelector from "./CategorySelector";

const App: React.FC = () => {
  const fields = ["House", "Tech House", "Techno"];
  const [selectedFields, setSelectedfields] = useState<string[]>([]);
  const [data, setData] = useState<DataSeries[]>([]);
  const [currentCategory, setCurrentCategory] = useState<string>("");

  const categories = ["Genres", "Subgenres", "Labels", "Artists"];

  useEffect(() => {
    // Fetch the genre data when the component mounts
    fetch("/genres.json")
      .then((response) => response.json())
      .then((rawData: { [genre: string]: { [year: string]: number } }) => {
        // Transform rawData into DataSeries[]
        const transformedData: DataSeries[] = selectedFields
          .filter((field) => rawData.hasOwnProperty(field))
          .map((field) => ({
            name: field,
            data: Object.entries(rawData[field]).map(([year, value]) => ({
              year: parseInt(year),
              value,
            })),
          }));

        setData(transformedData);
      })
      .catch((error) => console.error("Error fetching genre data:", error));
  }, [selectedFields]);

  const handleFieldChange = (field: string, isChecked: boolean) => {
    if (isChecked) {
      setSelectedfields((prevFields) => [...prevFields, field]);
    } else {
      setSelectedfields((prevFields) => prevFields.filter((g) => g !== field));
    }
  };

  const handleCategoryChange = (category: string) => {
    setCurrentCategory(category);
  };

  console.log("category:", currentCategory);

  return (
    <div>
      <div className="border-2 border-white p-9">
        <h1 className="mb-10">Beatport Popularity</h1>
        <div className="flex flex-row items-center justify-center">
          {categories.map((category) => {
            return (
              <CategorySelector
                key={category}
                category={category}
                currentCategory={currentCategory}
                handleCategoryChange={handleCategoryChange}
              />
            );
          })}
        </div>
        <div>
          {fields.map((field) => (
            <label key={field} className="no-select">
              <input
                type="checkbox"
                value={field}
                onChange={(e) => handleFieldChange(field, e.target.checked)}
              />
              {field}
            </label>
          ))}
        </div>
        <Graph data={data} />
      </div>
    </div>
  );
};

export default App;

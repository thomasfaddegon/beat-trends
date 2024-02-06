import Graph from "./graph";
import "./App.css";
import { useEffect, useState } from "react";
import { DataSeries } from "./types";

const App: React.FC = () => {
  const fields = ["House", "Tech House", "Techno"];
  const [selectedFields, setSelectedfields] = useState<string[]>([]);
  const [data, setData] = useState<DataSeries[]>([]);

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

  return (
    <>
      <h1 className="mb-10">Beatport fields</h1>
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
    </>
  );
};

export default App;

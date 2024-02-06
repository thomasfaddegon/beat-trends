// DataPoint represents a single point in a data series, defined by a year and its corresponding value. (2014: 30, 2015: 10, etc.)
export interface DataPoint {
  year: number;
  value: number;
}

// DataSeries represents a single series of data points on the graph, including its name and data points. (e.g. a line representing "House", "Techno", etc.)
export interface DataSeries {
  name: string;
  data: DataPoint[];
}

// GraphProps defines the props structure for the Graph component, including all of the data series (lines) to be displayed on the graph.
export interface GraphProps {
  data: DataSeries[];
}

import * as d3 from "d3";

export function loadData(year: number) {
  return new Promise((resolve, reject) => {
    d3.csv(`./data/beatport_results_${year}-01-01_to_${year}-12-01.csv`)
      .then((data) => resolve(data))
      .catch((error) => reject(error));
  });
}

// export async function loadAllData() {
//   let allData = {};
//   for (let year = 2013; year <= 2022; year++) {
//     let data = await loadData(year);
//     allData[year] = data;
//   }
//   return allData;
// }

import Papa from "papaparse";
import * as XLSX from "xlsx";

export interface ParsedData {
  columns: string[];
  rows: any[];
}

export const parseFile = async (file: File): Promise<ParsedData> => {
  const extension = file.name.split(".").pop()?.toLowerCase();

  if (extension === "csv") {
    return new Promise((resolve, reject) => {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          resolve({
            columns: results.meta.fields || [],
            rows: results.data,
          });
        },
        error: (error: any) => reject(error),
      });
    });
  } else if (extension === "xlsx" || extension === "xls") {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = e.target?.result;
          const workbook = XLSX.read(data, { type: "binary" });
          const firstSheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheetName];
          const json = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
          
          if (json.length === 0) {
            resolve({ columns: [], rows: [] });
            return;
          }

          const columns = json[0] as string[];
          const rows = json.slice(1).map((row: any) => {
            const obj: any = {};
            columns.forEach((col, index) => {
              obj[col] = row[index];
            });
            return obj;
          });

          resolve({ columns, rows });
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = (error) => reject(error);
      reader.readAsBinaryString(file);
    });
  } else {
    throw new Error("Unsupported file format. Please upload CSV or XLSX.");
  }
};

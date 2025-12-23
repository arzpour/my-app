import { urls } from "@/utils/urls";
import { axiosInstance } from "./instance";
import type { ISalaries } from "@/types/new-backend-types";

// Get all salaries
type getAllSalariesType = () => Promise<ISalaries[]>;
export const getAllSalaries: getAllSalariesType = async () => {
  const response = await axiosInstance.get(urls.salaries.list);
  return response.data;
};

// Get salary by ID
type getSalaryByIdType = (id: string) => Promise<ISalaries>;
export const getSalaryById: getSalaryByIdType = async (id) => {
  const response = await axiosInstance.get(urls.salaries.byId(id));
  return response.data;
};

// Get salaries by employee
type getSalariesByEmployeeType = (personId: string) => Promise<ISalaries[]>;
export const getSalariesByEmployee: getSalariesByEmployeeType = async (personId) => {
  const response = await axiosInstance.get(urls.salaries.byEmployee(personId));
  return response.data;
};

// Get salaries by period
type getSalariesByPeriodType = (year: string, month: string) => Promise<ISalaries[]>;
export const getSalariesByPeriod: getSalariesByPeriodType = async (year, month) => {
  const response = await axiosInstance.get(urls.salaries.byPeriod(year, month));
  return response.data;
};

// Create new salary
type createSalaryType = (data: Partial<ISalaries>) => Promise<ISalaries>;
export const createSalary: createSalaryType = async (data) => {
  const response = await axiosInstance.post(urls.salaries.create, data);
  return response.data;
};

// Update salary
type updateSalaryType = (id: string, data: Partial<ISalaries>) => Promise<ISalaries>;
export const updateSalary: updateSalaryType = async (id, data) => {
  const response = await axiosInstance.put(urls.salaries.update(id), data);
  return response.data;
};


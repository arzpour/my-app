import { urls } from "@/utils/urls";
import { axiosInstance } from "./instance";
import type { ILoan } from "@/types/new-backend-types";

// Get all loans
type getAllLoansType = () => Promise<ILoan[]>;
export const getAllLoans: getAllLoansType = async () => {
  const response = await axiosInstance.get(urls.loans.list);
  return response.data;
};

// Get loan by ID
type getLoanByIdType = (id: string) => Promise<ILoan>;
export const getLoanById: getLoanByIdType = async (id) => {
  const response = await axiosInstance.get(urls.loans.byId(id));
  return response.data;
};

// Get loans by borrower
type getLoansByBorrowerType = (personId: string) => Promise<ILoan[]>;
export const getLoansByBorrower: getLoansByBorrowerType = async (personId) => {
  const response = await axiosInstance.get(urls.loans.byBorrower(personId));
  return response.data;
};

// Get loans by status
type getLoansByStatusType = (status: string) => Promise<ILoan[]>;
export const getLoansByStatus: getLoansByStatusType = async (status) => {
  const response = await axiosInstance.get(urls.loans.byStatus(status));
  return response.data;
};

// Create new loan
type createLoanType = (data: Partial<ILoan>) => Promise<ILoan>;
export const createLoan: createLoanType = async (data) => {
  const response = await axiosInstance.post(urls.loans.create, data);
  return response.data;
};

// Update loan
type updateLoanType = (id: string, data: Partial<ILoan>) => Promise<ILoan>;
export const updateLoan: updateLoanType = async (id, data) => {
  const response = await axiosInstance.put(urls.loans.update(id), data);
  return response.data;
};


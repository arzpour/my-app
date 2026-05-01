import { urls } from "@/utils/urls";
import { axiosInstance } from "./instance";
import type { ITransactionNew } from "@/types/new-backend-types";


type getAllTransactionsType = () => Promise<ITransactionNew[]>;
export const getAllTransactions: getAllTransactionsType = async () => {
  const response = await axiosInstance.get(urls.transactions.list);
  return response.data;
};

// Get transactions by deal ID
type getTransactionsByDealType = (dealId: string) => Promise<ITransactionNew[]>;
export const getTransactionsByDeal: getTransactionsByDealType = async (
  dealId
) => {
  const response = await axiosInstance.get(urls.transactionsNew.byDeal(dealId));
  return response.data;
};

// Get transaction by ID
type getTransactionByIdType = (id: string) => Promise<ITransactionNew>;
export const getTransactionById: getTransactionByIdType = async (
  id
) => {
  const response = await axiosInstance.get(urls.transactionsNew.byId(id));
  return response.data;
};

// Get transactions by person ID
type getTransactionsByPersonType = (
  personId: string
) => Promise<ITransactionNew[]>;
export const getTransactionsByPerson: getTransactionsByPersonType = async (
  personId
) => {
  const response = await axiosInstance.get(
    urls.transactionsNew.byPerson(personId)
  );
  return response.data;
};

// Get transactions by type
type getTransactionsByTypeType = (type: string) => Promise<ITransactionNew[]>;
export const getTransactionsByType: getTransactionsByTypeType = async (
  type
) => {
  const response = await axiosInstance.get(urls.transactionsNew.byType(type));
  return response.data;
};

// Get transactions by date range
type getTransactionsByDateRangeType = (
  startDate: string,
  endDate: string
) => Promise<ITransactionNew[]>;
export const getTransactionsByDateRange: getTransactionsByDateRangeType =
  async (startDate, endDate) => {
    const response = await axiosInstance.get(urls.transactionsNew.byDateRange, {
      params: { startDate, endDate },
    });
    return response.data;
  };


// Create transaction
type createTransactionType = (data: Partial<ITransactionNew>) => Promise<ITransactionNew>;
export const createTransaction: createTransactionType = async (data) => {
  const response = await axiosInstance.post(
    urls.transactionsNew.create,
    data
  );
  return response.data;
};

// Update transaction
type updateTransactionType = (id: string, data: Partial<ITransactionNew>) => Promise<ITransactionNew>;
export const updateTransaction: updateTransactionType = async (id, data) => {
  const response = await axiosInstance.put(
    urls.transactionsNew.update(id),
    data
  );
  return response.data;
};

// Delete transaction
type deleteTransactionType = (id: string) => Promise<void>;
export const deleteTransaction: deleteTransactionType = async (id) => {
  const response = await axiosInstance.delete(
    urls.transactionsNew.delete(id)
  );
  return response.data;
};

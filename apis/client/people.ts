import { urls } from "@/utils/urls";
import { axiosInstance } from "./instance";
import type { IPeople } from "@/types/new-backend-types";

// Get all people (replaces getUniqeUsersData)
type getAllPeopleType = () => Promise<IPeople[]>;
export const getAllPeople: getAllPeopleType = async () => {
  const response = await axiosInstance.get(urls.people.list);
  return response.data;
};

// Get person by ID
type getPersonByIdType = (id: string) => Promise<IPeople>;
export const getPersonById: getPersonByIdType = async (id) => {
  const response = await axiosInstance.get(urls.people.byId(id));
  return response.data;
};

// Get person by national ID
type getPersonByNationalIdType = (nationalId: string) => Promise<IPeople>;
export const getPersonByNationalId: getPersonByNationalIdType = async (
  nationalId
) => {
  const response = await axiosInstance.get(
    urls.people.byNationalId(nationalId)
  );
  return response.data;
};

// Get people by role
type getPeopleByRoleType = (role: string) => Promise<IPeople[]>;
export const getPeopleByRole: getPeopleByRoleType = async (role) => {
  const response = await axiosInstance.get(urls.people.byRole(role));
  return response.data;
};

// Search people by name
type searchPeopleType = (name: string) => Promise<IPeople[]>;
export const searchPeople: searchPeopleType = async (name) => {
  const response = await axiosInstance.get(urls.people.search(name));
  return response.data;
};

// Create new person
type createPersonType = (data: Partial<IPeople>) => Promise<IPeople>;
export const createPerson: createPersonType = async (data) => {
  const response = await axiosInstance.post(urls.people.create, data);
  return response.data;
};

// Update person
type updatePersonType = (
  id: string,
  data: Partial<IPeople>
) => Promise<IPeople>;
export const updatePerson: updatePersonType = async (id, data) => {
  const response = await axiosInstance.put(urls.people.update(id), data);
  return response.data;
};

// Update wallet balance
type updateWalletType = (_: {
  id: string;
  data: IUpdateWalletReq;
}) => Promise<IPeople>;
export const updateWallet: updateWalletType = async ({ id, data }) => {
  const response = await axiosInstance.put(urls.people.updateWallet(id), data);
  return response.data;
};

// Delete person
type deletePersonType = (id: string) => Promise<void>;
export const deletePerson: deletePersonType = async (id) => {
  await axiosInstance.delete(urls.people.delete(id));
};

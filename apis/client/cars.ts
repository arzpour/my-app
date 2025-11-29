/**
 * ============================================
 * MIGRATION NOTES FOR NEW BACKEND API
 * ============================================
 *
 * This file handles car/deal operations. In the new backend:
 * - "Cars" are replaced by "Deals" (IDeal type)
 * - ChassisNo maps to VIN in vehicleSnapshot
 * - Use /deals endpoints instead of /cars
 *
 * NEW API ENDPOINTS TO USE:
 * - GET /deals - Get all deals (replaces getAllCars)
 * - GET /deals/vin/:vin - Get deal by VIN (replaces getCarByChassisNo)
 * - GET /deals/id/:id - Get deal by ID
 * - GET /deals/person/:personId - Get deals by person (replaces getFilterByUserData)
 * - GET /people - Get all people (replaces getUniqeUsersData)
 * - GET /people/national-id/:nationalId - Get person by national ID
 * - POST /deals - Create new deal (replaces createCar)
 * - PUT /deals/id/:id - Update deal (replaces updateCar)
 */
import { urls } from "@/utils/urls";
import { axiosInstance } from "./instance";
import type { IDeal, IDealsByPersonResponse } from "@/types/new-backend-types";

/**
 * MIGRATION: Replace with GET /deals
 * Returns: IDeal[] instead of ICarRes[]
 */
type getAllCarsType = () => Promise<ICarRes[]>;
export const getAllCars: getAllCarsType = async () => {
  const response = await axiosInstance.get(urls.cars.list);
  return response.data;
};

/**
 * MIGRATION: Replace with GET /vehicles to get all VINs
 * Or use GET /deals and extract vehicleSnapshot.vin from each deal
 */
type getAllCarChassisNoType = () => Promise<string[]>;
export const getAllCarChassisNo: getAllCarChassisNoType = async () => {
  const response = await axiosInstance.get(urls.cars.chassisNo);
  return response.data;
};

/**
 * MIGRATION: Replace with GET /deals/vin/:vin
 * Returns: IDeal instead of ICarRes
 * Note: chassisNo parameter maps to VIN in new structure
 */
type getCarByChassisNoType = (chassisNo: string) => Promise<ICarRes>;
export const getCarByChassisNo: getCarByChassisNoType = async (chassisNo) => {
  const response = await axiosInstance.get(urls.cars.byChassisNo(chassisNo));
  return response.data;
};

/**
 * MIGRATION: Replace with GET /deals/person/:personId
 * Returns deals where person is buyer or seller
 */
type getCarByNationalIdType = (nationalId: string) => Promise<ICarRes>;
export const getCarByNationalId: getCarByNationalIdType = async (
  nationalId
) => {
  const response = await axiosInstance.get(urls.cars.byNationalId(nationalId));
  return response.data;
};

// Get unique users data - maps to new people API
type getUniqeUsersDataType = () => Promise<IUniqeUsersData[]>;
export const getUniqeUsersData: getUniqeUsersDataType = async () => {
  const { getAllPeople } = await import("./people");
  const people = await getAllPeople();

  // Map to old format
  return people.map((person) => ({
    name: person.fullName,
    nationalId: person.nationalId.toString(),
    roles: person.roles,
  }));
};

// Get filter by user data - maps to new deals API
type getFilterByUserDataType = (data: {
  nationalId: string;
  userName: string;
}) => Promise<ICarDataByNationalIdOrName>;
export const getFilterByUserData: getFilterByUserDataType = async ({
  nationalId,
  userName,
}) => {
  // First, find person by nationalId or name
  const { getAllPeople, searchPeople } = await import("./people");
  let personId: string | null = null;

  if (nationalId) {
    try {
      const { getPersonByNationalId } = await import("./people");
      const person = await getPersonByNationalId(nationalId);
      personId = person._id.toString();
    } catch (error) {
      console.error("Person not found by nationalId:", error);
    }
  }

  if (!personId && userName) {
    const people = await searchPeople(userName);
    if (people.length > 0) {
      personId = people[0]._id.toString();
    }
  }

  if (!personId) {
    return { purchases: [], sales: [] };
  }

  // Get deals by person
  const { getDealsByPerson } = await import("./deals");
  const dealsData = await getDealsByPerson(personId);

  // Map deals to car format
  const mapDealToCar = (deal: IDeal): ICarRes => ({
    _id: deal._id.toString(),
    RowNo: 0,
    CarModel: deal.vehicleSnapshot.model,
    SaleAmount: deal.salePrice,
    PurchaseAmount: deal.purchasePrice,
    LicensePlate: deal.vehicleSnapshot.plateNumber,
    ChassisNo: deal.vehicleSnapshot.vin,
    SellerName: deal.seller.fullName,
    BuyerName: deal.buyer.fullName,
    SaleDate: deal.saleDate,
    PurchaseDate: deal.purchaseDate,
    SellerMobile: parseInt(deal.seller.mobile) || 0,
    BuyerMobile: parseInt(deal.buyer.mobile) || 0,
    PurchaseBroker: deal.purchaseBroker?.fullName || "",
    SaleBroker: deal.saleBroker?.fullName || "",
    Secretary: "",
    DocumentsCopy: "",
    SellerNationalID: parseInt(deal.seller.nationalId) || 0,
    BuyerNationalID: parseInt(deal.buyer.nationalId) || 0,
    status: deal.status,
  });

  return {
    purchases: dealsData.purchases.map(mapDealToCar),
    sales: dealsData.sales.map(mapDealToCar),
  };
};

/**
 * MIGRATION: Replace with POST /deals
 * Data structure changes:
 * - PurchaseAmount -> purchasePrice
 * - SaleAmount -> salePrice
 * - ChassisNo -> vehicleSnapshot.vin
 * - SellerName, BuyerName -> seller.fullName, buyer.fullName
 * - SellerNationalID, BuyerNationalID -> seller.nationalId, buyer.nationalId
 * - SellerMobile, BuyerMobile -> seller.mobile, buyer.mobile
 * - PurchaseBroker, SaleBroker -> purchaseBroker, saleBroker objects
 */
type createCarType = (data: Partial<ICarRes>) => Promise<ICarRes>;
export const createCar: createCarType = async (data) => {
  const response = await axiosInstance.post(urls.cars.list, data);
  return response.data;
};

/**
 * MIGRATION: Replace with PUT /deals/id/:id
 * Same field mappings as createCar above
 */
type updateCarType = (id: string, data: Partial<ICarRes>) => Promise<ICarRes>;
export const updateCar: updateCarType = async (id, data) => {
  const response = await axiosInstance.put(urls.cars.byId(id), data);
  return response.data;
};

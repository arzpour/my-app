# Migration Files Summary

This document lists all files that have been updated with migration comments and instructions for the new backend API.

## Files with Migration Comments

### 1. Component Files

#### `components/vehicleDashboard.tsx`
- **Location**: Main dashboard component for vehicle details
- **Comments Added**: 
  - Header comment explaining new API endpoints
  - Comments on `handleCarDetailDataByChassisNoData` function
  - Comments on `handleInvestmentDataByChassisNoData` function
  - Comments on `handleUnpaidDataByChassisNoData` function
  - Comments on calculation logic (totalPaidToSeller, etc.)
  - Comments on table rendering sections
- **Key Changes Needed**:
  - Replace `getDetailByChassisNo` with `GET /deals/vin/:vin` + `GET /transactions/deal/:dealId`
  - Replace `getChequeByChassisNo` with `GET /cheques/deal/:dealId`
  - Replace `getInvestmentByChassis` with `deal.partnerships` array
  - Update all field references (TransactionType → type, etc.)

### 2. API Client Files

#### `apis/client/cars.ts`
- **Comments Added**: 
  - Header comment with new API endpoints
  - Comments on each function explaining migration
- **Key Changes Needed**:
  - `getAllCars` → `GET /deals`
  - `getCarByChassisNo` → `GET /deals/vin/:vin`
  - `getUniqeUsersData` → `GET /people`
  - `getFilterByUserData` → `GET /deals/person/:personId`

#### `apis/client/transaction.ts`
- **Comments Added**:
  - Header comment with field mappings
  - Comments on each function
- **Key Changes Needed**:
  - `getTransactionByChassis` → `GET /transactions/deal/:dealId` (need dealId first)
  - Update field names (TransactionType → type, etc.)

#### `apis/client/cheques.ts`
- **Comments Added**:
  - Header comment with structure changes
  - Comments on each function
- **Key Changes Needed**:
  - `getChequeByChassis` → `GET /cheques/deal/:dealId` (need dealId first)
  - `getUnpaidCheques` → `GET /cheques/unpaid/deal/:dealId`
  - Update type values ("صادره" → "issued", "وارده" → "received")

#### `apis/client/detailsByChassisNo.ts`
- **Comments Added**:
  - Detailed explanation of multi-step API calls needed
  - Example code for combining data
- **Key Changes Needed**:
  - Replace single call with: GET deal → GET transactions → GET cheques
  - Map to old structure or refactor components

#### `apis/client/investment.ts`
- **Comments Added**:
  - Explanation of partnerships array
  - Example mapping code
- **Key Changes Needed**:
  - Use `deal.partnerships` instead of separate transactions
  - Map to IInvestmentRes format if needed

### 3. Configuration Files

#### `utils/urls.ts`
- **Comments Added**:
  - Comprehensive list of all new API endpoints
  - Organized by resource type (Deals, Transactions, Cheques, People, etc.)
- **Purpose**: Reference document for all available endpoints

### 4. Type Definition Files

#### `types/new-backend-types.d.ts` (NEW FILE)
- **Purpose**: Complete TypeScript interfaces for new backend structure
- **Types Included**:
  - `IBusinessAccounts`
  - `IChequeNew`
  - `IDeal`
  - `IExpense`
  - `ILoan`
  - `IPeople`
  - `ISalaries`
  - `ITransactionNew`
  - `IVehicle`
  - Response types (`IUnpaidChequesResponse`, `IDealsByPersonResponse`, etc.)

### 5. Documentation Files

#### `MIGRATION_GUIDE.md` (NEW FILE)
- **Purpose**: Comprehensive migration guide
- **Contents**:
  - Overview of changes
  - API endpoint mapping table
  - Field mappings
  - Migration steps by component
  - Example code snippets
  - Testing checklist

#### `MIGRATION_FILES_SUMMARY.md` (THIS FILE)
- **Purpose**: Quick reference of all updated files

## Migration Workflow

1. **Review Comments**: Check all files listed above for migration comments
2. **Read Migration Guide**: Review `MIGRATION_GUIDE.md` for comprehensive instructions
3. **Check Types**: Refer to `types/new-backend-types.d.ts` for new data structures
4. **Update URLs**: Add new endpoints to `utils/urls.ts` as needed
5. **Implement Changes**: Follow comments in each file to update API calls
6. **Test**: Use testing checklist in `MIGRATION_GUIDE.md`

## Quick Reference: Key Endpoints

### Getting Deal Data
```
1. GET /deals/vin/:vin → Get deal by VIN
2. Extract deal._id
3. GET /transactions/deal/:dealId → Get transactions
4. GET /cheques/deal/:dealId → Get cheques
5. GET /cheques/unpaid/deal/:dealId → Get unpaid cheques
```

### Field Mapping Quick Reference
- `TransactionType` → `type`
- `TransactionAmount` → `amount`
- `TransactionDate` → `transactionDate`
- `ChequeType === "صادره"` → `type === "issued"`
- `ChequeType === "وارده"` → `type === "received"`
- `vehicleDetails?.car.SaleAmount` → `deal.salePrice`
- `vehicleDetails?.car.PurchaseAmount` → `deal.purchasePrice`

## Notes

- All dashboard logic remains unchanged - only API calls need updating
- Field mappings are documented in each file
- Example code is provided in comments
- Types are fully defined in `new-backend-types.d.ts`


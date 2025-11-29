# Backend API Migration Guide

This document provides a comprehensive guide for migrating from the old API structure to the new backend API.

## Table of Contents
1. [Overview](#overview)
2. [Key Changes](#key-changes)
3. [API Endpoint Mapping](#api-endpoint-mapping)
4. [Type Definitions](#type-definitions)
5. [Field Mappings](#field-mappings)
6. [Migration Steps by Component](#migration-steps-by-component)
7. [Example Code](#example-code)

## Overview

The new backend API introduces a more structured approach with:
- **Deals** instead of **Cars** (with embedded vehicle information)
- **People** instead of user data scattered across cars
- **Transactions** with `dealId` instead of `ChassisNo`
- **Cheques** with `dealId` and structured payer/payee objects
- **Partnerships** embedded in deals instead of separate investment transactions

## Key Changes

### 1. ChassisNo → VIN → DealId Flow
- Old: Direct use of `ChassisNo` to fetch data
- New: 
  1. Use VIN (same as ChassisNo) to get deal: `GET /deals/vin/:vin`
  2. Extract `deal._id` 
  3. Use `dealId` for transactions, cheques, etc.

### 2. Data Structure Changes
- Field names: PascalCase → camelCase
- Nested objects: Flat structure → Nested (seller, buyer, broker objects)
- Relationships: ChassisNo → dealId

## API Endpoint Mapping

### Deals (replaces Cars)

| Old Endpoint | New Endpoint | Method | Notes |
|------------|-------------|--------|-------|
| `/cars` | `/deals` | GET | Get all deals |
| `/cars/:chassisNo` | `/deals/vin/:vin` | GET | Get deal by VIN |
| `/cars/id/:id` | `/deals/id/:id` | GET | Get deal by ID |
| `/cars/userData` | `/people` | GET | Get all people |
| `/cars/filterByUser` | `/deals/person/:personId` | GET | Get deals by person |
| `/cars` | `/deals` | POST | Create deal |
| `/cars/id/:id` | `/deals/id/:id` | PUT | Update deal |

### Transactions

| Old Endpoint | New Endpoint | Method | Notes |
|------------|-------------|--------|-------|
| `/transactions` | `/transactions` | GET | Get all transactions |
| `/transactions/:chassisNo` | `/transactions/deal/:dealId` | GET | Get by deal ID |
| `/transactions/investment/:chassisNo` | `/deals/id/:dealId` | GET | Use `deal.partnerships` |
| `/transactions` | `/transactions` | POST | Create transaction |

### Cheques

| Old Endpoint | New Endpoint | Method | Notes |
|------------|-------------|--------|-------|
| `/cheques` | `/cheques` | GET | Get all cheques |
| `/cheques/:chassisNo` | `/cheques/deal/:dealId` | GET | Get by deal ID |
| `/cheques/unpaid/:chassisNo` | `/cheques/unpaid/deal/:dealId` | GET | Get unpaid by deal ID |
| `/cheques` | `/cheques` | POST | Create cheque |

### People (New)

| Endpoint | Method | Purpose |
|---------|--------|---------|
| `/people` | GET | Get all people |
| `/people/id/:id` | GET | Get person by ID |
| `/people/national-id/:nationalId` | GET | Get person by national ID |
| `/people/role/:role` | GET | Get people by role |
| `/people/search/:name` | GET | Search people by name |
| `/people` | POST | Create person |
| `/people/id/:id` | PUT | Update person |
| `/people/id/:id/wallet` | PUT | Update wallet balance |

### Additional Endpoints

- **Business Accounts**: `/business-accounts/*`
- **Expenses**: `/expenses/*`
- **Loans**: `/loans/*`
- **Salaries**: `/salaries/*`
- **Vehicles**: `/vehicles/*`
- **Settings**: `/settings/*` (unchanged)

## Type Definitions

All new types are defined in `my-app/types/new-backend-types.d.ts`:

- `IBusinessAccounts`
- `IChequeNew`
- `IDeal`
- `IExpense`
- `ILoan`
- `IPeople`
- `ISalaries`
- `ITransactionNew`
- `IVehicle`

## Field Mappings

### Deal Fields (replaces Car)

| Old Field | New Field | Location |
|----------|-----------|----------|
| `ChassisNo` | `vehicleSnapshot.vin` | IDeal |
| `CarModel` | `vehicleSnapshot.model` | IDeal |
| `LicensePlate` | `vehicleSnapshot.plateNumber` | IDeal |
| `PurchaseAmount` | `purchasePrice` | IDeal |
| `SaleAmount` | `salePrice` | IDeal |
| `PurchaseDate` | `purchaseDate` | IDeal |
| `SaleDate` | `saleDate` | IDeal |
| `SellerName` | `seller.fullName` | IDeal |
| `SellerNationalID` | `seller.nationalId` | IDeal |
| `SellerMobile` | `seller.mobile` | IDeal |
| `BuyerName` | `buyer.fullName` | IDeal |
| `BuyerNationalID` | `buyer.nationalId` | IDeal |
| `BuyerMobile` | `buyer.mobile` | IDeal |
| `PurchaseBroker` | `purchaseBroker.fullName` | IDeal |
| `SaleBroker` | `saleBroker.fullName` | IDeal |

### Transaction Fields

| Old Field | New Field | Notes |
|----------|-----------|-------|
| `TransactionType` | `type` | Same values |
| `TransactionReason` | `reason` | Same values |
| `TransactionAmount` | `amount` | Number |
| `TransactionDate` | `transactionDate` | ISO string |
| `TransactionMethod` | `paymentMethod` | Same values |
| `CustomerNationalID` | `personId` | String |
| `ChassisNo` | `dealId` | Need to convert VIN to dealId |
| `ShowroomCard` | `bussinessAccountId` | String |
| `Notes` | `description` | String |
| `Partner` | (from partnerships) | Use `deal.partnerships[].partner.name` |
| `Broker` | (from partnerships) | Use `deal.partnerships[].profitSharePercentage` |

### Cheque Fields

| Old Field | New Field | Notes |
|----------|-----------|-------|
| `ChequeType` | `type` | "issued" \| "received" (not "صادره"/"وارده") |
| `ChequeStatus` | `status` | Same values |
| `ChequeAmount` | `amount` | Number |
| `ChequeDueDate` | `dueDate` | ISO string |
| `ChequeSerial` | `chequeNumber` | Number |
| `CustomerName` | `payer.fullName` or `payee.fullName` | Depends on type |
| `CustomerNationalID` | `payer.nationalId` or `payee.nationalId` | Depends on type |
| `Bank` | `bankName` | String |
| `CarChassisNo` | `relatedDealId` | Need to convert VIN to dealId |
| `SayadiID` | (check actions array) | May need to add to actions |

## Migration Steps by Component

### 1. VehicleDashboard Component

**Current Flow:**
1. Get details by chassisNo → `IDetailsByChassis`
2. Get cheques by chassisNo → `IChequeRes[]`
3. Get investment by chassisNo → `IInvestmentRes`

**New Flow:**
1. Get deal by VIN: `GET /deals/vin/:chassisNo` → `IDeal`
2. Extract `deal._id` as `dealId`
3. Get transactions: `GET /transactions/deal/:dealId` → `ITransactionNew[]`
4. Get cheques: `GET /cheques/deal/:dealId` → `IChequeNew[]`
5. Get unpaid cheques: `GET /cheques/unpaid/deal/:dealId` → `IUnpaidChequesResponse`
6. Use `deal.partnerships` for investment data

**Field Updates Needed:**
- `vehicleDetails?.car.SaleAmount` → `deal.salePrice`
- `vehicleDetails?.car.PurchaseAmount` → `deal.purchasePrice`
- `t.TransactionType` → `t.type`
- `t.TransactionAmount` → `t.amount`
- `c.ChequeType === "صادره"` → `c.type === "issued"`
- `c.ChequeType === "وارده"` → `c.type === "received"`

### 2. CustomersDashboard Component

**Current Flow:**
- `getFilterByUserData` → Get cars by user

**New Flow:**
- `GET /deals/person/:personId` → Returns `{ deals, sales, purchases, partnerships }`
- Map `sales` and `purchases` to old format if needed

### 3. Transaction Forms

**Current:**
- Create transaction with `ChassisNo`

**New:**
1. Get deal by VIN first
2. Use `deal._id` as `dealId` in transaction
3. Map all field names to new structure

### 4. Cheque Forms

**Current:**
- Create cheque with `CarChassisNo`

**New:**
1. Get deal by VIN first
2. Use `deal._id` as `relatedDealId`
3. Structure `payer` and `payee` objects
4. Use `type: "issued"` or `type: "received"` instead of Persian strings

## Example Code

### Getting Deal Data by VIN

```typescript
// Old way
const details = await getDetailByChassisNo.mutateAsync(chassisNo);

// New way
const deal = await axiosInstance.get(`/deals/vin/${chassisNo}`);
const dealId = deal._id;

// Get related data
const transactions = await axiosInstance.get(`/transactions/deal/${dealId}`);
const cheques = await axiosInstance.get(`/cheques/deal/${dealId}`);
const unpaidCheques = await axiosInstance.get(`/cheques/unpaid/deal/${dealId}`);
```

### Mapping Transaction Data

```typescript
// Old structure
const paidTransactions = transactions.filter(
  t => t.TransactionType === "پرداخت"
);

// New structure
const paidTransactions = transactions.filter(
  t => t.type === "پرداخت"
);

// Accessing fields
const amount = transaction.amount; // was TransactionAmount
const reason = transaction.reason; // was TransactionReason
const personId = transaction.personId; // was CustomerNationalID
```

### Mapping Cheque Data

```typescript
// Old structure
const issuedCheques = cheques.filter(
  c => c.ChequeType === "صادره" && c.ChequeStatus !== "وصول شد"
);

// New structure
const issuedCheques = cheques.filter(
  c => c.type === "issued" && c.status !== "paid"
);

// Accessing fields
const amount = cheque.amount; // was ChequeAmount
const customerName = cheque.type === "issued" 
  ? cheque.payer.fullName 
  : cheque.payee.fullName; // was CustomerName
```

### Using Partnerships for Investment Data

```typescript
// Old way
const investment = await getInvestmentByChassis.mutateAsync(chassisNo);
const totalBroker = investment.data.reduce((sum, t) => sum + t.Broker, 0);

// New way
const deal = await axiosInstance.get(`/deals/vin/${chassisNo}`);
const totalBroker = deal.partnerships.reduce(
  (sum, p) => sum + p.profitSharePercentage, 
  0
);

// Map to old format if needed
const investmentData = deal.partnerships.map(p => ({
  Partner: p.partner.name,
  Broker: p.profitSharePercentage,
  TransactionAmount: p.investmentAmount,
  TransactionDate: deal.createdAt,
  TransactionReason: "اصل شرکت"
}));
```

## Important Notes

1. **VIN to DealId Conversion**: Always get the deal first by VIN, then use `deal._id` for subsequent calls.

2. **Type Field Values**: 
   - Cheque types: Use `"issued"` and `"received"` instead of `"صادره"` and `"وارده"`
   - Transaction types remain the same: `"پرداخت"`, `"دریافت"`, etc.

3. **Unpaid Cheques Totals**: The new API already calculates `totals.issuedUnpaid` and `totals.receivedUnpaid` - no need to calculate manually!

4. **Partnerships**: Investment data is now embedded in deals as `partnerships` array, not separate transactions.

5. **People Management**: User data is now centralized in `/people` endpoints instead of scattered across cars.

6. **Business Accounts**: New feature - transactions can be linked to business accounts via `bussinessAccountId`.

## Testing Checklist

- [ ] VehicleDashboard displays correct data
- [ ] Transactions filter correctly (paid/received)
- [ ] Cheques display correctly (issued/received)
- [ ] Investment/partnership data displays
- [ ] Unpaid cheques totals match
- [ ] Customer dashboard shows correct deals
- [ ] Transaction forms create correctly
- [ ] Cheque forms create correctly
- [ ] All field mappings work correctly

## Support

For questions or issues during migration, refer to:
- `my-app/types/new-backend-types.d.ts` - Type definitions
- `my-app/utils/urls.ts` - URL structure (with comments)
- Component files - Migration comments inline


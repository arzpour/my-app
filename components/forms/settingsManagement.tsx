"use client";

import React from "react";
import PeopleForm from "./peopleForm";
import BusinessAccountForm from "./businessAccountForm";
import useGetAllPeople from "@/hooks/useGetAllPeople";
import { getAllBusinessAccounts } from "@/apis/client/businessAccounts";
import { useQuery } from "@tanstack/react-query";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { IPeople, IBusinessAccounts } from "@/types/new-backend-types";

const SettingsManagement = () => {
  const { data: allPeople, isLoading: peopleLoading } = useGetAllPeople();
  const { data: allAccounts, isLoading: accountsLoading } = useQuery({
    queryKey: ["get-all-business-accounts"],
    queryFn: getAllBusinessAccounts,
  });

  const [editingPerson, setEditingPerson] = React.useState<IPeople | null>(null);
  const [editingAccount, setEditingAccount] = React.useState<IBusinessAccounts | null>(null);

  return (
    <div className="space-y-8 p-4" dir="rtl">
      {/* People Management Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">مدیریت اشخاص</h2>
          <PeopleForm
            personData={null}
            mode="add"
            onSuccess={() => {
              setEditingPerson(null);
            }}
          />
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>نام و نام خانوادگی</TableHead>
                <TableHead>کد ملی</TableHead>
                <TableHead>موبایل</TableHead>
                <TableHead>نقش‌ها</TableHead>
                <TableHead>عملیات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {peopleLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">
                    در حال بارگذاری...
                  </TableCell>
                </TableRow>
              ) : allPeople && allPeople.length > 0 ? (
                allPeople.map((person) => (
                  <TableRow key={person._id?.toString()}>
                    <TableCell>{person.fullName}</TableCell>
                    <TableCell>{person.nationalId}</TableCell>
                    <TableCell>{person.phoneNumber}</TableCell>
                    <TableCell>
                      {person.roles?.map((role) => {
                        const roleMap: Record<string, string> = {
                          customer: "مشتری",
                          broker: "کارگزار",
                          employee: "کارمند",
                        };
                        return (
                          <span
                            key={role}
                            className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded mr-1"
                          >
                            {roleMap[role] || role}
                          </span>
                        );
                      })}
                    </TableCell>
                    <TableCell>
                      <PeopleForm
                        personData={person}
                        mode="edit"
                        onSuccess={() => {
                          setEditingPerson(null);
                        }}
                      />
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-gray-500">
                    هیچ شخصی ثبت نشده است
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Business Accounts Management Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">مدیریت حساب‌های بانکی</h2>
          <BusinessAccountForm
            accountData={null}
            mode="add"
            onSuccess={() => {
              setEditingAccount(null);
            }}
          />
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>نام حساب</TableHead>
                <TableHead>بانک</TableHead>
                <TableHead>شماره حساب</TableHead>
                <TableHead>موجودی</TableHead>
                <TableHead>وضعیت</TableHead>
                <TableHead>عملیات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {accountsLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">
                    در حال بارگذاری...
                  </TableCell>
                </TableRow>
              ) : allAccounts && allAccounts.length > 0 ? (
                allAccounts.map((account) => (
                  <TableRow key={account._id?.toString()}>
                    <TableCell>{account.accountName}</TableCell>
                    <TableCell>{account.bankName}</TableCell>
                    <TableCell>{account.accountNumber}</TableCell>
                    <TableCell>
                      {account.currentBalance?.toLocaleString("fa-IR")} ریال
                    </TableCell>
                    <TableCell>
                      <span
                        className={`inline-block text-xs px-2 py-1 rounded ${
                          account.isActive
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {account.isActive ? "فعال" : "غیرفعال"}
                      </span>
                    </TableCell>
                    <TableCell>
                      <BusinessAccountForm
                        accountData={account}
                        mode="edit"
                        onSuccess={() => {
                          setEditingAccount(null);
                        }}
                      />
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-gray-500">
                    هیچ حسابی ثبت نشده است
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default SettingsManagement;


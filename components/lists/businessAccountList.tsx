"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import useGetAllBusinessAccount from "@/hooks/useGetAllBusinessAccount";
import { Pencil } from "lucide-react";
import React from "react";

interface IBusinessAccountList {
  setMode: React.Dispatch<React.SetStateAction<"add" | "edit">>;
  setAccountId: React.Dispatch<React.SetStateAction<string>>;
}
const BusinessAccountList: React.FC<IBusinessAccountList> = ({
  setMode,
  setAccountId,
}) => {
  const { data: allBusinessAccount, isLoading } = useGetAllBusinessAccount();
  console.log(
    "🚀 ~ BusinessAccountList ~ allBusinessAccount:",
    allBusinessAccount,
  );

  return (
    <>
      {isLoading ? (
        <div className="border border-gray-300 p-4 rounded-md w-full text-center text-gray-500">
          در حال بارگذاری...
        </div>
      ) : (allBusinessAccount ?? []).length > 0 ? (
        <div className="border border-gray-300 p-4 rounded-md w-full mt-3">
          <div className="max-h-[33rem] overflow-y-auto rounded-md border w-full">
            <Table className="min-w-full table-fixed text-right border-collapse">
              <TableHeader className="top-0 sticky">
                <TableRow className="hover:bg-transparent bg-gray-100">
                  <TableHead className="text-center">ردیف</TableHead>
                  <TableHead className="text-center">نام</TableHead>
                  <TableHead className="text-center">شماره حساب</TableHead>
                  <TableHead className="text-center">شماره کارت</TableHead>
                  <TableHead className="text-center">عملیات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(allBusinessAccount ?? []).map((account, index) => {
                  return (
                    <TableRow
                      key={`${account._id}-${index}`}
                      className="has-data-[state=checked]:bg-muted/50"
                    >
                      <TableCell className="text-center">{index + 1}</TableCell>
                      <TableCell className="text-center">
                        {account.accountName || "—"}
                      </TableCell>
                      <TableCell className="text-center">
                        {account.accountNumber || "—"}
                      </TableCell>
                      <TableCell className="text-center overflow-auto">
                        {account?.cardNumber || "—"}
                      </TableCell>
                      <TableCell className="text-center flex gap-3 items-center justify-center">
                        <Pencil
                          className="w-4 h-4 cursor-pointer hover:text-indigo-500"
                          onClick={() => {
                            setMode("edit");
                            setAccountId(account._id);
                          }}
                        />
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </div>
      ) : (
        <div className="border border-gray-300 p-4 rounded-md w-full mt-7 text-center text-gray-500">
          هیچ حسابی یافت نشد
        </div>
      )}
    </>
  );
};

export default BusinessAccountList;

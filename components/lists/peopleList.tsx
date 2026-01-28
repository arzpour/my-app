"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import useGetAllPeople from "@/hooks/useGetAllPeople";
import { roleMap } from "@/utils/systemConstants";
import { Pencil } from "lucide-react";

interface IPeopleList {
  setMode: React.Dispatch<React.SetStateAction<"add" | "edit">>;
  setPersonId: React.Dispatch<React.SetStateAction<string>>;
}

const PeopleList: React.FC<IPeopleList> = ({ setMode, setPersonId }) => {
  const { data: allPeople, isLoading } = useGetAllPeople();

  return (
    <>
      {isLoading ? (
        <div className="border border-gray-300 p-4 rounded-md w-full text-center text-gray-500">
          در حال بارگذاری...
        </div>
      ) : (allPeople ?? []).length > 0 ? (
        <div className="border border-gray-300 p-4 rounded-md w-full mt-3">
          <div className="max-h-[33rem] overflow-y-auto rounded-md border w-full">
            <Table className="min-w-full table-fixed text-right border-collapse">
              <TableHeader className="top-0 sticky">
                <TableRow className="hover:bg-transparent bg-gray-100">
                  <TableHead className="text-center">ردیف</TableHead>
                  <TableHead className="text-center">نام</TableHead>
                  <TableHead className="text-center">نام خانوادگی</TableHead>
                  <TableHead className="text-center">شماره موبایل</TableHead>
                  <TableHead className="text-center">نقش</TableHead>
                  <TableHead className="text-center">عملیات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(allPeople ?? []).map((people, index) => {
                  return (
                    <TableRow
                      key={`${people._id}-${index}`}
                      className="has-data-[state=checked]:bg-muted/50"
                    >
                      <TableCell className="text-center">{index + 1}</TableCell>
                      <TableCell className="text-center">
                        {people.firstName || "—"}
                      </TableCell>
                      <TableCell className="text-center">
                        {people.lastName || "—"}
                      </TableCell>
                      <TableCell className="text-center overflow-auto">
                        {people?.phoneNumber ||
                          people.phoneNumbers?.map((el) => el) ||
                          "—"}
                      </TableCell>
                      <TableCell className="text-center">
                        {people?.roles.map((el) => roleMap[el]) || "—"}
                      </TableCell>
                      <TableCell className="text-center flex gap-3 items-center justify-center">
                        <Pencil
                          className="w-4 h-4 cursor-pointer hover:text-indigo-500"
                          onClick={() => {
                            setMode("edit");
                            setPersonId(people._id);
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
          هیچ فردی یافت نشد
        </div>
      )}
    </>
  );
};

export default PeopleList;

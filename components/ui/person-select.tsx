"use client";

import * as React from "react";
import { CheckIcon, ChevronDownIcon, SearchIcon, PlusIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import type { IPeople, IUsers } from "@/types/new-backend-types";

interface PersonSelectProps {
  value?: string; // personId
  onValueChange?: (personId: string, person?: any) => void;
  people?: IPeople[];
  users?: IUsers[];
  placeholder?: string;
  className?: string;
  searchPlaceholder?: string;
  onAddNew?: () => void; // Callback for adding new person
  filterByRole?: string[]; // Filter people by roles
  disabled?: boolean;
  isUser?: boolean;
}

const PersonSelect: React.FC<PersonSelectProps> = ({
  value,
  onValueChange,
  people = [],
  users = [],
  placeholder = "انتخاب شخص",
  className,
  searchPlaceholder = "جستجو بر اساس نام یا کد ملی...",
  onAddNew,
  filterByRole,
  disabled = false,
  isUser,
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [isMounted, setIsMounted] = React.useState(false);
  const selectRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  // Filter people by role if specified
  const filteredPeopleByRole = React.useMemo(() => {
    if (!filterByRole || filterByRole.length === 0) return people;
    return people.filter((person) =>
      filterByRole.some((role) => person.roles?.includes(role))
    );
  }, [people, filterByRole]);

  // Filter by search term
  const filteredPeople = React.useMemo(() => {
    if (!searchTerm) return filteredPeopleByRole;
    const lowerSearch = searchTerm.toLowerCase();
    return filteredPeopleByRole.filter((person) => {
      return (
        person.firstName?.toLowerCase().includes(lowerSearch) ||
        person.nationalId?.toString().includes(searchTerm)
      );
    });
  }, [filteredPeopleByRole, searchTerm]);

  // Filter by search term
  const filteredUsers = React.useMemo(() => {
    if (!searchTerm) return users;

    const lowerSearch = searchTerm.toLowerCase();

    return users.filter((user) => {
      const fullName = `${user.firstname ?? ""} ${
        user.lastname ?? ""
      }`.toLowerCase();

      return (
        fullName.includes(lowerSearch) ||
        user.username?.toLowerCase().includes(lowerSearch)
      );
    });
  }, [users, searchTerm]);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  React.useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        selectRef.current &&
        !selectRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSearchTerm("");
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const selectedPerson = React.useMemo(() => {
    if (!value) return null;
    return filteredPeopleByRole.find((p) => p._id?.toString() === value);
  }, [value, filteredPeopleByRole]);

  const selectedUser = React.useMemo(() => {
    if (!value) return null;
    return filteredUsers.find((p) => p._id?.toString() === value);
  }, [value, filteredUsers]);

  const handleSelect = (person: IPeople | IUsers) => {
    const personId = person._id?.toString() || "";
    onValueChange?.(personId, person);
    setIsOpen(false);
    setSearchTerm("");
  };

  const displayLabel = selectedPerson
    ? `${selectedPerson.firstName} ${selectedPerson.lastName} (${selectedPerson.nationalId})`
    : selectedUser
    ? `${selectedUser.firstname} ${selectedUser.lastname} (${selectedUser.username})`
    : placeholder;

  const data = isUser ? filteredUsers : filteredPeople;
  return (
    <div ref={selectRef} className={cn("relative w-full", className)}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={cn(
          "border-input [&_svg:not([class*='text-'])]:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 flex w-full items-center justify-between gap-2 rounded-md border bg-transparent px-3 py-2 text-sm whitespace-nowrap shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 h-9",
          className
        )}
      >
        <span className="truncate text-right w-full">{displayLabel}</span>
        <ChevronDownIcon
          className={cn(
            "size-4 opacity-50 transition-transform",
            isOpen && "rotate-180"
          )}
        />
      </button>

      {/* Dropdown */}
      {isOpen && !disabled && (
        <div className="absolute z-50 mt-1 w-full rounded-md border bg-popover text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95">
          {/* Search Input */}
          <div className="p-2 border-b">
            <div className="relative">
              <SearchIcon className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <input
                ref={inputRef}
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={searchPlaceholder}
                className="w-full pr-9 pl-3 py-2 text-sm border rounded-md outline-none focus:ring-2 focus:ring-ring"
                dir="rtl"
              />
            </div>
          </div>

          {/* Add New Button */}
          {onAddNew && (
            <div className="p-2 border-b">
              <button
                type="button"
                onClick={() => {
                  onAddNew();
                  setIsOpen(false);
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-primary hover:bg-accent rounded-md transition-colors"
                dir="rtl"
              >
                <PlusIcon className="size-4" />
                <span>افزودن شخص جدید</span>
              </button>
            </div>
          )}

          {/* Options List */}
          <div className="max-h-[200px] overflow-y-auto p-1">
            {data.length > 0 ? (
              data.map((person) => {
                const personId = person._id?.toString() || "";
                const isSelected = value === personId;
                return (
                  <button
                    key={personId}
                    type="button"
                    onClick={() => handleSelect(person)}
                    className={cn(
                      "focus:bg-accent focus:text-accent-foreground relative flex w-full cursor-default items-start gap-2 rounded-sm py-2 pr-8 pl-2 text-sm outline-none select-none hover:bg-accent hover:text-accent-foreground",
                      isSelected && "bg-accent text-accent-foreground"
                    )}
                    dir="rtl"
                  >
                    <span className="absolute right-2 flex size-3.5 items-center justify-center">
                      {isSelected && <CheckIcon className="size-4" />}
                    </span>
                    <div className="flex flex-col items-start">
                      <span className="font-medium">
                        {isUser
                          ? `${(person as IUsers).firstname} ${
                              (person as IUsers).lastname
                            }`
                          : `${(person as IPeople).firstName} ${
                              (person as IPeople).lastName
                            }`}
                      </span>
                      {(person as IPeople)?.nationalId && (
                        <span className="text-xs text-muted-foreground">
                          کد ملی: {(person as IPeople)?.nationalId}
                        </span>
                      )}
                    </div>
                  </button>
                );
              })
            ) : (
              <div className="py-6 text-center text-sm text-muted-foreground">
                نتیجه‌ای یافت نشد
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PersonSelect;

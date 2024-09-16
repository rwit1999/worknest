import React from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { usePathname, useRouter } from "next/navigation";

import qs from 'query-string';

const DateFilter = () => {
    const data = [
        { value: "today", label: "Today" },
        { value: "yesterday", label: "Yesterday" },
        { value: "thisWeek", label: "This Week" },
        { value: "lastWeek", label: "Last Week" },
        { value: "thisMonth", label: "This Month" },
    ];

    const router = useRouter();
    const pathname = usePathname();

    const onChange = (value: string) => {
        const currentQueryParams = qs.parseUrl(window.location.href).query;
        const newQueryParams = {
            ...currentQueryParams,
            createdAtFilter: value,
        };

        const url = qs.stringifyUrl({
            url: pathname,
            query: newQueryParams,
        }, { skipNull: true, skipEmptyString: true });

        router.push(url);
    };

    return (
        <div className="flex flex-col items-start space-y-2 w-full">
            <label className="text-gray-700 text-sm font-medium">Filter by Date:</label>
            <Select onValueChange={(selected) => onChange(selected)}>
                <SelectTrigger className="w-full px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm hover:border-gray-400 focus:ring focus:ring-blue-300 transition-all">
                    <SelectValue placeholder="Select a date filter" />
                </SelectTrigger>
                <SelectContent className="bg-white shadow-lg rounded-md border border-gray-200 max-h-60 overflow-auto w-full">
                    {data.map((item) => (
                        <SelectItem
                            key={item.value}
                            value={item.value}
                            className="px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer transition-colors"
                        >
                            {item.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
};

export default DateFilter;

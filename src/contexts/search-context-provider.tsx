"use client";
import { createContext, useState } from "react";

export type SearchContextType = {
    search: string;
    handleSearch: (newValue: string) => void;
}

export const SearchContext = createContext<SearchContextType | null>(null);

export default function SearchContextProvider({ children }: { children: React.ReactNode }) {
    const [search, setSearch] = useState("");

    const handleSearch = (newValue: string) => {
        setSearch(newValue);
    }

    return <SearchContext.Provider value={{ search, handleSearch }}>{children}</SearchContext.Provider>;
}
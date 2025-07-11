import { PetContext, PetContextType } from "@/contexts/pet-context-provider";
import { SearchContext, SearchContextType } from "@/contexts/search-context-provider";
import { useContext } from "react";

export const usePetContext = (): PetContextType => {
    const context = useContext(PetContext);
    if (!context) {
        throw new Error("usePetContext must be used within a PetContextProvider");
    }
    return context;
}

export const useSearchContext = (): SearchContextType => {
    const context = useContext(SearchContext);
    if (!context) {
        throw new Error("useSearchContext must be used within a SearchContextProvider");
    }
    return context;
}
import { Property } from "@/types";
import { create } from "zustand";

interface ISearchStateProps {
  search: string;
  type: Property["type"] | null;
  bedrooms: number | null;
  minPrice: number | null;
  maxPrice: number | null;

  filterCount: number;

  setSearch: (value: string) => void;
  setType: (value: Property["type"] | null) => void;
  setBedrooms: (value: number | null) => void;
  setMinPrice: (value: number | null) => void;
  setMaxPrice: (value: number | null) => void;

  resetFilter: () => void;
}

const getCount = (state: Partial<ISearchStateProps>) => {
  return [state.bedrooms, state.type, state.minPrice, state.maxPrice].filter(
    Boolean,
  ).length;
};

export const useSearchStore = create<ISearchStateProps>((set, get) => {
  return {
    search: "",
    type: null,
    bedrooms: null,
    minPrice: null,
    maxPrice: null,

    filterCount: 0,

    setSearch: (value: string) => set({ search: value }),
    setType: (value: Property["type"] | null) =>
      set((state) => {
        const nextState = {
          ...state,
          type: value,
        };
        return { type: value, filterCount: getCount(nextState) };
      }),
    setBedrooms: (value: number | null) =>
      set((state) => {
        const nextState = {
          ...state,
          bedrooms: value,
        };
        return { bedrooms: value, filterCount: getCount(nextState) };
      }),
    setMinPrice: (value: number | null) =>
      set((state) => {
        const nextState = {
          ...state,
          minPrice: value,
        };
        return { minPrice: value, filterCount: getCount(nextState) };
      }),
    setMaxPrice: (value: number | null) =>
      set((state) => {
        const nextState = {
          ...state,
          maxPrice: value,
        };
        return { maxPrice: value, filterCount: getCount(nextState) };
      }),

    resetFilter: () =>
      set({
        search: "",
        type: null,
        bedrooms: null,
        minPrice: null,
        maxPrice: null,
        filterCount: 0,
      }),
  };
});

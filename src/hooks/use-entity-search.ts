import { PAGINATION } from "@/lib/constants";
import { useEffect, useState } from "react";

interface useEntitySearchProps<T extends { search: string; page: number }> {
  params: T;
  setParam: (params: T) => void;
  debounceMs?: number;
}

export function useEntitySearch<
  T extends {
    search: string;
    page: number;
  },
>({ params, setParam, debounceMs }: useEntitySearchProps<T>) {
  const [localSearch, setLocalSearch] = useState(params.search);

  useEffect(() => {
    if (localSearch == "" && params.search !== "") {
      setParam({
        ...params,
        search: "",
        page: PAGINATION.DEFAULT_PAGE,
      });
      return;
    }

    const timer = setTimeout(() => {
      if (localSearch != params.search) {
        setParam({
          ...params,
          search: localSearch,
          page: PAGINATION.DEFAULT_PAGE,
        });
      }
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [localSearch, params, setParam, debounceMs]);

  return {
    searchValue: localSearch,
    onSearchChange: setLocalSearch,
  };
}

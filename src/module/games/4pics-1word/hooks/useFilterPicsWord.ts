import { useSearchParams } from 'react-router';
import { useDebounce } from 'minimal-shared/hooks';
import { useState, useEffect, useCallback } from 'react';

export const usePicsWordFilter = (defaultPage = 0, defaultPageSize = 10) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [pagination, setPagination] = useState(() => ({
    page: parseInt(searchParams.get('page') || `${defaultPage}`, 10),
    pageSize: parseInt(searchParams.get('limit') || `${defaultPageSize}`, 10),
  }));

  const [search, setSearch] = useState<string>(searchParams.get('search') ?? '');
  const debouncedSearch = useDebounce(search, 300);

  const setParams = useCallback(
    (newParams: Record<string, string>) => {
      setSearchParams((prevParams) => {
        const params = new URLSearchParams(prevParams);
        Object.entries(newParams).forEach(([key, value]) => {
          if (value) {
            params.set(key, value);
          } else {
            params.delete(key);
          }
        });

        return params;
      });
    },
    [setSearchParams]
  );

  useEffect(() => {
    setParams({ search: debouncedSearch });
  }, [debouncedSearch, setParams]);

  const onPaginationChange = useCallback(
    (values: { pageSize: number; page: number }) => {
      setPagination(values);
      setParams({ page: values.page.toString(), limit: values.pageSize.toString() });
    },
    [setParams]
  );

  const onSearchChange = useCallback(
    (value: string) => {
      setSearch(value);
    },
    [setSearch]
  );

  return {
    pagination,
    search,
    onSearchChange,
    onPaginationChange,
  };
};

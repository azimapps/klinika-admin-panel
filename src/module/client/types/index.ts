
export type IClient = {
    id: number;
    first_name: string;
    last_name: string;
    phone_number: string;
    birth_date: string;
    gender: 'male' | 'female';
    avatar: string | null;
};

export type IClientPagination = {
    items: IClient[];
    total: number;
    page: number;
    per_page: number;
};

export type IClientFilters = {
    search: string;
};

export interface User {
    id: number | string;
    name: string;
    password: string;
    email?: string;
    phone?: string;
}

type Address = {
    country?: string;
    town?: string;
    street?: string;
    houseNumber?: string;
}

export interface Product{
    id: number | string;
    title: string;
    price: number;
    isAvailable: boolean;
    description: string;
    categories: string[];
    images: {
        preview: string;
        gallery?: string[];
    };
    delivery?:{
        startTown: Address;
        earlyDate: Date;
        price: number;
    };
    discount: number;

}
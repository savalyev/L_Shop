export interface User {
    id: number;
    name: string;
    password: string;
    email?: string;
    phone?: string;
    sessionId?: string;
}

type Address = {
    country?: string;
    town?: string;
    street?: string;
    houseNumber?: string;
}

export interface Product{
    id: number;
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

export type ProductCreateBody = Omit<Product, 'id'>;
export type UserCreateBody = Omit<User, 'id'>;
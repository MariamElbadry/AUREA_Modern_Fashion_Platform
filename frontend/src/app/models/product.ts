export interface Product {
    Id: number;
    name: string;
    price: number;
    catId: number;
    imageUrl: string;
    quantity: number;
    designer: string;
    isRent: boolean;
    isNew: boolean;
}
export interface Product {
  id: string; 

  name: string; 
  price: number;
  description: string;
  
  image: string;
  category: ProductCategory; 
  
  color?: string; 
  [key: string]: any;
}





export type ProductCategory =  'Ropa'  | 'Deportes' | 'Sneakers';






type ProductSnapshotData = {
  name: string;
  price: number;
  description: string;
  image: string;
  category: ProductCategory;
  color?: string;
  
};

export type { ProductSnapshotData };
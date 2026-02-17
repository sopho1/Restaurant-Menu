export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  glb: string;
}

export interface MenuCategory {
  id: string;
  name: string;
  icon: string;
  items: MenuItem[];
}

export interface MenuData {
  restaurant: {
    name: string;
    tagline: string;
  };
  categories: MenuCategory[];
}

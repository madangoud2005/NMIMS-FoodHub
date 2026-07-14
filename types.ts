export type MealType = 'Breakfast' | 'Lunch' | 'Snacks' | 'Dinner';

export type DayOfWeek =
  | 'Monday'
  | 'Tuesday'
  | 'Wednesday'
  | 'Thursday'
  | 'Friday'
  | 'Saturday'
  | 'Sunday';

export interface WeeklyMenuItem {
  id: string;
  day: DayOfWeek;
  meal_type: MealType;
  item_name: string;
}

export type CanteenCategory =
  | 'Cool Drinks'
  | 'Pastries'
  | 'Puffs'
  | 'Tea & Coffee'
  | 'Chocolates'
  | 'Snacks';

export interface CanteenItem {
  id: string;
  category: CanteenCategory;
  item_name: string;
  image: string;
  price: number;
  stock: number;
  status: 'Available' | 'Low Stock' | 'Out of Stock';
}

export interface SpecialItem {
  id: string;
  item_name: string;
  description: string;
  image: string;
  price: number;
}

export interface FoodHubData {
  weeklyMenu: WeeklyMenuItem[];
  canteenItems: CanteenItem[];
  specialItem: SpecialItem;
  notices: string[];
}

import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { FoodHubData, CanteenItem, WeeklyMenuItem, SpecialItem } from "./src/types";

const PORT = 3000;
const DB_PATH = path.join(process.cwd(), "db.json");

const defaultData: FoodHubData = {
  weeklyMenu: [
    // Monday
    { id: "m1", day: "Monday", meal_type: "Breakfast", item_name: "Idli Sambhar, Medu Vada, Coconut Chutney, Tea & Coffee" },
    { id: "m2", day: "Monday", meal_type: "Lunch", item_name: "Paneer Butter Masala, Butter Naan, Jeera Rice, Dal Fry, Fresh Salad" },
    { id: "m3", day: "Monday", meal_type: "Snacks", item_name: "Samosa, Veg Cutlet, Special Masala Tea, Mint Lemonade" },
    { id: "m4", day: "Monday", meal_type: "Dinner", item_name: "Veg Kolhapuri, Roti, Plain Basmati Rice, Tomato Pappu, Curd & Papad" },
    // Tuesday
    { id: "t1", day: "Tuesday", meal_type: "Breakfast", item_name: "Masala Dosa, Upma, Sambar, Ginger Chutney, Tea & Coffee" },
    { id: "t2", day: "Tuesday", meal_type: "Lunch", item_name: "Veg Kadai Korma, Chapati, Veg Pulav, Mixed Veg Raita, Fryums" },
    { id: "t3", day: "Tuesday", meal_type: "Snacks", item_name: "Onion Pakoda, Hot Veg Puff, Ginger Tea, Cold Coffee" },
    { id: "t4", day: "Tuesday", meal_type: "Dinner", item_name: "Aloo Gobi Masala, Soft Phulka, Khichdi, Kadhi, Pickle & Papad" },
    // Wednesday
    { id: "w1", day: "Wednesday", meal_type: "Breakfast", item_name: "Puri Bhaji, Poha, Sprouts, Fresh Juices, Tea & Coffee" },
    { id: "w2", day: "Wednesday", meal_type: "Lunch", item_name: "Kadhai Paneer, Laccha Paratha, Special Dum Veg Biryani, Mirchi Salan" },
    { id: "w3", day: "Wednesday", meal_type: "Snacks", item_name: "Pav Bhaji, Cheese Chili Grilled Sandwich, Filter Coffee, Lemon Tea" },
    { id: "w4", day: "Wednesday", meal_type: "Dinner", item_name: "Bhindi Do Pyaza, Tandoori Roti, Veg Pulao, Dal Tadka, Sweet Lassi" },
    // Thursday
    { id: "th1", day: "Thursday", meal_type: "Breakfast", item_name: "Onion Uttapam, Plain Idli, Sambar, Tomato Chutney, Tea & Coffee" },
    { id: "th2", day: "Thursday", meal_type: "Lunch", item_name: "Methi Chaman, Butter Naan, Peas Pulav, Dal Makhani, Curd" },
    { id: "th3", day: "Thursday", meal_type: "Snacks", item_name: "Bread Pakoda, Mini Veg Burger, Cold Drinks, Cardamom Tea" },
    { id: "th4", day: "Thursday", meal_type: "Dinner", item_name: "Soya Chunks Curry, Phulka, Lemon Rice, Spicy Rasam, Curd" },
    // Friday
    { id: "f1", day: "Friday", meal_type: "Breakfast", item_name: "Chole Bhature, Indori Poha, Fresh Fruit Salad, Tea & Coffee" },
    { id: "f2", day: "Friday", meal_type: "Lunch", item_name: "Paneer Tikka Masala, Rumali Roti, Kashmiri Pulav, Dal Fry, Hot Gulab Jamun" },
    { id: "f3", day: "Friday", meal_type: "Snacks", item_name: "Golden French Fries, Veg Spring Rolls, Mango Milkshake, Filter Tea" },
    { id: "f4", day: "Friday", meal_type: "Dinner", item_name: "Palak Paneer, Phulka, Veg Fried Rice, Schezwan Manchurian Gravy" },
    // Saturday
    { id: "sa1", day: "Saturday", meal_type: "Breakfast", item_name: "Mysore Bajji, Venn Pongal, Coconut Chutney, Tea & Coffee" },
    { id: "sa2", day: "Saturday", meal_type: "Lunch", item_name: "NMIMS Special Veg Thali (Aloo Fry, Sambar, Basmati Rice, Poori, Kheer)" },
    { id: "sa3", day: "Saturday", meal_type: "Snacks", item_name: "Veg Grilled Sandwich, Samosa Pav, Cold Coffee, Ginger Tea" },
    { id: "sa4", day: "Saturday", meal_type: "Dinner", item_name: "Veg Hakka Noodles, Gobi Manchurian Dry, Schezwan Fried Rice" },
    // Sunday
    { id: "su1", day: "Sunday", meal_type: "Breakfast", item_name: "Aloo Paratha with Butter & Curd, Bread Butter Jam, Tea & Coffee" },
    { id: "su2", day: "Sunday", meal_type: "Lunch", item_name: "Hyderabad Dum Veg Biryani, Double Ka Meetha, Creamy Raita, Mirchi Salan" },
    { id: "su3", day: "Sunday", meal_type: "Snacks", item_name: "Samosa Pav, Cheese Corn Balls, Special Hot Filter Tea" },
    { id: "su4", day: "Sunday", meal_type: "Dinner", item_name: "Mix Veg Curry, Roti, Rice, Dal Fry, Vanilla Ice Cream" }
  ],
  canteenItems: [
    // Cool Drinks
    { id: "c1", category: "Cool Drinks", item_name: "Coca Cola (300ml)", image: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=300&auto=format&fit=crop&q=60", price: 40, stock: 25, status: "Available" },
    { id: "c2", category: "Cool Drinks", item_name: "Sprite (300ml)", image: "https://images.unsplash.com/photo-1625772290748-160b2a6038f6?w=300&auto=format&fit=crop&q=60", price: 40, stock: 15, status: "Available" },
    { id: "c3", category: "Cool Drinks", item_name: "Red Bull (250ml)", image: "https://images.unsplash.com/photo-1541457519651-7871b6ca3f1b?w=300&auto=format&fit=crop&q=60", price: 125, stock: 8, status: "Low Stock" },
    { id: "c4", category: "Cool Drinks", item_name: "Minute Maid (Juice)", image: "https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=300&auto=format&fit=crop&q=60", price: 35, stock: 3, status: "Low Stock" },
    
    // Pastries
    { id: "c5", category: "Pastries", item_name: "Chocolate Pastry", image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=300&auto=format&fit=crop&q=60", price: 90, stock: 5, status: "Low Stock" },
    { id: "c6", category: "Pastries", item_name: "Red Velvet Pastry", image: "https://images.unsplash.com/photo-1616541823729-00fe0aacd32c?w=300&auto=format&fit=crop&q=60", price: 120, stock: 0, status: "Out of Stock" },
    { id: "c7", category: "Pastries", item_name: "Pineapple Pastry", image: "https://images.unsplash.com/photo-1550617931-e17a7b70dce2?w=300&auto=format&fit=crop&q=60", price: 80, stock: 12, status: "Available" },
    
    // Puffs
    { id: "c8", category: "Puffs", item_name: "Veg Puff", image: "https://images.unsplash.com/photo-1608039829572-78524f79c4c7?w=300&auto=format&fit=crop&q=60", price: 20, stock: 18, status: "Available" },
    { id: "c9", category: "Puffs", item_name: "Egg Puff", image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=300&auto=format&fit=crop&q=60", price: 25, stock: 12, status: "Available" },
    { id: "c10", category: "Puffs", item_name: "Paneer Puff", image: "https://images.unsplash.com/photo-1541532713592-79a0317b6b77?w=300&auto=format&fit=crop&q=60", price: 30, stock: 4, status: "Low Stock" },
    
    // Tea & Coffee
    { id: "c11", category: "Tea & Coffee", item_name: "Hot Tea (Irani Cup)", image: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=300&auto=format&fit=crop&q=60", price: 15, stock: 120, status: "Available" },
    { id: "c12", category: "Tea & Coffee", item_name: "Filter Coffee", image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=300&auto=format&fit=crop&q=60", price: 20, stock: 75, status: "Available" },
    { id: "c13", category: "Tea & Coffee", item_name: "Cardamom Tea", image: "https://images.unsplash.com/photo-1597481499750-3e6b22637e12?w=300&auto=format&fit=crop&q=60", price: 18, stock: 45, status: "Available" },
    
    // Chocolates
    { id: "c14", category: "Chocolates", item_name: "Dairy Milk Silk", image: "https://images.unsplash.com/photo-1548907040-4d42b52125ca?w=300&auto=format&fit=crop&q=60", price: 80, stock: 22, status: "Available" },
    { id: "c15", category: "Chocolates", item_name: "KitKat (Four Finger)", image: "https://images.unsplash.com/photo-1581798459219-318e76aecc7b?w=300&auto=format&fit=crop&q=60", price: 30, stock: 14, status: "Available" },
    { id: "c16", category: "Chocolates", item_name: "Snickers Bar", image: "https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=300&auto=format&fit=crop&q=60", price: 50, stock: 9, status: "Low Stock" },
    
    // Snacks
    { id: "c17", category: "Snacks", item_name: "French Fries", image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=300&auto=format&fit=crop&q=60", price: 60, stock: 40, status: "Available" },
    { id: "c18", category: "Snacks", item_name: "Lay's Magic Masala", image: "https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=300&auto=format&fit=crop&q=60", price: 20, stock: 55, status: "Available" },
    { id: "c19", category: "Snacks", item_name: "Bingo Mad Angles", image: "https://images.unsplash.com/photo-1599490659213-e2b9527b0876?w=300&auto=format&fit=crop&q=60", price: 20, stock: 8, status: "Low Stock" }
  ],
  specialItem: {
    id: "s1",
    item_name: "Special Paneer Biryani",
    description: "Our signature Saturday-special aromatic Basmati rice cooked with fresh premium paneer cubes, rich saffron strands, and hand-ground spices. Served hot with thick raita & salad.",
    image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&auto=format&fit=crop&q=80",
    price: 120
  },
  notices: [
    "Fresh Veg Puffs Available Now!",
    "New Pastries Arrived at Bakery Counter",
    "Today's Special Paneer Biryani Added"
  ]
};

// Helper to read database
function readDb(): FoodHubData {
  try {
    if (!fs.existsSync(DB_PATH)) {
      fs.writeFileSync(DB_PATH, JSON.stringify(defaultData, null, 2), "utf8");
      return defaultData;
    }
    const data = fs.readFileSync(DB_PATH, "utf8");
    return JSON.parse(data);
  } catch (err) {
    console.error("Error reading database file, using fallback default data", err);
    return defaultData;
  }
}

// Helper to write database
function writeDb(data: FoodHubData) {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), "utf8");
  } catch (err) {
    console.error("Error writing to database file", err);
  }
}

// Calculate status helper
function computeStatus(stock: number): "Available" | "Low Stock" | "Out of Stock" {
  if (stock > 10) return "Available";
  if (stock >= 1) return "Low Stock";
  return "Out of Stock";
}

async function startServer() {
  const app = express();
  app.use(express.json());

  // API Endpoints
  app.get("/api/data", (req, res) => {
    const data = readDb();
    res.json(data);
  });

  // Admin middleware simple verification with specific credentials
  const checkAdmin = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const username = req.headers["x-admin-username"];
    const password = req.headers["x-admin-password"];
    const passcode = req.headers["x-admin-passcode"];

    const isUserValid = username === "madangoud2005" && password === "70022400803";
    const isLegacyValid = passcode === "NMIMSFOODADMIN";

    if (isUserValid || isLegacyValid) {
      next();
    } else {
      res.status(401).json({ error: "Unauthorized. Invalid admin username or password." });
    }
  };

  // Update Canteen Item
  app.post("/api/admin/update-canteen", checkAdmin, (req, res) => {
    const updatedItem: CanteenItem = req.body;
    const data = readDb();
    const index = data.canteenItems.findIndex(i => i.id === updatedItem.id);
    if (index !== -1) {
      // Re-evaluate the status on server-side based on stock
      updatedItem.status = computeStatus(updatedItem.stock);
      data.canteenItems[index] = { ...data.canteenItems[index], ...updatedItem };
      writeDb(data);
      res.json({ success: true, item: data.canteenItems[index] });
    } else {
      // Add as new if ID doesn't exist
      updatedItem.status = computeStatus(updatedItem.stock);
      data.canteenItems.push(updatedItem);
      writeDb(data);
      res.json({ success: true, item: updatedItem });
    }
  });

  // Delete Canteen Item
  app.post("/api/admin/delete-canteen", checkAdmin, (req, res) => {
    const { id } = req.body;
    const data = readDb();
    const filtered = data.canteenItems.filter(i => i.id !== id);
    if (filtered.length !== data.canteenItems.length) {
      data.canteenItems = filtered;
      writeDb(data);
      res.json({ success: true });
    } else {
      res.status(404).json({ error: "Item not found" });
    }
  });

  // Update Special Item
  app.post("/api/admin/update-special", checkAdmin, (req, res) => {
    const updatedSpecial: SpecialItem = req.body;
    const data = readDb();
    data.specialItem = updatedSpecial;
    writeDb(data);
    res.json({ success: true, specialItem: data.specialItem });
  });

  // Update Weekly Menu Item
  app.post("/api/admin/update-menu", checkAdmin, (req, res) => {
    const updatedMenuItem: WeeklyMenuItem = req.body;
    const data = readDb();
    const index = data.weeklyMenu.findIndex(i => i.id === updatedMenuItem.id);
    if (index !== -1) {
      data.weeklyMenu[index] = { ...data.weeklyMenu[index], ...updatedMenuItem };
      writeDb(data);
      res.json({ success: true, item: data.weeklyMenu[index] });
    } else {
      data.weeklyMenu.push(updatedMenuItem);
      writeDb(data);
      res.json({ success: true, item: updatedMenuItem });
    }
  });

  // Notices administration
  app.post("/api/admin/update-notices", checkAdmin, (req, res) => {
    const { notices } = req.body;
    if (Array.isArray(notices)) {
      const data = readDb();
      data.notices = notices;
      writeDb(data);
      res.json({ success: true, notices: data.notices });
    } else {
      res.status(400).json({ error: "Notices must be an array of strings" });
    }
  });

  // Handle client-side routing and assets
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();

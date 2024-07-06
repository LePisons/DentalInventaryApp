export interface InventoryItem {
    id: number;
    name: string;
    category: string;
    quantity: number;
    unit: string;
    lowStockThreshold: number;
  }
  
  export interface HistoryRecord {
    id: number;
    itemId: number;
    action: string;
    quantity: number;
    createdAt: string;
  }
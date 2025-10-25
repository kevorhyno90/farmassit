export type Crop = {
  id: string;
  name: string;
  variety: string;
  plantingDate: string;
  stage: 'Planted' | 'Germination' | 'Vegetative' | 'Flowering' | 'Harvest';
  expectedHarvest: string;
  // optional linkage to a field and treatment history
  fieldId?: string;
  treatments?: Treatment[];
  // optional tasks assigned to this crop
  tasks?: FarmTask[];
};

export const cropData: Crop[] = [
  { id: 'C001', name: 'Corn', variety: 'Sweet Corn', plantingDate: '2024-04-15', stage: 'Vegetative', expectedHarvest: '2024-07-25' },
  { id: 'C002', name: 'Tomato', variety: 'Roma', plantingDate: '2024-05-01', stage: 'Flowering', expectedHarvest: '2024-08-10' },
  { id: 'C003', name: 'Wheat', variety: 'Winter Wheat', plantingDate: '2023-10-20', stage: 'Harvest', expectedHarvest: '2024-06-30' },
  { id: 'C004', name: 'Soybean', variety: 'GMO-RR', plantingDate: '2024-05-20', stage: 'Germination', expectedHarvest: '2024-10-01' },
  { id: 'C005', name: 'Potato', variety: 'Russet', plantingDate: '2024-04-30', stage: 'Vegetative', expectedHarvest: '2024-09-15' },
];

export type Livestock = {
  id: string;
  type: 'Cattle' | 'Chicken' | 'Pig' | 'Sheep';
  tagId: string;
  lastFed: string;
  healthStatus: 'Healthy' | 'Sick' | 'Observation';
};

export const livestockData: Livestock[] = [
  { id: 'L001', type: 'Cattle', tagId: 'EID-5839', lastFed: '2024-07-20 08:00', healthStatus: 'Healthy' },
  { id: 'L002', type: 'Cattle', tagId: 'EID-5840', lastFed: '2024-07-20 08:00', healthStatus: 'Observation' },
  { id: 'L003', type: 'Chicken', tagId: 'BAND-01A', lastFed: '2024-07-20 09:30', healthStatus: 'Healthy' },
  { id: 'L004', type: 'Pig', tagId: 'EAR-P77', lastFed: '2024-07-20 07:45', healthStatus: 'Healthy' },
  { id: 'L005', type: 'Sheep', tagId: 'TAG-S102', lastFed: '2024-07-20 08:30', healthStatus: 'Sick' },
];

export type InventoryItem = {
  id: string;
  name: string;
  type: 'Seed' | 'Fertilizer' | 'Tool' | 'Feed';
  quantity: number;
  unit: string;
  lowStockThreshold: number;
};

export const inventoryData: InventoryItem[] = [
  { id: 'I001', name: 'Corn Seed', type: 'Seed', quantity: 50, unit: 'kg', lowStockThreshold: 20 },
  { id: 'I002', name: 'NPK 10-10-10', type: 'Fertilizer', quantity: 200, unit: 'kg', lowStockThreshold: 100 },
  { id: 'I003', name: 'Shovel', type: 'Tool', quantity: 5, unit: 'units', lowStockThreshold: 2 },
  { id: 'I004', name: 'Cattle Feed', type: 'Feed', quantity: 500, unit: 'kg', lowStockThreshold: 250 },
  { id: 'I005', name: 'Pesticide Alpha', type: 'Fertilizer', quantity: 20, unit: 'liters', lowStockThreshold: 10 },
];

export type FarmTask = {
  id: string;
  task: string;
  dueDate: string;
  status: 'Pending' | 'In Progress' | 'Completed';
  assignee: string;
};

export const taskData: FarmTask[] = [
  { id: 'T001', task: 'Plow Field 3', dueDate: '2024-07-22', status: 'In Progress', assignee: 'John D.' },
  { id: 'T002', task: 'Repair fence section B', dueDate: '2024-07-21', status: 'Completed', assignee: 'Maria G.' },
  { id: 'T003', task: 'Spray tomatoes for blight', dueDate: '2024-07-23', status: 'Pending', assignee: 'John D.' },
  { id: 'T004', task: 'Order more cattle feed', dueDate: '2024-07-25', status: 'Pending', assignee: 'Admin' },
  { id: 'T005', task: 'Harvest Winter Wheat', dueDate: '2024-07-28', status: 'Pending', assignee: 'All Hands' },
];

export type Treatment = {
  id: string;
  date: string;
  type: 'Fertilizer' | 'Pesticide' | 'Irrigation' | 'Other';
  product?: string;
  rate?: string;
  notes?: string;
};

export const treatmentData: Treatment[] = [
  { id: 'TR001', date: '2024-06-01', type: 'Fertilizer', product: 'NPK 10-10-10', rate: '50 kg/ha', notes: 'Pre-planting' },
  { id: 'TR002', date: '2024-07-01', type: 'Pesticide', product: 'Alpha', rate: '1 L/ha', notes: 'Targeted at blight' },
];

export type Field = {
  id: string;
  name: string;
  areaHa: number;
  soilType?: string;
  notes?: string;
};

export const fieldData: Field[] = [
  { id: 'F001', name: 'North Field', areaHa: 12.5, soilType: 'Loam', notes: 'Good drainage' },
  { id: 'F002', name: 'South Field', areaHa: 8.0, soilType: 'Clay', notes: 'Irrigation required' },
];

// Planting and Operation models
export type Planting = {
  id: string;
  cropId: string;
  fieldId?: string;
  sowingDate?: string;
  expectedHarvest?: string;
  notes?: string;
};

export const plantingData: Planting[] = [
  { id: 'P001', cropId: 'C001', fieldId: 'F001', sowingDate: '2024-04-15', expectedHarvest: '2024-07-25', notes: 'Spring planting' },
  { id: 'P002', cropId: 'C002', fieldId: 'F002', sowingDate: '2024-05-01', expectedHarvest: '2024-08-10' },
];

export type Operation = {
  id: string;
  plantingId?: string;
  type: string;
  plannedDate?: string;
  notes?: string;
};

export const operationData: Operation[] = [
  { id: 'O001', plantingId: 'P001', type: 'Fertilize', plannedDate: '2024-05-01', notes: 'Apply NPK' },
  { id: 'O002', plantingId: 'P002', type: 'Irrigation', plannedDate: '2024-05-15' },
];

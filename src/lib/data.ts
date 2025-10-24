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

// Animal & clinical models
export type Owner = {
  id?: string;
  name?: string;
  contact?: string;
};

export type Animal = {
  id: string;
  tagId?: string; // EID/RFID
  name?: string;
  species: 'Cattle' | 'Sheep' | 'Pig' | 'Chicken' | 'Goat' | 'Other';
  breed?: string;
  sex?: 'M' | 'F' | 'Unknown';
  dob?: string | null;
  owner?: Owner;
  location?: string; // field/pen
  status?: 'Active' | 'Sold' | 'Deceased' | 'Transferred';
  notes?: string;
  createdAt?: string;
  createdBy?: string;
  updatedAt?: string;
  updatedBy?: string;
};

export const animalData: Animal[] = [
  { id: 'A001', tagId: 'EID-1001', name: 'Bessie', species: 'Cattle', breed: 'Holstein', sex: 'F', dob: '2020-03-12', owner: { id: 'O001', name: 'Farm Owner' }, location: 'North Field', status: 'Active', createdAt: '2024-01-01' },
  { id: 'A002', tagId: 'EID-1002', name: 'Daisy', species: 'Cattle', breed: 'Jersey', sex: 'F', dob: '2021-05-22', owner: { id: 'O001', name: 'Farm Owner' }, location: 'South Field', status: 'Active', createdAt: '2024-01-02' },
];

export type Vitals = {
  tempC?: number;
  heartRate?: number;
  respRate?: number;
  weightKg?: number;
  conditionScore?: number;
};

export type Diagnosis = {
  code?: string;
  description: string;
  confidence?: number;
};

export type Visit = {
  id: string;
  animalId: string;
  dateTime: string;
  clinicianId?: string;
  type?: 'Consult' | 'Surgery' | 'FollowUp' | 'Emergency' | 'Other';
  reason?: string;
  vitals?: Vitals;
  diagnoses?: Diagnosis[];
  notes?: string;
  attachments?: string[]; // URIs
  createdAt?: string;
  createdBy?: string;
};

export const visitData: Visit[] = [
  { id: 'V001', animalId: 'A001', dateTime: '2024-07-20T08:30:00Z', clinicianId: 'DR001', type: 'Consult', reason: 'Routine check', vitals: { tempC: 38.5, heartRate: 60 }, diagnoses: [{ description: 'Healthy' }], notes: 'No concerns.' },
];

// Agrivi-like models
export type Application = {
  id: string;
  date: string;
  inputId?: string; // link to inventory item
  product?: string;
  rate?: string;
  areaHa?: number;
  notes?: string;
};

export type Operation = {
  id: string;
  plantingId: string;
  type: 'Sowing' | 'Irrigation' | 'Fertilization' | 'Pest Control' | 'Harvest' | 'Other';
  plannedDate?: string;
  performedDate?: string;
  performedBy?: string;
  applications?: Application[];
  notes?: string;
};

export type Planting = {
  id: string;
  cropId: string; // link to Crop
  fieldId: string;
  variety?: string;
  sowingDate?: string;
  expectedHarvest?: string;
  areaHa?: number;
  status?: 'Planned' | 'Active' | 'Completed' | 'Cancelled';
  operations?: Operation[];
  yield?: YieldRecord | null;
};

export type YieldRecord = {
  id: string;
  plantingId: string;
  date: string;
  quantity: number;
  unit: string;
  notes?: string;
};

export const plantingData: Planting[] = [
  {
    id: 'P001',
    cropId: 'C001',
    fieldId: 'F001',
    variety: 'Sweet Corn',
    sowingDate: '2024-04-15',
    expectedHarvest: '2024-07-25',
    areaHa: 2.5,
    status: 'Active',
    operations: [
      {
        id: 'O001',
        plantingId: 'P001',
        type: 'Fertilization',
        performedDate: '2024-05-01',
        performedBy: 'John D.',
        applications: [
          { id: 'A001', date: '2024-05-01', product: 'NPK 10-10-10', rate: '50 kg/ha', areaHa: 2.5 }
        ],
      },
    ],
  },
];

export const operationData: Operation[] = [
  {
    id: 'O001',
    plantingId: 'P001',
    type: 'Fertilization',
    performedDate: '2024-05-01',
    performedBy: 'John D.',
    applications: [{ id: 'A001', date: '2024-05-01', product: 'NPK 10-10-10', rate: '50 kg/ha', areaHa: 2.5 }],
  },
];


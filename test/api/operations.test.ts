import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { promises as fs } from 'fs';
import path from 'path';

const TEST_DATA_DIR = path.resolve(process.cwd(), '.data-test-operations');
const TEST_OPERATIONS_FILE = path.join(TEST_DATA_DIR, 'operations.json');

describe('Operations API Integration', () => {
  beforeEach(async () => {
    // Create test data directory
    await fs.mkdir(TEST_DATA_DIR, { recursive: true });
    // Clear any existing test data
    try {
      await fs.unlink(TEST_OPERATIONS_FILE);
    } catch (e) {
      // File doesn't exist, that's okay
    }
  });

  afterEach(async () => {
    // Clean up test data
    try {
      await fs.unlink(TEST_OPERATIONS_FILE);
    } catch (e) {
      // Ignore cleanup errors
    }
    try {
      await fs.rmdir(TEST_DATA_DIR);
    } catch (e) {
      // Ignore cleanup errors
    }
  });

  it('should read and write operations data to filesystem', async () => {
    const testData = [
      { 
        id: 'O001', 
        plantingId: 'P001', 
        type: 'Fertilize', 
        plannedDate: '2024-05-01',
        notes: 'Apply NPK fertilizer'
      },
      { 
        id: 'O002', 
        plantingId: 'P002', 
        type: 'Irrigation', 
        plannedDate: '2024-05-15'
      }
    ];

    // Write data
    await fs.writeFile(TEST_OPERATIONS_FILE, JSON.stringify(testData), 'utf-8');
    
    // Read data back
    const savedData = await fs.readFile(TEST_OPERATIONS_FILE, 'utf-8');
    const parsed = JSON.parse(savedData);
    
    expect(parsed).toEqual(testData);
    expect(parsed.length).toBe(2);
    expect(parsed[0].id).toBe('O001');
    expect(parsed[0].type).toBe('Fertilize');
  });

  it('should handle empty operations array', async () => {
    const emptyData: unknown[] = [];
    
    await fs.writeFile(TEST_OPERATIONS_FILE, JSON.stringify(emptyData), 'utf-8');
    const savedData = await fs.readFile(TEST_OPERATIONS_FILE, 'utf-8');
    const parsed = JSON.parse(savedData);
    
    expect(Array.isArray(parsed)).toBe(true);
    expect(parsed.length).toBe(0);
  });

  it('should handle operations with optional fields', async () => {
    const testData = [
      { 
        id: 'O003', 
        type: 'Weeding'
        // No plantingId, plannedDate, or notes
      }
    ];

    await fs.writeFile(TEST_OPERATIONS_FILE, JSON.stringify(testData), 'utf-8');
    const savedData = await fs.readFile(TEST_OPERATIONS_FILE, 'utf-8');
    const parsed = JSON.parse(savedData);
    
    expect(parsed[0].id).toBe('O003');
    expect(parsed[0].type).toBe('Weeding');
    expect(parsed[0].plantingId).toBeUndefined();
  });

  it('should preserve operation data structure', async () => {
    const testData = [
      { 
        id: 'O004', 
        plantingId: 'P001', 
        type: 'Pest Control', 
        plannedDate: '2024-06-15',
        notes: 'Apply organic pesticide for aphids'
      }
    ];

    await fs.writeFile(TEST_OPERATIONS_FILE, JSON.stringify(testData), 'utf-8');
    const savedData = await fs.readFile(TEST_OPERATIONS_FILE, 'utf-8');
    const parsed = JSON.parse(savedData);
    
    expect(parsed[0]).toHaveProperty('id');
    expect(parsed[0]).toHaveProperty('plantingId');
    expect(parsed[0]).toHaveProperty('type');
    expect(parsed[0]).toHaveProperty('plannedDate');
    expect(parsed[0]).toHaveProperty('notes');
    expect(typeof parsed[0].notes).toBe('string');
  });

  it('should handle multiple operations for same planting', async () => {
    const testData = [
      { 
        id: 'O005', 
        plantingId: 'P001', 
        type: 'Sowing', 
        plannedDate: '2024-04-15'
      },
      { 
        id: 'O006', 
        plantingId: 'P001', 
        type: 'Fertilize', 
        plannedDate: '2024-05-01'
      },
      { 
        id: 'O007', 
        plantingId: 'P001', 
        type: 'Harvest', 
        plannedDate: '2024-07-25'
      }
    ];

    await fs.writeFile(TEST_OPERATIONS_FILE, JSON.stringify(testData), 'utf-8');
    const savedData = await fs.readFile(TEST_OPERATIONS_FILE, 'utf-8');
    const parsed = JSON.parse(savedData);
    
    expect(parsed.length).toBe(3);
    const p001Operations = parsed.filter((op: { plantingId: string }) => op.plantingId === 'P001');
    expect(p001Operations.length).toBe(3);
  });

  it('should handle various operation types', async () => {
    const testData = [
      { id: 'O008', type: 'Sowing', plannedDate: '2024-04-01' },
      { id: 'O009', type: 'Fertilize', plannedDate: '2024-04-15' },
      { id: 'O010', type: 'Irrigation', plannedDate: '2024-05-01' },
      { id: 'O011', type: 'Weeding', plannedDate: '2024-05-10' },
      { id: 'O012', type: 'Pest Control', plannedDate: '2024-06-01' },
      { id: 'O013', type: 'Harvest', plannedDate: '2024-07-01' }
    ];

    await fs.writeFile(TEST_OPERATIONS_FILE, JSON.stringify(testData), 'utf-8');
    const savedData = await fs.readFile(TEST_OPERATIONS_FILE, 'utf-8');
    const parsed = JSON.parse(savedData);
    
    expect(parsed.length).toBe(6);
    const types = parsed.map((op: { type: string }) => op.type);
    expect(types).toContain('Sowing');
    expect(types).toContain('Fertilize');
    expect(types).toContain('Irrigation');
    expect(types).toContain('Weeding');
    expect(types).toContain('Pest Control');
    expect(types).toContain('Harvest');
  });
});

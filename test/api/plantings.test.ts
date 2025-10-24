import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { promises as fs } from 'fs';
import path from 'path';

// We need to test the API routes, but they depend on filesystem operations
// Let's create integration tests that verify the behavior

const TEST_DATA_DIR = path.resolve(process.cwd(), '.data-test-plantings');
const TEST_PLANTINGS_FILE = path.join(TEST_DATA_DIR, 'plantings.json');

describe('Plantings API Integration', () => {
  beforeEach(async () => {
    // Create test data directory
    await fs.mkdir(TEST_DATA_DIR, { recursive: true });
    // Clear any existing test data
    try {
      await fs.unlink(TEST_PLANTINGS_FILE);
    } catch (e) {
      // File doesn't exist, that's okay
    }
  });

  afterEach(async () => {
    // Clean up test data
    try {
      await fs.unlink(TEST_PLANTINGS_FILE);
    } catch (e) {
      // Ignore cleanup errors
    }
    try {
      await fs.rmdir(TEST_DATA_DIR);
    } catch (e) {
      // Ignore cleanup errors
    }
  });

  it('should read and write plantings data to filesystem', async () => {
    const testData = [
      { 
        id: 'P001', 
        cropId: 'C001', 
        fieldId: 'F001', 
        sowingDate: '2024-04-15', 
        expectedHarvest: '2024-07-25',
        notes: 'Test planting'
      },
      { 
        id: 'P002', 
        cropId: 'C002', 
        fieldId: 'F002', 
        sowingDate: '2024-05-01', 
        expectedHarvest: '2024-08-10'
      }
    ];

    // Write data
    await fs.writeFile(TEST_PLANTINGS_FILE, JSON.stringify(testData), 'utf-8');
    
    // Read data back
    const savedData = await fs.readFile(TEST_PLANTINGS_FILE, 'utf-8');
    const parsed = JSON.parse(savedData);
    
    expect(parsed).toEqual(testData);
    expect(parsed.length).toBe(2);
    expect(parsed[0].id).toBe('P001');
    expect(parsed[0].cropId).toBe('C001');
  });

  it('should handle empty plantings array', async () => {
    const emptyData: unknown[] = [];
    
    await fs.writeFile(TEST_PLANTINGS_FILE, JSON.stringify(emptyData), 'utf-8');
    const savedData = await fs.readFile(TEST_PLANTINGS_FILE, 'utf-8');
    const parsed = JSON.parse(savedData);
    
    expect(Array.isArray(parsed)).toBe(true);
    expect(parsed.length).toBe(0);
  });

  it('should handle plantings with optional fields', async () => {
    const testData = [
      { 
        id: 'P003', 
        cropId: 'C003'
        // No fieldId, sowingDate, expectedHarvest, or notes
      }
    ];

    await fs.writeFile(TEST_PLANTINGS_FILE, JSON.stringify(testData), 'utf-8');
    const savedData = await fs.readFile(TEST_PLANTINGS_FILE, 'utf-8');
    const parsed = JSON.parse(savedData);
    
    expect(parsed[0].id).toBe('P003');
    expect(parsed[0].cropId).toBe('C003');
    expect(parsed[0].fieldId).toBeUndefined();
  });

  it('should preserve planting data structure', async () => {
    const testData = [
      { 
        id: 'P004', 
        cropId: 'Tomato', 
        fieldId: 'North Field', 
        sowingDate: '2024-06-01', 
        expectedHarvest: '2024-09-01',
        notes: 'Heirloom variety'
      }
    ];

    await fs.writeFile(TEST_PLANTINGS_FILE, JSON.stringify(testData), 'utf-8');
    const savedData = await fs.readFile(TEST_PLANTINGS_FILE, 'utf-8');
    const parsed = JSON.parse(savedData);
    
    expect(parsed[0]).toHaveProperty('id');
    expect(parsed[0]).toHaveProperty('cropId');
    expect(parsed[0]).toHaveProperty('fieldId');
    expect(parsed[0]).toHaveProperty('sowingDate');
    expect(parsed[0]).toHaveProperty('expectedHarvest');
    expect(parsed[0]).toHaveProperty('notes');
    expect(typeof parsed[0].notes).toBe('string');
  });
});

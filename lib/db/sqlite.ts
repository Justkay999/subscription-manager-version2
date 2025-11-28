import Database from 'better-sqlite3';
import path from 'path';
import { Customer, Package } from '@/types';

// Database file path
const dbPath = path.join(process.cwd(), 'data', 'subscription.db');

// Initialize database
let db: Database.Database;

function getDb() {
    if (!db) {
        db = new Database(dbPath);
        db.pragma('journal_mode = WAL'); // Better performance
        initializeSchema();
        initializeSampleData();
    }
    return db;
}

// Create tables
function initializeSchema() {
    const db = getDb();

    // Packages table
    db.exec(`
        CREATE TABLE IF NOT EXISTS packages (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            duration INTEGER NOT NULL,
            durationType TEXT NOT NULL,
            isDefault INTEGER DEFAULT 0,
            imageUrl TEXT,
            createdAt TEXT NOT NULL,
            updatedAt TEXT NOT NULL
        )
    `);

    // Migration: Add imageUrl column if it doesn't exist
    try {
        db.exec('ALTER TABLE packages ADD COLUMN imageUrl TEXT');
    } catch (error) {
        // Column likely already exists, ignore
    }

    // Customers table
    db.exec(`
        CREATE TABLE IF NOT EXISTS customers (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            email TEXT NOT NULL,
            phone TEXT,
            serviceType TEXT,
            packageId TEXT NOT NULL,
            startDate TEXT NOT NULL,
            endDate TEXT NOT NULL,
            status TEXT NOT NULL,
            autoRenew INTEGER DEFAULT 0,
            notes TEXT,
            createdAt TEXT NOT NULL,
            updatedAt TEXT NOT NULL,
            FOREIGN KEY (packageId) REFERENCES packages(id)
        )
    `);

    // Create indexes
    db.exec(`
        CREATE INDEX IF NOT EXISTS idx_customers_status ON customers(status);
        CREATE INDEX IF NOT EXISTS idx_customers_packageId ON customers(packageId);
    `);
}

// Initialize sample data
function initializeSampleData() {
    const db = getDb();

    // Check if data already exists
    const packageCount = db.prepare('SELECT COUNT(*) as count FROM packages').get() as { count: number };
    if (packageCount.count > 0) return; // Data already exists

    // Insert sample packages
    const insertPackage = db.prepare(`
        INSERT INTO packages (id, name, duration, durationType, isDefault, createdAt, updatedAt)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    const samplePackages = [
        { id: 'pkg-1', name: '1 Month', duration: 1, durationType: 'month', isDefault: 1 },
        { id: 'pkg-2', name: '3 Months', duration: 3, durationType: 'month', isDefault: 1 },
        { id: 'pkg-3', name: '1 Year', duration: 1, durationType: 'year', isDefault: 1 },
    ];

    const now = new Date().toISOString();
    for (const pkg of samplePackages) {
        insertPackage.run(pkg.id, pkg.name, pkg.duration, pkg.durationType, pkg.isDefault, now, now);
    }

    // Insert sample customers
    const insertCustomer = db.prepare(`
        INSERT INTO customers (id, name, email, phone, serviceType, packageId, startDate, endDate, status, autoRenew, notes, createdAt, updatedAt)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const sampleCustomers = [
        {
            id: 'cust-1',
            name: 'John Doe',
            email: 'john@example.com',
            phone: '+1234567890',
            serviceType: 'Premium Service',
            packageId: 'pkg-1',
            startDate: '2024-11-01',
            endDate: '2024-12-01',
            status: 'active',
            autoRenew: 1,
            notes: 'VIP customer',
        },
        {
            id: 'cust-2',
            name: 'Jane Smith',
            email: 'jane@example.com',
            phone: '+0987654321',
            serviceType: 'Basic Service',
            packageId: 'pkg-2',
            startDate: '2024-09-01',
            endDate: '2024-12-01',
            status: 'active',
            autoRenew: 0,
            notes: '',
        },
    ];

    for (const customer of sampleCustomers) {
        insertCustomer.run(
            customer.id,
            customer.name,
            customer.email,
            customer.phone,
            customer.serviceType,
            customer.packageId,
            customer.startDate,
            customer.endDate,
            customer.status,
            customer.autoRenew,
            customer.notes,
            now,
            now
        );
    }
}

// Export database instance
export default getDb;

const policies = [
    {
        id: 1,
        policyNumber: 'POL2024001',
        referenceNumber: 'REF2024001',
        status: 'active',
        startDate: '2024-01-01',
        endDate: '2024-12-31',
        premium: 8500,
        coverageType: 'comprehensive',
        vehicle: {
            make: 'Toyota',
            model: 'Camry',
            year: 2023,
            bodyType: 'Sedan',
            value: 280000,
            seatingCapacity: 5,
            cylinderCapacity: 2000
        },
        policyholder: {
            name: 'John Smith',
            email: 'john@example.com',
            phone: '12345678',
            drivingExperience: 8
        },
        additionalCoverage: ['windscreen', 'personalAccident', 'roadside'],
        lastClaim: null
    },
    {
        id: 2,
        policyNumber: 'POL2024002',
        referenceNumber: 'REF2024002',
        status: 'pending',
        startDate: '2024-02-15',
        endDate: '2025-02-14',
        premium: 12800,
        coverageType: 'comprehensive',
        vehicle: {
            make: 'BMW',
            model: 'X5',
            year: 2024,
            bodyType: 'SUV',
            value: 520000,
            seatingCapacity: 7,
            cylinderCapacity: 3000
        },
        policyholder: {
            name: 'Sarah Chen',
            email: 'sarah@example.com',
            phone: '87654321',
            drivingExperience: 12
        },
        additionalCoverage: ['windscreen', 'personalAccident', 'naturalDisaster', 'roadside'],
        lastClaim: null
    },
    {
        id: 3,
        policyNumber: 'POL2024003',
        referenceNumber: 'REF2024003',
        status: 'expired',
        startDate: '2023-01-01',
        endDate: '2023-12-31',
        premium: 6200,
        coverageType: 'thirdParty',
        vehicle: {
            make: 'Honda',
            model: 'Civic',
            year: 2022,
            bodyType: 'Sedan',
            value: 180000,
            seatingCapacity: 5,
            cylinderCapacity: 1500
        },
        policyholder: {
            name: 'Michael Wong',
            email: 'michael@example.com',
            phone: '23456789',
            drivingExperience: 5
        },
        additionalCoverage: ['roadside'],
        lastClaim: '2023-06-15'
    },
    {
        id: 4,
        policyNumber: 'POL2024004',
        referenceNumber: 'REF2024004',
        status: 'active',
        startDate: '2024-01-15',
        endDate: '2025-01-14',
        premium: 15600,
        coverageType: 'comprehensive',
        vehicle: {
            make: 'Porsche',
            model: 'Cayenne',
            year: 2023,
            bodyType: 'SUV',
            value: 680000,
            seatingCapacity: 5,
            cylinderCapacity: 3500
        },
        policyholder: {
            name: 'Emily Chan',
            email: 'emily@example.com',
            phone: '34567890',
            drivingExperience: 15
        },
        additionalCoverage: ['windscreen', 'personalAccident', 'naturalDisaster', 'roadside'],
        lastClaim: '2023-11-30'
    },
    {
        id: 5,
        policyNumber: 'POL2024005',
        referenceNumber: 'REF2024005',
        status: 'cancelled',
        startDate: '2023-06-01',
        endDate: '2024-05-31',
        premium: 4800,
        coverageType: 'thirdPartyFire',
        vehicle: {
            make: 'Ford',
            model: 'Focus',
            year: 2021,
            bodyType: 'Hatchback',
            value: 150000,
            seatingCapacity: 5,
            cylinderCapacity: 1600
        },
        policyholder: {
            name: 'David Lee',
            email: 'david@example.com',
            phone: '45678901',
            drivingExperience: 3
        },
        additionalCoverage: ['roadside'],
        lastClaim: null,
        cancellationDate: '2023-12-15',
        cancellationReason: 'Vehicle Sold'
    },
    {
        id: 6,
        policyNumber: 'POL2024006',
        referenceNumber: 'REF2024006',
        status: 'active',
        startDate: '2024-02-01',
        endDate: '2025-01-31',
        premium: 9800,
        coverageType: 'comprehensive',
        vehicle: {
            make: 'Audi',
            model: 'A4',
            year: 2023,
            bodyType: 'Sedan',
            value: 320000,
            seatingCapacity: 5,
            cylinderCapacity: 2000
        },
        policyholder: {
            name: 'Lisa Wang',
            email: 'lisa@example.com',
            phone: '56789012',
            drivingExperience: 10
        },
        additionalCoverage: ['windscreen', 'personalAccident', 'roadside'],
        lastClaim: null
    },
    {
        id: 7,
        policyNumber: 'POL2024007',
        referenceNumber: 'REF2024007',
        status: 'pending',
        startDate: '2024-03-01',
        endDate: '2025-02-28',
        premium: 7200,
        coverageType: 'thirdPartyFire',
        vehicle: {
            make: 'Toyota',
            model: 'RAV4',
            year: 2022,
            bodyType: 'SUV',
            value: 250000,
            seatingCapacity: 5,
            cylinderCapacity: 2000
        },
        policyholder: {
            name: 'Peter Zhang',
            email: 'peter@example.com',
            phone: '67890123',
            drivingExperience: 6
        },
        additionalCoverage: ['windscreen', 'roadside'],
        lastClaim: '2023-09-20'
    },
    {
        id: 8,
        policyNumber: 'POL2024008',
        referenceNumber: 'REF2024008',
        status: 'active',
        startDate: '2024-01-20',
        endDate: '2025-01-19',
        premium: 18500,
        coverageType: 'comprehensive',
        vehicle: {
            make: 'Mercedes-Benz',
            model: 'E-Class',
            year: 2024,
            bodyType: 'Sedan',
            value: 750000,
            seatingCapacity: 5,
            cylinderCapacity: 3000
        },
        policyholder: {
            name: 'Grace Liu',
            email: 'grace@example.com',
            phone: '78901234',
            drivingExperience: 20
        },
        additionalCoverage: ['windscreen', 'personalAccident', 'naturalDisaster', 'roadside'],
        lastClaim: null
    }
];

const premiumRanges = {
    basic: {
        comprehensive: { base: 5000, rate: 0.035 },
        thirdParty: { base: 2000, rate: 0.02 },
        thirdPartyFire: { base: 3000, rate: 0.025 }
    },
    addons: {
        windscreen: 800,
        personalAccident: 1200,
        naturalDisaster: 1500,
        roadside: 500
    },
    discounts: {
        noClaimsDiscount: {
            1: 0.1,  // 10% discount for 1 year no claims
            2: 0.15, // 15% discount for 2 years no claims
            3: 0.20, // 20% discount for 3+ years no claims
        },
        longTermDiscount: 0.05,  // 5% discount for 24-month policies
        multiPolicyDiscount: 0.10 // 10% discount for multiple policies
    }
};

const vehicleCategories = {
    lowRisk: ['Toyota', 'Honda', 'Ford'],
    mediumRisk: ['BMW', 'Audi', 'Mercedes-Benz'],
    highRisk: ['Porsche', 'Ferrari', 'Lamborghini']
};

const claimTypes = {
    accident: {
        minor: { excess: 2000, impact: 0.15 },
        major: { excess: 5000, impact: 0.30 }
    },
    theft: { excess: 3000, impact: 0.25 },
    naturalDisaster: { excess: 4000, impact: 0.20 },
    windscreen: { excess: 500, impact: 0 }
}; 
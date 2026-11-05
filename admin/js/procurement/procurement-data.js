// ============================================================
// PROCUREMENT DATA - Seed database
// 12 suppliers with full SA-specific data
// ============================================================

window.ProcurementData = {
    // ============================================================
    // SUPPLIERS (12 with distinct personas)
    // ============================================================
    suppliers: [
        {
            id: "VEN-0001",
            legalName: "Meridian ICT Systems (Pty) Ltd",
            tradingName: "Meridian ICT",
            registrationNumber: "DEMO-2015/034521/07",
            csdNumber: "DEMO-CSD-100001",
            taxRef: "DEMO-9012345678",
            vatNumber: "DEMO-4123456789",
            vatRegistered: true,
            bbbeeLevel: 2,
            bbbeeCertificateIssue: "2026-01-15",
            bbbeeCertificateExpiry: "2027-01-14",
            businessType: "Private Company",
            country: "South Africa",
            province: "Gauteng",
            municipality: "City of Johannesburg",
            businessAddress: "Unit 5, Demo Park, 12 Innovation Road, Sandton, 2196",
            postalAddress: "PO Box 12345, Sandton, 2146",
            website: "https://demo-meridian.example",
            primaryContact: {
                name: "Thandiwe Nkosi",
                role: "Account Manager",
                email: "thandiwe@demo-meridian.example",
                phone: "+27 11 555 0101",
                department: "Sales",
                preferred: "email"
            },
            contacts: [
                { name: "Thandiwe Nkosi", role: "Account Manager", email: "thandiwe@demo-meridian.example", phone: "+27 11 555 0101", primary: true },
                { name: "Sipho Dlamini", role: "Technical Lead", email: "sipho@demo-meridian.example", phone: "+27 11 555 0102", primary: false }
            ],
            categories: ["ICT Hardware", "Networking", "Software Licensing"],
            capabilities: ["Enterprise networking", "Server hardware", "Cloud services"],
            operatingRegions: ["Gauteng", "Western Cape", "KwaZulu-Natal"],
            yearsInBusiness: 11,
            description: "Established enterprise ICT supplier with a strong track record in network infrastructure and cloud migration.",
            onboardingStatus: "qualified",
            operationalStatus: "active",
            qualificationStatus: "qualified",
            complianceStatus: "compliant",
            riskRating: "low",
            performanceScore: 92,
            spendToDate: 4520000,
            createdAt: "2024-03-15T09:00:00+02:00"
        },
        {
            id: "VEN-0002",
            legalName: "Cape Software Solutions CC",
            tradingName: "Cape Software",
            registrationNumber: "DEMO-2018/112233/23",
            csdNumber: "DEMO-CSD-100002",
            taxRef: "DEMO-9012345679",
            vatNumber: "DEMO-4123456790",
            vatRegistered: true,
            bbbeeLevel: 4,
            bbbeeCertificateIssue: "2026-02-01",
            bbbeeCertificateExpiry: "2027-01-31",
            businessType: "Close Corporation",
            country: "South Africa",
            province: "Western Cape",
            municipality: "City of Cape Town",
            businessAddress: "22 Demo Street, Cape Town, 8001",
            postalAddress: "PO Box 998, Cape Town, 8000",
            website: "https://demo-capesoft.example",
            primaryContact: {
                name: "Riaan van der Merwe",
                role: "Sales Director",
                email: "riaan@demo-capesoft.example",
                phone: "+27 21 555 0201",
                department: "Sales",
                preferred: "email"
            },
            contacts: [
                { name: "Riaan van der Merwe", role: "Sales Director", email: "riaan@demo-capesoft.example", phone: "+27 21 555 0201", primary: true }
            ],
            categories: ["Software Licensing", "Professional Services"],
            capabilities: ["ERP implementation", "Custom software", "Training"],
            operatingRegions: ["Western Cape", "Gauteng"],
            yearsInBusiness: 8,
            description: "Boutique software vendor specializing in mid-market ERP implementations.",
            onboardingStatus: "qualified",
            operationalStatus: "active",
            qualificationStatus: "qualified",
            complianceStatus: "compliant",
            riskRating: "low",
            performanceScore: 88,
            spendToDate: 890000,
            createdAt: "2024-08-20T09:00:00+02:00"
        },
        {
            id: "VEN-0003",
            legalName: "Ubuntu Logistics (Pty) Ltd",
            tradingName: "Ubuntu Logistics",
            registrationNumber: "DEMO-2012/998877/07",
            csdNumber: "DEMO-CSD-100003",
            taxRef: "DEMO-9012345680",
            vatNumber: "DEMO-4123456791",
            vatRegistered: true,
            bbbeeLevel: 1,
            bbbeeCertificateIssue: "2026-03-10",
            bbbeeCertificateExpiry: "2027-03-09",
            businessType: "Private Company",
            country: "South Africa",
            province: "KwaZulu-Natal",
            municipality: "eThekwini",
            businessAddress: "Dock 7, Demo Harbour, Durban, 4001",
            postalAddress: "PO Box 555, Durban, 4000",
            website: "https://demo-ubuntu.example",
            primaryContact: {
                name: "Nomvula Khumalo",
                role: "Operations Manager",
                email: "nomvula@demo-ubuntu.example",
                phone: "+27 31 555 0301",
                department: "Operations",
                preferred: "phone"
            },
            contacts: [
                { name: "Nomvula Khumalo", role: "Operations Manager", email: "nomvula@demo-ubuntu.example", phone: "+27 31 555 0301", primary: true }
            ],
            categories: ["Logistics", "Freight & Transport"],
            capabilities: ["Road freight", "Warehousing", "Customs clearance"],
            operatingRegions: ["KwaZulu-Natal", "Gauteng", "Eastern Cape"],
            yearsInBusiness: 14,
            description: "Level 1 B-BBEE logistics provider with national road freight coverage.",
            onboardingStatus: "qualified",
            operationalStatus: "active",
            qualificationStatus: "qualified",
            complianceStatus: "compliant",
            riskRating: "low",
            performanceScore: 95,
            spendToDate: 1280000,
            createdAt: "2024-01-10T09:00:00+02:00"
        },
        {
            id: "VEN-0004",
            legalName: "Highveld Office Supplies (Pty) Ltd",
            tradingName: "Highveld Office",
            registrationNumber: "DEMO-2010/445566/07",
            csdNumber: "DEMO-CSD-100004",
            taxRef: "DEMO-9012345681",
            vatNumber: "DEMO-4123456792",
            vatRegistered: true,
            bbbeeLevel: 3,
            bbbeeCertificateIssue: "2026-04-20",
            bbbeeCertificateExpiry: "2027-04-19",
            businessType: "Private Company",
            country: "South Africa",
            province: "Gauteng",
            municipality: "City of Tshwane",
            businessAddress: "15 Demo Industrial, Pretoria, 0001",
            postalAddress: "PO Box 777, Pretoria, 0002",
            website: "https://demo-highveld.example",
            primaryContact: {
                name: "Johan Steyn",
                role: "Key Account Manager",
                email: "johan@demo-highveld.example",
                phone: "+27 12 555 0401",
                department: "Sales",
                preferred: "email"
            },
            contacts: [
                { name: "Johan Steyn", role: "Key Account Manager", email: "johan@demo-highveld.example", phone: "+27 12 555 0401", primary: true }
            ],
            categories: ["Office Supplies", "Stationery", "Furniture"],
            capabilities: ["Office consumables", "Printing", "Ergonomic furniture"],
            operatingRegions: ["Gauteng"],
            yearsInBusiness: 16,
            description: "Established office supplies provider serving government and corporate clients.",
            onboardingStatus: "qualified",
            operationalStatus: "active",
            qualificationStatus: "qualified",
            complianceStatus: "attention_required",
            riskRating: "medium",
            performanceScore: 78,
            spendToDate: 340000,
            createdAt: "2024-02-05T09:00:00+02:00"
        },
        {
            id: "VEN-0005",
            legalName: "Bay Area Facilities Management CC",
            tradingName: "Bay Area FM",
            registrationNumber: "DEMO-2019/223344/23",
            csdNumber: "DEMO-CSD-100005",
            taxRef: "DEMO-9012345682",
            vatNumber: "DEMO-4123456793",
            vatRegistered: true,
            bbbeeLevel: 1,
            bbbeeCertificateIssue: "2026-05-15",
            bbbeeCertificateExpiry: "2027-05-14",
            businessType: "Close Corporation",
            country: "South Africa",
            province: "Eastern Cape",
            municipality: "Nelson Mandela Bay",
            businessAddress: "3 Demo Bay Road, Port Elizabeth, 6001",
            postalAddress: "PO Box 333, Port Elizabeth, 6000",
            website: "https://demo-bayfm.example",
            primaryContact: {
                name: "Lindiwe Mthembu",
                role: "Contracts Manager",
                email: "lindiwe@demo-bayfm.example",
                phone: "+27 41 555 0501",
                department: "Contracts",
                preferred: "email"
            },
            contacts: [
                { name: "Lindiwe Mthembu", role: "Contracts Manager", email: "lindiwe@demo-bayfm.example", phone: "+27 41 555 0501", primary: true }
            ],
            categories: ["Facilities Management", "Cleaning Services", "Maintenance"],
            capabilities: ["Commercial cleaning", "HVAC maintenance", "Security services"],
            operatingRegions: ["Eastern Cape", "Western Cape"],
            yearsInBusiness: 7,
            description: "Level 1 B-BBEE facilities management company with provincial coverage.",
            onboardingStatus: "qualified",
            operationalStatus: "active",
            qualificationStatus: "qualified",
            complianceStatus: "compliant",
            riskRating: "low",
            performanceScore: 89,
            spendToDate: 560000,
            createdAt: "2024-06-12T09:00:00+02:00"
        },
        {
            id: "VEN-0006",
            legalName: "Zamani Training Institute NPC",
            tradingName: "Zamani Training",
            registrationNumber: "DEMO-2014/778899/08",
            csdNumber: "DEMO-CSD-100006",
            taxRef: "DEMO-9012345683",
            vatNumber: "DEMO-4123456794",
            vatRegistered: false,
            bbbeeLevel: 1,
            bbbeeCertificateIssue: "2026-06-01",
            bbbeeCertificateExpiry: "2027-05-31",
            businessType: "Non-Profit Company",
            country: "South Africa",
            province: "Gauteng",
            municipality: "City of Johannesburg",
            businessAddress: "8 Demo Skills Centre, Soweto, 1804",
            postalAddress: "PO Box 222, Soweto, 1800",
            website: "https://demo-zamani.example",
            primaryContact: {
                name: "Sizwe Mokoena",
                role: "Programme Director",
                email: "sizwe@demo-zamani.example",
                phone: "+27 11 555 0601",
                department: "Programmes",
                preferred: "email"
            },
            contacts: [
                { name: "Sizwe Mokoena", role: "Programme Director", email: "sizwe@demo-zamani.example", phone: "+27 11 555 0601", primary: true }
            ],
            categories: ["Training", "Skills Development"],
            capabilities: ["Technical training", "Soft skills", "Learnerships"],
            operatingRegions: ["Gauteng", "Mpumalanga"],
            yearsInBusiness: 12,
            description: "Accredited NPC training provider focused on skills development for corporate and government.",
            onboardingStatus: "qualified",
            operationalStatus: "active",
            qualificationStatus: "qualified",
            complianceStatus: "compliant",
            riskRating: "low",
            performanceScore: 91,
            spendToDate: 290000,
            createdAt: "2024-04-08T09:00:00+02:00"
        },
        {
            id: "VEN-0007",
            legalName: "Silver Line Construction (Pty) Ltd",
            tradingName: "Silver Line",
            registrationNumber: "DEMO-2020/556677/07",
            csdNumber: "DEMO-CSD-100007",
            taxRef: "DEMO-9012345684",
            vatNumber: "DEMO-4123456795",
            vatRegistered: true,
            bbbeeLevel: 6,
            bbbeeCertificateIssue: "2025-08-01",
            bbbeeCertificateExpiry: "2026-07-31",
            businessType: "Private Company",
            country: "South Africa",
            province: "Limpopo",
            municipality: "Polokwane",
            businessAddress: "42 Demo Industrial, Polokwane, 0699",
            postalAddress: "PO Box 111, Polokwane, 0700",
            website: "https://demo-silverline.example",
            primaryContact: {
                name: "Pieter Marais",
                role: "Managing Director",
                email: "pieter@demo-silverline.example",
                phone: "+27 15 555 0701",
                department: "Executive",
                preferred: "phone"
            },
            contacts: [
                { name: "Pieter Marais", role: "Managing Director", email: "pieter@demo-silverline.example", phone: "+27 15 555 0701", primary: true }
            ],
            categories: ["Construction", "Civil Engineering"],
            capabilities: ["Building construction", "Civil works", "Renovations"],
            operatingRegions: ["Limpopo", "Gauteng"],
            yearsInBusiness: 6,
            description: "Small construction company with regional government experience.",
            onboardingStatus: "under_review",
            operationalStatus: "active",
            qualificationStatus: "pending",
            complianceStatus: "attention_required",
            riskRating: "high",
            performanceScore: null,
            spendToDate: 0,
            createdAt: "2026-09-15T09:00:00+02:00"
        },
        {
            id: "VEN-0008",
            legalName: "Kalahari Solar Solutions (Pty) Ltd",
            tradingName: "Kalahari Solar",
            registrationNumber: "DEMO-2021/889900/07",
            csdNumber: "DEMO-CSD-100008",
            taxRef: "DEMO-9012345685",
            vatNumber: "DEMO-4123456796",
            vatRegistered: true,
            bbbeeLevel: 2,
            bbbeeCertificateIssue: "2026-01-20",
            bbbeeCertificateExpiry: "2027-01-19",
            businessType: "Private Company",
            country: "South Africa",
            province: "Northern Cape",
            municipality: "Sol Plaatje",
            businessAddress: "5 Demo Solar Park, Kimberley, 8301",
            postalAddress: "PO Box 88, Kimberley, 8300",
            website: "https://demo-kalahari.example",
            primaryContact: {
                name: "Andile Mthembu",
                role: "Sales Lead",
                email: "andile@demo-kalahari.example",
                phone: "+27 53 555 0801",
                department: "Sales",
                preferred: "email"
            },
            contacts: [
                { name: "Andile Mthembu", role: "Sales Lead", email: "andile@demo-kalahari.example", phone: "+27 53 555 0801", primary: true }
            ],
            categories: ["Renewable Energy", "Solar Installation"],
            capabilities: ["Solar PV", "Battery storage", "Energy audits"],
            operatingRegions: ["Northern Cape", "Free State", "Western Cape"],
            yearsInBusiness: 5,
            description: "Emerging solar energy solutions provider with strong growth trajectory.",
            onboardingStatus: "submitted",
            operationalStatus: "pending",
            qualificationStatus: "pending",
            complianceStatus: "missing",
            riskRating: "medium",
            performanceScore: null,
            spendToDate: 0,
            createdAt: "2026-10-10T09:00:00+02:00"
        },
        {
            id: "VEN-0009",
            legalName: "Suspended Vendor Demo (Pty) Ltd",
            tradingName: "Suspended Demo Co",
            registrationNumber: "DEMO-2017/334455/07",
            csdNumber: "DEMO-CSD-100009",
            taxRef: "DEMO-9012345686",
            vatNumber: "DEMO-4123456797",
            vatRegistered: true,
            bbbeeLevel: 8,
            bbbeeCertificateIssue: "2024-01-01",
            bbbeeCertificateExpiry: "2025-01-01",
            businessType: "Private Company",
            country: "South Africa",
            province: "Gauteng",
            municipality: "Ekurhuleni",
            businessAddress: "1 Demo Road, Germiston, 1401",
            postalAddress: "PO Box 44, Germiston, 1400",
            website: "",
            primaryContact: {
                name: "Demo Contact",
                role: "Owner",
                email: "demo@suspended.example",
                phone: "+27 11 555 0901",
                department: "Executive",
                preferred: "email"
            },
            contacts: [
                { name: "Demo Contact", role: "Owner", email: "demo@suspended.example", phone: "+27 11 555 0901", primary: true }
            ],
            categories: ["General Services"],
            capabilities: ["General work"],
            operatingRegions: ["Gauteng"],
            yearsInBusiness: 9,
            description: "Vendor suspended pending compliance investigation.",
            onboardingStatus: "qualified",
            operationalStatus: "suspended",
            qualificationStatus: "suspended",
            complianceStatus: "expired",
            riskRating: "critical",
            performanceScore: 45,
            spendToDate: 120000,
            createdAt: "2024-05-20T09:00:00+02:00"
        },
        {
            id: "VEN-0010",
            legalName: "Coastal Catering Services CC",
            tradingName: "Coastal Catering",
            registrationNumber: "DEMO-2016/667788/23",
            csdNumber: "DEMO-CSD-100010",
            taxRef: "DEMO-9012345687",
            vatNumber: "DEMO-4123456798",
            vatRegistered: true,
            bbbeeLevel: 3,
            bbbeeCertificateIssue: "2026-02-15",
            bbbeeCertificateExpiry: "2027-02-14",
            businessType: "Close Corporation",
            country: "South Africa",
            province: "Western Cape",
            municipality: "City of Cape Town",
            businessAddress: "12 Demo Kitchen, Stellenbosch, 7600",
            postalAddress: "PO Box 66, Stellenbosch, 7599",
            website: "https://demo-coastalcater.example",
            primaryContact: {
                name: "Marie van Wyk",
                role: "Sales Manager",
                email: "marie@demo-coastalcater.example",
                phone: "+27 21 555 1001",
                department: "Sales",
                preferred: "email"
            },
            contacts: [
                { name: "Marie van Wyk", role: "Sales Manager", email: "marie@demo-coastalcater.example", phone: "+27 21 555 1001", primary: true }
            ],
            categories: ["Catering", "Events"],
            capabilities: ["Corporate catering", "Event management", "Function venues"],
            operatingRegions: ["Western Cape"],
            yearsInBusiness: 10,
            description: "Corporate catering and events specialist serving Western Cape clients.",
            onboardingStatus: "qualified",
            operationalStatus: "active",
            qualificationStatus: "qualified",
            complianceStatus: "compliant",
            riskRating: "low",
            performanceScore: 85,
            spendToDate: 180000,
            createdAt: "2024-09-01T09:00:00+02:00"
        },
        {
            id: "VEN-0011",
            legalName: "Incomplete Profile Demo Ltd",
            tradingName: "Incomplete Co",
            registrationNumber: "DEMO-2022/111222/07",
            csdNumber: "",
            taxRef: "",
            vatNumber: "",
            vatRegistered: false,
            bbbeeLevel: null,
            bbbeeCertificateIssue: null,
            bbbeeCertificateExpiry: null,
            businessType: "Private Company",
            country: "South Africa",
            province: "Gauteng",
            municipality: "City of Johannesburg",
            businessAddress: "",
            postalAddress: "",
            website: "",
            primaryContact: {
                name: "New Contact",
                role: "Owner",
                email: "new@incomplete.example",
                phone: "+27 11 555 1101",
                department: "Executive",
                preferred: "email"
            },
            contacts: [
                { name: "New Contact", role: "Owner", email: "new@incomplete.example", phone: "+27 11 555 1101", primary: true }
            ],
            categories: ["General Services"],
            capabilities: [],
            operatingRegions: ["Gauteng"],
            yearsInBusiness: 2,
            description: "New supplier with incomplete profile.",
            onboardingStatus: "draft",
            operationalStatus: "pending",
            qualificationStatus: "unqualified",
            complianceStatus: "missing",
            riskRating: "medium",
            performanceScore: null,
            spendToDate: 0,
            createdAt: "2026-10-20T09:00:00+02:00"
        },
        {
            id: "VEN-0012",
            legalName: "Highveld Office Supplies (Pty) Ltd [DUPLICATE]",
            tradingName: "Highveld Office Dup",
            registrationNumber: "DEMO-2010/445566/07",  // Same as VEN-0004 → flagged
            csdNumber: "",
            taxRef: "DEMO-9012345699",
            vatNumber: "",
            vatRegistered: false,
            bbbeeLevel: null,
            bbbeeCertificateIssue: null,
            bbbeeCertificateExpiry: null,
            businessType: "Private Company",
            country: "South Africa",
            province: "Gauteng",
            municipality: "City of Tshwane",
            businessAddress: "Different address",
            postalAddress: "",
            website: "",
            primaryContact: {
                name: "Potential Duplicate",
                role: "Owner",
                email: "johan@demo-highveld.example",  // Same domain → flagged
                phone: "+27 12 555 9999",
                department: "Executive",
                preferred: "email"
            },
            contacts: [],
            categories: ["Office Supplies"],
            capabilities: [],
            operatingRegions: ["Gauteng"],
            yearsInBusiness: 16,
            description: "Potential duplicate of Highveld Office Supplies.",
            onboardingStatus: "submitted",
            operationalStatus: "pending",
            qualificationStatus: "pending",
            complianceStatus: "missing",
            riskRating: "high",
            performanceScore: null,
            spendToDate: 0,
            createdAt: "2026-10-22T09:00:00+02:00"
        }
    ],

    // ============================================================
    // COMPLIANCE RECORDS
    // ============================================================
    complianceRecords: [
        // VEN-0001 - Meridian - all compliant
        { id: "CMP-0001", vendorId: "VEN-0001", documentType: "CIPC Registration", referenceNumber: "DEMO-2015/034521/07", issueDate: "2024-01-15", expiryDate: "2027-01-14", reviewStatus: "approved", verificationStatus: "not_externally_verified", notes: "" },
        { id: "CMP-0002", vendorId: "VEN-0001", documentType: "Tax Clearance", referenceNumber: "DEMO-TAX-001", issueDate: "2026-01-10", expiryDate: "2027-01-09", reviewStatus: "approved", verificationStatus: "not_externally_verified", notes: "" },
        { id: "CMP-0003", vendorId: "VEN-0001", documentType: "B-BBEE Certificate", referenceNumber: "DEMO-BBEEE-001", issueDate: "2026-01-15", expiryDate: "2027-01-14", reviewStatus: "approved", verificationStatus: "not_externally_verified", notes: "Level 2" },
        { id: "CMP-0004", vendorId: "VEN-0001", documentType: "Public Liability Insurance", referenceNumber: "DEMO-INS-001", issueDate: "2026-06-01", expiryDate: "2027-05-31", reviewStatus: "approved", verificationStatus: "not_externally_verified", notes: "R5m cover" },
        
        // VEN-0002 - Cape Software - all compliant
        { id: "CMP-0005", vendorId: "VEN-0002", documentType: "CIPC Registration", referenceNumber: "DEMO-2018/112233/23", issueDate: "2024-01-15", expiryDate: "2027-01-14", reviewStatus: "approved", verificationStatus: "not_externally_verified", notes: "" },
        { id: "CMP-0006", vendorId: "VEN-0002", documentType: "Tax Clearance", referenceNumber: "DEMO-TAX-002", issueDate: "2026-02-01", expiryDate: "2027-01-31", reviewStatus: "approved", verificationStatus: "not_externally_verified", notes: "" },
        { id: "CMP-0007", vendorId: "VEN-0002", documentType: "B-BBEE Certificate", referenceNumber: "DEMO-BBEEE-002", issueDate: "2026-02-01", expiryDate: "2027-01-31", reviewStatus: "approved", verificationStatus: "not_externally_verified", notes: "Level 4" },
        
        // VEN-0003 - Ubuntu - all compliant
        { id: "CMP-0008", vendorId: "VEN-0003", documentType: "CIPC Registration", referenceNumber: "DEMO-2012/998877/07", issueDate: "2024-01-15", expiryDate: "2027-01-14", reviewStatus: "approved", verificationStatus: "not_externally_verified", notes: "" },
        { id: "CMP-0009", vendorId: "VEN-0003", documentType: "Tax Clearance", referenceNumber: "DEMO-TAX-003", issueDate: "2026-03-10", expiryDate: "2027-03-09", reviewStatus: "approved", verificationStatus: "not_externally_verified", notes: "" },
        { id: "CMP-0010", vendorId: "VEN-0003", documentType: "B-BBEE Certificate", referenceNumber: "DEMO-BBEEE-003", issueDate: "2026-03-10", expiryDate: "2027-03-09", reviewStatus: "approved", verificationStatus: "not_externally_verified", notes: "Level 1" },
        { id: "CMP-0011", vendorId: "VEN-0003", documentType: "Goods-in-Transit Insurance", referenceNumber: "DEMO-INS-003", issueDate: "2026-05-01", expiryDate: "2027-04-30", reviewStatus: "approved", verificationStatus: "not_externally_verified", notes: "R10m cover" },
        
        // VEN-0004 - Highveld - EXPIRING certificates
        { id: "CMP-0012", vendorId: "VEN-0004", documentType: "CIPC Registration", referenceNumber: "DEMO-2010/445566/07", issueDate: "2024-01-15", expiryDate: "2027-01-14", reviewStatus: "approved", verificationStatus: "not_externally_verified", notes: "" },
        { id: "CMP-0013", vendorId: "VEN-0004", documentType: "Tax Clearance", referenceNumber: "DEMO-TAX-004", issueDate: "2025-11-20", expiryDate: "2026-11-19", reviewStatus: "approved", verificationStatus: "not_externally_verified", notes: "EXPIRING SOON" },
        { id: "CMP-0014", vendorId: "VEN-0004", documentType: "B-BBEE Certificate", referenceNumber: "DEMO-BBEEE-004", issueDate: "2026-04-20", expiryDate: "2027-04-19", reviewStatus: "approved", verificationStatus: "not_externally_verified", notes: "Level 3" },
        
        // VEN-0005 - Bay Area - compliant
        { id: "CMP-0015", vendorId: "VEN-0005", documentType: "CIPC Registration", referenceNumber: "DEMO-2019/223344/23", issueDate: "2024-01-15", expiryDate: "2027-01-14", reviewStatus: "approved", verificationStatus: "not_externally_verified", notes: "" },
        { id: "CMP-0016", vendorId: "VEN-0005", documentType: "Tax Clearance", referenceNumber: "DEMO-TAX-005", issueDate: "2026-05-01", expiryDate: "2027-04-30", reviewStatus: "approved", verificationStatus: "not_externally_verified", notes: "" },
        { id: "CMP-0017", vendorId: "VEN-0005", documentType: "B-BBEE Certificate", referenceNumber: "DEMO-BBEEE-005", issueDate: "2026-05-15", expiryDate: "2027-05-14", reviewStatus: "approved", verificationStatus: "not_externally_verified", notes: "Level 1" },
        
        // VEN-0006 - Zamani - compliant
        { id: "CMP-0018", vendorId: "VEN-0006", documentType: "NPC Registration", referenceNumber: "DEMO-2014/778899/08", issueDate: "2024-01-15", expiryDate: "2027-01-14", reviewStatus: "approved", verificationStatus: "not_externally_verified", notes: "" },
        { id: "CMP-0019", vendorId: "VEN-0006", documentType: "Tax Clearance", referenceNumber: "DEMO-TAX-006", issueDate: "2026-06-01", expiryDate: "2027-05-31", reviewStatus: "approved", verificationStatus: "not_externally_verified", notes: "" },
        { id: "CMP-0020", vendorId: "VEN-0006", documentType: "B-BBEE Certificate", referenceNumber: "DEMO-BBEEE-006", issueDate: "2026-06-01", expiryDate: "2027-05-31", reviewStatus: "approved", verificationStatus: "not_externally_verified", notes: "Level 1" },
        { id: "CMP-0021", vendorId: "VEN-0006", documentType: "Accreditation Certificate", referenceNumber: "DEMO-ACCR-006", issueDate: "2025-09-01", expiryDate: "2026-08-31", reviewStatus: "approved", verificationStatus: "not_externally_verified", notes: "EXPIRING SOON" },
        
        // VEN-0007 - Silver Line - MISSING docs
        { id: "CMP-0022", vendorId: "VEN-0007", documentType: "CIPC Registration", referenceNumber: "DEMO-2020/556677/07", issueDate: "2024-01-15", expiryDate: "2027-01-14", reviewStatus: "approved", verificationStatus: "not_externally_verified", notes: "" },
        { id: "CMP-0023", vendorId: "VEN-0007", documentType: "Tax Clearance", referenceNumber: "MISSING", issueDate: null, expiryDate: null, reviewStatus: "missing", verificationStatus: "not_externally_verified", notes: "Not submitted" },
        { id: "CMP-0024", vendorId: "VEN-0007", documentType: "B-BBEE Certificate", referenceNumber: "DEMO-BBEEE-007", issueDate: "2025-08-01", expiryDate: "2026-07-31", reviewStatus: "approved", verificationStatus: "not_externally_verified", notes: "Level 6" },
        { id: "CMP-0025", vendorId: "VEN-0007", documentType: "Construction Insurance", referenceNumber: "MISSING", issueDate: null, expiryDate: null, reviewStatus: "missing", verificationStatus: "not_externally_verified", notes: "Not submitted" },
        
        // VEN-0008 - Kalahari - ALL MISSING
        { id: "CMP-0026", vendorId: "VEN-0008", documentType: "CIPC Registration", referenceNumber: "MISSING", issueDate: null, expiryDate: null, reviewStatus: "missing", verificationStatus: "not_externally_verified", notes: "New vendor" },
        { id: "CMP-0027", vendorId: "VEN-0008", documentType: "Tax Clearance", referenceNumber: "MISSING", issueDate: null, expiryDate: null, reviewStatus: "missing", verificationStatus: "not_externally_verified", notes: "New vendor" },
        { id: "CMP-0028", vendorId: "VEN-0008", documentType: "B-BBEE Certificate", referenceNumber: "MISSING", issueDate: null, expiryDate: null, reviewStatus: "missing", verificationStatus: "not_externally_verified", notes: "New vendor" },
        
        // VEN-0009 - Suspended - all EXPIRED
        { id: "CMP-0029", vendorId: "VEN-0009", documentType: "CIPC Registration", referenceNumber: "DEMO-2017/334455/07", issueDate: "2024-01-15", expiryDate: "2027-01-14", reviewStatus: "approved", verificationStatus: "not_externally_verified", notes: "" },
        { id: "CMP-0030", vendorId: "VEN-0009", documentType: "Tax Clearance", referenceNumber: "DEMO-TAX-009", issueDate: "2024-01-01", expiryDate: "2025-01-01", reviewStatus: "expired", verificationStatus: "not_externally_verified", notes: "EXPIRED - vendor suspended" },
        { id: "CMP-0031", vendorId: "VEN-0009", documentType: "B-BBEE Certificate", referenceNumber: "DEMO-BBEEE-009", issueDate: "2024-01-01", expiryDate: "2025-01-01", reviewStatus: "expired", verificationStatus: "not_externally_verified", notes: "EXPIRED - vendor suspended" },
        
        // VEN-0010 - Coastal - compliant
        { id: "CMP-0032", vendorId: "VEN-0010", documentType: "CIPC Registration", referenceNumber: "DEMO-2016/667788/23", issueDate: "2024-01-15", expiryDate: "2027-01-14", reviewStatus: "approved", verificationStatus: "not_externally_verified", notes: "" },
        { id: "CMP-0033", vendorId: "VEN-0010", documentType: "Tax Clearance", referenceNumber: "DEMO-TAX-010", issueDate: "2026-02-15", expiryDate: "2027-02-14", reviewStatus: "approved", verificationStatus: "not_externally_verified", notes: "" },
        { id: "CMP-0034", vendorId: "VEN-0010", documentType: "Health Certificate", referenceNumber: "DEMO-HEALTH-010", issueDate: "2026-03-01", expiryDate: "2027-02-28", reviewStatus: "approved", verificationStatus: "not_externally_verified", notes: "Food handling" },
        
        // VEN-0011 - Incomplete
        { id: "CMP-0035", vendorId: "VEN-0011", documentType: "CIPC Registration", referenceNumber: "MISSING", issueDate: null, expiryDate: null, reviewStatus: "missing", verificationStatus: "not_externally_verified", notes: "Draft onboarding" },
        { id: "CMP-0036", vendorId: "VEN-0011", documentType: "Tax Clearance", referenceNumber: "MISSING", issueDate: null, expiryDate: null, reviewStatus: "missing", verificationStatus: "not_externally_verified", notes: "Draft onboarding" },
        { id: "CMP-0037", vendorId: "VEN-0011", documentType: "B-BBEE Certificate", referenceNumber: "MISSING", issueDate: null, expiryDate: null, reviewStatus: "missing", verificationStatus: "not_externally_verified", notes: "Draft onboarding" },
        
        // VEN-0012 - Duplicate
        { id: "CMP-0038", vendorId: "VEN-0012", documentType: "CIPC Registration", referenceNumber: "MISSING", issueDate: null, expiryDate: null, reviewStatus: "missing", verificationStatus: "not_externally_verified", notes: "Potential duplicate" }
    ],

    // ============================================================
    // RISK REGISTER
    // ============================================================
    risks: [
        { id: "RSK-0001", vendorId: "VEN-0009", category: "Compliance", description: "Expired tax clearance and B-BBEE certificates", likelihood: 5, impact: 5, score: 25, severity: "critical", mitigation: "Vendor suspended; compliance investigation underway", owner: "Compliance Officer", reviewDate: "2026-11-01", status: "open" },
        { id: "RSK-0002", vendorId: "VEN-0007", category: "Compliance", description: "Missing tax clearance and construction insurance", likelihood: 4, impact: 4, score: 16, severity: "high", mitigation: "Requested documents; awaiting response", owner: "Elena Rodriguez", reviewDate: "2026-11-05", status: "open" },
        { id: "RSK-0003", vendorId: "VEN-0012", category: "Fraud", description: "Potential duplicate of VEN-0004 (same CIPC registration, same email domain)", likelihood: 5, impact: 4, score: 20, severity: "critical", mitigation: "Under review by procurement lead", owner: "Elena Rodriguez", reviewDate: "2026-10-30", status: "open" },
        { id: "RSK-0004", vendorId: "VEN-0004", category: "Compliance", description: "Tax clearance expiring within 30 days", likelihood: 3, impact: 3, score: 9, severity: "medium", mitigation: "Reminder sent to vendor", owner: "Procurement Admin", reviewDate: "2026-11-15", status: "open" },
        { id: "RSK-0005", vendorId: "VEN-0001", category: "Concentration", description: "High concentration of ICT spend with single vendor", likelihood: 3, impact: 3, score: 9, severity: "medium", mitigation: "Diversify ICT supplier base", owner: "Sarah Chen", reviewDate: "2026-12-01", status: "monitoring" }
    ],

    // ============================================================
    // PERFORMANCE REVIEWS
    // ============================================================
    performanceReviews: [
        { id: "PERF-0001", vendorId: "VEN-0001", period: "Q3 2026", onTimeDelivery: 98, qualityAcceptance: 97, priceCompetitiveness: 82, responsiveness: 95, documentation: 100, overallScore: 94, reviewNotes: "Consistently strong performance", reviewer: "Elena Rodriguez", reviewedAt: "2026-10-01T10:00:00+02:00" },
        { id: "PERF-0002", vendorId: "VEN-0002", period: "Q3 2026", onTimeDelivery: 92, qualityAcceptance: 95, priceCompetitiveness: 78, responsiveness: 88, documentation: 100, overallScore: 90, reviewNotes: "Good delivery, pricing slightly above market", reviewer: "Elena Rodriguez", reviewedAt: "2026-10-01T10:00:00+02:00" },
        { id: "PERF-0003", vendorId: "VEN-0003", period: "Q3 2026", onTimeDelivery: 99, qualityAcceptance: 98, priceCompetitiveness: 90, responsiveness: 92, documentation: 100, overallScore: 96, reviewNotes: "Excellent logistics partner", reviewer: "Sarah Chen", reviewedAt: "2026-10-01T10:00:00+02:00" },
        { id: "PERF-0004", vendorId: "VEN-0004", period: "Q3 2026", onTimeDelivery: 78, qualityAcceptance: 82, priceCompetitiveness: 88, responsiveness: 72, documentation: 60, overallScore: 76, reviewNotes: "Compliance gaps impacting score", reviewer: "Elena Rodriguez", reviewedAt: "2026-10-01T10:00:00+02:00" },
        { id: "PERF-0005", vendorId: "VEN-0005", period: "Q3 2026", onTimeDelivery: 88, qualityAcceptance: 92, priceCompetitiveness: 85, responsiveness: 90, documentation: 100, overallScore: 91, reviewNotes: "Reliable facilities partner", reviewer: "Sarah Chen", reviewedAt: "2026-10-01T10:00:00+02:00" },
        { id: "PERF-0006", vendorId: "VEN-0006", period: "Q3 2026", onTimeDelivery: 95, qualityAcceptance: 96, priceCompetitiveness: 92, responsiveness: 88, documentation: 95, overallScore: 93, reviewNotes: "Strong training outcomes", reviewer: "Aisha Patel", reviewedAt: "2026-10-01T10:00:00+02:00" }
    ],

    // ============================================================
    // CONTRACTS
    // ============================================================
    contracts: [
        { id: "CTR-0001", vendorId: "VEN-0001", title: "Enterprise Network Infrastructure Agreement", contractType: "Supply Agreement", effectiveDate: "2024-06-01", expiryDate: "2027-05-31", value: 5000000, currency: "ZAR", renewalTerms: "12 months auto-renew", noticePeriod: 60, contractOwner: "Sarah Chen", status: "active", obligations: "Quarterly performance review; 99% uptime SLA", createdAt: "2024-05-15T10:00:00+02:00" },
        { id: "CTR-0002", vendorId: "VEN-0003", title: "National Road Freight SLA", contractType: "Service Level Agreement", effectiveDate: "2024-02-01", expiryDate: "2027-01-31", value: 1500000, currency: "ZAR", renewalTerms: "24 months auto-renew", noticePeriod: 90, contractOwner: "Elena Rodriguez", status: "active", obligations: "98% on-time delivery; goods-in-transit insurance R10m", createdAt: "2024-01-20T10:00:00+02:00" },
        { id: "CTR-0003", vendorId: "VEN-0006", title: "Skills Development Programme", contractType: "Service Agreement", effectiveDate: "2025-04-01", expiryDate: "2026-03-31", value: 400000, currency: "ZAR", renewalTerms: "Annual renewal", noticePeriod: 30, contractOwner: "Aisha Patel", status: "expiring_soon", obligations: "Deliver 200 learnerships annually", createdAt: "2025-03-15T10:00:00+02:00" },
        { id: "CTR-0004", vendorId: "VEN-0005", title: "Facilities Management Services", contractType: "Master Service Agreement", effectiveDate: "2024-07-01", expiryDate: "2027-06-30", value: 800000, currency: "ZAR", renewalTerms: "12 months auto-renew", noticePeriod: 60, contractOwner: "Sarah Chen", status: "active", obligations: "Monthly cleaning; quarterly HVAC maintenance", createdAt: "2024-06-15T10:00:00+02:00" }
    ],

    // ============================================================
    // AUDIT LOG
    // ============================================================
    auditLog: [
        { id: "ACT-0001", timestamp: "2026-10-22T14:30:00+02:00", user: "Elena Rodriguez", action: "Vendor registered", entityType: "vendor", entityId: "VEN-0012", summary: "Potential duplicate flagged for review", before: null, after: { status: "submitted" } },
        { id: "ACT-0002", timestamp: "2026-10-21T09:15:00+02:00", user: "Elena Rodriguez", action: "Vendor registered", entityType: "vendor", entityId: "VEN-0008", summary: "New vendor submitted for onboarding", before: null, after: { status: "submitted" } },
        { id: "ACT-0003", timestamp: "2026-10-20T16:45:00+02:00", user: "Aisha Patel", action: "Document reviewed", entityType: "compliance", entityId: "CMP-0004", summary: "Public Liability Insurance approved for VEN-0001", before: { status: "under_review" }, after: { status: "approved" } },
        { id: "ACT-0004", timestamp: "2026-10-18T11:20:00+02:00", user: "Sarah Chen", action: "Vendor suspended", entityType: "vendor", entityId: "VEN-0009", summary: "Suspended pending compliance investigation", before: { operationalStatus: "active" }, after: { operationalStatus: "suspended" } },
        { id: "ACT-0005", timestamp: "2026-10-15T10:00:00+02:00", user: "Elena Rodriguez", action: "Compliance reminder sent", entityType: "vendor", entityId: "VEN-0004", summary: "Tax clearance expiring - reminder sent to vendor", before: null, after: null },
        { id: "ACT-0006", timestamp: "2026-10-10T09:00:00+02:00", user: "System", action: "Performance review completed", entityType: "vendor", entityId: "VEN-0001", summary: "Q3 2026 review: 94/100", before: null, after: { score: 94 } },
        { id: "ACT-0007", timestamp: "2026-10-05T15:30:00+02:00", user: "Sarah Chen", action: "Contract renewed", entityType: "contract", entityId: "CTR-0001", summary: "Network infrastructure agreement renewed for 24 months", before: { expiryDate: "2027-05-31" }, after: { expiryDate: "2029-05-31" } }
    ],

    // ============================================================
    // NOTIFICATIONS
    // ============================================================
    notifications: [
        { id: "NOTIF-0001", type: "warning", title: "Tax clearance expiring", message: "Highveld Office Supplies tax clearance expires in 26 days", entityType: "vendor", entityId: "VEN-0004", read: false, createdAt: "2026-10-24T08:00:00+02:00" },
        { id: "NOTIF-0002", type: "danger", title: "Potential duplicate detected", message: "Incomplete Profile Demo Ltd has the same registration as Highveld Office", entityType: "vendor", entityId: "VEN-0012", read: false, createdAt: "2026-10-22T14:30:00+02:00" },
        { id: "NOTIF-0003", type: "info", title: "New vendor submitted", message: "Kalahari Solar Solutions submitted onboarding for review", entityType: "vendor", entityId: "VEN-0008", read: false, createdAt: "2026-10-21T09:15:00+02:00" },
        { id: "NOTIF-0004", type: "warning", title: "Contract expiring", message: "Skills Development Programme expires in 158 days", entityType: "contract", entityId: "CTR-0003", read: true, createdAt: "2026-10-20T10:00:00+02:00" }
    ],

    // ============================================================
    // CONFIGURATION
    // ============================================================
    config: {
        version: "1.0.0",
        performanceWeights: {
            onTimeDelivery: 30,
            qualityAcceptance: 25,
            priceCompetitiveness: 20,
            responsiveness: 15,
            documentation: 10
        },
        complianceWarningDays: 30,
        requiredDocuments: {
            "ICT Hardware": ["CIPC Registration", "Tax Clearance", "B-BBEE Certificate", "Public Liability Insurance"],
            "Logistics": ["CIPC Registration", "Tax Clearance", "B-BBEE Certificate", "Goods-in-Transit Insurance"],
            "Construction": ["CIPC Registration", "Tax Clearance", "B-BBEE Certificate", "Construction Insurance"],
            "Training": ["CIPC Registration", "Tax Clearance", "B-BBEE Certificate", "Accreditation Certificate"],
            "default": ["CIPC Registration", "Tax Clearance", "B-BBEE Certificate"]
        }
    }
};

console.log('[Procurement] Seed data loaded:', {
    suppliers: ProcurementData.suppliers.length,
    compliance: ProcurementData.complianceRecords.length,
    risks: ProcurementData.risks.length,
    contracts: ProcurementData.contracts.length
});
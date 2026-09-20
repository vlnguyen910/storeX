import "dotenv/config";
import { db, queryClient } from "./client";
import {
  auditLogs,
  contracts,
  facilities,
  incidentDiscrepancies,
  invoices,
  paymentTransactions,
  pricingPolicies,
  reservations,
  roles,
  staffShifts,
  storageUnits,
  supportTickets,
  ticketComments,
  unitHandovers,
  unitTypes,
  userRoles,
  users,
} from "./schema";

function getItem<T>(arr: T[], index: number, name: string): T {
  const item = arr[index];
  if (!item) {
    throw new Error(`Expected item at index ${index} for ${name}`);
  }
  return item;
}

async function seed() {
  console.log("🌱 Starting database seeding...");

  // 1. Roles
  console.log("  -> Seeding roles...");
  const roleResults = await db
    .insert(roles)
    .values([
      { name: "admin", description: "System Administrator with full access" },
      { name: "manager", description: "Facility Manager responsible for operations" },
      { name: "staff", description: "Facility Staff handling check-in/out and maintenance" },
      { name: "customer", description: "End user renting storage units" },
    ])
    .returning();

  const adminRole = getItem(roleResults, 0, "adminRole");
  const managerRole = getItem(roleResults, 1, "managerRole");
  const staffRole = getItem(roleResults, 2, "staffRole");
  const customerRole = getItem(roleResults, 3, "customerRole");

  // 2. Users (Password hash placeholder: bcrypt hash for 'Password@123')
  console.log("  -> Seeding users...");
  const dummyHash = "$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW"; // 'Password@123'
  const userResults = await db
    .insert(users)
    .values([
      {
        fullName: "System Admin",
        email: "admin@storex.vn",
        phoneNumber: "0901234567",
        passwordHash: dummyHash,
        status: "active",
      },
      {
        fullName: "Nguyen Van Quan Ly",
        email: "manager.hanoi@storex.vn",
        phoneNumber: "0902345678",
        passwordHash: dummyHash,
        status: "active",
      },
      {
        fullName: "Tran Thi Nhan Vien",
        email: "staff.hanoi@storex.vn",
        phoneNumber: "0903456789",
        passwordHash: dummyHash,
        status: "active",
      },
      {
        fullName: "Le Van Khach Hang",
        email: "customer1@gmail.com",
        phoneNumber: "0904567890",
        passwordHash: dummyHash,
        status: "active",
      },
      {
        fullName: "Pham Thi Thu",
        email: "customer2@gmail.com",
        phoneNumber: "0905678901",
        passwordHash: dummyHash,
        status: "active",
      },
    ])
    .returning();

  const adminUser = getItem(userResults, 0, "adminUser");
  const managerUser = getItem(userResults, 1, "managerUser");
  const staffUser = getItem(userResults, 2, "staffUser");
  const customerUser1 = getItem(userResults, 3, "customerUser1");
  const customerUser2 = getItem(userResults, 4, "customerUser2");

  // 3. Facilities
  console.log("  -> Seeding facilities...");
  const facilityResults = await db
    .insert(facilities)
    .values([
      {
        name: "storeX Ha Noi Central",
        code: "HN-01",
        address: "123 Cau Giay, Quan Cau Giay, Ha Noi",
        operatingStatus: "active",
      },
      {
        name: "storeX TP Ho Chi Minh District 7",
        code: "HCM-01",
        address: "456 Nguyen Huu Tho, Quan 7, TP Ho Chi Minh",
        operatingStatus: "active",
      },
      {
        name: "storeX Da Nang Riverside",
        code: "DN-01",
        address: "789 Tran Hung Dao, Quan Son Tra, Da Nang",
        operatingStatus: "active",
      },
    ])
    .returning();

  const facilityHN = getItem(facilityResults, 0, "facilityHN");
  const facilityHCM = getItem(facilityResults, 1, "facilityHCM");
  const facilityDN = getItem(facilityResults, 2, "facilityDN");

  // 4. User Roles
  console.log("  -> Seeding user roles...");
  await db.insert(userRoles).values([
    { userId: adminUser.id, roleId: adminRole.id, facilityId: null },
    { userId: managerUser.id, roleId: managerRole.id, facilityId: facilityHN.id },
    { userId: staffUser.id, roleId: staffRole.id, facilityId: facilityHN.id },
    { userId: customerUser1.id, roleId: customerRole.id, facilityId: null },
    { userId: customerUser2.id, roleId: customerRole.id, facilityId: null },
  ]);

  // 5. Unit Types
  console.log("  -> Seeding unit types...");
  const unitTypeResults = await db
    .insert(unitTypes)
    .values([
      {
        name: "Small Storage Locker",
        sizeCategory: "small",
        dimensions: "1m x 1m x 1m",
        volumeM3: "1.00",
      },
      {
        name: "Medium Self-Storage Unit",
        sizeCategory: "medium",
        dimensions: "2m x 2m x 2.5m",
        volumeM3: "10.00",
      },
      {
        name: "Large Warehouse Unit",
        sizeCategory: "large",
        dimensions: "3m x 4m x 3m",
        volumeM3: "36.00",
      },
    ])
    .returning();

  const unitTypeSmall = getItem(unitTypeResults, 0, "unitTypeSmall");
  const unitTypeMedium = getItem(unitTypeResults, 1, "unitTypeMedium");
  const unitTypeLarge = getItem(unitTypeResults, 2, "unitTypeLarge");

  // 6. Pricing Policies
  console.log("  -> Seeding pricing policies...");
  await db.insert(pricingPolicies).values([
    {
      facilityId: facilityHN.id,
      unitTypeId: unitTypeSmall.id,
      basePriceMonthly: "500000.00",
      depositPercentage: "20.00",
      dailyOverdueFee: "50000.00",
    },
    {
      facilityId: facilityHN.id,
      unitTypeId: unitTypeMedium.id,
      basePriceMonthly: "1500000.00",
      depositPercentage: "20.00",
      dailyOverdueFee: "100000.00",
    },
    {
      facilityId: facilityHN.id,
      unitTypeId: unitTypeLarge.id,
      basePriceMonthly: "3500000.00",
      depositPercentage: "25.00",
      dailyOverdueFee: "200000.00",
    },
    {
      facilityId: facilityHCM.id,
      unitTypeId: unitTypeSmall.id,
      basePriceMonthly: "600000.00",
      depositPercentage: "20.00",
      dailyOverdueFee: "50000.00",
    },
    {
      facilityId: facilityDN.id,
      unitTypeId: unitTypeSmall.id,
      basePriceMonthly: "450000.00",
      depositPercentage: "20.00",
      dailyOverdueFee: "40000.00",
    },
  ]);

  // 7. Storage Units
  console.log("  -> Seeding storage units...");
  const storageUnitResults = await db
    .insert(storageUnits)
    .values([
      {
        facilityId: facilityHN.id,
        unitTypeId: unitTypeSmall.id,
        unitCode: "HN-A101",
        currentStatus: "occupied",
        currentPasscodeHash: dummyHash,
      },
      {
        facilityId: facilityHN.id,
        unitTypeId: unitTypeMedium.id,
        unitCode: "HN-A102",
        currentStatus: "available",
        currentPasscodeHash: null,
      },
      {
        facilityId: facilityHN.id,
        unitTypeId: unitTypeLarge.id,
        unitCode: "HN-B201",
        currentStatus: "reserved",
        currentPasscodeHash: null,
      },
      {
        facilityId: facilityHCM.id,
        unitTypeId: unitTypeSmall.id,
        unitCode: "HCM-C301",
        currentStatus: "available",
        currentPasscodeHash: null,
      },
      {
        facilityId: facilityDN.id,
        unitTypeId: unitTypeSmall.id,
        unitCode: "DN-D401",
        currentStatus: "available",
        currentPasscodeHash: null,
      },
    ])
    .returning();

  const unitA101 = getItem(storageUnitResults, 0, "unitA101");
  const unitB201 = getItem(storageUnitResults, 2, "unitB201");

  // 8. Reservations
  console.log("  -> Seeding reservations...");
  const reservationResults = await db
    .insert(reservations)
    .values([
      {
        reservationCode: "RES-202609-001",
        customerId: customerUser1.id,
        facilityId: facilityHN.id,
        unitTypeId: unitTypeSmall.id,
        assignedUnitId: unitA101.id,
        startDate: "2026-10-01",
        rentalDurationMonths: 6,
        status: "confirmed",
      },
      {
        reservationCode: "RES-202609-002",
        customerId: customerUser2.id,
        facilityId: facilityHN.id,
        unitTypeId: unitTypeLarge.id,
        assignedUnitId: unitB201.id,
        startDate: "2026-10-15",
        rentalDurationMonths: 3,
        status: "pending",
      },
    ])
    .returning();

  const res1 = getItem(reservationResults, 0, "res1");

  // 9. Contracts
  console.log("  -> Seeding contracts...");
  const contractResults = await db
    .insert(contracts)
    .values([
      {
        contractNumber: "HD-2026-0001",
        reservationId: res1.id,
        customerId: customerUser1.id,
        unitId: unitA101.id,
        startDate: "2026-10-01",
        endDate: "2027-04-01",
        monthlyRentalRate: "500000.00",
        depositAmount: "100000.00",
        currentStatus: "active",
      },
    ])
    .returning();

  const contract1 = getItem(contractResults, 0, "contract1");

  // 10. Unit Handovers
  console.log("  -> Seeding unit handovers...");
  const handoverResults = await db
    .insert(unitHandovers)
    .values([
      {
        contractId: contract1.id,
        staffId: staffUser.id,
        handoverType: "check_in",
        lockStatus: "functional",
        cleanlinessStatus: "clean",
        damageFeeIncurred: "0.00",
        refundedDeposit: "0.00",
      },
    ])
    .returning();

  const handover1 = getItem(handoverResults, 0, "handover1");

  // 11. Staff Shifts
  console.log("  -> Seeding staff shifts...");
  await db.insert(staffShifts).values([
    {
      facilityId: facilityHN.id,
      staffId: staffUser.id,
      shiftDate: "2026-10-01",
      shiftType: "morning",
    },
  ]);

  // 12. Invoices & Payment Transactions
  console.log("  -> Seeding invoices and payments...");
  const invoiceResults = await db
    .insert(invoices)
    .values([
      {
        invoiceNumber: "INV-2026-0001",
        contractId: contract1.id,
        reservationId: res1.id,
        customerId: customerUser1.id,
        invoiceType: "monthly_rental",
        totalAmount: "600000.00", // 500k rent + 100k deposit
        paymentStatus: "paid",
      },
    ])
    .returning();

  const invoice1 = getItem(invoiceResults, 0, "invoice1");

  await db.insert(paymentTransactions).values([
    {
      invoiceId: invoice1.id,
      gateway: "vnpay",
      transactionCode: "VNPAY-TX-20260920001",
      amount: "600000.00",
      status: "success",
    },
  ]);

  // 13. Support Tickets & Comments
  console.log("  -> Seeding support tickets...");
  const ticketResults = await db
    .insert(supportTickets)
    .values([
      {
        ticketCode: "TCK-2026-001",
        facilityId: facilityHN.id,
        customerId: customerUser1.id,
        unitId: unitA101.id,
        assignedStaffId: staffUser.id,
        category: "lock_issue",
        severityLevel: "medium",
        status: "in_progress",
      },
    ])
    .returning();

  const ticket1 = getItem(ticketResults, 0, "ticket1");

  await db.insert(ticketComments).values([
    {
      ticketId: ticket1.id,
      authorId: customerUser1.id,
      message: "Khóa điện tử của kho A101 thỉnh thoảng bị kẹt nút bấm số 4.",
    },
    {
      ticketId: ticket1.id,
      authorId: staffUser.id,
      message: "Dạ em đã tiếp nhận yêu cầu, kỹ thuật viên sẽ qua kiểm tra vào chiều nay ạ.",
    },
  ]);

  // 14. Audit Logs
  console.log("  -> Seeding audit logs...");
  await db.insert(auditLogs).values([
    {
      userId: customerUser1.id,
      action: "RESERVATION_CREATED",
      entityName: "reservations",
      entityId: res1.id,
    },
    {
      userId: staffUser.id,
      action: "HANDOVER_COMPLETED",
      entityName: "unit_handovers",
      entityId: handover1.id,
    },
  ]);

  // 15. Incident Discrepancies
  console.log("  -> Seeding incident discrepancies...");
  await db.insert(incidentDiscrepancies).values([
    {
      unitId: unitA101.id,
      previousHandoverId: null,
      currentHandoverId: handover1.id,
      reportedByCustomerId: customerUser1.id,
      responsibleStaffId: staffUser.id,
      discrepancyDescription: "Vết xước nhẹ ở góc tường bên trái kho khi nhận bàn giao.",
      investigationResult: "Xác nhận vết xước cũ, không tính phí bồi thường",
      repairCost: "0.00",
      resolvedAt: new Date(),
    },
  ]);

  console.log("✅ All 17 tables seeded successfully!");
}

seed()
  .catch((err) => {
    console.error("❌ Seed failed with error:", err);
    process.exit(1);
  })
  .finally(async () => {
    await queryClient.end();
  });

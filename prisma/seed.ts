import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting comprehensive seed...');

  // Hash passwords
  const hashedPassword = await bcrypt.hash('password123', 10);

  // ========================================
  // 1. CREATE USERS WITH HIERARCHY
  // ========================================
  console.log('👥 Creating users...');

  // Create SUPER ADMIN user (Company Owner)
  const superAdmin = await prisma.user.upsert({
    create: {
      address: 'Mumbai, Maharashtra',
      email: 'superadmin@supervidya.com',
      name: 'Super Vidya Admin',
      password: hashedPassword,
      phone: '+91-9999999999',
      role: 'SUPER_ADMIN',
      status: 'Active',
      type: 'COMPANY_OWNER'
    },
    update: {},
    where: { email: 'superadmin@supervidya.com' }
  });

  // Create ADMIN user
  const admin = await prisma.user.upsert({
    create: {
      address: 'Mumbai, Maharashtra',
      email: 'admin@supervidya.com',
      name: 'Super Admin',
      parentUserId: superAdmin.id,
      password: hashedPassword,
      phone: '+91-9876543210',
      role: 'ADMIN',
      status: 'Active',
      type: 'ADMINISTRATOR'
    },
    update: {},
    where: { email: 'admin@supervidya.com' }
  });

  // Create DISTRIBUTOR user (child of admin)
  const distributor = await prisma.user.upsert({
    create: {
      address: 'Delhi, India',
      email: 'distributor@supervidya.com',
      name: 'Rajesh Kumar',
      parentUserId: admin.id,
      password: hashedPassword,
      phone: '+91-9876543211',
      role: 'DISTRIBUTOR',
      status: 'Active',
      type: 'BUSINESS_PARTNER'
    },
    update: {},
    where: { email: 'distributor@supervidya.com' }
  });

  // Create DEALER users (children of distributor)
  const dealer1 = await prisma.user.upsert({
    create: {
      address: 'Pune, Maharashtra',
      email: 'dealer@supervidya.com',
      name: 'Amit Sharma',
      parentUserId: distributor.id,
      password: hashedPassword,
      phone: '+91-9876543212',
      role: 'DEALER',
      status: 'Active',
      type: 'RETAILER'
    },
    update: {},
    where: { email: 'dealer@supervidya.com' }
  });

  await prisma.user.upsert({
    create: {
      address: 'Chennai, Tamil Nadu',
      email: 'dealer2@supervidya.com',
      name: 'Sunita Verma',
      parentUserId: distributor.id,
      password: hashedPassword,
      phone: '+91-9876543215',
      role: 'DEALER',
      status: 'Active',
      type: 'RETAILER'
    },
    update: {},
    where: { email: 'dealer2@supervidya.com' }
  });

  // Create CUSTOMER users (children of dealers)
  const customer1 = await prisma.user.upsert({
    create: {
      address: 'Bangalore, Karnataka',
      email: 'customer@supervidya.com',
      name: 'Priya Singh',
      parentUserId: dealer1.id,
      password: hashedPassword,
      phone: '+91-9876543213',
      role: 'CUSTOMER',
      status: 'Active',
      type: 'END_USER'
    },
    update: {},
    where: { email: 'customer@supervidya.com' }
  });

  const customer2 = await prisma.user.upsert({
    create: {
      address: 'Ahmedabad, Gujarat',
      email: 'customer2@supervidya.com',
      name: 'Vikram Patel',
      parentUserId: dealer1.id,
      password: hashedPassword,
      phone: '+91-9876543214',
      role: 'CUSTOMER',
      status: 'Active',
      type: 'END_USER'
    },
    update: {},
    where: { email: 'customer2@supervidya.com' }
  });

  // ========================================
  // 2. CREATE INVENTORY ITEMS
  // ========================================
  console.log('📦 Creating inventory items...');

  const stb = await prisma.inventoryItem.create({
    data: {
      category: 'HARDWARE',
      description: 'HD Set Top Box with DVR functionality',
      name: 'HD Set Top Box',
      price: 2500.0
    }
  });

  await prisma.inventoryItem.create({
    data: {
      category: 'ACCESSORIES',
      description: 'Universal Remote Control for STB',
      name: 'Universal Remote',
      price: 300.0
    }
  });

  await prisma.inventoryItem.create({
    data: {
      category: 'ACCESSORIES',
      description: '2 Meter HDMI Cable',
      name: 'HDMI Cable',
      price: 150.0
    }
  });

  // ========================================
  // 3. CREATE PLANS
  // ========================================
  console.log('📋 Creating subscription plans...');

  const basicPlan = await prisma.plan.create({
    data: {
      name: 'Basic Plan',
      price: 199.0,
      type: 'BASIC'
    }
  });

  const premiumPlan = await prisma.plan.create({
    data: {
      name: 'Premium Plan',
      price: 399.0,
      type: 'PREMIUM'
    }
  });

  const familyPlan = await prisma.plan.create({
    data: {
      name: 'Family Plan',
      price: 599.0,
      type: 'FAMILY'
    }
  });

  // ========================================
  // 4. CREATE CHANNELS
  // ========================================
  console.log('📺 Creating TV channels...');

  const channels = await Promise.all([
    prisma.channel.create({ data: { name: 'Star Plus', price: 25.0 } }),
    prisma.channel.create({ data: { name: 'Zee TV', price: 20.0 } }),
    prisma.channel.create({ data: { name: 'Colors', price: 22.0 } }),
    prisma.channel.create({ data: { name: 'Sony Entertainment', price: 28.0 } }),
    prisma.channel.create({ data: { name: 'Discovery Channel', price: 35.0 } }),
    prisma.channel.create({ data: { name: 'National Geographic', price: 40.0 } }),
    prisma.channel.create({ data: { name: 'Star Sports', price: 50.0 } }),
    prisma.channel.create({ data: { name: 'Sony Max', price: 30.0 } })
  ]);

  const [starPlus, zeeTV, colors, sonyEnt, discovery] = channels;

  // ========================================
  // 5. CREATE PLAN-CHANNEL RELATIONSHIPS
  // ========================================
  console.log('🔗 Linking plans to channels...');

  // Basic Plan Channels
  await Promise.all([
    prisma.planChannel.upsert({
      create: { channelId: starPlus.id, planId: basicPlan.id },
      update: {},
      where: { planId_channelId: { channelId: starPlus.id, planId: basicPlan.id } }
    }),
    prisma.planChannel.upsert({
      create: { channelId: zeeTV.id, planId: basicPlan.id },
      update: {},
      where: { planId_channelId: { channelId: zeeTV.id, planId: basicPlan.id } }
    }),
    prisma.planChannel.upsert({
      create: { channelId: colors.id, planId: basicPlan.id },
      update: {},
      where: { planId_channelId: { channelId: colors.id, planId: basicPlan.id } }
    })
  ]);

  // Premium Plan Channels (includes Basic + more)
  await Promise.all([
    // Basic channels
    prisma.planChannel.upsert({
      create: { channelId: starPlus.id, planId: premiumPlan.id },
      update: {},
      where: { planId_channelId: { channelId: starPlus.id, planId: premiumPlan.id } }
    }),
    prisma.planChannel.upsert({
      create: { channelId: zeeTV.id, planId: premiumPlan.id },
      update: {},
      where: { planId_channelId: { channelId: zeeTV.id, planId: premiumPlan.id } }
    }),
    prisma.planChannel.upsert({
      create: { channelId: colors.id, planId: premiumPlan.id },
      update: {},
      where: { planId_channelId: { channelId: colors.id, planId: premiumPlan.id } }
    }),
    // Premium channels
    prisma.planChannel.upsert({
      create: { channelId: sonyEnt.id, planId: premiumPlan.id },
      update: {},
      where: { planId_channelId: { channelId: sonyEnt.id, planId: premiumPlan.id } }
    }),
    prisma.planChannel.upsert({
      create: { channelId: discovery.id, planId: premiumPlan.id },
      update: {},
      where: { planId_channelId: { channelId: discovery.id, planId: premiumPlan.id } }
    })
  ]);

  // Family Plan Channels (all channels)
  await Promise.all(
    channels.map((channel) =>
      prisma.planChannel.upsert({
        create: { channelId: channel.id, planId: familyPlan.id },
        update: {},
        where: { planId_channelId: { channelId: channel.id, planId: familyPlan.id } }
      })
    )
  );

  // ========================================
  // 6. CREATE USER PLANS
  // ========================================
  console.log('📝 Assigning plans to users...');

  const today = new Date();
  const nextMonth = new Date(today);
  nextMonth.setMonth(today.getMonth() + 1);

  const userPlans = await Promise.all([
    // Customer 1 - Premium Plan
    prisma.userPlan.create({
      data: {
        endDate: nextMonth,
        planId: premiumPlan.id,
        startDate: today,
        status: 'ACTIVE',
        userId: customer1.id
      }
    }),
    // Customer 2 - Basic Plan
    prisma.userPlan.create({
      data: {
        endDate: nextMonth,
        planId: basicPlan.id,
        startDate: today,
        status: 'ACTIVE',
        userId: customer2.id
      }
    })
  ]);

  // ========================================
  // 7. CREATE USER CHANNELS
  // ========================================
  console.log('📡 Creating user channel subscriptions...');

  const userChannels = await Promise.all([
    // Customer 1 channels (from Premium Plan)
    prisma.userChannel.create({
      data: {
        addedFrom: 'PLAN',
        channelId: starPlus.id,
        price: starPlus.price,
        userId: customer1.id
      }
    }),
    prisma.userChannel.create({
      data: {
        addedFrom: 'PLAN',
        channelId: zeeTV.id,
        price: zeeTV.price,
        userId: customer1.id
      }
    }),
    prisma.userChannel.create({
      data: {
        addedFrom: 'PLAN',
        channelId: colors.id,
        price: colors.price,
        userId: customer1.id
      }
    }),
    prisma.userChannel.create({
      data: {
        addedFrom: 'PLAN',
        channelId: sonyEnt.id,
        price: sonyEnt.price,
        userId: customer1.id
      }
    }),
    prisma.userChannel.create({
      data: {
        addedFrom: 'PLAN',
        channelId: discovery.id,
        price: discovery.price,
        userId: customer1.id
      }
    }),
    // Customer 2 channels (from Basic Plan)
    prisma.userChannel.create({
      data: {
        addedFrom: 'PLAN',
        channelId: starPlus.id,
        price: starPlus.price,
        userId: customer2.id
      }
    }),
    prisma.userChannel.create({
      data: {
        addedFrom: 'PLAN',
        channelId: zeeTV.id,
        price: zeeTV.price,
        userId: customer2.id
      }
    }),
    prisma.userChannel.create({
      data: {
        addedFrom: 'PLAN',
        channelId: colors.id,
        price: colors.price,
        userId: customer2.id
      }
    })
  ]);

  // ========================================
  // 8. CREATE USER CHANNEL HISTORY
  // ========================================
  console.log('📊 Creating channel history snapshots...');

  await Promise.all(
    userChannels.map((userChannel) =>
      prisma.userChannelHistory.create({
        data: {
          channelId: userChannel.channelId,
          metadata: {
            action: 'SUBSCRIBED',
            planId:
              userChannel.addedFrom === 'PLAN'
                ? userPlans.find((up) => up.userId === userChannel.userId)?.planId
                : null,
            source: 'INITIAL_SETUP'
          },
          price: userChannel.price,
          userId: userChannel.userId
        }
      })
    )
  );

  // ========================================
  // 9. CREATE BILLINGS
  // ========================================
  console.log('💰 Creating billing records...');

  // Product Sale Billing (Customer 1 buying STB)
  const productSale = await prisma.billing.create({
    data: {
      billingDate: new Date(),
      billingType: 'PRODUCT_SALE',
      sellerId: dealer1.id,
      status: 'PAID',
      totalAmount: 2500.0,
      userId: customer1.id
    }
  });

  // Monthly Bill for Customer 1
  const monthlyBill1 = await prisma.billing.create({
    data: {
      billingDate: new Date(),
      billingType: 'MONTHLY_BILL',
      status: 'PAID',
      totalAmount: 399.0,
      userId: customer1.id
    }
  });

  // Monthly Bill for Customer 2
  const monthlyBill2 = await prisma.billing.create({
    data: {
      billingDate: new Date(),
      billingType: 'MONTHLY_BILL',
      status: 'PENDING',
      totalAmount: 199.0,
      userId: customer2.id
    }
  });

  // ========================================
  // 10. CREATE BILLING ITEMS
  // ========================================
  console.log('📋 Creating billing line items...');

  await Promise.all([
    // Product Sale Items
    prisma.billingItem.create({
      data: {
        billingId: productSale.id,
        description: 'HD Set Top Box purchase',
        inventoryId: stb.id,
        itemType: 'PRODUCT',
        price: 2500.0,
        quantity: 1
      }
    }),
    // Monthly Bill Items - Customer 1 (Premium Plan)
    prisma.billingItem.create({
      data: {
        billingId: monthlyBill1.id,
        description: 'Premium Plan - Monthly Subscription',
        itemType: 'PLAN',
        planId: premiumPlan.id,
        price: 399.0,
        quantity: 1
      }
    }),
    // Monthly Bill Items - Customer 2 (Basic Plan)
    prisma.billingItem.create({
      data: {
        billingId: monthlyBill2.id,
        description: 'Basic Plan - Monthly Subscription',
        itemType: 'PLAN',
        planId: basicPlan.id,
        price: 199.0,
        quantity: 1
      }
    })
  ]);

  // ========================================
  // 11. CREATE BILLING HISTORY
  // ========================================
  console.log('📜 Creating billing history snapshots...');

  await Promise.all([
    prisma.billingHistory.create({
      data: {
        billingId: productSale.id,
        metadata: {
          customerName: customer1.name,
          items: ['HD Set Top Box'],
          paymentMethod: 'CASH',
          sellerName: dealer1.name,
          total: 2500.0
        }
      }
    }),
    prisma.billingHistory.create({
      data: {
        billingId: monthlyBill1.id,
        metadata: {
          customerName: customer1.name,
          items: ['Premium Plan Subscription'],
          paymentMethod: 'ONLINE',
          total: 399.0
        }
      }
    }),
    prisma.billingHistory.create({
      data: {
        billingId: monthlyBill2.id,
        metadata: {
          customerName: customer2.name,
          items: ['Basic Plan Subscription'],
          paymentMethod: 'PENDING',
          total: 199.0
        }
      }
    })
  ]);

  console.log('✅ Comprehensive seed completed successfully!');
  console.log('\n📊 Summary:');
  console.log(`👥 Users created: 7`);
  console.log(`📦 Inventory items: 3`);
  console.log(`📋 Plans: 3`);
  console.log(`📺 Channels: 8`);
  console.log(`🔗 Plan-Channel links: 18`);
  console.log(`📝 User plans: 2`);
  console.log(`📡 User channels: 8`);
  console.log(`📊 Channel history entries: 8`);
  console.log(`💰 Billings: 3`);
  console.log(`📋 Billing items: 3`);
  console.log(`📜 Billing history: 3`);

  console.log('\n🔐 Login credentials:');
  console.log('Email: any user email above');
  console.log('Password: password123');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

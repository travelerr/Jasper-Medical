const { db } = require("@vercel/postgres");
const {
  invoices,
  customers,
  revenue,
  users,
  roles,
  user_roles,
} = require("./placeholder-data.js");
const bcrypt = require("bcrypt");

async function seedUsers(client) {
  try {
    // Create the "users" table if it doesn't exist
    const createTable = await client.sql`
      CREATE TABLE IF NOT EXISTS users (
        user_id INT PRIMARY KEY UNIQUE,
        first_name VARCHAR(50) NOT NULL,
        last_name VARCHAR(50) NOT NULL,
        date_of_birth DATE,
        gender VARCHAR(10),
        phone_number VARCHAR(20),
        email VARCHAR(100) UNIQUE,
        password TEXT NULL,
        street VARCHAR(100),
        city VARCHAR(50),
        state VARCHAR(50),
        zipcode VARCHAR(20),
        height DECIMAL(5, 2),
        weight DECIMAL(5, 2)
      );
    `;

    console.log(`Created "users" table`);

    // Insert data into the "users" table
    const insertedUsers = await Promise.all(
      users.map(async (user) => {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        return client.sql`
        INSERT INTO users (
          user_id, 
          first_name, 
          last_name,
          date_of_birth,
          gender,
          phone_number,
          email,
          password,
          street,
          city,
          state,
          zipcode,
          height,
          weight
        )
        VALUES (
          ${user.user_id}, 
          ${user.first_name}, 
          ${user.last_name},
          ${user.date_of_birth}, 
          ${user.gender}, 
          ${user.phone_number}, 
          ${user.email}, 
          ${hashedPassword}, 
          ${user.street}, 
          ${user.city}, 
          ${user.state}, 
          ${user.zipcode}, 
          ${user.height}, 
          ${user.weight}
        )
        ON CONFLICT (user_id) DO NOTHING;
      `;
      })
    );

    console.log(`Seeded ${insertedUsers.length} users`);

    return {
      createTable,
      users: insertedUsers,
    };
  } catch (error) {
    console.error("Error seeding users:", error);
    throw error;
  }
}

async function seedRoles(client) {
  try {
    // Create the "roles" table if it doesn't exist
    const createTable = await client.sql`
      CREATE TABLE IF NOT EXISTS roles (
        role_id INT PRIMARY KEY UNIQUE,
        role_name VARCHAR(50) UNIQUE NOT NULL
      );
    `;

    console.log(`Created "roles" table`);

    // Insert data into the "roles" table
    const insertedRoles = await Promise.all(
      roles.map(async (role) => {
        return client.sql`
        INSERT INTO roles (role_id, role_name)
        VALUES (${role.id}, ${role.name})
        ON CONFLICT (role_id) DO NOTHING;
      `;
      })
    );

    console.log(`Seeded ${insertedRoles.length} roles`);

    return {
      createTable,
      roles: insertedRoles,
    };
  } catch (error) {
    console.error("Error seeding roles:", error);
    throw error;
  }
}

async function seedUserRoles(client) {
  try {
    // Create the "user_roles" table if it doesn't exist
    const createTable = await client.sql`
      CREATE TABLE IF NOT EXISTS user_roles (
        user_id INT,
        role_id INT,
        PRIMARY KEY (user_id, role_id),
        FOREIGN KEY (user_id) REFERENCES Users(user_id),
        FOREIGN KEY (role_id) REFERENCES Roles(role_id)
      );
    `;

    console.log(`Created "user_roles" table`);

    // Insert data into the "user_roles" table
    const insertedUserRoles = await Promise.all(
      user_roles.map(async (user_role) => {
        return client.sql`
        INSERT INTO user_roles (user_id, role_id)
        VALUES (${user_role.user_id}, ${user_role.role_id})
      `;
      })
    );

    console.log(`Seeded ${insertedUserRoles.length} user_roles`);

    return {
      createTable,
      roles: insertedUserRoles,
    };
  } catch (error) {
    console.error("Error seeding user_roles:", error);
    throw error;
  }
}

async function seedInvoices(client) {
  try {
    await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

    // Create the "invoices" table if it doesn't exist
    const createTable = await client.sql`
    CREATE TABLE IF NOT EXISTS invoices (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    customer_id UUID NOT NULL,
    amount INT NOT NULL,
    status VARCHAR(255) NOT NULL,
    date DATE NOT NULL
  );
`;

    console.log(`Created "invoices" table`);

    // Insert data into the "invoices" table
    const insertedInvoices = await Promise.all(
      invoices.map(
        (invoice) => client.sql`
        INSERT INTO invoices (customer_id, amount, status, date)
        VALUES (${invoice.customer_id}, ${invoice.amount}, ${invoice.status}, ${invoice.date})
        ON CONFLICT (id) DO NOTHING;
      `
      )
    );

    console.log(`Seeded ${insertedInvoices.length} invoices`);

    return {
      createTable,
      invoices: insertedInvoices,
    };
  } catch (error) {
    console.error("Error seeding invoices:", error);
    throw error;
  }
}

async function seedCustomers(client) {
  try {
    await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

    // Create the "customers" table if it doesn't exist
    const createTable = await client.sql`
      CREATE TABLE IF NOT EXISTS customers (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        image_url VARCHAR(255) NOT NULL
      );
    `;

    console.log(`Created "customers" table`);

    // Insert data into the "customers" table
    const insertedCustomers = await Promise.all(
      customers.map(
        (customer) => client.sql`
        INSERT INTO customers (id, name, email, image_url)
        VALUES (${customer.id}, ${customer.name}, ${customer.email}, ${customer.image_url})
        ON CONFLICT (id) DO NOTHING;
      `
      )
    );

    console.log(`Seeded ${insertedCustomers.length} customers`);

    return {
      createTable,
      customers: insertedCustomers,
    };
  } catch (error) {
    console.error("Error seeding customers:", error);
    throw error;
  }
}

async function seedRevenue(client) {
  try {
    // Create the "revenue" table if it doesn't exist
    const createTable = await client.sql`
      CREATE TABLE IF NOT EXISTS revenue (
        month VARCHAR(4) NOT NULL UNIQUE,
        revenue INT NOT NULL
      );
    `;

    console.log(`Created "revenue" table`);

    // Insert data into the "revenue" table
    const insertedRevenue = await Promise.all(
      revenue.map(
        (rev) => client.sql`
        INSERT INTO revenue (month, revenue)
        VALUES (${rev.month}, ${rev.revenue})
        ON CONFLICT (month) DO NOTHING;
      `
      )
    );

    console.log(`Seeded ${insertedRevenue.length} revenue`);

    return {
      createTable,
      revenue: insertedRevenue,
    };
  } catch (error) {
    console.error("Error seeding revenue:", error);
    throw error;
  }
}

async function main() {
  const client = await db.connect();

  // await seedUsers(client);
  await seedCustomers(client);
  await seedInvoices(client);
  await seedRevenue(client);
  // await seedUsers(client);
  // await seedRoles(client);
  // await seedUserRoles(client);
  await client.end();
}

main().catch((err) => {
  console.error(
    "An error occurred while attempting to seed the database:",
    err
  );
});

// CommonJS Prisma 7 config so the CLI can read DATABASE_URL at runtime.
module.exports = {
  datasources: {
    db: {
      provider: "postgresql",
      url: process.env.DATABASE_URL,
    },
  },
};

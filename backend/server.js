require("dotenv").config();

const app = require("./src/app");
const { testConnection } = require("./src/config/db");

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await testConnection();

    app.listen(PORT, () => {
      console.log(`\n✓ Server running on http://localhost:${PORT}`);
      console.log(`✓ API Health: http://localhost:${PORT}/api/health`);
    });
  } catch (error) {
    console.error("✗ Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();

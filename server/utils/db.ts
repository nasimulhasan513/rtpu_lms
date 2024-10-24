import pg from "pg";

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});

export const query = async (text: string, params?: any[]) => {
  try {
    console.log("====================================");
    console.log(text, params);
    console.log("====================================");
    const result = await pool.query(text, params);
    if (result && result.rows) {
      return result.rows;
    }
    return [];
  } catch (error) {
    console.error("Database query error:", error);
    throw error;
  }
};

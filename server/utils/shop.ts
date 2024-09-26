import axios from "axios";
const BASE_URL = "https://shop.aparsclassroom.com/query";

async function checkTransaction(
  tran_id: string | null,
  phone: string | null,
  email: string | null
) {
  const checks = [
    { condition: phone, func: () => ACS_COURSES_PHONE(phone) },
    { condition: tran_id, func: () => ASG_SHOP_TRANSACTION(tran_id) },
    { condition: email, func: () => ACS_COURSES_EMAIL(email) },
  ];

  for (const check of checks) {
    if (check.condition) {
      const result = await check.func();
      if (result) return result;
    }
  }

  return "Please provide a valid tran_id, phone, or email as query parameters.";
}

async function makeRequest(endpoint, identifier) {
  try {
    const response = await axios.post(`${BASE_URL}/${endpoint}`, identifier, {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching data from ${endpoint}:`, error.message);
    return null;
  }
}

function processTransactions(tranx) {
  if (!tranx || tranx.length === 0) return false;

  const validTransactions = tranx.filter((t) => t.status === "VALID");
  if (validTransactions.length === 0) return false;

  const firstValid = validTransactions[0];
  return {
    Name: firstValid.Name,
    Email: firstValid.Email,
    Phone: firstValid.Phone,
    Institution: firstValid.Institution,
    HSC: firstValid.HSC,
    courses: validTransactions.map((t) => t.ProductName),
  };
}

async function ACS_COURSES_PHONE(phone: string) {
  const data = await makeRequest(
    "phone",
    `phone=${encodeURIComponent("+88" + phone)}`
  );
  return data ? processTransactions(data.tranx) : false;
}

async function ACS_COURSES_EMAIL(email: string) {
  const data = await makeRequest("email", `email=${encodeURIComponent(email)}`);
  return data ? processTransactions(data.tranx) : false;
}

async function ASG_SHOP_TRANSACTION(tran_id: string) {
  const data = await makeRequest(
    "transaction",
    `tran_id=${encodeURIComponent(tran_id)}`
  );
  if (!data || !data.tranx || data.tranx.status !== "VALID") return false;

  return {
    Name: data.tranx.Name,
    Email: data.tranx.Email,
    Phone: data.tranx.Phone,
    Institution: data.tranx.Institution,
    HSC: data.tranx.HSC,
    course: data.tranx.ProductName,
    Cycle: data.tranx.Product?.Cycle,
  };
}

export {
  checkTransaction,
  ACS_COURSES_PHONE,
  ACS_COURSES_EMAIL,
  ASG_SHOP_TRANSACTION,
};

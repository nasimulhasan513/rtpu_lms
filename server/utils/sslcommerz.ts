// @ts-ignore
import SSLCommerzPayment from "sslcommerz-lts";

const store_id = process.env.SSLCZ_STORE_ID;
const store_passwd = process.env.SSLCZ_STORE_PASSWORD;
const is_live = process.env.SSLCZ_TESTMODE === "false";
const sslcommerz = new SSLCommerzPayment(store_id, store_passwd, is_live);

export { sslcommerz };

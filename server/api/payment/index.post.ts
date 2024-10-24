export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { order, transactionId, payableAmount, gateway } = body;

  return await handleSSLCommerzPayment(order, transactionId, payableAmount, gateway);
});







async function handleSSLCommerzPayment(
  order: any,
  transactionId: string,
  payableAmount: number,
  gateway: string
) {
  const payload = {
    total_amount: payableAmount,
    currency: "BDT",
    tran_id: transactionId,
    success_url: `${process.env.BASE_URL}/api/payment/success`,
    fail_url: `${process.env.BASE_URL}/payment/failed`,
    cancel_url: `${process.env.BASE_URL}/payment/failed`,
    ipn_url: `${process.env.BASE_URL}/api/payment/ipn`,
    cus_name: order.name,
    cus_email: order.user.email || "rhombus@gmail.com",
    cus_add1: order.shipping_address,
    cus_city: order.district,
    cus_postcode: "2580",
    cus_country: "BD",
    cus_phone: order.phone,
    shipping_method: "NO",
    product_name: "online book store",
    product_category: "Ecommerce",
    product_profile: "general",
    value_a: order.id,
  };

  const data = await sslcommerz.init(payload);
  if (data.status === "SUCCESS") {
    const gatewayData = data.desc.find((d) => d.name === gateway);
    return gatewayData
      ? gatewayData.redirectGatewayURL
      : data.redirectGatewayURL;
  } else {
    return createError({
      statusCode: 500,
      statusMessage: "Failed to initiate payment",
    });
  }
}

export default defineEventHandler(async (event) => {
  await validateRequest(event);

  const body = await readBody(event);
  const { slug, gateway } = body;

  const user_id = event.context.user?.id;

  let enrollment = await db.courseEnrollment.findFirst({
    where: { course: { slug }, user_id },
    include: {
      course: {
        select: {
          id: true,
          name: true,
        },
      },
      user: {
        select: {
          name: true,
          email: true,
          phone: true,
        },
      },
    },
  });

  if (!enrollment) {
    return createError({
      statusCode: 404,
      statusMessage: "Enrollment not found",
    });
  }

  const transactionId = `${enrollment.course.id}-${user_id}-${Date.now()}`;

  return await handleSSLCommerzPayment(
    enrollment,
    transactionId,
    enrollment.payable_amount,
    gateway
  );
});

async function handleSSLCommerzPayment(
  enrollment: any,
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
    cus_name: enrollment.user.name,
    cus_email: enrollment.user.email || "shahriarsir02@gmail.com",
    cus_add1: enrollment.user.address,
    cus_city: enrollment.user.district,
    cus_postcode: "2580",
    cus_country: "BD",
    cus_phone: enrollment.user.phone || "01646915232",
    shipping_method: "NO",
    product_name: enrollment.course.name,
    product_category: "Ecommerce",
    product_profile: "general",
    value_a: enrollment.id,
  };

  const data = await sslcommerz.init(payload);
 
  if (data.status === "SUCCESS") {
    const gatewayData = data.desc.find((d: any) => d.name === gateway);
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

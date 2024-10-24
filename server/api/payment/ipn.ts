export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { tran_id, value_a, val_id, card_type, bank_tran_id, store_amount } =
      body;

    await sslcommerz.validate({
      val_id,
    });

    return true;
  } catch (error) {
    return createError({
      statusCode: 400,
      statusMessage: "Payment failed",
    });
  }
});

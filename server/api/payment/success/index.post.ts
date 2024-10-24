export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { tran_id, value_a, val_id, card_type, bank_tran_id, store_amount } =
      body;

    const isVerified = await sslcommerz.validate({
      val_id,
    });

    if (!isVerified) {
      return sendRedirect(event, `/payment/failed`);
    }

    const enrollment = await db.courseEnrollment.findFirst({
      where: {
        id: parseInt(value_a),
      },
    });

    if (!enrollment) {
      return sendRedirect(event, `/payment/failed`);
    }

    await db.courseEnrollment.update({
      where: {
        id: parseInt(value_a),
      },
      data: {
        gateway_response: {
          val_id,
          card_type,
          bank_tran_id,
        },
        paid_amount: parseFloat(store_amount),
        enrolled_at: new Date(),
        status: "success",
      },
    });

    // send sms

    return sendRedirect(event, `/payment/${enrollment.id}/success`);
  } catch (error) {
    console.error(error);
    return createError({
      statusCode: 400,
      statusMessage: "Payment failed",
    });
  }
});

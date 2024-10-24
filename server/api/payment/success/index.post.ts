
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

  



   

    const user = await db.user.findFirst({
      where: {
        id: order.userId,
      },
      select: {
        name: true,
      },
    });

    if (!user) {
      return createError({
        statusCode: 400,
        statusMessage: "User not found",
      });
    }


    if (order.phone) {
      const sms = `Dear ${order.name},\nYour order has been placed successfully. Your Order No is ${tran_id}.\nThank you. \n- Rhombus Publications`;
      await sendSMS(order.phone, sms);
    }
    return sendRedirect(event, `/payment/${tran_id}/success`);
  } catch (error) {
    console.error(error);
    return createError({
      statusCode: 400,
      statusMessage: "Payment failed",
    });
  }
});

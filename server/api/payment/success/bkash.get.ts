export default defineEventHandler(async (event) => {
  try {
    const body = await getQuery(event);
    const paymentID = body?.paymentID;

    if (!paymentID) {
      return createError({
        statusCode: 400,
        statusMessage: "Payment ID not found",
      });
    }

  
  } catch (error) {
    console.log("====================================");
    console.log(error);
    console.log("====================================");
  }
});

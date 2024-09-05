export default defineEventHandler(async (event) => {
  const query = getQuery(event);

  //   setCookie(event, "test", "test1", {
  //     path: "/",
  //     secure: process.env.NODE_ENV === "production",
  //     httpOnly: true,
  //     maxAge: 60 * 10,
  //     sameSite: "lax",
  //   });

  let data = getCookie(event, "google_oauth_code_verifier");

  return data;
});

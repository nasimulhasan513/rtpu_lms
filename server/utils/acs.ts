export interface ASG_SHOP_RESPONSE {
  name: string;
  email: string;
  phone: string;
  institution: string;
  hsc_batch: string;
  course: string;
  cycle: string;
}

export const ASG_SHOP = async (tran_id: string, slug: string) => {
  try {
    const data = await ASG_SHOP_TRANSACTION(tran_id);

    if (!data) {
      return false;
    }

    const result: ASG_SHOP_RESPONSE = {
      name: data.Name,
      email: data.Email,
      phone: data.Phone,
      institution: data.Institution,
      hsc_batch: data.HSC,
      course: data.course,
      cycle: data.Cycle,
    };

    const productName = slug.split("-")[0].toLowerCase();
    const cycle = slug.split("-")[1]?.toLowerCase()?.replace("c", "Cycle-");
    const courseName = data.course.toLowerCase();

    if (productName === courseName) {
      if (cycle) {
        if (data.Cycle && data.Cycle === cycle) {
          return result;
        } else {
          return false;
        }
      } else {
        return result;
      }
    }

    return false;
  } catch (error) {
    console.error("Error fetching transaction data:", error);
    return "Error fetching data";
  }
};

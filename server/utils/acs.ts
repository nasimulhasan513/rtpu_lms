import axios from "axios";

export interface ASG_SHOP_RESPONSE {
  name: string;
  email: string;
  phone: string;
  institution: string;
  hsc_batch: string;
  courses: string[];
}



export const ASG_SHOP = async (
  tran_id: string,
  phone: string,
  email: string
) => {
  try {
    const { data } = await axios.get(
      "https://script.google.com/macros/s/AKfycbyH0QJI7s7-VV3u8LJeWgkhc509UYbfLh4-BPx3ysjz9d5Dxgj0i2xiucVS6P2yf7Rv/exec",
      {
        params: {
          tran_id,
          phone,
          email,
        },
      }
    );
    const result: ASG_SHOP_RESPONSE = {
      name: data.Name,
      email: data.Email,
      phone: data.Phone,
      institution: data.Institution,
      hsc_batch: data.HSC,
      courses: data.courses,
    };

    return result;
  } catch (error) {
    console.error("Error fetching transaction data:", error);
    return "Error fetching data";
  }
};

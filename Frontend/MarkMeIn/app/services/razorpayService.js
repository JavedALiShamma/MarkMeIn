import RazorpayCheckout from "react-native-razorpay";
import axios from "axios";
import API_URLS from "../config/apiUrl";

export const startRazorpayPayment = async ({
  planId,
  user,
  token,
}) => {
  try {
    // 1️⃣ Create order (backend)
    const { data } = await axios.post(
      `${API_URLS.PAYMENT}/create-order`,
      { planId }, // ✅ BODY
      {
        headers: {
          Authorization: `Bearer ${token}`, // ✅ CONFIG
        },
      }
    );
    console.log("Order created:", data);
    const options = {
      key: "rzp_test_S9OxoYUz5Bhc01", // public key
      amount: data.amount,
      currency: "INR",
      order_id: data.orderId,
      name: "MarkMeIn",
      description: data.planName,
      prefill: {
        email: user.email,
        contact: user.mobile,
      },
      theme: { color: "#2563eb" },
    };

    // 2️⃣ Open Razorpay UI
    const response = await RazorpayCheckout.open(options);

       const paymentResult =await axios.post(
      `${API_URLS.PAYMENT}/verify-payment`,
      {
        razorpay_order_id: response.razorpay_order_id,
        razorpay_payment_id: response.razorpay_payment_id,
        razorpay_signature: response.razorpay_signature,
        paymentId: data.paymentId,
      }, // ✅ BODY
      {
        headers: {
          Authorization: `Bearer ${token}`, // ✅ CONFIG
        },
      }
    );
    console.log("Payment verification result:", paymentResult.data);
    if(!paymentResult.data.success){
      return { success: false };
    }
   
    // 3️⃣ Verify payment (backend)
    // ✅ ALWAYS treat as success once Razorpay succeeds
    return { success: true };

    
  } catch (error) {
    if (error?.code === 0) {
      // Razorpay cancelled
      return { success: false, cancelled: true };
    }

    console.error("Razorpay error:", error?.response?.data || error);
    return { success: false };
  }
};

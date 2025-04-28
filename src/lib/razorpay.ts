import Razorpay from 'razorpay'

console.log('Razorpay Key ID:', process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID)
console.log('Razorpay Secret Key:', process.env.RAZORPAY_SECRET_ID)
export const razorpay = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_SECRET_ID!,
})

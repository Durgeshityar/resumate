'use server'

import { Resend } from 'resend'

// Server-side only API key access
const resend = new Resend(process.env.RESEND_API_KEY!)
console.log(process.env.RESEND_API_KEY)

const URL = process.env.BASE_URL

export const sendTwoFactorTokenEmail = async (email: string, token: string) => {
  await resend.emails.send({
    from: 'onboarding@resumate.app',
    to: email,
    subject: '2FA code',
    html: `<p> Your 2FA code: ${token}</p>`,
  })
}

export const sendPasswordResetEmail = async (emial: string, token: string) => {
  const resetLink = `${URL}/auth/new-password?token=${token}`

  await resend.emails.send({
    from: 'onboarding@resumate.sbs',
    to: emial,
    subject: 'Reset your password',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              color: #333333;
              line-height: 1.6;
              margin: 0;
              padding: 0;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              background-color: #f9f9f9;
            }
            .header {
              text-align: center;
              padding: 20px 0;
              background-color: #4F46E5;
              color: white;
              border-radius: 5px 5px 0 0;
            }
            .content {
              padding: 30px;
              background-color: white;
              border-radius: 0 0 5px 5px;
              box-shadow: 0 2px 5px rgba(0,0,0,0.1);
            }
            .button {
              display: inline-block;
              padding: 12px 24px;
              background-color: #4F46E5;
              color: white !important;
              text-decoration: none;
              border-radius: 4px;
              font-weight: bold;
              margin: 20px 0;
            }
            .footer {
              text-align: center;
              color: #888888;
              font-size: 12px;
              margin-top: 20px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Resumate</h1>
            </div>
            <div class="content">
              <h2>Reset Your Password</h2>
              <p>You requested to reset your password. Click the button below to create a new password for your Resumate account.</p>
              <div style="text-align: center;">
                <a href="${resetLink}" class="button" style="color: white !important; background-color: #4F46E5; text-decoration: none; padding: 12px 24px; border-radius: 4px; font-weight: bold; display: inline-block;">Reset Password</a>
              </div>
              <p>If you did not request a password reset, you can safely ignore this email.</p>
            </div>
            <div class="footer">
              <p>&copy; ${new Date().getFullYear()} Resumate. All rights reserved.</p>
              <p>This is an automated email, please do not reply.</p>
            </div>
          </div>
        </body>
      </html>
    `,
  })
}

export const sendVerificationEmail = async (email: string, token: string) => {
  const confirmLink = `${URL}/auth/new-verification?token=${token}`
  await resend.emails.send({
    from: 'onboarding@resumate.sbs',
    to: email,
    subject: 'Confirm your email',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              color: #333333;
              line-height: 1.6;
              margin: 0;
              padding: 0;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              background-color: #f9f9f9;
            }
            .header {
              text-align: center;
              padding: 20px 0;
              background-color: #4F46E5;
              color: white;
              border-radius: 5px 5px 0 0;
            }
            .content {
              padding: 30px;
              background-color: white;
              border-radius: 0 0 5px 5px;
              box-shadow: 0 2px 5px rgba(0,0,0,0.1);
            }
            .button {
              display: inline-block;
              padding: 12px 24px;
              background-color: #4F46E5;
              color: white !important;
              text-decoration: none;
              border-radius: 4px;
              font-weight: bold;
              margin: 20px 0;
            }
            .footer {
              text-align: center;
              color: #888888;
              font-size: 12px;
              margin-top: 20px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Resumate</h1>
            </div>
            <div class="content">
              <h2>Verify Your Email Address</h2>
              <p>Thank you for signing up with Resumate! Please verify your email address to complete your registration.</p>
              <div style="text-align: center;">
                <a href="${confirmLink}" class="button" style="color: white !important; background-color: #4F46E5; text-decoration: none; padding: 12px 24px; border-radius: 4px; font-weight: bold; display: inline-block;">Verify Email Address</a>
              </div>
              <p>If you did not sign up for a Resumate account, you can safely ignore this email.</p>
            </div>
            <div class="footer">
              <p>&copy; ${new Date().getFullYear()} Resumate. All rights reserved.</p>
              <p>This is an automated email, please do not reply.</p>
            </div>
          </div>
        </body>
      </html>
    `,
  })
}

export const sendPaymentSuccessEmail = async (email: string, plan: string) => {
  await resend.emails.send({
    from: 'pro@resumate.sbs',
    to: email,
    subject: 'Payment successful',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              color: #333333;
              line-height: 1.6;
              margin: 0;
              padding: 0;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              background-color: #f9f9f9;
            }
            .header {
              text-align: center;
              padding: 20px 0;
              background-color: #4F46E5;
              color: white;
              border-radius: 5px 5px 0 0;
            }
            .content {
              padding: 30px;
              background-color: white;
              border-radius: 0 0 5px 5px;
              box-shadow: 0 2px 5px rgba(0,0,0,0.1);
            }
            .button {
              display: inline-block;
              padding: 12px 24px;
              background-color: #4F46E5;
              color: white !important;
              text-decoration: none;
              border-radius: 4px;
              font-weight: bold;
              margin: 20px 0;
            }
            .plan-badge {
              display: inline-block;
              padding: 8px 16px;
              background-color: #4F46E5;
              color: white;
              border-radius: 20px;
              font-weight: bold;
              margin: 10px 0;
            }
            .footer {
              text-align: center;
              color: #888888;
              font-size: 12px;
              margin-top: 20px;
            }
            .checkmark {
              width: 80px;
              height: 80px;
              border-radius: 50%;
              display: block;
              margin: 0 auto 20px;
              background-color: #4caf50;
              text-align: center;
              line-height: 80px;
              font-size: 40px;
              color: white;
              font-weight: bold;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Resumate</h1>
            </div>
            <div class="content">
              <div class="checkmark">✓</div>
              <h2 style="text-align: center;">Payment Successful!</h2>
              <p style="text-align: center;">Thank you for your payment. Your subscription has been successfully activated.</p>
              <div style="text-align: center;">
                <div class="plan-badge">${plan} Plan</div>
              </div>
              <p>You now have access to all the premium features offered in the ${plan} plan. Start creating outstanding resumes today!</p>
              <div style="text-align: center; margin-top: 30px;">
                <a href="${URL}/resumes" class="button" style="color: white !important; background-color: #4F46E5; text-decoration: none; padding: 12px 24px; border-radius: 4px; font-weight: bold; display: inline-block;">Go to Dashboard</a>
              </div>
            </div>
            <div class="footer">
              <p>&copy; ${new Date().getFullYear()} Resumate. All rights reserved.</p>
              <p>This is an automated email, please do not reply.</p>
            </div>
          </div>
        </body>
      </html>
    `,
  })
}

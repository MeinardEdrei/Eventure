using System.Net;
using System.Net.Mail;
using Microsoft.Extensions.Configuration;

public class EmailServicePassword 
{
    private readonly IConfiguration _configuration;

    public EmailServicePassword(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    public string sendEmail(string email, string emailSubject, string resetCode, string firstName)
    {
        MailAddress fromAddress = new MailAddress("official.eventure@gmail.com", "Eventure");
        MailAddress toAddress = new MailAddress(email, firstName);
        string fromPassword = _configuration["EMAIL_PASSWORD_SECRET"]; // Use your App Password here

        SmtpClient smtp = new SmtpClient
        {
            Host = "smtp.gmail.com",
            Port = 587,
            EnableSsl = true,
            DeliveryMethod = SmtpDeliveryMethod.Network,
            UseDefaultCredentials = false,
            Credentials = new NetworkCredential(fromAddress.Address, fromPassword)
        };

        MailMessage message = new MailMessage(fromAddress, toAddress)
        {
            Subject = emailSubject,
            IsBodyHtml = true,
            Priority = MailPriority.High
        };

        message.Body = $@"
            <html>
            <body style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;'>
                <div style='background-color: #f4f4f4; padding: 20px; text-align: center;'>
                    <h1 style='color: #d9534f;'>🔒 Password Reset Request</h1>
                </div>
                <div style='padding: 20px;'>
                    <h2>Hello {firstName},</h2>
                    <p>We received a request to reset your password. Please use the following code to reset your password:</p>
                    <h3 style='font-weight: bold; color: #333;'>{resetCode}</h3>
                    <p>This code will expire in 1 hour.</p>
                    <div style='background-color: #ffdddd; border-left: 6px solid #f44336; padding: 10px; margin: 15px 0;'>
                        <p><strong>Action Required:</strong> Enter the code on the reset password page to proceed.</p>
                    </div>
                    <p>If you did not request a password reset, please ignore this email.</p>
                    <p>Best regards,<br>Eventure Team</p>
                </div>
            </body>
            </html>";

        try
        {
            smtp.Send(message);
            return "Email sent successfully.";
        }
        catch (SmtpException smtpEx)
        {
            return $"SMTP Error: {smtpEx.StatusCode}, Failed to send email. Error: {smtpEx.Message}";
        }
        catch (Exception ex)
        {
            return $"Failed to send email. Error: {ex.Message}";
        }
    }
}
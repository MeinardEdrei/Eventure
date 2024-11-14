using System.Net;
using System.Net.Mail;
using Microsoft.Extensions.Configuration;

public class EmailService 
{
    private readonly IConfiguration _configuration;

    public EmailService(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    public string sendEmail(string email, string emailSubject, string emailBody, string firstName)
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
            Body = emailBody,
            IsBodyHtml = true,
            Priority = MailPriority.High
        };

        message.Body = $@"
            <html>
            <body style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;'>
                <div style='background-color: #f4f4f4; padding: 20px; text-align: center;'>
                    <h1 style='color: #d9534f;'>🚨 Important Event Notification 🚨</h1>
                </div>
                <div style='padding: 20px;'>
                    <h2>Event Registration Confirmation</h2>
                    <p>Dear {firstName},</p>
                    <p style='font-weight: bold; color: #333;'>{emailBody}</p>
                    <div style='background-color: #ffdddd; border-left: 6px solid #f44336; padding: 10px; margin: 15px 0;'>
                        <p><strong>Action Required:</strong> Please confirm your attendance.</p>
                    </div>
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

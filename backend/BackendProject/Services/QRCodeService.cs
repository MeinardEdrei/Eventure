using QRCoder;
using System;
using System.Drawing;
using System.IO;

public class QRCodeService 
{
    public async Task<string> GenerateQRCode(string data)
    {
        // Create QR Code Generator
        QRCodeGenerator qrGenerator = new QRCodeGenerator();
        
        // Create QR Code Data
        QRCodeData qrCodeData = qrGenerator.CreateQrCode(data, QRCodeGenerator.ECCLevel.Q);
        
        // Create QR Code Image with transparent background
        PngByteQRCode qrCode = new PngByteQRCode(qrCodeData);
        
        // Generate PNG byte array with transparent background
        byte[] qrCodeImage = qrCode.GetGraphic(
            pixelsPerModule: 10, 
            darkColor: Color.Black, 
            lightColor: Color.Transparent
        );
        
        // Convert to base64 string for easy transmission
        return Convert.ToBase64String(qrCodeImage);
    }
}
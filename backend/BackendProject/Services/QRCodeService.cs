using System.Net.Http;
using System.IO;
using System.Threading.Tasks;

public class QRCodeService 
{
  public async Task<byte[]> GenerateQRCode(string data)
  {
    string url = $"https://api.qrserver.com/v1/create-qr-code/?size=150x150&data={data}";
    using (HttpClient client = new HttpClient())
    {
        // Fetch the QR code image from the API
        byte[] qrCodeImage = await client.GetByteArrayAsync(url);
        return qrCodeImage;
    }
  }
}
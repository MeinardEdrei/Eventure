import "./globals.css";

export const metadata = {
  title: "Eventure",
  description: "Web Application by UMAK Computer Science Students in II-BCSAD",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}

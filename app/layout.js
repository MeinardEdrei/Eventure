import Provider from "@/lib/Provider";
import Header from "./components/Header";
import "./globals.css";

export const metadata = {
  title: "Eventure",
  description: "Web Application by UMAK Computer Science Students in II-BCSAD",
  icons: {
    icon: '/logo.png'
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Provider>
          <Header/>
          {children}
        </Provider>
      </body>
    </html>
  );
}

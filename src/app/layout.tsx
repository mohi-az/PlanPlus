import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {
  title: 'PlanPlus',

}

export default function RootLayout({ children, }: Readonly<{ children: React.ReactNode; }>) {
  return (
    <html lang="en" data-theme="dim" id="test" >
      
      <body >
          {children}
      </body>
    </html>
  );
}

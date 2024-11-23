import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Container from "@/lib/container";

export const metadata: Metadata = {
  title: 'PlanPlus',

}

export default function RootLayout({ children, }: Readonly<{ children: React.ReactNode; }>) {
  return (
    <html lang="en" data-theme="dim" >
      <body >
        <Container >
          {children}
        </Container>
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Container from "@/lib/container";



export default function RootLayout({ children, }: Readonly<{ children: React.ReactNode; }>) {
  return (
    <html lang="en" data-theme="night">
      <body >
        <Container >
          {children}
        </Container>
      </body>
    </html>
  );
}

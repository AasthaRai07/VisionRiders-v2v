import { Epilogue, Fira_Sans, Archivo_Narrow } from "next/font/google";
import "./globals.css";

const epilogue = Epilogue({
  variable: "--font-epilogue",
  subsets: ["latin"],
});

const firaSans = Fira_Sans({
  variable: "--font-fira-sans",
  weight: ["400", "500", "600"],
  subsets: ["latin"],
});

const archivoNarrow = Archivo_Narrow({
  variable: "--font-archivo-narrow",
  subsets: ["latin"],
});

export const metadata = {
  title: "HerNova - PDF to Website Generator",
  description: "A platform dedicated to women's education, financial literacy, and career advancement.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${epilogue.variable} ${firaSans.variable} ${archivoNarrow.variable}`}>
      <body>{children}</body>
    </html>
  );
}

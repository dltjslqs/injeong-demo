// The site's fonts, served from this site instead of jsDelivr and Google Fonts (they held up the first paint).
// Pretendard: the variable font split by character range, so a page downloads only the pieces its text uses.
import "pretendard/dist/web/variable/pretendardvariable-dynamic-subset.css";
import { Archivo } from "next/font/google";

// Archivo (numbers and English accents), downloaded at build time; its family is in --font-archivo
export const archivo = Archivo({ weight: ["700", "800"], subsets: ["latin"], display: "swap", variable: "--font-archivo" });

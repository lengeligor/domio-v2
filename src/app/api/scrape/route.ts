import { NextResponse } from "next/server";
import * as cheerio from "cheerio";

export async function POST(request: Request) {
  try {
    const { url } = await request.json();

    if (!url || !url.includes("nehnutelnosti.sk")) {
      return NextResponse.json(
        { error: "Neplatná URL. Podporujeme len nehnutelnosti.sk." },
        { status: 400 }
      );
    }

    const response = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Nepodarilo sa načítať stránku." },
        { status: 502 }
      );
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    // Parse data from the page
    const title =
      $("h1").first().text().trim() ||
      $('meta[property="og:title"]').attr("content") ||
      "";

    const description =
      $(".description-text, .property-description, [class*=description]")
        .first()
        .text()
        .trim() ||
      $('meta[property="og:description"]').attr("content") ||
      "";

    // Price parsing
    const priceText =
      $(".price, [class*=price]").first().text().trim() || "";
    const priceMatch = priceText.replace(/\s/g, "").match(/[\d,]+/);
    const price = priceMatch
      ? parseFloat(priceMatch[0].replace(",", "."))
      : null;

    // Area parsing
    const areaText = $("body").text();
    const areaMatch = areaText.match(/(\d+(?:[.,]\d+)?)\s*m[²2]/);
    const area = areaMatch
      ? parseFloat(areaMatch[1].replace(",", "."))
      : null;

    // Rooms parsing
    const roomsMatch = areaText.match(
      /(\d+)\s*-?\s*(?:izb|izbov|room)/i
    );
    const rooms = roomsMatch ? parseInt(roomsMatch[1]) : null;

    // Images
    const images: string[] = [];
    $("img[src*=nehnutelnosti], img[src*=cdn], img[data-src]").each(
      (_, el) => {
        const src =
          $(el).attr("data-src") || $(el).attr("src") || "";
        if (src && !src.includes("logo") && !src.includes("icon")) {
          images.push(src);
        }
      }
    );

    return NextResponse.json({
      title,
      description,
      price,
      area,
      rooms,
      images: images.slice(0, 10),
      source_url: url,
    });
  } catch {
    return NextResponse.json(
      { error: "Nepodarilo sa spracovať URL." },
      { status: 500 }
    );
  }
}

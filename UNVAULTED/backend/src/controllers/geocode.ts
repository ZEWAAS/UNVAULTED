import { Request, Response } from "express";

export const nominatimProxy = async (req: Request, res: Response) => {
  const q = req.query.q as string;

  if (!q) {
    return res.status(400).json({ error: "Missing 'q' parameter" });
  }

  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
    q
  )}&format=json&limit=10&addressdetails=1`;

  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": "UNVAULTED (student project) <your-contact@example.com>",
        "Accept-Language": "en",
      },
    });

    if (!response.ok) {
      return res
        .status(response.status)
        .json({ error: "Nominatim request failed" });
    }

    const data = await response.json();
    return res.json(data);
  } catch (err) {
    console.error("Nominatim proxy error:", err);
    return res.status(500).json({ error: "Nominatim request failed" });
  }
};

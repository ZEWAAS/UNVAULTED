import { Request, Response } from "express";
let lastRequestTime = 0;

export const nominatimProxy = async (req: Request, res: Response) => {
  const q = req.query.q as string;

  if (!q) {
    return res.status(400).json({ error: "Missing 'q' parameter" });
  }

  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
    q
  )}&format=json&limit=10&addressdetails=1`;

  try {
    const now = Date.now();
    if (now - lastRequestTime < 1100) {
      return res.status(429).json({ error: "Too many requests" });
    }

    lastRequestTime = now;
    const response = await fetch(url, {
      headers: {
        "User-Agent":
          "UNVAULTED-HTL-Dornbirn/1.0 (contact: simon.wallner@student.htl-dornbirn.at)",
        Accept: "application/json",
        Referer: "http://localhost:3000",
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

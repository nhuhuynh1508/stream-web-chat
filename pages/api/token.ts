import type { NextApiRequest, NextApiResponse } from "next";
import { StreamChat } from "stream-chat";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    const { userId } = req.body as { userId?: string };

    if (!userId) {
      return res.status(400).json({ error: "Missing userId" });
    }

    const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY;
    const apiSecret = process.env.STREAM_API_SECRET;

    if (!apiKey || !apiSecret) {
      throw new Error("Missing Stream API credentials in your environment variables.");
    }

    const serverClient = StreamChat.getInstance(apiKey, apiSecret);

    const safeId = userId.toLowerCase().replace(/[^a-z0-9@_-]/g, "-");

    await serverClient.upsertUser({
      id: safeId,
      name: safeId,
      image: `https://api.dicebear.com/6.x/thumbs/svg?seed=${safeId}`,
    });

    const token = serverClient.createToken(safeId);

    return res.status(200).json({ token });
  } catch (err: any) {
    console.error("Error generating token:", err);
    return res.status(500).json({ error: err.message || "Internal Server Error" });
  }
}


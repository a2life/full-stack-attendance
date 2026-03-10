import { Router, Request, Response } from "express";
import EventSheet from "../models/EventSheet";

const router = Router();

// Get all event sheets (summary)
router.get("/", async (_req: Request, res: Response) => {
  try {
    const sheets = await EventSheet.find()
      .select("eventName eventDate createdAt attendance")
      .sort({ createdAt: -1 });
    res.json(sheets);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch event sheets" });
  }
});

// Get single event sheet
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const sheet = await EventSheet.findById(req.params.id);
    if (!sheet) return res.status(404).json({ error: "Event sheet not found" });
    res.json(sheet);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch event sheet" });
  }
});

// Create event sheet
router.post("/", async (req: Request, res: Response) => {
  try {
    const sheet = new EventSheet(req.body);
    await sheet.save();
    res.status(201).json(sheet);
  } catch (err) {
    res.status(400).json({ error: "Failed to create event sheet" });
  }
});

// Delete event sheet
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    await EventSheet.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete event sheet" });
  }
});

export default router;

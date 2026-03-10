import { Router, Request, Response } from "express";
import Member from "../models/Member";

const router = Router();

router.get("/", async (_req: Request, res: Response) => {
  try {
    const members = await Member.find().sort({ memberId: 1 });
    res.json(members);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch members" });
  }
});

router.post("/", async (req: Request, res: Response) => {
  try {
    const member = new Member(req.body);
    await member.save();
    res.status(201).json(member);
  } catch (err: any) {
    if (err.code === 11000) {
      return res.status(409).json({ error: "Member ID already exists" });
    }
    res.status(400).json({ error: "Failed to create member" });
  }
});

router.put("/:id", async (req: Request, res: Response) => {
  try {
    const member = await Member.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!member) return res.status(404).json({ error: "Member not found" });
    res.json(member);
  } catch (err: any) {
    if (err.code === 11000) {
      return res.status(409).json({ error: "Member ID already exists" });
    }
    res.status(400).json({ error: "Failed to update member" });
  }
});

router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const member = await Member.findByIdAndDelete(req.params.id);
    if (!member) return res.status(404).json({ error: "Member not found" });
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete member" });
  }
});

export default router;

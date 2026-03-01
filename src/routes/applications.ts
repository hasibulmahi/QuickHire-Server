import { Router, Request, Response } from "express";
import mongoose from "mongoose";
import { Application } from "../models/Application";
import { Job } from "../models/Job";

const router = Router();

// POST /api/applications – Submit job application
router.post("/", async (req: Request, res: Response) => {
  try {
    const body = req.body as {
      job_id?: string;
      jobId?: string;
      name?: string;
      email?: string;
      resume_link?: string;
      resumeUrl?: string;
      cover_note?: string;
      coverNote?: string;
    };
    const jobId = body.job_id ?? body.jobId;
    const name = (body.name ?? "").trim();
    const email = (body.email ?? "").trim();
    const resume_link = (body.resume_link ?? body.resumeUrl ?? "").trim();
    const cover_note = (body.cover_note ?? body.coverNote ?? "").trim();

    if (!jobId) {
      res.status(400).json({ error: "job_id (or jobId) is required" });
      return;
    }
    if (!name) {
      res.status(400).json({ error: "name is required" });
      return;
    }
    if (!email) {
      res.status(400).json({ error: "email is required" });
      return;
    }
    if (!resume_link) {
      res.status(400).json({ error: "resume_link (or resumeUrl) is required" });
      return;
    }

    if (!mongoose.isValidObjectId(jobId)) {
      res.status(400).json({ error: "Invalid job id" });
      return;
    }
    const jobExists = await Job.findById(jobId);
    if (!jobExists) {
      res.status(404).json({ error: "Job not found" });
      return;
    }

    const application = await Application.create({
      job_id: new mongoose.Types.ObjectId(jobId),
      name,
      email,
      resume_link,
      cover_note,
    });
    const created = application.toJSON();
    res.status(201).json(created);
  } catch (err) {
    console.error("POST /api/applications error:", err);
    res.status(500).json({ error: "Failed to submit application" });
  }
});

export default router;

import { Router, Request, Response } from "express";
import mongoose from "mongoose";
import { Job } from "../models/Job";
import { requireAdmin } from "../middleware/auth";

const router = Router();

// GET /api/jobs – List all jobs
router.get("/", async (_req: Request, res: Response) => {
  try {
    const jobs = await Job.find().sort({ createdAt: -1 }).lean();
    const list = jobs.map((j) => {
      const id = (j as { _id: mongoose.Types.ObjectId })._id.toString();
      return {
        id,
        title: j.title,
        companyName: j.company,
        company: j.company,
        location: j.location,
        category: j.category,
        description: j.description ?? "",
        jobType: j.jobType ?? "Full Time",
        tags: j.tags ?? [],
        logo: j.logo ?? "",
        created_at: (j as { createdAt: Date }).createdAt,
      };
    });
    res.json(list);
  } catch (err) {
    console.error("GET /api/jobs error:", err);
    res.status(500).json({ error: "Failed to fetch jobs" });
  }
});

// GET /api/jobs/:id – Get single job details
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      res.status(400).json({ error: "Invalid job id" });
      return;
    }
    const job = await Job.findById(id).lean();
    if (!job) {
      res.status(404).json({ error: "Job not found" });
      return;
    }
    const j = job as typeof job & { _id: mongoose.Types.ObjectId; createdAt: Date };
    res.json({
      id: j._id.toString(),
      title: j.title,
      companyName: j.company,
      company: j.company,
      location: j.location,
      category: j.category,
      description: j.description ?? "",
      jobType: j.jobType ?? "Full Time",
      tags: j.tags ?? [],
      logo: j.logo ?? "",
      created_at: j.createdAt,
    });
  } catch (err) {
    console.error("GET /api/jobs/:id error:", err);
    res.status(500).json({ error: "Failed to fetch job" });
  }
});

// POST /api/jobs – Create a job (Admin)
router.post("/", requireAdmin, async (req: Request, res: Response) => {
  try {
    const body = req.body as {
      title?: string;
      company?: string;
      companyName?: string;
      location?: string;
      category?: string;
      description?: string;
      jobType?: string;
      tags?: string[];
      logo?: string;
    };
    const company = (body.company ?? body.companyName ?? "").trim() || "Company";
    const title = (body.title ?? "").trim() || "Untitled";
    const location = (body.location ?? "").trim() || "—";
    const jobType = (body.jobType ?? "").trim() || "Full Time";
    const category = (body.category ?? "").trim() || "General";
    const description = typeof body.description === "string" ? body.description : "";
    const tags = Array.isArray(body.tags) ? body.tags.filter(Boolean) : ["General"];
    const logo = typeof body.logo === "string" ? body.logo : "";

    const job = await Job.create({
      title,
      company,
      location,
      category,
      description,
      jobType,
      tags,
      logo,
    });
    const created = job.toJSON();
    res.status(201).json(created);
  } catch (err) {
    console.error("POST /api/jobs error:", err);
    res.status(500).json({ error: "Failed to create job" });
  }
});

// DELETE /api/jobs/:id – Delete a job (Admin)
router.delete("/:id", requireAdmin, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      res.status(400).json({ error: "Invalid job id" });
      return;
    }
    const job = await Job.findByIdAndDelete(id);
    if (!job) {
      res.status(404).json({ error: "Job not found" });
      return;
    }
    res.status(200).json({ message: "Job deleted", id });
  } catch (err) {
    console.error("DELETE /api/jobs/:id error:", err);
    res.status(500).json({ error: "Failed to delete job" });
  }
});

export default router;

import mongoose, { Document, Schema } from "mongoose";

export interface IJob extends Document {
  title: string;
  company: string;
  location: string;
  category: string;
  description: string;
  jobType: string;
  tags: string[];
  logo: string;
}

export interface IJobOutput {
  id: string;
  title: string;
  companyName: string;
  location: string;
  category: string;
  description: string;
  jobType: string;
  tags: string[];
  logo: string;
  created_at: Date;
}

const JobSchema = new Schema<IJob>(
  {
    title: { type: String, required: true, trim: true },
    company: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true, default: "General" },
    description: { type: String, default: "" },
    jobType: { type: String, required: true, trim: true, default: "Full Time" },
    tags: { type: [String], default: [] },
    logo: { type: String, default: "" },
  },
  { timestamps: true }
);

// Use "createdAt" from timestamps
JobSchema.set("toJSON", {
  virtuals: false,
  versionKey: false,
  transform(_doc, ret: any) {
    ret.id = ret._id.toString();
    ret.companyName = ret.company;
    ret.created_at = ret.createdAt;
    delete ret._id;
    delete ret.__v;
    delete ret.company;
    delete ret.createdAt;
    delete ret.updatedAt;
  },
});

export const Job = mongoose.model<IJob>("Job", JobSchema);

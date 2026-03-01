import mongoose, { Document, Schema } from "mongoose";

export interface IApplication extends Document {
  _id: mongoose.Types.ObjectId;
  job_id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  resume_link: string;
  cover_note: string;
  createdAt: Date;
}

const ApplicationSchema = new Schema<IApplication>(
  {
    job_id: { type: Schema.Types.ObjectId, ref: "Job", required: true },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
    resume_link: { type: String, required: true, trim: true },
    cover_note: { type: String, default: "" },
  },
  { timestamps: true }
);

ApplicationSchema.set("toJSON", {
  virtuals: false,
  versionKey: false,
  transform(_doc, ret) {
    ret.id = ret._id.toString();
    ret.created_at = ret.createdAt;
    delete ret._id;
    delete ret.__v;
    delete ret.createdAt;
    delete ret.updatedAt;
  },
});

export const Application = mongoose.model<IApplication>(
  "Application",
  ApplicationSchema
);

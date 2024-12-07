import mongoose, { Document, Schema } from 'mongoose';

interface IScores extends Document {
  name: string;
  score: number;
  level: string;
}

const scoreSchema: Schema = new Schema<IScores>({
  name: { type: String, required: true },
  score: { type: Number, required: true },
  level: { type: String },
}, { timestamps: true});

// create an index for name
scoreSchema.index({ name: 1 });

const ScoreModel = mongoose.model<IScores>('Scores', scoreSchema);

export default ScoreModel;

import ScoreModel from "../models/ScoreBoard";

export const getScores = async () => {
  return await ScoreModel.find().sort({ score: -1 }).limit(3);
};

export const groupScoresByLevel = async () => {
    return await ScoreModel.aggregate([
        {
        $group: {
            _id: "$level",
            scores: { $push: "$$ROOT" },
        },
        },
    ]);
}

export const postScore = async (name: string, score: number, level: string) => {
  const newScore = new ScoreModel({ name, score, level });
  return await newScore.save();
};
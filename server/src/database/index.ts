import mongoose from 'mongoose';

const connectToDatabase = async (): Promise<void> => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/sudoku');
    console.log('Database connected successfully');
  } catch (error) {
    console.error('Error connecting to the database:', error);
    process.exit(1);
  }
};

export default connectToDatabase;
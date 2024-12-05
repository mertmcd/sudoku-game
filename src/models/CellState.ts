class CellState {
    cellValue: number | null;
    isWrong: boolean;
    isPrefilled: boolean;
    correctValue: number;
  
    constructor(cellValue: number | null = null, correctValue: number) {
      this.cellValue = cellValue;
      this.isPrefilled = cellValue != null;
      this.isWrong = false;
      this.correctValue = correctValue
    }
  }
  export default CellState;
class CellState {
    cellValue: number | null; // the value of the cell user gives
    isWrong: boolean;
    isPrefilled: boolean;
    correctValue: number; // the correct value of the cell
  
    constructor(cellValue: number | null = null, correctValue: number) {
      this.cellValue = cellValue;
      this.isPrefilled = cellValue != null;
      this.isWrong = false;
      this.correctValue = correctValue
    }
  }
  export default CellState;
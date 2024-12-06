class CellState {
    cellValue: number | null; // the value of the cell user gives
    isWrong: boolean;
    isPrefilled: boolean;
    correctValue: number; // the correct value of the cell
    pointsReceived!: boolean; // in order to prevent multiple points for the same cell

    constructor(cellValue: number | null = null, correctValue: number) {
      this.cellValue = cellValue;
      this.isPrefilled = cellValue != null;
      this.isWrong = false;
      this.correctValue = correctValue
      this.pointsReceived = false;
    }

    setCellPointState (): void {
      this.pointsReceived = true;
    }
}

  export default CellState;
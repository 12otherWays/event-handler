export class Month {
    private year: number;
    private month: number;
    constructor() {
        const d = new Date();
        this.year = d.getFullYear();
        this.month = d.getMonth();
    }
}
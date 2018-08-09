export class Tarea {
    userId: number;
    id: number;
    title: string;
    completed: boolean;

    constructor() {
        this.userId = null;
        this.id = null;
        this.completed = false;
    }
}
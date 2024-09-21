export class Option {
    public id: string;
    public title: string;
    public order: number;
    public correct: boolean;
    public points: number;
    public questionId: string;

    constructor(item: any){
        this.id = item.id
        this.title = item.title
        this.order = item.order;
        this.correct = item.correct;
        this.points = item.points;
        this.questionId = item.questionId
    }
}


export class Question{
    public id: string;
    public title: string;
    public type!: string;
    public nextQuestionId!: string;
    public nextContetId!: string;
    public previusQuestionId!: string;
    public previusContetId!: string;
    public options: Option[]

    constructor(item: any){
        this.id = item.id;
        this.title = item.title;
        this.type = item.type;
        this.nextContetId = item.nextContetId;
        this.nextQuestionId = item.nextQuestionId;
        this.previusContetId = item.previusContetId;
        this.previusQuestionId = item.previusQuestionId
        this.options = []
    }
}
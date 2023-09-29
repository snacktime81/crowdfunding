import { RowDataPacket, FieldPacket } from "mysql2/promise";

interface user extends RowDataPacket{
    id: nubmer,
    email: string,
    name: string,
    password: string,
    authority: string
}

interface item extends RowDataPacket{
    id: number,
    user_id: number,
    name: string,
    price: number,
    percent: number,
    explanation: string,
    img: string,
    deadline: string
}

interface qAndA extends RowDataPacket{
    id: number,
    user_id: number,
    question: string,
    answer: string,
    respondent: number
}

export {user, item, qAndA}
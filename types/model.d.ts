import { RowDataPacket, FieldPacket } from "mysql2/promise";
import jwt from 'jsonwebtoken';

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

interface reqBody{
	name: string;
	email: string;
	password: string;
}

interface payload extends jwt.JwtPayload{
	id: number,
	email: string,
	name: string
}
export {user, item, qAndA, reqBody, payload}
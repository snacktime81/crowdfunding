import { RowDataPacket, FieldPacket } from "mysql2/promise";

interface user extends RowDataPacket{
    id: nubmer,
    email: string,
    name: string,
    password: string,
    authority: string
}

export {user}
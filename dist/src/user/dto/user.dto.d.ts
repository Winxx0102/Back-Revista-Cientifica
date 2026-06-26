export declare enum Role {
    USER = "USER",
    ADMIN = "ADMIN",
    SUPERADMIN = "SUPERADMIN"
}
export declare class CreateUserDto {
    name: string;
    email: string;
    password: string;
}

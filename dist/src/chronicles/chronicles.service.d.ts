import { CreateChronicleDto } from './dto/create-chronicle.dto';
import { UpdateChronicleDto } from './dto/update-chronicle.dto';
import { PrismaService } from '../../prisma/prisma.service';
export declare class ChroniclesService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createChronicleDto: CreateChronicleDto, userId: number): Promise<{
        id: number;
        file_path: string | null;
        title: string;
        author: string;
        content: string;
        correo: string | null;
        materia: string | null;
        palabras_claves: string | null;
        year_presentacion: string | null;
        createdAt: Date;
        userId: number;
    }>;
    findAll(): import(".prisma/client").Prisma.PrismaPromise<{
        id: number;
        file_path: string | null;
        title: string;
        author: string;
        content: string;
        correo: string | null;
        materia: string | null;
        palabras_claves: string | null;
        year_presentacion: string | null;
        createdAt: Date;
        userId: number;
    }[]>;
    findOne(id: number): import(".prisma/client").Prisma.Prisma__chroniclesClient<{
        id: number;
        file_path: string | null;
        title: string;
        author: string;
        content: string;
        correo: string | null;
        materia: string | null;
        palabras_claves: string | null;
        year_presentacion: string | null;
        createdAt: Date;
        userId: number;
    }, null, import("@prisma/client/runtime/library").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    update(id: number, updateChronicleDto: UpdateChronicleDto): import(".prisma/client").Prisma.Prisma__chroniclesClient<{
        id: number;
        file_path: string | null;
        title: string;
        author: string;
        content: string;
        correo: string | null;
        materia: string | null;
        palabras_claves: string | null;
        year_presentacion: string | null;
        createdAt: Date;
        userId: number;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    remove(id: number): import(".prisma/client").Prisma.Prisma__chroniclesClient<{
        id: number;
        file_path: string | null;
        title: string;
        author: string;
        content: string;
        correo: string | null;
        materia: string | null;
        palabras_claves: string | null;
        year_presentacion: string | null;
        createdAt: Date;
        userId: number;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    findByUser(userId: number): Promise<{
        id: number;
        file_path: string | null;
        title: string;
        author: string;
        content: string;
        correo: string | null;
        materia: string | null;
        palabras_claves: string | null;
        year_presentacion: string | null;
        createdAt: Date;
        userId: number;
    }[]>;
    countTotal(): Promise<number>;
}

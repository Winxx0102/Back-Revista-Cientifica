import { CreateChronicleDto } from './dto/create-chronicle.dto';
import { UpdateChronicleDto } from './dto/update-chronicle.dto';
import { PrismaService } from '../../prisma/prisma.service';
export declare class ChroniclesService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createChronicleDto: CreateChronicleDto): import(".prisma/client").Prisma.Prisma__chroniclesClient<{
        id: number;
        userId: number;
        title: string;
        author: string;
        content: string;
        createdAt: Date;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    findAll(): import(".prisma/client").Prisma.PrismaPromise<{
        id: number;
        userId: number;
        title: string;
        author: string;
        content: string;
        createdAt: Date;
    }[]>;
    findOne(id: number): import(".prisma/client").Prisma.Prisma__chroniclesClient<{
        id: number;
        userId: number;
        title: string;
        author: string;
        content: string;
        createdAt: Date;
    }, null, import("@prisma/client/runtime/library").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    update(id: number, updateChronicleDto: UpdateChronicleDto): import(".prisma/client").Prisma.Prisma__chroniclesClient<{
        id: number;
        userId: number;
        title: string;
        author: string;
        content: string;
        createdAt: Date;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    remove(id: number): import(".prisma/client").Prisma.Prisma__chroniclesClient<{
        id: number;
        userId: number;
        title: string;
        author: string;
        content: string;
        createdAt: Date;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    findByUser(userId: number): Promise<{
        id: number;
        userId: number;
        title: string;
        author: string;
        content: string;
        createdAt: Date;
    }[]>;
}

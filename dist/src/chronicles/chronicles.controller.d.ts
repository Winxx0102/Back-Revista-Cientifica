import { ChroniclesService } from './chronicles.service';
import { CreateChronicleDto } from './dto/create-chronicle.dto';
import { UpdateChronicleDto } from './dto/update-chronicle.dto';
export declare class ChroniclesController {
    private readonly chroniclesService;
    constructor(chroniclesService: ChroniclesService);
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
    findOne(id: string): import(".prisma/client").Prisma.Prisma__chroniclesClient<{
        id: number;
        userId: number;
        title: string;
        author: string;
        content: string;
        createdAt: Date;
    }, null, import("@prisma/client/runtime/library").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    getMyChronicles(req: any): Promise<{
        id: number;
        userId: number;
        title: string;
        author: string;
        content: string;
        createdAt: Date;
    }[]>;
    update(id: string, updateChronicleDto: UpdateChronicleDto): import(".prisma/client").Prisma.Prisma__chroniclesClient<{
        id: number;
        userId: number;
        title: string;
        author: string;
        content: string;
        createdAt: Date;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    remove(id: string): import(".prisma/client").Prisma.Prisma__chroniclesClient<{
        id: number;
        userId: number;
        title: string;
        author: string;
        content: string;
        createdAt: Date;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
}

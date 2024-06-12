import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PublisherEntity } from './entities/publisher.entity';
import { Repository } from 'typeorm';
import { conflictMessage, notFoundMessage, PublicMessage } from 'src/common/messages/index.message';

@Injectable()
export class PublisherService {
    constructor(
        @InjectRepository(PublisherEntity) private publisherRepository: Repository<PublisherEntity>,
    ) {}
    async create(name: string) {
        await this.checkExistByName(name);
        await this.publisherRepository.insert({ name });
        return {
            message: PublicMessage.created,
        };
    }

    async findOne(id: number) {
        const publisher = await this.publisherRepository.findOneBy({ id });
        if (!publisher) throw new NotFoundException(notFoundMessage.publisher);
        return publisher;
    }

    async delete(id: number) {
        await this.findOne(id);
        await this.publisherRepository.delete({ id });
        return {
            messsage: PublicMessage.deleted,
        }
    }

    async checkExistByName(name: string) {
        const publisher = await this.publisherRepository.findOneBy({ name });
        if (publisher) throw new ConflictException(conflictMessage.conflict);
        return null;
    }
}

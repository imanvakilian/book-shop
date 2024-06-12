import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateAuthorDto, UpdateAuthorDto } from './dto/author.dto';
import { createSlug } from 'src/common/utils/functions.util';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthorEntity } from './entities/author.entity';
import { Repository } from 'typeorm';
import { conflictMessage, notFoundMessage, PublicMessage } from 'src/common/messages/index.message';

@Injectable()
export class AuthorService {
    constructor(
        @InjectRepository(AuthorEntity) private authorRepository: Repository<AuthorEntity>,
    ) { }

    async create(createDto: CreateAuthorDto) {
        let { firstname, lastname, slug, alive, about } = createDto;
        if (!slug) slug = createSlug(`${firstname} ${lastname}`);
        await this.checkExistBySlug(slug);
        let aliveInctance;
        if (alive == "true") aliveInctance = true;
        if (alive == "false") aliveInctance = false;
        await this.authorRepository.insert({ firstname, lastname, slug, alive: aliveInctance, about });
        return {
            message: PublicMessage.created,
        }

    }

    async update(id: number, updateDto: UpdateAuthorDto) {
        let { firstname, lastname, slug, alive, about } = updateDto;
        if (!slug) slug = createSlug(`${firstname} ${lastname}`);
        let aliveInctance;
        if (alive == "true") aliveInctance = true;
        if (alive == "false") aliveInctance = false;
        const author = await this.findOne(id);
        if (firstname) author.firstname = firstname;
        if (lastname) author.lastname = lastname;
        if (slug) author.slug = slug;
        if (alive) author.alive = aliveInctance;
        if (about) author.about = about;
        await this.authorRepository.save(author);
        return {
            message: PublicMessage.updated,
        }
    }

    async delete(id: number) {
        await this.findOne(id);
        await this.authorRepository.delete({ id });
        return {
            message: PublicMessage.deleted,
        }
    }

    async checkExistBySlug(slug: string) {
        const author = await this.authorRepository.existsBy({ slug });
        if (author) throw new ConflictException(conflictMessage.conflict);
        return null;
    }

    async findOne(id: number) {
        const author = await this.authorRepository.findOneBy({ id });
        if (!author) throw new NotFoundException(notFoundMessage.author);
        return author;
    }
}

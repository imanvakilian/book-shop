import { Inject, Injectable, NotFoundException, Scope } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { Repository } from 'typeorm';
import { notFoundMessage } from 'src/common/messages/index.message';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';

@Injectable({scope: Scope.REQUEST})
export class UserService {
    constructor(
        @InjectRepository(UserEntity) private userRepository: Repository<UserEntity>,
        @Inject(REQUEST) private req: Request,
    ) { }
    async findOne(id: number) {
        const user = await this.userRepository.findOneBy({ id });
        if (!user) throw new NotFoundException(notFoundMessage.user);
        return user;
    }
    async findOneWithDiscountRel(id: number) {
        const user = await this.userRepository.findOne({
            where: { id },
            relations: ["discount"],
        });
        if (!user) throw new NotFoundException(notFoundMessage.user);
        return user;
    }

    library() {
        const {id} = this.req.user;
        return this.userRepository.findOne({
            where: {id},
            relations: ["bookmarks", "bookmarks.book", "bookmarks.book.options", "bookmarks.book.author"],
            select: {
                id: true,
                bookmarks: {
                    id: true,
                    book: {
                        id: true,
                        options: {
                            id: true,
                            title: true,
                        },
                        author: {
                            id: true,
                            firstname: true,
                            lastname: true,
                        }
                    }
                }
            }
        })
    }
}

import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryEntity } from './entities/category.entity';
import { Repository } from 'typeorm';
import { conflictMessage, notFoundMessage, PublicMessage } from 'src/common/messages/index.message';
import { createSlug } from 'src/common/utils/functions.util';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(CategoryEntity) private categoryRepository: Repository<CategoryEntity>,
  ) { }

  async create(createDto: CreateCategoryDto) {
    let { name, slug } = createDto;
    if (!slug) slug = createSlug(name);
    await this.checkExistBySlug(slug);
    await this.categoryRepository.insert({ name, slug });
    return {
      message: PublicMessage.created,
    }
  }

  async findOne(id: number) {
    const category = await this.categoryRepository.findOneBy({ id });
    if(!category) throw new NotFoundException(notFoundMessage.category);
    return category;
  }

  async findOneBySlug(slug: string) {
    const category = await this.categoryRepository.findOneBy({ slug });
    // add book relation
    if(!category) throw new NotFoundException(notFoundMessage.category);
    return category;
  }

  async checkExistBySlug(slug: string) {
    const category = await this.categoryRepository.existsBy({ slug });
    if (category) throw new ConflictException(conflictMessage.conflict);
    return null;
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.categoryRepository.delete({id});
    return {
      message: PublicMessage.deleted,
    }
  }
}

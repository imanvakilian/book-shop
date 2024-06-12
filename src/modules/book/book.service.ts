import { ConflictException, Inject, Injectable, InternalServerErrorException, NotFoundException, Scope } from '@nestjs/common';
import { CommentDto, CreateBookDto, UpdateBookDto } from './dto/book.dto';
import { TmulterFile } from 'src/common/utils/multer-book.util';
import { IbookOptions, Tfiles } from './types/book.types';
import { createSlug } from 'src/common/utils/functions.util';
import { InjectRepository } from '@nestjs/typeorm';
import { BookEntity } from './entities/book.entity';
import { FindOptionsWhere, Repository } from 'typeorm';
import { conflictMessage, internalErrorMessage, notFoundMessage, PublicMessage } from 'src/common/messages/index.message';
import { AuthorService } from '../author/author.service';
import { CategoryService } from '../category/category.service';
import { PublisherService } from '../publisher/publisher.service';
import { SeasonEntity } from './entities/season.entity';
import { BookOptionsEntity } from './entities/book-option.entity';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { BookLikeEntity } from './entities/book-like.entity';
import { BookBookmarkEntity } from './entities/book-bookmark.entity';
import { EntityName } from 'src/common/enums/entity.enum';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { generatePagination } from 'src/common/utils/pagination.util';
import { CommentEntity } from './entities/comment.entity';
import { SubscriptionService } from '../subscription/subscription.service';

@Injectable({ scope: Scope.REQUEST })
export class BookService {
  constructor(
    @InjectRepository(BookEntity) private bookRepository: Repository<BookEntity>,
    @InjectRepository(CommentEntity) private commentRepository: Repository<CommentEntity>,
    @InjectRepository(BookLikeEntity) private bookLikeRepository: Repository<BookLikeEntity>,
    @InjectRepository(BookBookmarkEntity) private bookbookmarkRepository: Repository<BookBookmarkEntity>,
    @InjectRepository(BookOptionsEntity) private bookOptionsRepository: Repository<BookOptionsEntity>,
    @InjectRepository(SeasonEntity) private seasonRepository: Repository<SeasonEntity>,
    @Inject(REQUEST) private req: Request,
    private authorService: AuthorService,
    private categoryService: CategoryService,
    private publisherService: PublisherService,
    private subscriptionService: SubscriptionService,
  ) { }
  // ==================== CRUD =====================================================================================================
  async create(createBookDto: CreateBookDto, files: Tfiles) {
    let { title, slug } = createBookDto;
    if (!slug) slug = createSlug(title);
    await this.checkExistBySlug(slug);
    const { authorId, categoryId, publisherId } = createBookDto;
    const book = await this.validateAndCreateBook(+authorId, +categoryId, publisherId);
    const {
      description, short_summary, seasons,
      count, price, timeToRead } = createBookDto;
    const { image, audio, pdf } = files;
    const seasonItems = seasons?.split(",");
    seasonItems?.forEach(async item => {
      await this.seasonRepository.insert({ name: item, bookId: book.id });
    })
    const options = {
      title,
      description,
      slug,
      short_summary,
      count: +count,
      price: +price,
      timeToRead: +timeToRead,
      image: image[0].path.substring(7),
      pdf: pdf[0].path.substring(7),
      audio: audio[0].path.substring(7),
      total_price: +price
    }
    const bookOptions = await this.createBookOptions(options, book.id);
    book.optionsId = bookOptions.id;
    await this.bookRepository.save(book);
    return {
      message: PublicMessage.created,
    }
  }
  async findAll(paginationDto: PaginationDto, search: string) {
    let { page, limit = 10 } = paginationDto;
    if (+page > 0) page = `${+page - 1}`;
    const skip = +page * +limit;
    let where = '';
    if (search) {
      search = `%${search}%`;
      where = 'CONCAT(options.title, options.slug, author.firstname, author.lastname, author.slug, category.name) ILIKE :search'
    }
    // you can get needed information or all information and details
    const [books, count] = await this.bookRepository.createQueryBuilder(EntityName.Book)
      .where(where, { search })
      // .leftJoin("book.category", "category")
      .leftJoin("book.author", "author")
      // .leftJoin("book.publisher", "publisher")
      .leftJoin("book.options", "options")
      // .leftJoin("book.seasons", "seasons")
      // .leftJoin("book.comments", "comments")
      .loadRelationCountAndMap("book.likes", "book.likes")
      .loadRelationCountAndMap("book.bookmarks", "book.bookmarks")
      // .addSelect(["category.id", "category.name"])
      .addSelect(["author.id", "author.firstname", "author.lastname"])
      // .addSelect(["publisher.id", "publisher.name"])
      .addSelect(["options.id", "options.title"])
      // .addSelect(["seasons"])
      // .addSelect(["comments"])
      .skip(skip)
      .take(+limit)
      .orderBy({ "book.id": "DESC" })
      .getManyAndCount();
    return [
      generatePagination(+page, +limit, count),
      books,
    ]
  }
  async findOne(id: number) {
    const book = await this.bookRepository.findOneBy({ id });
    if (!book) throw new NotFoundException(notFoundMessage.book);
    return book;
  }
  async update(id: number, updateBookDto: UpdateBookDto) {
    await this.findOne(id);
    const bookOption = await this.bookOptionsRepository.findOneBy({ bookId: id });
    const { discount, new_price, count } = updateBookDto;
    if (+discount > 100) throw new InternalServerErrorException(internalErrorMessage.processFailed);
    if (new_price) bookOption.price = +new_price;
    if (discount) bookOption.discount = +discount;
    if (count) bookOption.count = +count;
    await this.bookOptionsRepository.save(bookOption);
    return {
      message: PublicMessage.updated,
    }
  }
  async remove(id: number) {
    await this.findOne(id);
    await this.bookRepository.delete({ id });
    return {
      message: PublicMessage.deleted,
    }
  }
  // ==================== CRUD =====================================================================================================
  // ==================== USER =====================================================================================================
  async likeToggle(id: number) {
    const book = await this.bookRepository.findOneBy({ id });
    const bookId = book.id;
    const { id: userId } = this.req.user;
    let bookLike = await this.bookLikeRepository.existsBy({ userId, bookId });
    let message;
    if (bookLike) {
      await this.bookLikeRepository.delete({ userId, bookId });
      message = PublicMessage.disliked;
    } else {
      await this.bookLikeRepository.insert({ userId, bookId });
      message = PublicMessage.liked;
    }
    return {
      message
    }
  }
  async bookmarkToggle(id: number) {
    const book = await this.bookRepository.findOneBy({ id });
    const bookId = book.id;
    const { id: userId } = this.req.user;
    let bookLike = await this.bookbookmarkRepository.existsBy({ userId, bookId });
    let message;
    if (bookLike) {
      await this.bookbookmarkRepository.delete({ userId, bookId });
      message = PublicMessage.unbookmarked;
    } else {
      await this.bookbookmarkRepository.insert({ userId, bookId });
      message = PublicMessage.bookmarked;
    }
    return {
      message
    }
  }
  async createComment(id: number, commentDto: CommentDto) {
    const { score, text } = commentDto;
    const { id: userId } = this.req.user;
    const book = await this.bookRepository.findOne({
      where: { id },
      relations: ["options"],
    });
    if (!book) throw new NotFoundException(notFoundMessage.book);
    await this.checkExistComment(userId, book.id);
    const comment = this.commentRepository.create({ userId, bookId: book.id, text, score: +score });
    await this.commentRepository.save(comment);
    const comments = (await this.commentRepository.findBy({ bookId: book.id }));
    let finalScore = 0;
    comments.forEach(comment => {
      finalScore += comment.score;
      console.log(comment.score);

      console.log(finalScore);

    });
    const bookOption = await this.bookOptionsRepository.findOneBy({ bookId: book.id });
    bookOption.score = +(finalScore / comments.length).toString().substring(0, 3);
    await this.bookOptionsRepository.save(bookOption);
    return {
      message: PublicMessage.comment,
    }
  }
  async checkExistComment(userId: number, bookId: number) {
    const comment = await this.commentRepository.existsBy({ userId, bookId });
    if (comment) throw new ConflictException(conflictMessage.comment);
    return null;
  }
  // ==================== USER =====================================================================================================
  // ==================== CREATE =====================================================================================================
  async validateAndCreateBook(authorId: number, categoryId: number, publisherId: string | null) {
    await this.authorService.findOne(authorId);
    await this.categoryService.findOne(categoryId);
    if (publisherId) await this.publisherService.findOne(+publisherId);
    const book = this.bookRepository.create({
      categoryId,
      authorId,
      publisherId: +publisherId || null,
    })
    await this.bookRepository.save(book);
    return book;
  }
  async createBookOptions(options: IbookOptions, bookId: number) {
    const {
      description, short_summary, slug, title,
      count, price, timeToRead } = options;
    const { image, pdf, audio } = options;
    const bookOptions = this.bookOptionsRepository.create({
      title, slug, description, short_summary,
      timeToRead: +timeToRead, price: +price, count: +count,
      image, pdf: pdf, audio: audio, total_price: +price, bookId
    })
    await this.bookOptionsRepository.save(bookOptions);
    return bookOptions;
  }
  // ==================== CREATE =====================================================================================================
  // ==================== FIND =====================================================================================================
  async findOneWithRelations(id: number) {
    const book = await this.findOneBookWithRelations("id", id);
    if (!book) throw new NotFoundException(notFoundMessage.book);
    return book;
  }
  async findOneBySlugWithRelations(slug: string) {
    const option = await this.bookOptionsRepository.findOneBy({ slug });
    const book = await this.findOneBookWithRelations("optionsId", option.id);
    if (!book) throw new NotFoundException(notFoundMessage.book);
    return book;
  }
  // ==================== FIND =====================================================================================================
  // ==================== CATEGORY =====================================================================================================
  editorsChoice(categoryId: number) {
    // you can get needed information or all information and details
    return this.bookRepository.createQueryBuilder(EntityName.Book)
      // .leftJoin("book.category", "category")
      .leftJoin("book.author", "author")
      // .leftJoin("book.publisher", "publisher")
      .leftJoin("book.options", "options")
      // .leftJoin("book.seasons", "seasons")
      // .leftJoin("book.comments", "comments")
      .loadRelationCountAndMap("book.likes", "book.likes")
      .loadRelationCountAndMap("book.bookmarks", "book.bookmarks")
      // .addSelect(["category.id", "category.name"])
      .addSelect(["author.id", "author.firstname", "author.lastname"])
      // .addSelect(["publisher.id", "publisher.name"])
      .addSelect(["options.id", "options.title"])
      // .addSelect(["seasons"])
      // .addSelect(["comments"])
      .orderBy("book.id", "DESC")
      .where({ categoryId, options: { editors_choice: true } })
      .getMany()
  }
  async byCategory(paginationDto: PaginationDto, categoryId: number) {
    let { page, limit = 10 } = paginationDto;
    if (+page > 0) page = `${+page - 1}`;
    const skip = +page * +limit;
    // you can get needed information or all information and details
    const [books, count] = await this.bookRepository.createQueryBuilder(EntityName.Book)
      .where({ categoryId })
      // .leftJoin("book.category", "category")
      .leftJoin("book.author", "author")
      // .leftJoin("book.publisher", "publisher")
      .leftJoin("book.options", "options")
      // .leftJoin("book.seasons", "seasons")
      // .leftJoin("book.comments", "comments")
      .loadRelationCountAndMap("book.likes", "book.likes")
      .loadRelationCountAndMap("book.bookmarks", "book.bookmarks")
      // .addSelect(["category.id", "category.name"])
      .addSelect(["author.id", "author.firstname", "author.lastname"])
      // .addSelect(["publisher.id", "publisher.name"])
      .addSelect(["options.id", "options.title"])
      // .addSelect(["seasons"])
      // .addSelect(["comments"])
      .skip(skip)
      .take(+limit)
      .orderBy({ "book.id": "DESC" })
      .getManyAndCount();
    return [
      generatePagination(+page, +limit, count),
      books,
    ]
  }
  async byCategorySlug(paginationDto: PaginationDto, categorySlug: string) {
    let { page, limit = 10 } = paginationDto;
    if (+page > 0) page = `${+page - 1}`;
    const skip = +page * +limit;
    // you can get needed information or all information and details
    const [books, count] = await this.bookRepository.createQueryBuilder(EntityName.Book)
      // .leftJoin("book.category", "category")
      .leftJoin("book.author", "author")
      // .leftJoin("book.publisher", "publisher")
      .leftJoin("book.options", "options")
      // .leftJoin("book.seasons", "seasons")
      // .leftJoin("book.comments", "comments")
      .loadRelationCountAndMap("book.likes", "book.likes")
      .loadRelationCountAndMap("book.bookmarks", "book.bookmarks")
      // .addSelect(["category.id", "category.name"])
      .addSelect(["author.id", "author.firstname", "author.lastname"])
      // .addSelect(["publisher.id", "publisher.name"])
      .addSelect(["options.id", "options.title"])
      // .addSelect(["seasons"])
      // .addSelect(["comments"])
      .skip(skip)
      .take(+limit)
      .orderBy({ "book.id": "DESC" })
      .where({ category: { slug: categorySlug } })
      .getManyAndCount();
    return [
      generatePagination(+page, +limit, count),
      books,
    ]
  }
  // ==================== CATEGORY =====================================================================================================
  // ==================== FIND HELPER =====================================================================================================
  async checkExistBySlug(slug: string) {
    const book = await this.bookOptionsRepository.existsBy({ slug });
    if (book) throw new ConflictException(conflictMessage.conflict);
    return null;
  }
  async findOneBookWithRelations(field: string, value: any) {
    let where: FindOptionsWhere<BookEntity> = {};
    console.log(field, value);
    console.log(where);
    where[field] = value;
    return this.bookRepository.createQueryBuilder(EntityName.Book)
      .where(where)
      .leftJoin("book.category", "category")
      .leftJoin("book.author", "author")
      .leftJoin("book.publisher", "publisher")
      .leftJoin("book.options", "options")
      .leftJoin("book.seasons", "seasons")
      .leftJoin("book.comments", "comments")
      .loadRelationCountAndMap("book.likes", "book.likes")
      .addSelect(["category.id", "category.name"])
      .addSelect(["author.id", "author.firstname", "author.lastname"])
      .addSelect(["publisher.id", "publisher.name"])
      .addSelect(["options"])
      .addSelect(["seasons"])
      .addSelect(["comments"])
      .orderBy("book.id", "DESC")
      .getOne()
  }
  async findManyBookWithRelations(field: string, value: any) {
    let where: FindOptionsWhere<BookEntity> = {};
    console.log(field, value);
    console.log(where);
    where[field] = value;
    // you can get needed information or all information and details
    return this.bookRepository.createQueryBuilder(EntityName.Book)
      .where(where)
      // .leftJoin("book.category", "category")
      .leftJoin("book.author", "author")
      // .leftJoin("book.publisher", "publisher")
      .leftJoin("book.options", "options")
      // .leftJoin("book.seasons", "seasons")
      // .leftJoin("book.comments", "comments")
      .loadRelationCountAndMap("book.likes", "book.likes")
      .loadRelationCountAndMap("book.bookmarks", "book.bookmarks")
      // .addSelect(["category.id", "category.name"])
      .addSelect(["author.id", "author.firstname", "author.lastname"])
      // .addSelect(["publisher.id", "publisher.name"])
      .addSelect(["options.id", "options.title"])
      // .addSelect(["seasons"])
      // .addSelect(["comments"])
      .orderBy("book.id", "DESC")
      .getMany()
  }
  // ==================== FIND HELPER =====================================================================================================
  // ==================== AUTHOR =====================================================================================================
  byAuthor(authorId: number) {
    return this.findManyBookWithRelations("authorId", authorId);
  }
  // ==================== AUTHOR =====================================================================================================
  // ==================== file =====================================================================================================
  async getFile(id: number) {
    await this.findOne(id);
    await this.subscriptionService.checkSub();
    return this.bookRepository.findOne({
      where: { id },
      relations: ["options"],
      select: {
        id: true,
        options: {
          id: true,
          pdf: true,
          audio: true,
        }
      }
    });
  }
  // ==================== file =====================================================================================================
}

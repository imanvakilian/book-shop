export function generatePagination(page: number, limit: number, count: number) {
    page += 1;
    const totalPage = Math.ceil(count / limit);
    return {
        totalPage,
        page,
        totalCount: count,
        limit,
        hasNextPage: page < totalPage,
    }
}
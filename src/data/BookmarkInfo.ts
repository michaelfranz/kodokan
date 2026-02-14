import store from '../utils/store'

const BOOKMARK_STORE_KEY = 'bookmarks'

export default class BookmarkInfo {
    public static async bookmarkTerms(): Promise<string[]> {
        const bookmarkedTerms: string[] = await store.get(BOOKMARK_STORE_KEY)
        return bookmarkedTerms ? bookmarkedTerms : []
    }

    public static async bookmarkCount(): Promise<number> {
        return (await BookmarkInfo.bookmarkTerms()).length
    }

    public static async isBookmarked(term: string): Promise<boolean> {
        return (await BookmarkInfo.bookmarkTerms()).includes(term)
    }

    public static async addBookmarkTerm(term: string): Promise<number> {
        const bookmarkedTerms: string[] = await BookmarkInfo.bookmarkTerms()
        bookmarkedTerms.push(term)
        bookmarkedTerms.sort()
        await store.delete(BOOKMARK_STORE_KEY)
        await BookmarkInfo.storeBookmarks(bookmarkedTerms)
        return bookmarkedTerms.length
    }

    public static async removeBookmarkTerm(term: string): Promise<number> {
        const bookmarkedTerms: string[] = await BookmarkInfo.bookmarkTerms()
        const index = bookmarkedTerms.indexOf(term, 0)
        if (index > -1) {
            bookmarkedTerms.splice(index, 1)
            await BookmarkInfo.storeBookmarks(bookmarkedTerms)
        }
        return bookmarkedTerms.length
    }

    public static async clearBookmarks() {
        return await store.delete(BOOKMARK_STORE_KEY)
    }

    private static async storeBookmarks(bookmarks: string[]) {
        await BookmarkInfo.clearBookmarks()
        for (const term of bookmarks) {
            await store.push(BOOKMARK_STORE_KEY, term)
        }
    }
}

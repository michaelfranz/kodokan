import BookmarkInfo from './BookmarkInfo'

test('initial bookmark count is 0', () => {
    expect(BookmarkInfo.clearBookmarks())
    return expect(BookmarkInfo.bookmarkCount()).resolves.toBe(0)
})

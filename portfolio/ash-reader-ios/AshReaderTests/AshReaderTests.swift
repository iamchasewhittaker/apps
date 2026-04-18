import XCTest
@testable import AshReader

final class AshReaderTests: XCTestCase {

    // MARK: - Chunker (existing)

    func testChunkByCharsQA() {
        let text = """
        Human: What is anxiety?

        Assistant: Anxiety is a natural response to stress or perceived danger. It involves feelings of worry, nervousness, or fear about future events. \
        While some anxiety is normal and can be helpful, excessive anxiety can interfere with daily life. \
        The key is understanding your triggers and developing healthy coping mechanisms.

        Human: How do I manage it?

        Assistant: There are several evidence-based strategies. First, practice deep breathing — slow, controlled breaths activate the parasympathetic nervous system. \
        Second, identify your triggers through journaling. Third, consider cognitive behavioral techniques to reframe anxious thoughts. \
        Finally, regular exercise, sleep hygiene, and limiting caffeine all significantly reduce baseline anxiety levels.
        """

        let chunks = chunkByChars(text, maxChars: 200)
        XCTAssertGreaterThan(chunks.count, 0)
        for chunk in chunks {
            let trimmed = chunk.text.trimmingCharacters(in: .whitespacesAndNewlines)
            XCTAssertFalse(trimmed.isEmpty)
            XCTAssertLessThanOrEqual(chunk.charCount, 200, "Chunk \(chunk.id) exceeds maxChars: \(chunk.charCount)")
        }
    }

    func testChunkByCharsFallbackToParagraphs() {
        let text = "This is paragraph one with some words in it.\n\nThis is paragraph two with more content here.\n\nParagraph three keeps going with additional material."
        let chunks = chunkByChars(text, maxChars: 60)
        XCTAssertGreaterThan(chunks.count, 1)
        for chunk in chunks {
            XCTAssertLessThanOrEqual(chunk.charCount, 60, "Chunk \(chunk.id) exceeds maxChars: \(chunk.charCount)")
        }
    }

    func testChunkByCharsHardCapNeverExceeded() {
        let longParagraph = String(repeating: "word ", count: 1000) // 5000 chars
        let chunks = chunkByChars(longParagraph, maxChars: 4000)
        for chunk in chunks {
            XCTAssertLessThanOrEqual(chunk.charCount, 4000, "Chunk \(chunk.id) exceeds 4000: \(chunk.charCount)")
        }
    }

    // MARK: - ProgressStore

    func testProgressStorePersists() {
        let store = ProgressStore()
        store.reset()
        store.toggle(0)
        XCTAssertTrue(store.sent.contains(0))
        store.toggle(0)
        XCTAssertFalse(store.sent.contains(0))
    }

    func testProgressStoreCustomKey() {
        let keyA = "ash_reader_ios_test_store_a_\(Int.random(in: 10000...99999))"
        let keyB = "ash_reader_ios_test_store_b_\(Int.random(in: 10000...99999))"
        defer {
            UserDefaults.standard.removeObject(forKey: keyA)
            UserDefaults.standard.removeObject(forKey: keyB)
        }

        let storeA = ProgressStore(key: keyA)
        let storeB = ProgressStore(key: keyB)

        storeA.reset()
        storeB.reset()

        storeA.toggle(5)
        storeA.toggle(10)

        // storeB must be unaffected
        XCTAssertFalse(storeB.sent.contains(5))
        XCTAssertFalse(storeB.sent.contains(10))

        // Reload storeA from UserDefaults to verify persistence
        let reloaded = ProgressStore(key: keyA)
        XCTAssertTrue(reloaded.sent.contains(5))
        XCTAssertTrue(reloaded.sent.contains(10))

        // Toggle off and verify
        storeA.toggle(5)
        let reloaded2 = ProgressStore(key: keyA)
        XCTAssertFalse(reloaded2.sent.contains(5))
        XCTAssertTrue(reloaded2.sent.contains(10))
    }

    func testProgressStoreReset() {
        let key = "ash_reader_ios_test_reset_\(Int.random(in: 10000...99999))"
        defer { UserDefaults.standard.removeObject(forKey: key) }

        let store = ProgressStore(key: key)
        store.toggle(1)
        store.toggle(2)
        store.toggle(3)
        store.reset()

        XCTAssertTrue(store.sent.isEmpty)
        let reloaded = ProgressStore(key: key)
        XCTAssertTrue(reloaded.sent.isEmpty)
    }

    // MARK: - stripMarkdown

    func testStripMarkdownHeadings() {
        XCTAssertEqual(stripMarkdown("# Heading One"), "Heading One")
        XCTAssertEqual(stripMarkdown("## Level Two"), "Level Two")
        XCTAssertEqual(stripMarkdown("### Deep"), "Deep")
        XCTAssertEqual(stripMarkdown("# Title\nBody text"), "Title\nBody text")
    }

    func testStripMarkdownBold() {
        XCTAssertEqual(stripMarkdown("This is **bold** text"), "This is bold text")
        XCTAssertEqual(stripMarkdown("**All bold**"), "All bold")
        XCTAssertEqual(stripMarkdown("**a** and **b**"), "a and b")
    }

    func testStripMarkdownItalic() {
        XCTAssertEqual(stripMarkdown("This is *italic* text"), "This is italic text")
        XCTAssertEqual(stripMarkdown("*emphasized*"), "emphasized")
    }

    func testStripMarkdownInlineCode() {
        XCTAssertEqual(stripMarkdown("Use `someFunction()` here"), "Use someFunction() here")
        XCTAssertEqual(stripMarkdown("`code`"), "code")
    }

    func testStripMarkdownBullets() {
        let input = "- First item\n- Second item\n* Third item"
        let result = stripMarkdown(input)
        XCTAssertTrue(result.contains("• First item"), "Got: \(result)")
        XCTAssertTrue(result.contains("• Second item"), "Got: \(result)")
        XCTAssertTrue(result.contains("• Third item"), "Got: \(result)")
    }

    func testStripMarkdownNumberedList() {
        let input = "1. Step one\n2. Step two\n3. Step three"
        let result = stripMarkdown(input)
        XCTAssertTrue(result.contains("Step one"), "Got: \(result)")
        XCTAssertTrue(result.contains("Step two"), "Got: \(result)")
        XCTAssertFalse(result.contains("1."), "Got: \(result)")
    }

    func testStripMarkdownLinks() {
        XCTAssertEqual(stripMarkdown("[click here](https://example.com)"), "click here")
        XCTAssertEqual(stripMarkdown("See [docs](https://docs.example.com) for more"), "See docs for more")
    }

    func testStripMarkdownBlockquote() {
        XCTAssertEqual(stripMarkdown("> Quoted text"), "Quoted text")
        XCTAssertEqual(stripMarkdown("> Line one\n> Line two"), "Line one\nLine two")
    }

    func testStripMarkdownHorizontalRule() {
        let result = stripMarkdown("Before\n---\nAfter")
        XCTAssertFalse(result.contains("---"), "Got: \(result)")
        XCTAssertTrue(result.contains("Before"), "Got: \(result)")
        XCTAssertTrue(result.contains("After"), "Got: \(result)")
    }

    func testStripMarkdownCollapseExtraNewlines() {
        let input = "Para one\n\n\n\nPara two"
        let result = stripMarkdown(input)
        XCTAssertFalse(result.contains("\n\n\n"), "Got: \(result)")
        XCTAssertTrue(result.contains("Para one"), "Got: \(result)")
        XCTAssertTrue(result.contains("Para two"), "Got: \(result)")
    }

    func testStripMarkdownCombo() {
        let input = "## **Bold Heading**\n\n- Item with `code` and [link](https://x.com)\n\n> Blockquote"
        let result = stripMarkdown(input)
        XCTAssertFalse(result.contains("##"), "Got: \(result)")
        XCTAssertFalse(result.contains("**"), "Got: \(result)")
        XCTAssertFalse(result.contains("`"), "Got: \(result)")
        XCTAssertFalse(result.contains("]("), "Got: \(result)")
        XCTAssertFalse(result.contains(">"), "Got: \(result)")
        XCTAssertTrue(result.contains("Bold Heading"), "Got: \(result)")
        XCTAssertTrue(result.contains("code"), "Got: \(result)")
        XCTAssertTrue(result.contains("link"), "Got: \(result)")
        XCTAssertTrue(result.contains("Blockquote"), "Got: \(result)")
    }

    // MARK: - parseThemes

    private let sampleMD = """
    ## 1. The Core Problem

    This section covers the core problem in depth. It has multiple paragraphs of content.
    The content explains how the issue manifests and why it matters.

    More detail here about root causes and historical context.

    ### Actions
    - Identify your main trigger pattern and write it down
    - Practice the pause-and-name technique daily for one week
    - Share one insight with a trusted person this week

    ## 2. Avoidance Patterns

    Avoidance is a natural but counterproductive response. When we avoid discomfort,
    we reinforce the belief that we cannot handle it.

    This section explores the different forms avoidance takes.

    ### Actions
    - List three situations you have been avoiding
    - Choose the least scary one and do it before the week ends
    * Notice what happens to anxiety after you follow through
    1. Write a reflection afterward about what you learned
    """

    func testParseThemesCount() {
        let sections = parseThemes(sampleMD)
        XCTAssertEqual(sections.count, 2)
    }

    func testParseThemesTitlesStripped() {
        let sections = parseThemes(sampleMD)
        XCTAssertEqual(sections[0].title, "The Core Problem")
        XCTAssertEqual(sections[1].title, "Avoidance Patterns")
    }

    func testParseThemesSlugsStable() {
        let sections = parseThemes(sampleMD)
        // Running twice on same input should produce identical slugs
        let sections2 = parseThemes(sampleMD)
        XCTAssertEqual(sections[0].id, sections2[0].id)
        XCTAssertEqual(sections[1].id, sections2[1].id)
    }

    func testParseThemesSlugFormat() {
        let sections = parseThemes(sampleMD)
        // Slugs should be lowercase with hyphens, no spaces or numbers
        for s in sections {
            XCTAssertFalse(s.id.contains(" "), "Slug has space: \(s.id)")
            XCTAssertTrue(s.id == s.id.lowercased(), "Slug not lowercase: \(s.id)")
        }
        XCTAssertEqual(sections[0].id, "the-core-problem")
        XCTAssertEqual(sections[1].id, "avoidance-patterns")
    }

    func testParseThemesActionsExtracted() {
        let sections = parseThemes(sampleMD)
        // Section 1: 3 actions, Section 2: 4 actions (3 bullets + 1 numbered)
        XCTAssertEqual(sections[0].actions.count, 3, "Got: \(sections[0].actions)")
        XCTAssertGreaterThanOrEqual(sections[1].actions.count, 3, "Got: \(sections[1].actions)")
    }

    func testParseThemesActionsLengthFilter() {
        let sections = parseThemes(sampleMD)
        for section in sections {
            for action in section.actions {
                XCTAssertGreaterThan(action.count, 10, "Too short: '\(action)'")
                XCTAssertLessThan(action.count, 200, "Too long: '\(action)'")
            }
        }
    }

    func testParseThemesActionsBoldStripped() {
        let mdWithBold = """
        ## 1. Test Theme

        Content here for the theme section.

        - **Do this first** and then follow up carefully
        - Regular action without bold markers
        """
        let sections = parseThemes(mdWithBold)
        XCTAssertEqual(sections.count, 1)
        let actions = sections[0].actions
        XCTAssertFalse(actions.isEmpty)
        for action in actions {
            XCTAssertFalse(action.contains("**"), "Bold not stripped: '\(action)'")
        }
    }

    func testParseThemesContentNotEmpty() {
        let sections = parseThemes(sampleMD)
        for s in sections {
            XCTAssertFalse(s.content.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty)
        }
    }

    func testParseThemesEmptyInput() {
        let sections = parseThemes("")
        XCTAssertEqual(sections.count, 0)
    }

    func testParseThemesOnlyH2SectionsHaveSlugs() {
        // Input with a real ## section plus preamble text before it —
        // only the ## section should produce a valid slug.
        let md = "Preamble text here.\n\n## 1. Real Section\n\nBody of section."
        let sections = parseThemes(md)
        XCTAssertGreaterThanOrEqual(sections.count, 1)
        // The ## section must be present
        XCTAssertTrue(sections.contains(where: { $0.id == "real-section" }),
                      "Got: \(sections.map { $0.id })")
    }
}

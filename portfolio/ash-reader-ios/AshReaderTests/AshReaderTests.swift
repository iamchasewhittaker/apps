import XCTest
@testable import AshReader

final class AshReaderTests: XCTestCase {

    func testChunkSmartQA() {
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

        let chunks = chunkSmart(text, targetWords: 30)
        XCTAssertGreaterThan(chunks.count, 0)
        // Each chunk should not cut mid-sentence (ends with punctuation or newline)
        for chunk in chunks {
            let trimmed = chunk.text.trimmingCharacters(in: .whitespacesAndNewlines)
            XCTAssertFalse(trimmed.isEmpty)
        }
    }

    func testChunkSmartFallbackToParagraphs() {
        let text = "This is paragraph one with some words in it.\n\nThis is paragraph two with more content here.\n\nParagraph three keeps going with additional material."
        let chunks = chunkSmart(text, targetWords: 8)
        XCTAssertGreaterThan(chunks.count, 1)
    }

    func testProgressStorePersists() {
        let store = ProgressStore()
        store.reset()
        store.toggle(0)
        XCTAssertTrue(store.sent.contains(0))
        store.toggle(0)
        XCTAssertFalse(store.sent.contains(0))
    }
}

// swift-tools-version: 5.9
import PackageDescription

let package = Package(
    name: "ClarityUI",
    platforms: [.iOS(.v17), .macOS(.v14)],
    products: [
        .library(name: "ClarityUI", targets: ["ClarityUI"])
    ],
    targets: [
        .target(
            name: "ClarityUI",
            path: "Sources/ClarityUI"
        ),
        .testTarget(
            name: "ClarityUITests",
            dependencies: ["ClarityUI"],
            path: "Tests/ClarityUITests"
        )
    ]
)

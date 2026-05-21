// swift-tools-version:5.3

import Foundation
import PackageDescription

var sources = ["src/parser.c"]
if FileManager.default.fileExists(atPath: "src/scanner.c") {
    sources.append("src/scanner.c")
}

let package = Package(
    name: "TreeSitterWasp",
    products: [
        .library(name: "TreeSitterWasp", targets: ["TreeSitterWasp"]),
    ],
    dependencies: [
        .package(name: "SwiftTreeSitter", url: "https://github.com/tree-sitter/swift-tree-sitter", from: "0.9.0"),
    ],
    targets: [
        .target(
            name: "TreeSitterWasp",
            dependencies: [],
            path: ".",
            sources: sources,
            resources: [
                .copy("queries")
            ],
            publicHeadersPath: "bindings/swift",
            cSettings: [.headerSearchPath("src")]
        ),
        .testTarget(
            name: "TreeSitterWaspTests",
            dependencies: [
                "SwiftTreeSitter",
                "TreeSitterWasp",
            ],
            path: "bindings/swift/TreeSitterWaspTests"
        )
    ],
    cLanguageStandard: .c11
)

// Usage: swift scripts/segment-person.swift <input image> <output mask png>
// Produces a full-resolution 8-bit person mask (white = person) using Apple Vision.
import Foundation
import Vision
import CoreImage
import AppKit

let args = CommandLine.arguments
guard args.count >= 3 else { print("usage: in out"); exit(2) }
let inURL = URL(fileURLWithPath: args[1])
let outURL = URL(fileURLWithPath: args[2])
guard let src = CIImage(contentsOf: inURL) else { print("cannot read input"); exit(1) }
let handler = VNImageRequestHandler(url: inURL, options: [:])
let req = VNGeneratePersonSegmentationRequest()
req.qualityLevel = .accurate
req.outputPixelFormat = kCVPixelFormatType_OneComponent8
try handler.perform([req])
guard let result = req.results?.first else { print("no result"); exit(1) }
let mask = CIImage(cvPixelBuffer: result.pixelBuffer)
let sx = src.extent.width / mask.extent.width
let sy = src.extent.height / mask.extent.height
let scaled = mask.transformed(by: CGAffineTransform(scaleX: sx, y: sy))
let ctx = CIContext()
guard let cg = ctx.createCGImage(scaled, from: CGRect(x: 0, y: 0, width: src.extent.width, height: src.extent.height)) else { print("cg fail"); exit(1) }
let rep = NSBitmapImageRep(cgImage: cg)
guard let png = rep.representation(using: .png, properties: [:]) else { print("png fail"); exit(1) }
try png.write(to: outURL)
print("wrote \(outURL.path) \(cg.width)x\(cg.height)")

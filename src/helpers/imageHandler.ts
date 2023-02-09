import sharp from "sharp";

export function resize(
  buffer: Buffer,
  width: number | null,
  height: number | null
) {
  return sharp(buffer)
    .rotate()
    .resize(width, height, {
      fit: sharp.fit.inside,
      withoutEnlargement: true,
    })
    .withMetadata();
}

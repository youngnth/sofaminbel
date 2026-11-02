import { formatVND, formatVNDWithCode } from '../data/products';

/**
 * Smart search matcher for Perfa products.
 * Supports:
 * - Product name queries (e.g., "Luna Sofa" matches "Luna 3-Seater Sofa")
 * - Material, color, or tag queries (e.g., "Pet-Friendly", "Linen", "Green")
 * - Price queries in millions (e.g., "25 million", "25m", "25 mio")
 * - Exact or partial numeric price queries (e.g., "25000000", "25,000,000", "13,500,000")
 */
export function searchProducts(products, rawQuery) {
  if (!rawQuery || !rawQuery.trim()) {
    return [];
  }

  const query = rawQuery.trim().toLowerCase();

  // 1. Check if query is a "X million" / "Xm" price search (e.g. "25 million", "25m", "13.5 million")
  const millionMatch = query.match(/^(\d+(?:\.\d+)?)\s*(?:million|mil|m|mio|tr)\b/i);
  if (millionMatch) {
    const millionValue = parseFloat(millionMatch[1]);
    const targetVND = Math.round(millionValue * 1000000);

    // First look for exact match or within +/- 1,500,000 VND
    const exactMatches = products.filter((p) => p.price === targetVND);
    if (exactMatches.length > 0) return exactMatches;

    const nearMatches = products.filter(
      (p) => Math.abs(p.price - targetVND) <= 3000000
    );
    return nearMatches;
  }

  // 2. Check if query is a pure number or formatted price (e.g. "25000000", "25,000,000", "25000000 ₫", "vnd 25,000,000")
  const numericClean = query.replace(/[,\s.₫vnd]/gi, '');
  if (/^\d+$/.test(numericClean)) {
    const numVal = parseInt(numericClean, 10);

    // If user typed a small number like "25" or "13", also check if it matches millions (25,000,000) or seatCount
    const exactVnd = products.filter((p) => p.price === numVal);
    if (exactVnd.length > 0) return exactVnd;

    const millionVnd = products.filter((p) => p.price === numVal * 1000000);
    if (millionVnd.length > 0) return millionVnd;

    // Partial digit match on price string (e.g., "25000" or "47900000")
    const digitMatches = products.filter(
      (p) =>
        String(p.price).includes(numericClean) ||
        formatVND(p.price).replace(/,/g, '').includes(numericClean)
    );
    if (digitMatches.length > 0) return digitMatches;
  }

  // 3. Text & multi-token matching (so "Luna Sofa" matches "Luna 3-Seater Sofa")
  const tokens = query.split(/\s+/).filter(Boolean);

  return products.filter((product) => {
    const searchableBlob = [
      product.name,
      product.material,
      product.color,
      `${product.seatCount}-seater`,
      `${product.seatCount} seats`,
      product.wixCategory || '',
      ...(product.tags || []),
      String(product.price),
      formatVND(product.price),
      formatVNDWithCode(product.price),
      `${product.price / 1000000} million`
    ]
      .join(' ')
      .toLowerCase();

    // Direct substring match
    if (searchableBlob.includes(query)) {
      return true;
    }

    // All tokens match anywhere in the product's searchable fields
    return tokens.every((token) => searchableBlob.includes(token));
  });
}

/**
 * Food images – direct Pexels CDN URLs (same format as user example; loads in browser).
 * Format: https://images.pexels.com/photos/{id}/{slug}.jpeg
 */
const PEXELS = "https://images.pexels.com/photos";

export const foodImageMap: Record<string, string> = {
  salad: `${PEXELS}/5938/food-salad-healthy-lunch.jpg`,
  tartare: `${PEXELS}/2098110/cooked-meat-2098110.jpeg`,
  bisque: `${PEXELS}/2347313/pexels-photo-2347313.jpeg`,
  foie: `${PEXELS}/1040685/pexels-photo-1040685.jpeg`,
  steak: `${PEXELS}/60616/fried-chicken-chicken-fried-crunchy-60616.jpeg`,
  lobster: `${PEXELS}/3184183/pexels-photo-3184183.jpeg`,
  duck: `${PEXELS}/60616/fried-chicken-chicken-fried-crunchy-60616.jpeg`,
  pasta: `${PEXELS}/1279330/pexels-photo-1279330.jpeg`,
  sushi: `${PEXELS}/3533477/pexels-photo-3533477.jpeg`,
  souffle: `${PEXELS}/2067390/pexels-photo-2067390.jpeg`,
  creme: `${PEXELS}/3026803/pexels-photo-3026803.jpeg`,
  tiramisu: `${PEXELS}/2067390/pexels-photo-2067390.jpeg`,
  tart: `${PEXELS}/1123250/pexels-photo-1123250.jpeg`,
  wine: `${PEXELS}/674268/pexels-photo-674268.jpeg`,
  cocktail: `${PEXELS}/941864/pexels-photo-941864.jpeg`,
  whiskey: `${PEXELS}/674268/pexels-photo-674268.jpeg`,
  champagne: `${PEXELS}/1282428/pexels-photo-1282428.jpeg`,
  mocktail: `${PEXELS}/941864/pexels-photo-941864.jpeg`,
};

/** Get image URL for a menu item (by item.image or item.id). */
export function getFoodImageUrl(item: { image?: string; id: string }): string {
  const key = item.image || item.id;
  const url = foodImageMap[key];
  if (url) return url;
  for (const [k, v] of Object.entries(foodImageMap)) {
    if (key?.includes(k)) return v;
  }
  return foodImageMap.steak;
}

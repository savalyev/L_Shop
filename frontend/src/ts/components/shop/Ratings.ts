export function displayStars(rating: number): string {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - Math.ceil(rating);
  let stars = '★'.repeat(fullStars);
  if (halfStar) stars += '½';
  stars += '☆'.repeat(emptyStars);
  return stars;
}
// Page de création de wishlist — simple wrapper qui rend le composant principal
// On sépare la page du composant pour garder une structure Next.js propre
import WishlyNewCategory from "./createWishlist";

export default function Page() {
  return <WishlyNewCategory />;
}

export type Product = {
  id: string;
  name: string;
  cartName: string; //shortened name to display in cart
  title: string;
  description: string;
  servings: string;
  price: number; //keep this as like 3.4 so we can total up the cart price 
  image: any;
};

export const products: Product[] = [
  {
    id: "cheerios",
    name: "Cheerios",
    cartName: "Cheerios Family Size (18 oz)",
    title: "Cheerios, Gluten Free Breakfast Cereal, Family Size, 18 oz",
    description: "Cheerios, Heart Healthy Gluten Free Breakfast Cereal, Family Size, 18 oz\n100% Whole Grain Oats",
    servings: "13.0 servings per container | 1½ cup (39g) (age 4+ years)",
    price: 3.4,
    image: require("../../assets/images/cheerios.png"),
  },
  {
    id: "ctc",
    name: "Cinnamon Toast Crunch",
    cartName: "Cinnamon Toast Crunch Family Size (18.8 oz)",
    title: "Cinnamon Toast Crunch, Gluten Free Breakfast Cereal, Family Size, 18 oz",
    description: "Cinnamon Toast Crunch, Heart Healthy Gluten Free Breakfast Cereal, Family Size, 18 oz\n100% Whole Grain Oats",
    servings: "13.0 servings per container | 1½ cup (39g) (age 4+ years)",
    price: 3.98,
    image: require("../../assets/images/cinnamon-toast-crunch.png"),
  },
  {
    id: "chex",
    name: "Rice Chex",
    cartName: "Rice Chex Family Size (18 oz)",
    title: "Rice Chex, Gluten Free Breakfast Cereal, Family Size, 18 oz",
    description: "Rice Chex, Heart Healthy Gluten Free Breakfast Cereal, Family Size, 18 oz\n100% Whole Grain Oats",
    servings: "13.0 servings per container | 1½ cup (39g) (age 4+ years)",
    price: 3.68,
    image: require("../../assets/images/rice-chex.png"),
  },
];
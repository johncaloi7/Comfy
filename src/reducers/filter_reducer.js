import {
  LOAD_PRODUCTS,
  SET_LISTVIEW,
  SET_GRIDVIEW,
  UPDATE_SORT,
  SORT_PRODUCTS,
  UPDATE_FILTERS,
  FILTER_PRODUCTS,
  CLEAR_FILTERS,
} from "../actions";

const filter_reducer = (state, action) => {
  switch (action.type) {
    case LOAD_PRODUCTS:
      let maxPrice = action.payload.map((p) => p.price);
      maxPrice = Math.max(...maxPrice);
      return {
        ...state,
        all_products: [...action.payload],
        filtered_products: [...action.payload],
        filters: { ...state.filters, max_price: maxPrice, price: maxPrice },
      };

    case SET_GRIDVIEW:
      return { ...state, grid_view: true };

    case SET_LISTVIEW: {
      return { ...state, grid_view: false };
    }
    case UPDATE_SORT:
      return { ...state, sort: action.payload };

    case SORT_PRODUCTS:
      const { sort, filtered_products } = state;
      let tempProducts = [];
      if (sort === "price-lowest") {
        tempProducts = filtered_products.sort((a, b) => {
          return a.price - b.price;
        });
      }
      if (sort === "price-highest") {
        tempProducts = filtered_products.sort((a, b) => {
          return b.price - a.price;
        });
      }
      if (sort === "name-a") {
        tempProducts = filtered_products.sort((a, b) => {
          return a.name.localeCompare(b.name);
        });
      }
      if (sort === "name-z") {
        tempProducts = filtered_products.sort((a, b) => {
          return b.name.localeCompare(a.name);
        });
      }

      return { ...state, filtered_products: tempProducts };

    case UPDATE_FILTERS:
      const { name, value } = action.payload;
      return { ...state, filters: { ...state.filters, [name]: value } };

    case FILTER_PRODUCTS:
      const { all_products } = state;
      const { text, category, company, color, price } = state.filters;
      let tempFilterProducts = [...all_products];

      if (text) {
        tempFilterProducts = tempFilterProducts.filter((product) =>
          product.name.toLowerCase().startsWith(text)
        );
      }

      if (category !== "all") {
        tempFilterProducts = tempFilterProducts.filter(
          (product) => product.category === category
        );
      }

      if (company !== "all") {
        tempFilterProducts = tempFilterProducts.filter(
          (product) => product.company === company
        );
      }

      if (color !== "all") {
        tempFilterProducts = tempFilterProducts.filter((product) => {
          return product.colors.find((c) => c === color);
        });
      }

      // filter products by price
      tempFilterProducts = tempFilterProducts.filter(
        (product) => product.price <= price
      );

      return { ...state, filtered_products: tempFilterProducts };

    default:
      throw new Error(`No Matching "${action.type}" - action type`);
  }
};

export default filter_reducer;

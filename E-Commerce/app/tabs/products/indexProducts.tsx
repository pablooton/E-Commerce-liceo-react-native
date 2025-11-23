import React, { useEffect, useState, useCallback } from "react";
import { FlatList, StyleSheet, View, Text, ActivityIndicator, Keyboard, ScrollView } from "react-native";
import { collection, getDocs, getFirestore, query, where, limit, startAfter } from "firebase/firestore";
import { router } from "expo-router";
import ProductCard from "@/components/ProductCard";
import SearchBar from "@/components/SearchBar";
import FilterBadge from "@/components/FilterBadge";
import { Product, ProductSnapshotData, ProductCategory } from "@/types/app";

const ITEMS_PER_PAGE = 10;
type FilterCategory = ProductCategory | 'Todos';

const ProductGridScreen = () => {
  const db = getFirestore();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [searchString, setSearchString] = useState(''); 
  const [isSearchActive, setIsSearchActive] = useState(false); 

  const [activeCategory, setActiveCategory] = useState<FilterCategory>('Todos');
  const categories: FilterCategory[] = ['Todos', 'Ropa', 'Deportes', 'Sneakers'];

  const [lastVisible, setLastVisible] = useState<any>(null);
  const [allProductsLoaded, setAllProductsLoaded] = useState(false);
  const [isFetchingMore, setIsFetchingMore] = useState(false);

  const loadProducts = async (searchTerm = '', category: FilterCategory = 'Todos', append = false) => {
    if (!append) {
      setLoading(true);
      setProducts([]);
      setLastVisible(null);
      setAllProductsLoaded(false);
    } else if (allProductsLoaded || isFetchingMore) {
      return;
    }

    if (append) {
      setIsFetchingMore(true);
    }

    try {
      let productsRef = collection(db, "productos");
      let baseQuery = [];

      if (category !== 'Todos') {
        baseQuery.push(where('category', '==', category));
      }
      
      if (searchTerm.length > 0) {
        baseQuery.push(where('name', '>=', searchTerm));
        baseQuery.push(where('name', '<=', searchTerm + '\uf8ff'));
      }

      if (append && lastVisible) {
        baseQuery.push(startAfter(lastVisible));
      }

      baseQuery.push(limit(ITEMS_PER_PAGE));

      const productsQuery = query(productsRef, ...baseQuery);

      const querySnapshot = await getDocs(productsQuery);
      const newProducts: Product[] = [];
      let newLastVisible: any = null;

      querySnapshot.forEach(snapshot => {
        const snapshotData = { ...snapshot.data() } as ProductSnapshotData;
        const product = { id: snapshot.id, ...snapshotData } as Product;
        newProducts.push(product);
      });

      if (querySnapshot.docs.length > 0) {
        newLastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];
        setLastVisible(newLastVisible);
      }

      if (newProducts.length < ITEMS_PER_PAGE) {
        setAllProductsLoaded(true);
      }

      setProducts(prevProducts => append ? [...prevProducts, ...newProducts] : newProducts);

    } catch (error) {
      console.error("Error al cargar productos:", error);
    } finally {
      setLoading(false);
      setIsFetchingMore(false);
    }
  };

  const handleCategorySelect = (category: FilterCategory) => {
    setActiveCategory(category);
    loadProducts(searchString, category, false);
  };

  const handleSearchSubmit = () => {
    Keyboard.dismiss();
    loadProducts(searchString.trim(), activeCategory, false);
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const loadMoreProducts = () => {
    if (!allProductsLoaded && !isFetchingMore) {
      loadProducts(searchString, activeCategory, true);
    }
  };

  const navigateToDetail = (product: Product) => {
    router.push({
      pathname: "/tabs/products/details", 
      params: { id: product.id },
    });
  };

  return (
    <View style={styles.container}>
      <SearchBar
        placeholder="Buscar productos..."
        clicked={isSearchActive}
        setClicked={setIsSearchActive}
        searchString={searchString}
        setSearchString={setSearchString}
        onSearchSubmit={handleSearchSubmit}
      />

      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.categoryBar}
        contentContainerStyle={styles.categoryContent}
      >
        {categories.map((cat) => (
          <FilterBadge
            key={cat}
            label={cat}
            active={cat === activeCategory}
            onClick={() => handleCategorySelect(cat)}
          />
        ))}
      </ScrollView>
      
      {loading && products.length === 0 ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4FC3F7" />
          <Text style={styles.loadingText}>Cargando productos...</Text>
        </View>
      ) : products.length === 0 && (searchString.length > 0 || activeCategory !== 'Todos') ? (
        <Text style={styles.emptyText}>No se encontraron productos en esta selección</Text>
      ) : products.length === 0 ? (
        <Text style={styles.emptyText}>No hay productos disponibles</Text>
      ) : (
        <FlatList
          data={products}
          keyExtractor={(product) => product.id}
          renderItem={({ item }) => (
            <ProductCard product={item} onPress={() => navigateToDetail(item)} />
          )}
          numColumns={2}
          contentContainerStyle={styles.productList}
          showsVerticalScrollIndicator={false}
          onEndReached={loadMoreProducts}
          onEndReachedThreshold={0.5}
          ListFooterComponent={() => 
            isFetchingMore && (
              <View style={styles.footerLoader}>
                <ActivityIndicator size="small" color="#4FC3F7" />
              </View>
            )
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E1F5FE", 
  },
  productList: {
    paddingHorizontal: 8,
    paddingBottom: 20,
    rowGap: 10,
    columnGap: 10,
    justifyContent: "space-between",
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    marginTop: 10,
    color: "#4FC3F7",
    fontSize: 16,
  },
  emptyText: {
    textAlign: "center",
    marginTop: 50,
    fontSize: 16,
    color: "#777",
  },
  footerLoader: {
    paddingVertical: 20,
  },
  categoryBar: {
    maxHeight: 60,
    paddingTop: 5,
    paddingBottom: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  categoryContent: {
    paddingHorizontal: 10,
    gap: 8,
  },
});

export default ProductGridScreen;
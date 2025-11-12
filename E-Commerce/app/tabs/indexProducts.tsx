import React, { useEffect, useState } from "react";
import { FlatList, StyleSheet, View, Text, ActivityIndicator } from "react-native";
import { collection, getDocs, getFirestore } from "firebase/firestore";
import { router } from "expo-router";
import ProductCard from "@/components/ProductCard";
import { Product, ProductSnapshotData } from "@/types/app";

const ProductGridScreen = () => {
  const db = getFirestore();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const loadProducts = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "productos"));
      const queryProducts: Product[] = [];
      querySnapshot.forEach(snapshot => {
        const snapshotData = { ...snapshot.data() } as ProductSnapshotData;
        const product = { id: snapshot.id, ...snapshotData } as Product;
        queryProducts.push(product);
      });
      setProducts(queryProducts);
    } catch (error) {
      console.error("Error al cargar productos:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const navigateToDetail = (product: Product) => {
    router.push({
      pathname: "./details",
      params: { id: product.id },
    });
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4FC3F7" />
          <Text style={styles.loadingText}>Cargando productos...</Text>
        </View>
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
});

export default ProductGridScreen;
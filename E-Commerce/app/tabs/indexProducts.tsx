import ProductCard from "@/components/ProductCard";
import { Product, ProductSnapshotData } from "@/types/app"; 
import { router } from "expo-router"; 

import { collection, getDocs, getFirestore } from "firebase/firestore";

import { useEffect, useState } from "react";
import { FlatList, StyleSheet, View, Text } from "react-native";


const ProductGridScreen = () => {
  const db = getFirestore();
  const [products, setProducts] = useState<Product[]>([]);

  
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
      {products.length === 0 ? (
         <Text style={styles.emptyText}>Cargando o no hay productos...</Text>
      ) : (
        <FlatList
          data={products} 
          keyExtractor={product => product.id}
          renderItem={({ item }) => (
            <ProductCard
              product={item}
              onPress={() => navigateToDetail(item)}
            />
          )}
          numColumns={2} 
          contentContainerStyle={styles.productList}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  productList: {
      paddingHorizontal: 5,
      paddingBottom: 20,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: '#999',
  }
});

export default ProductGridScreen;
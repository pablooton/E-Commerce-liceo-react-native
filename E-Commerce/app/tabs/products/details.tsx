import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator, ScrollView, Alert, Button, Image } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { doc, getDoc, getFirestore } from "firebase/firestore";
import { Product } from "@/types/app";

const addToCart = (product: Product) => {
  Alert.alert("🛒 Producto Añadido", `${product.name} se ha añadido al carrito.`);
};

export default function ProductDetailsScreen() {
  const db = getFirestore();
  const { id } = useLocalSearchParams();
  const productId = Array.isArray(id) ? id[0] : id;

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!productId) {
      setError("Error: ID de producto no proporcionado.");
      setLoading(false);
      return;
    }

    const loadProductDetails = async () => {
      try {
        const productRef = doc(db, "productos", productId);
        const productSnap = await getDoc(productRef);

        if (productSnap.exists()) {
          const data = productSnap.data();
          setProduct({ id: productSnap.id, ...data } as Product);
        } else {
          setError("Producto no encontrado.");
        }
      } catch (e) {
        setError("Error al conectar con la base de datos.");
      } finally {
        setLoading(false);
      }
    };

    loadProductDetails();
  }, [productId]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#FF5722" />
        <Text style={styles.loadingText}>Cargando detalles...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (!product) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>No se pudo cargar la información del producto.</Text>
      </View>
    );
  }

  const productKeys = Object.keys(product!); // Corrección: Usamos '!' para asegurar que no es null
  const basicKeys = ['id', 'name', 'price', 'description', 'image', 'category'];
  const additionalDetails = productKeys.filter(key => !basicKeys.includes(key));

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Image
        source={{ uri: product.image }}
        style={styles.image}
        resizeMode="contain"
      />

      <View style={styles.header}>
        <Text style={styles.title}>{product.name}</Text>
        <Text style={styles.price}>${product.price.toFixed(2)}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Descripción</Text>
        <Text style={styles.descriptionText}>{product.description}</Text>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Categoría</Text>
        <Text style={styles.descriptionText}>{product.category}</Text> 
      </View>

      {product.color && (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>Color</Text>
    <Text style={styles.descriptionText}>{product.color}</Text> 
  </View>
)}

      <View style={styles.buttonContainer}>
        <Button
          title="Añadir al Carrito"
          onPress={() => addToCart(product)}
          color="#FF5722"
        />
      </View>
      
      <View style={{ height: 50 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    paddingHorizontal: 15,
    paddingTop: 15,
    paddingBottom: 20,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: '#FF5722',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
  },
  image: {
    width: '100%',
    height: 300,
    borderRadius: 8,
    marginBottom: 15,
    backgroundColor: '#f0f0f0',
  },
  header: {
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  price: {
    fontSize: 24,
    fontWeight: '600',
    color: '#FF5722',
    marginTop: 5,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#444',
    marginBottom: 8,
  },
  descriptionText: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#f7f7f7',
  },
  detailKey: {
    fontSize: 15,
    fontWeight: '600',
    color: '#555',
    flex: 1,
  },
  detailValue: {
    fontSize: 15,
    color: '#777',
    flex: 2,
    textAlign: 'right',
  },
  buttonContainer: {
    marginTop: 20,
    paddingHorizontal: 10,
  }
});
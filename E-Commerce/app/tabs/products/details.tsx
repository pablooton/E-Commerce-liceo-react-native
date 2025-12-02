import { Product } from "@/types/app";
import { useLocalSearchParams } from "expo-router";
import { doc, getDoc, getFirestore } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, Button, Image, ScrollView, StyleSheet, Text, View } from "react-native";


import { useCart } from "../../contexts/CartContext";

export default function ProductDetailsScreen() {
    const db = getFirestore();
    const { id } = useLocalSearchParams();
    const productId = Array.isArray(id) ? id[0] : id;
    
    
    const { addToCart } = useCart();

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

    
    const handleAddToCart = () => {
        if (product) {
            addToCart(product);
            Alert.alert(
                "¡Añadido!", 
                `${product.name} ya está en tu carrito.`
            );
        }
    };

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#4FC3F7" />
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

    if (!product) return null;

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
                    onPress={handleAddToCart} 
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
        backgroundColor: '#E1F5FE', 
    },
    loadingText: {
        marginTop: 10,
        color: '#4FC3F7', 
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
    buttonContainer: {
        marginTop: 20,
        paddingHorizontal: 10,
    }
});
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Alert, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { CartItem, useCart } from '../../contexts/CartContext';

export default function CartScreen() {
    const { cart, removeFromCart, increaseQuantity, decreaseQuantity, getTotalPrice } = useCart();

    const confirmDelete = (item: CartItem) => {
        Alert.alert(
            "Eliminar producto",
            `¿Estás seguro de que quieres eliminar ${item.name} del carrito?`,
            [
                { text: "Cancelar", style: "cancel" },
                { 
                    text: "Eliminar", 
                    onPress: () => removeFromCart(item.id),
                    style: "destructive" 
                }
            ]
        );
    };

    const renderItem = ({ item }: { item: CartItem }) => (
        <View style={styles.cartItem}>
            <Image source={{ uri: item.image }} style={styles.itemImage} />
            
            <View style={styles.itemDetails}>
                <Text style={styles.itemTitle}>{item.name}</Text>
                <Text style={styles.itemCategory}>{item.category}</Text>
                <Text style={styles.itemPrice}>${item.price.toFixed(2)}</Text>
            </View>

            <View style={styles.actionsContainer}>
                
                <View style={styles.quantityContainer}>
                    <TouchableOpacity onPress={() => decreaseQuantity(item.id)} style={styles.qtyButton}>
                        <Ionicons name="remove" size={16} color="#fff" />
                    </TouchableOpacity>
                    <Text style={styles.quantityText}>{item.quantity}</Text>
                    <TouchableOpacity onPress={() => increaseQuantity(item.id)} style={styles.qtyButton}>
                        <Ionicons name="add" size={16} color="#fff" />
                    </TouchableOpacity>
                </View>

                
                <TouchableOpacity onPress={() => confirmDelete(item)} style={styles.deleteButton}>
                    <Ionicons name="trash-outline" size={24} color="#FF5722" />
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            {cart.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Ionicons name="cart-outline" size={80} color="#ddd" />
                    <Text style={styles.emptyText}>El carrito está vacío</Text>
                </View>
            ) : (
                <>
                    <FlatList
                        data={cart}
                        keyExtractor={(item) => item.id}
                        renderItem={renderItem}
                        contentContainerStyle={styles.listContent}
                    />

                    <View style={styles.footer}>
                        <View style={styles.totalRow}>
                            <Text style={styles.totalLabel}>Total:</Text>
                            <Text style={styles.totalPrice}>${getTotalPrice().toFixed(2)}</Text>
                        </View>
                        <TouchableOpacity style={styles.checkoutButton} onPress={() => Alert.alert("Compra", "Procesando pago...")}>
                            <Text style={styles.checkoutText}>Finalizar Compra</Text>
                        </TouchableOpacity>
                    </View>
                </>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    listContent: {
        padding: 15,
    },
    cartItem: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderRadius: 10,
        marginBottom: 15,
        padding: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        borderWidth: 1,
        borderColor: '#f0f0f0'
    },
    itemImage: {
        width: 80,
        height: 80,
        borderRadius: 8,
        backgroundColor: '#f9f9f9',
    },
    itemDetails: {
        flex: 1,
        paddingHorizontal: 10,
        justifyContent: 'center',
    },
    itemTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 4,
    },
    itemCategory: {
        fontSize: 12,
        color: '#888',
        marginBottom: 4,
    },
    itemPrice: {
        fontSize: 16,
        fontWeight: '600',
        color: '#FF5722',
    },
    actionsContainer: {
        justifyContent: 'space-between',
        alignItems: 'flex-end',
    },
    quantityContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
        borderRadius: 20,
        padding: 2,
    },
    qtyButton: {
        backgroundColor: '#FF5722',
        width: 24,
        height: 24,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    quantityText: {
        marginHorizontal: 10,
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
    },
    deleteButton: {
        padding: 5,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyText: {
        marginTop: 10,
        fontSize: 18,
        color: '#888',
    },
    footer: {
        padding: 20,
        borderTopWidth: 1,
        borderTopColor: '#eee',
        backgroundColor: '#fff',
    },
    totalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    totalLabel: {
        fontSize: 18,
        color: '#555',
    },
    totalPrice: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FF5722',
    },
    checkoutButton: {
        backgroundColor: '#FF5722',
        paddingVertical: 15,
        borderRadius: 8,
        alignItems: 'center',
    },
    checkoutText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});
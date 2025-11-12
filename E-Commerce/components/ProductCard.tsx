import React from "react";
import { Image, StyleSheet, Text, View, Pressable } from "react-native";
import { Product } from "@/types/app";

type ProductCardProps = {
  product: Product;
  onPress: () => void;
};

const ProductCard: React.FC<ProductCardProps> = ({ product, onPress }) => {
  const productImageSource = product.image
    ? { uri: product.image }
    : require("../assets/images/Gemini_Generated_Image_hopugohopugohopu.png");

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.cardContainer,
        { opacity: pressed ? 0.9 : 1 },
      ]}
    >
      <Image
        source={productImageSource}
        style={styles.image}
        resizeMode="contain"
      />

      <View style={styles.detailsContainer}>
        <Text style={styles.name} numberOfLines={2}>
          {product.name}
        </Text>

        <Text style={styles.price}>
          ${product.price ? product.price.toFixed(2) : "N/A"}
        </Text>

        <Text style={styles.extraDetail}>
          {product.color || product.category}
        </Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
     flex: 1,
  backgroundColor: "#FFFF",
  borderRadius: 16,
  padding: 10,
  margin: 5,
  alignItems: "center",
  shadowColor: "#000",
  shadowOpacity: 0.15,
  shadowOffset: { width: 0, height: 2 },
  shadowRadius: 6,
  elevation: 4,
  },
  image: {
    width: "100%",
    height: 120,
    borderRadius: 12,
  },
  detailsContainer: {
    alignItems: "center",
    marginTop: 10,
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 5,
    color: "#333",
  },
  price: {
    fontSize: 18,
    fontWeight: "700",
    color: "black",
    marginBottom: 5,
  },
  extraDetail: {
    fontSize: 13,
    color: "#555",
  },
});

export default ProductCard;
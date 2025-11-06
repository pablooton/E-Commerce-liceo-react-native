import { Image, StyleSheet, Text, View, Pressable } from "react-native";
import { Product, ProductCategory } from "@/types/app"; 


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
          { opacity: pressed ? 0.9 : 1 } 
        ]}
    >
      
      <Image 
        source={productImageSource} 
        style={styles.image} 
        resizeMode="cover" 
      />
      
      
      <View style={styles.detailsContainer}>
        
        <Text style={styles.name} numberOfLines={2}>{product.name}</Text>
        
        
        <Text style={styles.price}>${product.price ? product.price.toFixed(2) : 'N/A'}</Text>
        
        
        <Text style={styles.extraDetail}>{product.color || product.category}</Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    flex: 1, // Crucial para la distribución en 2 columnas
    margin: 8,
    backgroundColor: "#ffffff",
    borderRadius: 12,
    shadowColor: "#000",
    
  },
  image: {
    width: "100%", 
    height: 150,    
  },
  detailsContainer: {
    padding: 10,
    alignItems: 'flex-start',
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
    height: 40,
    marginBottom: 5,
  },
  price: {
    fontSize: 18,
    fontWeight: "700",
    color: "#E91E63", 
    marginBottom: 5,
  },
  extraDetail: {
    fontSize: 12,
    color: '#666',
  }
});

export default ProductCard;
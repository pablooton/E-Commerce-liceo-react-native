import React from "react";
import { Pressable, StyleSheet, Text } from "react-native";

type FilterBadgeProps = {
  label: string;
  active: boolean;
  onClick: () => void;
};

const FilterBadge: React.FC<FilterBadgeProps> = ({ label, active, onClick }) => (
  <Pressable
    style={({ pressed }) => [
      styles.badge,
      active ? styles.badgeActive : styles.badgeInactive,
      pressed && styles.badgePressed,
    ]}
    onPress={onClick}
  >
    <Text style={styles.labelText}>{label}</Text>
  </Pressable>
);

const styles = StyleSheet.create({
  badge: {
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
    minWidth: 70,
    minHeight: 35,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  badgeActive: {
    backgroundColor: "#4FC3F7", 
    borderWidth: 1,
    borderColor: "#03A9F4",
  },
  badgeInactive: {
    backgroundColor: "#F5F5F5", 
    borderWidth: 1,
    borderColor: "#DDDDDD",
  },
  badgePressed: {
    opacity: 0.8,
  },
  labelText: {
    color: "#333", 
    fontWeight: "600",
    textAlign: "center",
    fontSize: 14,
  },
});

export default FilterBadge;
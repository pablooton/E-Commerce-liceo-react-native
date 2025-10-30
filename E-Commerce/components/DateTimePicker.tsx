import React, { useState } from "react";
import { Controller } from "react-hook-form";
import { View, Text, TouchableOpacity, StyleSheet, Platform, TextInput } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";

type FormDatePickerProps = {
  control: any;
  name: string;
  placeholder?: string;
};

const FormDatePicker: React.FC<FormDatePickerProps> = ({ control, name, placeholder }) => {
  const [show, setShow] = useState(false);

  const isAdult = (date: Date) => {
    const today = new Date();
    let age = today.getFullYear() - date.getFullYear();
    const m = today.getMonth() - date.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < date.getDate())) age--;
    return age >= 18;
  };

  return (
    <Controller
      control={control}
      name={name}
      rules={{
        required: "La fecha es obligatoria",
        validate: (value) => {
          if (!value) return "La fecha es obligatoria";
          const dateValue = value instanceof Date ? value : new Date(value);
          return isAdult(dateValue) ? true : "Debes ser mayor de 18 años";
        },
      }}
      render={({ field: { value, onChange }, fieldState: { error } }) => (
        <View style={styles.container}>
          {/* ✅ Web: usar input tipo date */}
          {Platform.OS === "web" ? (
            <input
              type="date"
              value={value ? value.toISOString().split("T")[0] : ""}
              onChange={(e) => onChange(new Date(e.target.value))}
              style={{
                padding: 10,
                borderRadius: 10,
                borderWidth: 1,
                borderColor: "gray",
                width: "100%",
                fontSize: 16,
              }}
              placeholder={placeholder || "Selecciona tu fecha"}
            />
          ) : (
            <>
              <TouchableOpacity style={styles.input} onPress={() => setShow(true)}>
                <Text style={{ color: value ? "black" : "#aaa" }}>
                  {value ? new Date(value).toLocaleDateString() : placeholder || "Selecciona tu fecha"}
                </Text>
              </TouchableOpacity>

              {show && (
                <DateTimePicker
                  value={value ? new Date(value) : new Date()}
                  mode="date"
                  maximumDate={new Date()}
                  display="spinner"
                  onChange={(event, selectedDate) => {
                    setShow(false);
                    if (selectedDate) onChange(selectedDate); 
                  }}
                />
              )}
            </>
          )}

          {error && <Text style={styles.error}>{error.message}</Text>}
        </View>
      )}
    />
  );
};

export default FormDatePicker;

const styles = StyleSheet.create({
  container: {
    gap: 10,
    width: "100%",
    marginVertical: 8,
  },
  input: {
    fontSize: 16,
    borderWidth: 1,
    borderColor: "white",
    padding: 10,
    borderRadius: 10,
    backgroundColor: "white",
  },
  error: {
    color: "red",
    fontSize: 12,
  },
});
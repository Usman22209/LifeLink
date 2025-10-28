import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, TextInput } from "react-native";
import { useTensorflowModel } from "react-native-fast-tflite";

const linearModelSource = require("@assets/model/linear_model.tflite");

export default function ModelTestScreen() {
  const [inputValue, setInputValue] = useState("435");
  const [output, setOutput] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  // Load model using the hook (auto handles async)
  const plugin = useTensorflowModel(linearModelSource);

  useEffect(() => {
    if (plugin?.state === "loaded") {
      setLoading(false);
    }
  }, [plugin]);

  const runModel = async () => {
    try {
      if (!plugin || plugin.state !== "loaded") {
        console.warn("Model not loaded yet");
        return;
      }

      const model = plugin.model;

      // Convert user input to number
      const numValue = parseFloat(inputValue);
      if (isNaN(numValue)) {
        alert("Please enter a valid number");
        return;
      }

      const input = new Float32Array([numValue]);

      // Run inference
      const result = model.runSync([input]);
      const predicted = (result?.[0] as Float32Array)[0];

      setOutput(predicted);
      console.log(`✅ Model output for ${numValue}:`, predicted);
    } catch (err) {
      console.error("Error running model:", err);
    }
  };

  const refresh = () => {
    if (inputValue.trim() !== "") {
      runModel();
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🧠 Linear Model Test (TFLite)</Text>

      {loading ? (
        <Text style={styles.status}>⏳ Loading model...</Text>
      ) : (
        <Text style={styles.status}>✅ Model Loaded</Text>
      )}

      {/* 🔹 Input Field */}
      <TextInput
        style={styles.input}
        placeholder="Enter a number..."
        keyboardType="numeric"
        value={inputValue}
        onChangeText={setInputValue}
      />

      {/* 🔹 Run Model Button */}
      <TouchableOpacity style={styles.button} onPress={runModel}>
        <Text style={styles.buttonText}>Run Model</Text>
      </TouchableOpacity>

      {/* 🔹 Refresh Button */}
      <TouchableOpacity style={[styles.button, styles.refreshButton]} onPress={refresh}>
        <Text style={styles.buttonText}>🔄 Refresh</Text>
      </TouchableOpacity>

      {output !== null && (
        <Text style={styles.output}>
          Predicted Output: {output.toFixed(3)}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
  },
  status: {
    marginBottom: 20,
    fontSize: 16,
    color: "#333",
  },
  input: {
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    width: 200,
    height: 45,
    paddingHorizontal: 10,
    marginBottom: 15,
    fontSize: 16,
    textAlign: "center",
  },
  button: {
    backgroundColor: "#007bff",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    marginVertical: 5,
  },
  refreshButton: {
    backgroundColor: "#28a745",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  output: {
    marginTop: 20,
    fontSize: 18,
    color: "#111",
  },
});

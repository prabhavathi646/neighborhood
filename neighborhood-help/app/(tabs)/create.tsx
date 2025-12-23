import { useState } from "react";
import { View, TextInput, Button, Alert, StyleSheet } from "react-native";
import { useRequests } from "../../lib/RequestsContext";
import { colors, spacing } from "../../lib/theme";

export default function CreateRequest() {
  const { addRequest } = useRequests();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [phone, setPhone] = useState("");

  const submit = () => {
    if (!title || !description) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }
    addRequest({ title, description, location, phone });
    Alert.alert("Success", "Help request submitted!");
    setTitle(""); setDescription(""); setLocation(""); setPhone("");
  };

  return (
    <View style={styles.container}>
      <TextInput style={styles.input} placeholder="Title" value={title} onChangeText={setTitle} />
      <TextInput style={styles.input} placeholder="Description" value={description} onChangeText={setDescription} />
      <TextInput style={styles.input} placeholder="Location" value={location} onChangeText={setLocation} />
      <TextInput style={styles.input} placeholder="Phone Number" value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
      <Button color={colors.primary} title="Submit" onPress={submit} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.md,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: spacing.sm,
    marginBottom: spacing.md,
    backgroundColor: colors.card,
  },
});




import { View, Text, FlatList, StyleSheet } from "react-native";
import { useRequests } from "../../lib/RequestsContext";
import { colors, spacing } from "../../lib/theme";

export default function Offers() {
  const { offers } = useRequests();

  return (
    <FlatList
      contentContainerStyle={{ padding: spacing.md }}
      data={offers}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <View style={styles.card}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.description}>{item.description}</Text>
        </View>
      )}
      ListEmptyComponent={<Text style={styles.empty}>No offers yet</Text>}
    />
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text,
    marginBottom: spacing.sm,
  },
  description: {
    fontSize: 14,
    color: colors.muted,
  },
  empty: {
    textAlign: "center",
    color: colors.muted,
    marginTop: spacing.lg,
  },
});



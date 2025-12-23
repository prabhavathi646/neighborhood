import { View, Text, Button, FlatList, StyleSheet } from "react-native";
import { useRequests } from "../../lib/RequestsContext";
import { colors, spacing } from "../../lib/theme";

export default function Home() {
  const { requests, offerHelp } = useRequests();

  return (
    <FlatList
      contentContainerStyle={{ padding: spacing.md }}
      data={requests}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <View style={styles.card}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.description}>{item.description}</Text>
          <Button color={colors.primary} title="Offer Help" onPress={() => offerHelp(item)} />
        </View>
      )}
      ListEmptyComponent={<Text style={styles.empty}>No requests yet</Text>}
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
    marginBottom: spacing.sm,
  },
  empty: {
    textAlign: "center",
    color: colors.muted,
    marginTop: spacing.lg,
  },
});

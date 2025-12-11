
import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import type { Participant } from "./AudienceEventScreen";

interface Props {
  participants: Participant[];
}
const AudienceParticipantList: React.FC<Props> = ({ participants }) => {
 const [filtered, setFiltered] = useState<Participant[]>([]);

  const [filterName, setFilterName] = useState("");
  const [filterTeam, setFilterTeam] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");


    useEffect(() => {
    applyFilters();
  }, [participants, filterName, filterTeam, filterStatus]);


  const applyFilters = () => {
    if(!participants){
        setFiltered([]); return;
    }

    let list = [...participants];

    if(filterName.trim() !== ""){
        list = list.filter((p) => (p.name ?? "").toLocaleLowerCase().includes(filterName.toLowerCase()));
    };

     if (filterTeam !== "all") {
      list = list.filter((p) => p.team === filterTeam);
    }

    if (filterStatus !== "all") {
      list = list.filter((p) => p.status === filterStatus);
    }

    setFiltered(list);
  };

  if (!participants || participants.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyTitle}>Participants</Text>
        <Text>No participants registered for this event.</Text>
      </View>
    );
  }

return (
    <View style={styles.container}>
      <Text style={styles.title}>Participants</Text>

      {/* Filters */}
      <View style={styles.filterSection}>
        <TextInput
          style={styles.input}
          placeholder="Search name..."
          value={filterName}
          onChangeText={setFilterName}
        />

        <View style={styles.row}>
          <Text style={styles.label}>Team:</Text>
          <TextInput
            style={styles.inputInline}
            placeholder="all / red / blue / green"
            value={filterTeam}
            onChangeText={setFilterTeam}
          />
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Status:</Text>
          <TextInput
            style={styles.inputInline}
            placeholder="all / active / offline / finished"
            value={filterStatus}
            onChangeText={setFilterStatus}
          />
        </View>
      </View>

      <ScrollView style={styles.list}>
        {filtered.map((p) => (
          <View key={p.id} style={styles.item}>
            <Text style={styles.itemName}>{p.name ?? "N/A"}</Text>
            <Text style={styles.itemLine}>Team: {p.team ?? "N/A"}</Text>
            <Text style={styles.itemLine}>Status: {p.status}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};


export default AudienceParticipantList;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 8,
  },
  emptyContainer: {
    flex: 1,
    padding: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 6,
  },
  filterSection: {
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginBottom: 6,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  label: {
    width: 60,
    fontSize: 12,
  },
  inputInline: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  list: {
    marginTop: 4,
  },
  item: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 4,
    padding: 6,
    marginBottom: 4,
  },
  itemName: {
    fontWeight: "bold",
  },
  itemLine: {
    fontSize: 12,
  },
});
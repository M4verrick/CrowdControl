import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  Button,
} from "react-native";
import NavBar from "../components/navbar";

const TicketsScreen = ({ navigation }) => {
  const tickets = [
    {
      id: 1,
      event: "Concert A",
      date: "2024-09-15",
      location: "STANDING PEN A",
      venueId: "A",
    },
    {
      id: 2,
      event: "Festival B",
      date: "2024-09-20",
      location: "STANDING PEN B",
      venueId: "B",
    },
    {
      id: 3,
      event: "Theater C",
      date: "2024-09-25",
      location: "STANDING PEN C",
      venueId: "C",
    },
    {
      id: 4,
      event: "Exhibition D",
      date: "2024-09-30",
      location: "STANDING PEN D",
      venueId: "D",
    },
  ];

  const [redeemedTickets, setRedeemedTickets] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentVenue, setCurrentVenue] = useState(null);

  const handleRedeem = (id, venueId) => {
    setRedeemedTickets([...redeemedTickets, { id, venueId }]);
    setCurrentVenue(venueId);
    setModalVisible(true); // Show the map modal
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container}>
        {tickets.map((ticket) => (
          <View key={ticket.id} style={styles.ticketContainer}>
            <Text style={styles.eventText}>{ticket.event}</Text>
            <Text style={styles.detailsText}>Date: {ticket.date}</Text>
            <Text style={styles.detailsText}>Location: {ticket.location}</Text>
            <TouchableOpacity
              style={[
                styles.claimButton,
                redeemedTickets.some((redeemed) => redeemed.id === ticket.id) &&
                  styles.redeemedButton,
              ]}
              onPress={() => handleRedeem(ticket.id, ticket.venueId)}
              disabled={redeemedTickets.some(
                (redeemed) => redeemed.id === ticket.id
              )}
            >
              <Text style={styles.claimButtonText}>
                {redeemedTickets.some((redeemed) => redeemed.id === ticket.id)
                  ? "Redeemed"
                  : "Redeem"}
              </Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Stadium Map</Text>
            <StadiumMap currentVenue={currentVenue} />
            <Button title="Close" onPress={closeModal} />
          </View>
        </View>
      </Modal>

      <NavBar navigation={navigation} />
    </View>
  );
};

// Stadium Map Component
const StadiumMap = ({ currentVenue }) => {
  return (
    <View style={styles.stadiumMapContainer}>
      <View style={styles.stage}>
        <Text style={styles.stageLabel}>Stage</Text>
      </View>
      <View style={styles.seatingContainer}>
        <View style={styles.row}>
          <SeatingBlock
            section="A"
            highlighted={currentVenue === "A"}
            exitPosition="bottom-left"
          />
          <SeatingBlock
            section="B"
            highlighted={currentVenue === "B"}
            exitPosition="bottom-right"
          />
        </View>
        <View style={styles.row}>
          <SeatingBlock
            section="C"
            highlighted={currentVenue === "C"}
            exitPosition="top-left"
          />
          <SeatingBlock
            section="D"
            highlighted={currentVenue === "D"}
            exitPosition="top-right"
          />
        </View>
      </View>
    </View>
  );
};

const SeatingBlock = ({ section, highlighted, exitPosition }) => {
  return (
    <View
      style={[
        styles.seatingBlock,
        { backgroundColor: highlighted ? "#FFD700" : "#D3D3D3" }, // Yellow for highlighted, grey for default
      ]}
    >
      <Text style={styles.seatingLabel}>{section}</Text>
      <View style={[styles.emergencyExit, styles[exitPosition]]}>
        <Text style={styles.exitText}>Exit</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  ticketContainer: {
    width: "100%",
    padding: 16,
    marginVertical: 8,
    borderRadius: 10,
    backgroundColor: "#f9f9f9",
    borderColor: "#ddd",
    borderWidth: 1,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 3,
  },
  eventText: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  detailsText: {
    fontSize: 14,
    color: "#555",
    marginBottom: 4,
  },
  claimButton: {
    marginTop: 10,
    paddingVertical: 10,
    borderRadius: 5,
    backgroundColor: "#1E90FF",
    alignItems: "center",
  },
  redeemedButton: {
    backgroundColor: "#32CD32",
  },
  claimButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    width: 350,
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
  },
  stadiumMapContainer: {
    width: 300,
    height: 300,
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
  },
  stage: {
    width: 200,
    height: 50,
    backgroundColor: "#333",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    zIndex: 1,
  },
  stageLabel: {
    color: "#fff",
    fontWeight: "bold",
  },
  seatingContainer: {
    width: "100%",
    height: "100%",
    justifyContent: "space-around",
    alignItems: "center",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 10,
  },
  seatingBlock: {
    width: 100,
    height: 70,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    margin: 5,
    position: "relative",
  },
  seatingLabel: {
    color: "#000",
    fontWeight: "bold",
  },
  emergencyExit: {
    position: "absolute",
    backgroundColor: "#ff3333",
    padding: 4,
    borderRadius: 3,
  },
  exitText: {
    color: "#fff",
    fontSize: 10,
  },
  "bottom-left": {
    bottom: 5,
    left: 5,
  },
  "bottom-right": {
    bottom: 5,
    right: 5,
  },
  "top-left": {
    top: 5,
    left: 5,
  },
  "top-right": {
    top: 5,
    right: 5,
  },
});

export default TicketsScreen;

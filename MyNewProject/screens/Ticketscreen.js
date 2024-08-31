import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  Button,
} from "react-native";
import axios from "axios";
import NavBar from "../components/navbar";
import { UserContext } from "./usercontext";

const TicketsScreen = ({ navigation }) => {
  const tickets = [
    {
      id: 1,
      event: "SMU HALLOWEEN EVENT",
      date: "2024-09-15",
      location: "SOL, PSR, SOB",
      venueId: "A",
    },
  ];

  const { user } = useContext(UserContext);  // Get the username from context
  const [redeemedTickets, setRedeemedTickets] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentVenue, setCurrentVenue] = useState(null);
  const [isTicketRedeemed, setIsTicketRedeemed] = useState(false);
  const [assignedSector, setAssignedSector] = useState(null);  // Store the assigned sector

  // Check redemption status when the screen loads
  useEffect(() => {
    const checkRedemptionStatus = async () => {
      try {
        const response = await axios.post('http://192.168.1.126:8000/check-redemption-status', { username: user.username });
        if (response.data.sector) {
          setRedeemedTickets([...redeemedTickets, { id: tickets[0].id, venueId: tickets[0].venueId }]);
          setIsTicketRedeemed(true);
          setAssignedSector(response.data.sector);
        }
      } catch (error) {
        console.error('Error checking redemption status:', error.message);
      }
    };

    checkRedemptionStatus();
  }, []);

  const handleRedeem = async (id, venueId, event) => {
    try {
      // Call the backend to redeem the ticket and get the assigned sector
      const response = await axios.post('http://192.168.1.126:8000/redeem', { username: user.username }); // Use the actual username
      const assignedSector = response.data.sector;

      setRedeemedTickets([...redeemedTickets, { id, venueId }]);
      setIsTicketRedeemed(true);  // Mark the ticket as redeemed
      setAssignedSector(assignedSector); // Store the assigned sector

      // Navigate to the map screen with the assigned sector
      navigation.navigate("Map", { venueId, event, sector: assignedSector });
    } catch (error) {
      console.error('Error redeeming ticket:', error.message);
    }
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
              onPress={() => handleRedeem(ticket.id, ticket.venueId, ticket.event)}
              disabled={redeemedTickets.some(
                (redeemed) => redeemed.id === ticket.id
              )}
            >
              <Text style={styles.claimButtonText}>
                {redeemedTickets.some((redeemed) => redeemed.id === ticket.id)
                  ? `Redeemed - Sector: ${assignedSector}`
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

      {/* Pass the isTicketRedeemed state to NavBar */}
      <NavBar navigation={navigation} isTicketRedeemed={isTicketRedeemed} />
    </View>
  );
};

// Stadium Map Component (optional - if needed in the modal)
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
    flex: 1,
    backgroundColor: "#1e1e1e",
  },
  searchContainer: {
    padding: 16,
    backgroundColor: "#333",
    borderBottomWidth: 1,
    borderBottomColor: "#444",
  },
  searchInput: {
    backgroundColor: "#444",
    borderRadius: 8,
    padding: 10,
    color: "#fff",
    fontSize: 16,
  },
  scrollView: {
    padding: 16,
  },
  eventCard: {
    backgroundColor: "#222",
    borderRadius: 10,
    marginBottom: 20,
    overflow: "hidden",
  },
  eventImage: {
    width: "100%",
    height: 180,
  },
  eventDetails: {
    padding: 16,
  },
  eventTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  eventDate: {
    color: "#888",
    marginTop: 5,
    fontSize: 14,
  },
  eventLocation: {
    color: "#888",
    marginTop: 2,
    fontSize: 14,
  },
  eventDescription: {
    color: "#aaa",
    marginTop: 10,
    fontSize: 14,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.8)",
  },
  modalContent: {
    width: 350,
    backgroundColor: "#1e1e1e",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
  },
  modalImage: {
    width: "100%",
    height: 200,
    marginBottom: 20,
    borderRadius: 10,
  },
  modalTitle: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalDate: {
    color: "#888",
    fontSize: 16,
    marginBottom: 5,
  },
  modalLocation: {
    color: "#888",
    fontSize: 16,
    marginBottom: 10,
  },
  modalDescription: {
    color: "#aaa",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
  },
  purchaseButton: {
    backgroundColor: "#ff4500",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 30,
    marginBottom: 20,
  },
  purchaseButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default TicketsScreen;

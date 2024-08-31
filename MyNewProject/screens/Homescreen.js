import React, { useState } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  Image,
  Text,
  TouchableOpacity,
  Modal,
  Button,
  TextInput,
} from "react-native";
import NavBar from "../components/navbar";

const HomeScreen = ({ navigation }) => {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const events = [
    {
      id: 1,
      title: "How to Become a Web Developer in a Week",
      description:
        "Join our intensive bootcamp and kickstart your career as a web developer. Learn HTML, CSS, JavaScript, and more!",
      date: "Monday, 2 September at 9AM",
      category: "Education",
      price: "Free",
      location: "Tech Academy, San Francisco, CA",
      image: require("../assets/cover1.png"),
    },
    {
      id: 2,
      title: "This is Why You Need to Eat Avocados",
      description:
        "Discover the amazing health benefits of avocados and how they can transform your diet and overall wellness.",
      date: "Wednesday, 4 September at 2PM",
      category: "Health",
      price: "$20",
      location: "Wellness Center, Los Angeles, CA",
      image: require("../assets/cover2.png"),
    },
    {
      id: 3,
      title: "Singapore Night Festival",
      description:
        "Experience the magic of the Singapore Night Festival with stunning light displays, performances, and more.",
      date: "Friday, 8 September at 7PM",
      category: "Festival",
      price: "$15",
      location: "Bras Basah, Singapore",
      image: require("../assets/cover3.png"),
    },
  ];

  // Filter the events based on search
  const filteredEvents = events.filter((event) => {
    const matchesSearch =
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesSearch;
  });

  const handleEventPress = (event) => {
    setSelectedEvent(event);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedEvent(null);
  };

  return (
    <View style={styles.container}>
      {/* Search Section */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search events"
          placeholderTextColor="#aaa"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Horizontal Scroll View for Events */}
      <ScrollView contentContainerStyle={styles.scrollView}>
        {filteredEvents.map((event) => (
          <TouchableOpacity
            key={event.id}
            style={styles.eventCard}
            onPress={() => handleEventPress(event)}
          >
            <Image source={event.image} style={styles.eventImage} />
            <View style={styles.eventDetails}>
              <Text style={styles.eventTitle}>{event.title}</Text>
              <Text style={styles.eventDate}>{event.date}</Text>
              <Text style={styles.eventLocation}>{event.location}</Text>
              <Text style={styles.eventDescription} numberOfLines={2}>
                {event.description}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Event Details Modal */}
      {selectedEvent && (
        <Modal
          visible={modalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={closeModal}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Image source={selectedEvent.image} style={styles.modalImage} />
              <Text style={styles.modalTitle}>{selectedEvent.title}</Text>
              <Text style={styles.modalDate}>{selectedEvent.date}</Text>
              <Text style={styles.modalLocation}>{selectedEvent.location}</Text>
              <Text style={styles.modalDescription}>
                {selectedEvent.description}
              </Text>
              <TouchableOpacity
                style={styles.purchaseButton}
                onPress={() => alert("Ticket Purchase")}
              >
                <Text style={styles.purchaseButtonText}>Purchase Tickets</Text>
              </TouchableOpacity>
              <Button title="Close" onPress={closeModal} />
            </View>
          </View>
        </Modal>
      )}

      {/* Bottom Navigation Bar */}
      <NavBar navigation={navigation} />
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

export default HomeScreen;

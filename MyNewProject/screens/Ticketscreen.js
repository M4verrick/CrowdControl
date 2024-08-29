
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import NavBar from '../components/navbar';  // Updated import path
import React, { useState } from 'react'; 

const TicketsScreen = ({ navigation }) => {
  // Example ticket data
  const tickets = [
    { id: 1, event: 'Concert A', date: '2024-09-15', location: 'Venue A' },
    { id: 2, event: 'Festival B', date: '2024-09-20', location: 'Venue B' },
    { id: 3, event: 'Theater C', date: '2024-09-25', location: 'Venue C' },
    { id: 4, event: 'Exhibition D', date: '2024-09-30', location: 'Venue D' },
  ];

  const [redeemedTickets, setRedeemedTickets] = useState([]);

  const handleRedeem = (id) => {
    setRedeemedTickets([...redeemedTickets, id]);
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
                redeemedTickets.includes(ticket.id) && styles.redeemedButton,
              ]}
              onPress={() => handleRedeem(ticket.id)}
              disabled={redeemedTickets.includes(ticket.id)}
            >
              <Text style={styles.claimButtonText}>
                {redeemedTickets.includes(ticket.id) ? 'Redeemed' : 'Redeem'}
              </Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

    
      <NavBar navigation={navigation} />  
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ticketContainer: {
    width: '100%',
    padding: 16,
    marginVertical: 8,
    borderRadius: 10,
    backgroundColor: '#f9f9f9',
    borderColor: '#ddd',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 3,
  },
  eventText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  detailsText: {
    fontSize: 14,
    color: '#555',
    marginBottom: 4,
  },
  claimButton: {
    marginTop: 10,
    paddingVertical: 10,
    borderRadius: 5,
    backgroundColor: '#1E90FF',
    alignItems: 'center',
  },
  redeemedButton: {
    backgroundColor: '#32CD32',
  },
  claimButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default TicketsScreen;

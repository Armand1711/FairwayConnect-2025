import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function PlayerCard({ player }) {
  return (
    <View style={styles.card}>
      <Text style={styles.name}>{player.name}</Text>
      <Text style={styles.info}>Handicap: {player.handicap}</Text>
      <Text style={styles.info}>Location: {player.location}</Text>
      <Text style={styles.info}>Courses: {player.courses.join(', ')}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFD700',
    borderRadius: 10,
    padding: 20,
    height: 300,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#228B22'
  },
  name: { fontSize: 24, fontWeight: 'bold', color: '#228B22' },
  info: { fontSize: 18, color: '#000', marginTop: 10 }
});
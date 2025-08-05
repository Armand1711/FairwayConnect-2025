import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Swiper from 'react-native-deck-swiper';
import { getFirestore, collection, query, where, getDocs, doc, setDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import PlayerCard from '../components/PlayerCard';

export default function MatchFeedScreen() {
  const [players, setPlayers] = useState([]);
  const auth = getAuth();
  const currentUser = auth.currentUser;

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const db = getFirestore();
        const userRef = doc(db, 'users', currentUser.uid);
        const userSnap = await getDocs(collection(db, 'users')).then(snapshot => snapshot.docs.find(doc => doc.id === currentUser.uid));
        if (!userSnap) return;
        const userData = userSnap.data();
        const handicap = userData.handicap || 0;
        const q = query(
          collection(db, 'users'),
          where('handicap', '>=', handicap - 5),
          where('handicap', '<=', handicap + 5),
          where('uid', '!=', currentUser.uid)
        );
        const querySnapshot = await getDocs(q);
        const playerList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setPlayers(playerList);
      } catch (error) {
        console.error(error);
      }
    };
    if (currentUser) fetchPlayers();
  }, [currentUser]);

  const handleSwipeRight = async (index) => {
    try {
      const swipedUser = players[index];
      const db = getFirestore();
      const matchId = `${currentUser.uid}_${swipedUser.id}`;
      await setDoc(doc(db, 'matches', matchId), {
        user1Id: currentUser.uid,
        user2Id: swipedUser.id,
        status: 'pending'
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Find Golfers</Text>
      {players.length > 0 ? (
        <Swiper
          cards={players}
          renderCard={(player) => <PlayerCard player={player} />}
          onSwipedRight={handleSwipeRight}
          onSwipedLeft={() => {}}
          cardIndex={0}
          backgroundColor="#fff"
          stackSize={3}
          containerStyle={styles.swiper}
        />
      ) : (
        <Text style={styles.noPlayers}>No players found</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  title: { fontSize: 24, color: '#228B22', textAlign: 'center', marginVertical: 20 },
  swiper: { flex: 1, marginBottom: 60 },
  noPlayers: { fontSize: 18, color: '#FFD700', textAlign: 'center', marginTop: 20 }
});
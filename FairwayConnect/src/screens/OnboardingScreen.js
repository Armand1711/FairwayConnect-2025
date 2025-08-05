import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

export default function OnboardingScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [handicap, setHandicap] = useState('');
  const [location, setLocation] = useState('');
  const [courses, setCourses] = useState('');

  const handleSignUp = async () => {
    try {
      const auth = getAuth();
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const db = getFirestore();
      await setDoc(doc(db, 'users', user.uid), {
        name,
        handicap: parseInt(handicap),
        location,
        courses: courses.split(',').map(course => course.trim()),
        uid: user.uid
      });
      navigation.navigate('MatchFeed');
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>FairwayConnect - Sign Up</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TextInput
        style={styles.input}
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Handicap (0-36)"
        value={handicap}
        onChangeText={setHandicap}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Location (e.g., Johannesburg)"
        value={location}
        onChangeText={setLocation}
      />
      <TextInput
        style={styles.input}
        placeholder="Preferred Courses (comma-separated)"
        value={courses}
        onChangeText={setCourses}
      />
      <View style={styles.button}>
        <Button title="Sign Up" onPress={handleSignUp} color="#228B22" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff', justifyContent: 'flex-end' },
  title: { fontSize: 24, color: '#228B22', marginBottom: 20, textAlign: 'center' },
  input: { height: 48, borderColor: '#FFD700', borderWidth: 1, marginBottom: 10, padding: 10, borderRadius: 5 },
  button: { marginBottom: 20 }
});
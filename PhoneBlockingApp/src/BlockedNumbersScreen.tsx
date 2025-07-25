import React, {useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  TextInput,
  Button,
  FlatList,
} from 'react-native';
import {useBlockedNumbers} from './store/BlockedNumbersContext';

export default function BlockedNumbersScreen() {
  const {numbers, addNumber, removeNumber} = useBlockedNumbers();
  const [input, setInput] = useState('');

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          placeholder="Enter number"
          keyboardType="phone-pad"
          value={input}
          onChangeText={setInput}
        />
        <Button
          title="Add"
          onPress={() => {
            if (input.trim()) {
              addNumber(input.trim());
              setInput('');
            }
          }}
        />
      </View>
      <FlatList
        data={numbers}
        keyExtractor={item => item}
        renderItem={({item}) => (
          <View style={styles.itemRow}>
            <Text style={styles.itemText}>{item}</Text>
            <Button title="Remove" onPress={() => removeNumber(item)} />
          </View>
        )}
        ListEmptyComponent={<Text style={styles.empty}>No blocked numbers</Text>}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  input: {
    flex: 1,
    borderColor: '#ccc',
    borderWidth: 1,
    marginRight: 8,
    paddingHorizontal: 8,
    height: 40,
    borderRadius: 4,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  itemText: {
    flex: 1,
  },
  empty: {
    textAlign: 'center',
    color: '#666',
  },
});
